import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const CACHE_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
const CACHE_DIR = path.join(process.cwd(), 'cache', 'images', 'class', 'messenger');

// Ensure cache directory exists
async function ensureCacheDirectory() {
    try {
        await fs.access(CACHE_DIR);
    } catch {
        await fs.mkdir(CACHE_DIR, { recursive: true });
    }
}

// Get cache file path
function getCacheFilePath(filename: string): string {
    return path.join(CACHE_DIR, filename);
}

// Get cache metadata file path
function getCacheMetadataPath(filename: string): string {
    return path.join(CACHE_DIR, `${filename}.meta.json`);
}

// Check if cache is valid
async function isCacheValid(filename: string): Promise<boolean> {
    try {
        const metadataPath = getCacheMetadataPath(filename);
        const metadataContent = await fs.readFile(metadataPath, 'utf-8');
        const metadata = JSON.parse(metadataContent);
        
        return Date.now() < metadata.expiresAt;
    } catch {
        return false;
    }
}

// Save image to cache
async function saveImageToCache(filename: string, imageBuffer: Buffer): Promise<void> {
    try {
        await ensureCacheDirectory();
        
        // Save image file
        const imagePath = getCacheFilePath(filename);
        await fs.writeFile(imagePath, imageBuffer);
        
        // Save metadata
        const metadataPath = getCacheMetadataPath(filename);
        const metadata = {
            filename,
            timestamp: Date.now(),
            expiresAt: Date.now() + CACHE_DURATION,
            size: imageBuffer.length
        };
        await fs.writeFile(metadataPath, JSON.stringify(metadata, null, 2));
        
        console.log(`Image cached: ${filename}`);
    } catch (error) {
        console.error(`Error caching image ${filename}:`, error);
    }
}

// Fetch image from FlyFF API
async function fetchImageFromAPI(filename: string): Promise<Buffer> {
    const imageUrl = `https://api.flyff.com/image/class/messenger/${filename}`;
    
    const response = await fetch(imageUrl, {
        headers: {
            'User-Agent': 'FlyFF-Skill-Simulator/1.0'
        }
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status} for image ${filename}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    return Buffer.from(arrayBuffer);
}

// Get image content type based on file extension
function getContentType(filename: string): string {
    const ext = path.extname(filename).toLowerCase();
    switch (ext) {
        case '.png':
            return 'image/png';
        case '.jpg':
        case '.jpeg':
            return 'image/jpeg';
        case '.gif':
            return 'image/gif';
        case '.webp':
            return 'image/webp';
        default:
            return 'image/png'; // default
    }
}

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ filename: string }> }
) {
    try {
        const filename = (await params).filename;
        
        if (!filename) {
            return NextResponse.json(
                { error: 'Filename is required' },
                { status: 400 }
            );
        }

        // Check if cache exists and is valid
        const cachePath = getCacheFilePath(filename);
        const isCached = await isCacheValid(filename);

        if (isCached) {
            try {
                // Serve from cache
                const imageBuffer = await fs.readFile(cachePath);
                const contentType = getContentType(filename);
                
                console.log(`Serving cached image: ${filename}`);
                
                return new NextResponse(imageBuffer, {
                    headers: {
                        'Content-Type': contentType,
                        'Cache-Control': 'public, max-age=604800', // 7 days
                        'X-Cache': 'HIT'
                    }
                });
            } catch (error) {
                console.log(`Cache file not found: ${filename}, fetching from API...`);
            }
        }

        // Fetch from API and cache
        console.log(`Fetching image from API: ${filename}`);
        const imageBuffer = await fetchImageFromAPI(filename);
        
        // Save to cache
        await saveImageToCache(filename, imageBuffer);
        
        const contentType = getContentType(filename);
        
        return new NextResponse(imageBuffer, {
            headers: {
                'Content-Type': contentType,
                'Cache-Control': 'public, max-age=604800', // 7 days
                'X-Cache': 'MISS'
            }
        });

    } catch (error) {
        console.error('Error in image API route:', error);
        
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to fetch image',
                message: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
} 
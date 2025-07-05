import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const CACHE_DIR = path.join(process.cwd(), 'cache');

interface CleanupResult {
    classData: {
        deleted: number;
        errors: string[];
    };
    images: {
        deleted: number;
        errors: string[];
    };
    total: {
        deleted: number;
        errors: string[];
    };
}

// Clean up expired class data cache
async function cleanupClassDataCache(): Promise<{ deleted: number; errors: string[] }> {
    const classDataPath = path.join(CACHE_DIR, 'class-data.json');
    const errors: string[] = [];
    let deleted = 0;

    try {
        const stats = await fs.stat(classDataPath);
        const content = await fs.readFile(classDataPath, 'utf-8');
        const data = JSON.parse(content);

        if (Date.now() > data.expiresAt) {
            await fs.unlink(classDataPath);
            deleted = 1;
            console.log('Deleted expired class data cache');
        }
    } catch (error) {
        if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
            errors.push(`Class data cleanup error: ${error}`);
        }
    }

    return { deleted, errors };
}

// Clean up expired image cache
async function cleanupImageCache(): Promise<{ deleted: number; errors: string[] }> {
    const imageCacheDir = path.join(CACHE_DIR, 'images', 'class', 'messenger');
    const errors: string[] = [];
    let deleted = 0;

    try {
        const files = await fs.readdir(imageCacheDir);
        
        for (const file of files) {
            if (file.endsWith('.meta.json')) {
                try {
                    const metadataPath = path.join(imageCacheDir, file);
                    const content = await fs.readFile(metadataPath, 'utf-8');
                    const metadata = JSON.parse(content);

                    if (Date.now() > metadata.expiresAt) {
                        // Delete both image file and metadata
                        const imageFile = file.replace('.meta.json', '');
                        const imagePath = path.join(imageCacheDir, imageFile);
                        
                        try {
                            await fs.unlink(imagePath);
                        } catch (error) {
                            // Image file might not exist, that's okay
                        }
                        
                        await fs.unlink(metadataPath);
                        deleted++;
                        console.log(`Deleted expired image cache: ${imageFile}`);
                    }
                } catch (error) {
                    errors.push(`Image cleanup error for ${file}: ${error}`);
                }
            }
        }
    } catch (error) {
        if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
            errors.push(`Image cache directory error: ${error}`);
        }
    }

    return { deleted, errors };
}

// Get cache statistics
async function getCacheStats(): Promise<{
    classData: { exists: boolean; size?: number; expiresAt?: number };
    images: { count: number; totalSize: number };
}> {
    const stats = {
        classData: { exists: false, size: 0, expiresAt: 0 },
        images: { count: 0, totalSize: 0 }
    };

    // Check class data cache
    try {
        const classDataPath = path.join(CACHE_DIR, 'class-data.json');
        const classDataStats = await fs.stat(classDataPath);
        const content = await fs.readFile(classDataPath, 'utf-8');
        const data = JSON.parse(content);
        
        stats.classData = {
            exists: true,
            size: classDataStats.size,
            expiresAt: data.expiresAt
        };
    } catch (error) {
        // Class data cache doesn't exist or is invalid
    }

    // Check image cache
    try {
        const imageCacheDir = path.join(CACHE_DIR, 'images', 'class', 'messenger');
        const files = await fs.readdir(imageCacheDir);
        
        for (const file of files) {
            if (file.endsWith('.meta.json')) {
                try {
                    const metadataPath = path.join(imageCacheDir, file);
                    const content = await fs.readFile(metadataPath, 'utf-8');
                    const metadata = JSON.parse(content);
                    
                    stats.images.count++;
                    stats.images.totalSize += metadata.size || 0;
                } catch (error) {
                    // Skip invalid metadata files
                }
            }
        }
    } catch (error) {
        // Image cache directory doesn't exist
    }

    return stats;
}

export async function GET(request: NextRequest) {
    try {
        const stats = await getCacheStats();
        
        return NextResponse.json({
            success: true,
            stats,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to get cache stats',
                message: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        console.log('Starting cache cleanup...');
        
        const [classDataResult, imageResult] = await Promise.all([
            cleanupClassDataCache(),
            cleanupImageCache()
        ]);

        const totalDeleted = classDataResult.deleted + imageResult.deleted;
        const totalErrors = [...classDataResult.errors, ...imageResult.errors];

        const result: CleanupResult = {
            classData: classDataResult,
            images: imageResult,
            total: {
                deleted: totalDeleted,
                errors: totalErrors
            }
        };

        console.log(`Cache cleanup completed: ${totalDeleted} files deleted, ${totalErrors.length} errors`);

        return NextResponse.json({
            success: true,
            result,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Cache cleanup error:', error);
        
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to cleanup cache',
                message: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
} 
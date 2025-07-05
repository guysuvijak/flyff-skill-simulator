import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

interface ClassData {
    id: number;
    name: Record<string, string>; // รองรับภาษาใดๆ ที่ API ส่งมา
    type: string;
    icon: string;
    tree: string;
    minLevel: number;
    maxLevel: number;
    parent: number;
    maxHP: string;
    maxFP: string;
    maxMP: string;
    hp: number;
    mp: number;
    fp: number;
    attackSpeed: number;
    block: number;
    critical: number;
    autoAttackFactors: {
        sword: number;
        axe: number;
        staff: number;
        stick: number;
        knuckle: number;
        yoyo: number;
        bow: number;
        wand: number;
    };
    defense: number;
    magicDefenseStaFactor: number;
    magicDefenseIntFactor: number;
}

interface CacheData {
    data: ClassData[];
    timestamp: number;
    expiresAt: number;
}

const CACHE_DURATION = 24 * 60 * 60 * 1000; // 1 day in milliseconds
const CACHE_FILE_PATH = path.join(process.cwd(), 'cache', 'class-data.json');

// Ensure cache directory exists
async function ensureCacheDirectory() {
    const cacheDir = path.dirname(CACHE_FILE_PATH);
    try {
        await fs.access(cacheDir);
    } catch {
        await fs.mkdir(cacheDir, { recursive: true });
    }
}

// Read cache from file
async function readCache(): Promise<CacheData | null> {
    try {
        await ensureCacheDirectory();
        const cacheContent = await fs.readFile(CACHE_FILE_PATH, 'utf-8');
        const cache: CacheData = JSON.parse(cacheContent);
        
        // Check if cache is still valid
        if (Date.now() < cache.expiresAt) {
            return cache;
        }
        
        return null; // Cache expired
    } catch (error) {
        console.log('No cache found or cache is invalid');
        return null;
    }
}

// Write cache to file
async function writeCache(data: ClassData[]): Promise<void> {
    try {
        await ensureCacheDirectory();
        const cacheData: CacheData = {
            data,
            timestamp: Date.now(),
            expiresAt: Date.now() + CACHE_DURATION
        };
        
        await fs.writeFile(CACHE_FILE_PATH, JSON.stringify(cacheData, null, 2));
        console.log('Class data cached successfully');
    } catch (error) {
        console.error('Error writing cache:', error);
    }
}

// Fetch class IDs from main API
async function fetchClassIds(): Promise<number[]> {
    const response = await fetch('https://api.flyff.com/class', {
        headers: {
            'Accept': 'application/json',
            'User-Agent': 'FlyFF-Skill-Simulator/1.0'
        }
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
}

// Fetch detailed class data for multiple class IDs in a single request
async function fetchClassDataBatch(classIds: number[]): Promise<ClassData[]> {
    const classIdsString = classIds.join(',');
    const response = await fetch(`https://api.flyff.com/class/${classIdsString}`, {
        headers: {
            'Accept': 'application/json',
            'User-Agent': 'FlyFF-Skill-Simulator/1.0'
        }
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status} for class IDs: ${classIdsString}`);
    }

    return await response.json();
}

// Fetch all class data from API
async function fetchAllClassData(): Promise<ClassData[]> {
    console.log('Fetching class data from FlyFF API...');
    
    try {
        // Step 1: Get all class IDs
        const classIds = await fetchClassIds();
        console.log(`Found ${classIds.length} classes to fetch`);
        
        // Step 2: Fetch all class data in a single request
        const classData = await fetchClassDataBatch(classIds);
        
        console.log(`Successfully fetched ${classData.length} classes in a single request`);
        return classData;
        
    } catch (error) {
        console.error('Error fetching class data:', error);
        throw error;
    }
}

export async function GET(request: NextRequest) {
    try {
        // Step 1: Check cache first
        const cachedData = await readCache();
        
        if (cachedData) {
            console.log('Serving cached class data');
            return NextResponse.json({
                success: true,
                data: cachedData.data,
                source: 'cache',
                cachedAt: new Date(cachedData.timestamp).toISOString(),
                expiresAt: new Date(cachedData.expiresAt).toISOString()
            });
        }
        
        // Step 2: Cache expired or doesn't exist, fetch fresh data
        console.log('Cache expired or not found, fetching fresh data...');
        const classData = await fetchAllClassData();
        
        // Step 3: Cache the new data
        await writeCache(classData);
        
        return NextResponse.json({
            success: true,
            data: classData,
            source: 'flyff-api',
            cachedAt: new Date().toISOString(),
            expiresAt: new Date(Date.now() + CACHE_DURATION).toISOString()
        });
        
    } catch (error) {
        console.error('Error in class API route:', error);
        
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to fetch class data',
                message: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
} 
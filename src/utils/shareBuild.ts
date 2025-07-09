// Next.js 15 - src/utils/shareBuild.ts
import { useClassStore } from '@/stores/classStore';
import { useCharacterStore } from '@/stores/characterStore';
import { useSkillStore } from '@/stores/skillStore';
import {
    compressToEncodedURIComponent,
    decompressFromEncodedURIComponent
} from 'lz-string';

export function shareBuild() {
    // Check if we're on the client side
    if (typeof window === 'undefined') {
        return ''; // Return empty string during server-side rendering
    }

    const { selectedClass } = useClassStore.getState();
    const { characterLevel, skillPoints } = useCharacterStore.getState();
    const { skillLevels } = useSkillStore.getState();

    const buildData = {
        selectedClass,
        characterLevel,
        skillPoints,
        skillLevels
    };

    const encodedData = compressToEncodedURIComponent(
        JSON.stringify(buildData)
    );

    const url = `${window.location.origin}?data=${encodedData}`;
    return url;
}

// Optimize data compression by removing unnecessary fields and using shorter keys
export function shareBuildOptimized() {
    // Check if we're on the client side
    if (typeof window === 'undefined') {
        return ''; // Return empty string during server-side rendering
    }

    const { selectedClass } = useClassStore.getState();
    const { characterLevel, skillPoints } = useCharacterStore.getState();
    const { skillLevels } = useSkillStore.getState();

    // Only include skills that have levels > 0 to reduce data size
    const filteredSkillLevels = Object.fromEntries(
        Object.entries(skillLevels).filter(
            ([_, skillLevel]) => skillLevel.level > 0
        )
    );

    // Use shorter property names to reduce JSON size
    const buildData = {
        c: selectedClass.id, // class ID only
        l: characterLevel, // level
        p: skillPoints, // points
        s: filteredSkillLevels // skills (only non-zero levels)
    };

    const encodedData = compressToEncodedURIComponent(
        JSON.stringify(buildData)
    );

    const url = `${window.location.origin}?b=${encodedData}`; // shorter parameter name
    return url;
}

export async function loadBuildFromUrl() {
    // Check if we're on the client side
    if (typeof window === 'undefined') {
        return; // Do nothing during server-side rendering
    }

    const urlParams = new URLSearchParams(window.location.search);
    const encodedData = urlParams.get('data') || urlParams.get('b'); // support both old and new format

    if (!encodedData) {
        return;
    }

    try {
        const decompressedData = decompressFromEncodedURIComponent(encodedData);
        if (!decompressedData) {
            throw new Error('Invalid or corrupted build data');
        }

        const decodedData = JSON.parse(decompressedData);

        // Handle both old and new format
        if (decodedData.selectedClass) {
            // Old format
            const { selectedClass, characterLevel, skillPoints, skillLevels } =
                decodedData;

            useClassStore.setState({ selectedClass });
            useCharacterStore.getState().updateCharacter({
                characterLevel: characterLevel,
                skillPoints: skillPoints
            });
            useSkillStore.setState({ skillLevels });
        } else {
            // New optimized format
            const {
                c: classId,
                l: characterLevel,
                p: skillPoints,
                s: skillLevels
            } = decodedData;

            // Load class data based on ID - wait for completion
            try {
                const response = await fetch('/data/classall.json');
                if (!response.ok) {
                    throw new Error('Failed to fetch class data');
                }
                const allClasses = await response.json();
                const selectedClass = allClasses.find(
                    (cls: any) => cls.id === classId
                );

                if (selectedClass) {
                    // Set class first, then character data
                    useClassStore.setState({ selectedClass });
                    useCharacterStore.getState().updateCharacter({
                        characterLevel: characterLevel,
                        skillPoints: skillPoints
                    });
                    useSkillStore.setState({ skillLevels });
                } else {
                    throw new Error(`Class not found for ID: ${classId}`);
                }
            } catch (fetchError) {
                if (fetchError instanceof Error) {
                    throw new Error(
                        `Failed to fetch class data: ${fetchError.message}`
                    );
                } else {
                    throw new Error('Failed to fetch class data');
                }
            }
        }
    } catch (error) {
        console.error('Failed to decode or parse data:', error);
        // Re-throw the error so it can be caught by the calling function
        if (error instanceof Error) {
            throw error;
        } else {
            throw new Error('Failed to decode or parse build data');
        }
    }
}

export function clearUrlData() {
    // Check if we're on the client side
    if (typeof window === 'undefined') {
        return; // Do nothing during server-side rendering
    }

    // Remove ?data parameter from URL without reloading the page
    const url = new URL(window.location.href);
    url.searchParams.delete('data');
    url.searchParams.delete('b'); // also clear new format
    window.history.replaceState({}, '', url.toString());
}

// New function to decode build data step by step
export function decodeBuildData(encodedData: string) {
    try {
        const decompressedData = decompressFromEncodedURIComponent(encodedData);
        if (!decompressedData) {
            throw new Error('Invalid or corrupted build data');
        }

        const decodedData = JSON.parse(decompressedData);

        // Handle both old and new format
        if (decodedData.selectedClass) {
            // Old format
            return {
                selectedClass: decodedData.selectedClass,
                characterLevel: decodedData.characterLevel || 15,
                skillPoints: decodedData.skillPoints || 0,
                skillLevels: decodedData.skillLevels || {},
                format: 'old'
            };
        } else {
            // New optimized format
            return {
                classId: decodedData.c,
                characterLevel: decodedData.l || 15,
                skillPoints: decodedData.p || 0,
                skillLevels: decodedData.s || {},
                format: 'new'
            };
        }
    } catch (error) {
        console.error('Failed to decode build data:', error);
        if (error instanceof Error) {
            throw error;
        } else {
            throw new Error('Failed to decode build data');
        }
    }
}

// Function to load class data by ID
export async function loadClassById(classId: number) {
    try {
        const response = await fetch('/data/classall.json');
        if (!response.ok) {
            throw new Error('Failed to fetch class data');
        }
        const allClasses = await response.json();
        const selectedClass = allClasses.find((cls: any) => cls.id === classId);

        if (!selectedClass) {
            throw new Error(`Class not found for ID: ${classId}`);
        }

        return selectedClass;
    } catch (error) {
        console.error('Failed to load class data:', error);
        if (error instanceof Error) {
            throw error;
        } else {
            throw new Error('Failed to load class data');
        }
    }
}

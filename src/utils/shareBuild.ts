import { useClassStore } from '@/stores/classStore';
import { useCharacterStore } from '@/stores/characterStore';
import { useSkillStore } from '@/stores/skillStore';
import {
    compressToEncodedURIComponent,
    decompressFromEncodedURIComponent
} from 'lz-string';

export function shareBuild() {
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

export function loadBuildFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    const encodedData = urlParams.get('data');

    if (!encodedData) return;

    try {
        const decodedData = JSON.parse(
            decompressFromEncodedURIComponent(encodedData) || ''
        );

        const { selectedClass, characterLevel, skillPoints, skillLevels } =
            decodedData;
        useClassStore.setState({ selectedClass });
        useCharacterStore.getState().updateCharacter({
            characterLevel: characterLevel,
            skillPoints: skillPoints
        });
        useSkillStore.setState({ skillLevels });
    } catch (error) {
        console.error('Failed to decode or parse data:', error);
    }
}

// Next.js 15 - src/utils/skillUtils.ts
import { useWebsiteStore } from '@/stores/websiteStore';

interface SkillName {
    en: string;
    [key: string]: string;
}

interface SkillDescription {
    en: string;
    [key: string]: string;
}

/**
 * Get skill name in current language with fallback support
 * @param names - Object containing names in different languages
 * @param currentLang - Current language from website store
 * @returns Skill name in current language or fallback
 */
export function getSkillNameInCurrentLang(
    names: SkillName,
    currentLang: string
): string {
    // Try to get name in current language
    if (names[currentLang]) {
        return names[currentLang];
    }

    // Fallback to English
    if (names.en) {
        return names.en;
    }

    // If English is not available, return the first available name
    const firstAvailableName = Object.values(names)[0];
    if (firstAvailableName) {
        return firstAvailableName;
    }

    // Last resort - return a default message
    return 'Unknown Skill';
}

/**
 * Get skill description in current language with fallback support
 * @param descriptions - Object containing descriptions in different languages
 * @param currentLang - Current language from website store
 * @returns Skill description in current language or fallback
 */
export function getSkillDescriptionInCurrentLang(
    descriptions: SkillDescription,
    currentLang: string
): string {
    // Try to get description in current language
    if (descriptions[currentLang]) {
        return descriptions[currentLang];
    }

    // Fallback to English
    if (descriptions.en) {
        return descriptions.en;
    }

    // If English is not available, return the first available description
    const firstAvailableDescription = Object.values(descriptions)[0];
    if (firstAvailableDescription) {
        return firstAvailableDescription;
    }

    // Last resort - return a default message
    return 'No description available';
}

/**
 * Custom hook for getting skill names and descriptions in current website language
 * @returns Functions to get skill name and description in current language
 */
export const useSkillLocalization = () => {
    const { lang } = useWebsiteStore();

    /**
     * Get skill name in current website language
     * @param names - Object containing names in different languages
     * @returns Skill name in current language or fallback
     */
    const getSkillName = (names: SkillName): string => {
        return getSkillNameInCurrentLang(names, lang);
    };

    /**
     * Get skill description in current website language
     * @param descriptions - Object containing descriptions in different languages
     * @returns Skill description in current language or fallback
     */
    const getSkillDescription = (descriptions: SkillDescription): string => {
        return getSkillDescriptionInCurrentLang(descriptions, lang);
    };

    return {
        getSkillName,
        getSkillDescription,
        currentLang: lang
    };
};

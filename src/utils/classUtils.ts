// Next.js 15 - src/utils/classUtils.ts
import { LanguageNames } from '@/types/class';

/**
 * Get class name in specified language with fallback support
 * @param names - Object containing names in different languages
 * @param preferredLanguage - Preferred language code (e.g., 'en', 'th', 'jp')
 * @param fallbackLanguage - Fallback language if preferred is not available (default: 'en')
 * @returns Class name in preferred language or fallback
 */
export function getClassName(
    names: LanguageNames,
    preferredLanguage: string = 'en',
    fallbackLanguage: string = 'en'
): string {
    // Try to get name in preferred language
    if (names[preferredLanguage]) {
        return names[preferredLanguage];
    }

    // Fallback to specified fallback language
    if (names[fallbackLanguage]) {
        return names[fallbackLanguage];
    }

    // If fallback is not available, return the first available name
    const firstAvailableName = Object.values(names)[0];
    if (firstAvailableName) {
        return firstAvailableName;
    }

    // Last resort - return a default message
    return 'Unknown Class';
}

/**
 * Get class name using current website language from store
 * This is a convenience function that automatically uses the current language
 * @param names - Object containing names in different languages
 * @param currentLang - Current language from website store
 * @returns Class name in current language or fallback
 */
export function getClassNameInCurrentLang(
    names: LanguageNames,
    currentLang: string
): string {
    return getClassName(names, currentLang, 'en');
}

/**
 * Get all available languages for a class
 * @param names - Object containing names in different languages
 * @returns Array of language codes
 */
export function getAvailableLanguages(names: LanguageNames): string[] {
    return Object.keys(names);
}

/**
 * Check if a specific language is available for a class
 * @param names - Object containing names in different languages
 * @param language - Language code to check
 * @returns True if language is available
 */
export function hasLanguage(names: LanguageNames, language: string): boolean {
    return names[language] !== undefined;
}

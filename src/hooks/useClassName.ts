// Next.js 15 - src/hooks/useClassName.ts
import { useWebsiteStore } from '@/stores/websiteStore';
import { getClassNameInCurrentLang } from '@/utils/classUtils';
import { LanguageNames } from '@/types/class';

/**
 * Custom hook for getting class names in current website language
 * @returns Function to get class name in current language
 */
export const useClassName = () => {
    const { lang } = useWebsiteStore();

    /**
     * Get class name in current website language
     * @param names - Object containing names in different languages
     * @returns Class name in current language or fallback
     */
    const getClassName = (names: LanguageNames): string => {
        return getClassNameInCurrentLang(names, lang);
    };

    return {
        getClassName,
        currentLang: lang
    };
};

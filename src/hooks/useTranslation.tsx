// Next.js 15 - src/hooks/useTranslation.tsx
'use client';
import { useState, useEffect, useCallback, ReactNode } from 'react';
import { useWebsiteStore } from '@/stores/websiteStore';
import { TranslationValue, Variables, Translation } from '@/types/language';

const translationCache: { [key: string]: Translation } = {};

export const useTranslation = () => {
    const { lang } = useWebsiteStore();
    const [dict, setDict] = useState<Translation>({});
    const [isLoaded, setIsLoaded] = useState(false);

    const loadTranslations = useCallback(async () => {
        try {
            if (translationCache[lang]) {
                setDict(translationCache[lang]);
                setIsLoaded(true);
                return;
            }

            const translation = await import(`@/locales/${lang}.json`);
            translationCache[lang] = translation.default;
            setDict(translation.default);
            setIsLoaded(true);
        } catch (e) {
            console.error(`Failed to load ${lang} translation:`, e);
        }
    }, [lang]);

    useEffect(() => {
        setIsLoaded(false);
        loadTranslations();
    }, [loadTranslations]);

    const getTranslation = useCallback(
        (key: string, variables?: Variables): string | ReactNode[] => {
            if (!isLoaded) return '';

            try {
                const result = key
                    .split('.')
                    .reduce<TranslationValue>((obj, k) => {
                        if (typeof obj === 'object') {
                            return obj[k] || key;
                        }
                        return key;
                    }, dict);

                if (typeof result === 'string' && variables) {
                    // Prefer plain string replacement so spaces around
                    // placeholders are preserved inside flex containers.
                    const hasReactNode = Object.values(variables).some(
                        (value) => typeof value === 'object' && value !== null
                    );

                    if (!hasReactNode) {
                        return Object.entries(variables).reduce(
                            (text, [key, value]) =>
                                text.replace(
                                    new RegExp(`\\{${key}\\}`, 'g'),
                                    String(value)
                                ),
                            result
                        );
                    }

                    const parts = result.split(/({[^}]+})/g);
                    return parts.map((part, index) => {
                        const matches = part.match(/^{([^}]+)}$/);
                        if (matches && variables[matches[1]] !== undefined) {
                            const value = variables[matches[1]];
                            return <span key={index}>{value}</span>;
                        }
                        return part;
                    });
                }

                return typeof result === 'string' ? result : key;
            } catch {
                return key;
            }
        },
        [dict, isLoaded]
    );

    function t(key: string): string;
    function t(key: string, variables: Variables): ReactNode[];
    function t(key: string, variables?: Variables): string | ReactNode[] {
        return getTranslation(key, variables);
    }

    return { t, lang };
};

'use client';
import { useEffect } from 'react';
import { useWebsiteStore } from '@/stores/websiteStore';

const LanguageProvider = () => {
    const { lang } = useWebsiteStore();

    useEffect(() => {
        document.documentElement.lang = lang;
    }, [lang]);

    return null;
};

export { LanguageProvider };

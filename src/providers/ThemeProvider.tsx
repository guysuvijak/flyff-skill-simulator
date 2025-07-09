// Next.js 15 - src/providers/ThemeProvider.tsx
'use client';
import { useEffect, useState, ReactNode } from 'react';
import { ThemeProvider as NextThemeProvider } from 'next-themes';
import { useWebsiteStore } from '@/stores/websiteStore';

const ThemeProvider = ({ children }: { children: ReactNode }) => {
    const [mounted, setMounted] = useState(false);
    const { colorTheme } = useWebsiteStore();

    useEffect(() => {
        setMounted(true);
    }, []);

    // Apply color theme to HTML element
    useEffect(() => {
        if (mounted) {
            const htmlElement = document.documentElement;
            if (colorTheme && colorTheme !== 'default') {
                htmlElement.setAttribute('data-theme', colorTheme);
            } else {
                htmlElement.removeAttribute('data-theme');
            }
        }
    }, [colorTheme, mounted]);

    if (!mounted) {
        return <>{children}</>;
    }

    return (
        <NextThemeProvider attribute='class' defaultTheme='dark' enableSystem>
            {children}
        </NextThemeProvider>
    );
};

export { ThemeProvider };

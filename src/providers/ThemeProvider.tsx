// Next.js 15 - src/providers/ThemeProvider.tsx
'use client';
import { useEffect, useState, ReactNode } from 'react';
import { ThemeProvider as NextThemeProvider } from 'next-themes';

const ThemeProvider = ({ children }: { children: ReactNode }) => {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

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

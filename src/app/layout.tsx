// Next.js 15 - src/app/layout.tsx
import { ReactNode } from 'react';
import { ThemeProvider } from '@/providers/ThemeProvider';
import { LanguageProvider } from '@/providers/LanguageProvider';
import { FontProvider } from '@/providers/FontProvider';
import { Toaster } from '@/components/ui/sonner';
import { VIEWPORT, METADATA } from '@/configs/metadata';
import { JSON_LD_SCHEMA } from '@/configs/schema';
import './globals.css';

export const viewport = VIEWPORT;
export const metadata = METADATA;

const RootLayout = ({ children }: { children: ReactNode }) => {
    return (
        <html lang='en'>
            <head>
                <script
                    type='application/ld+json'
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify(JSON_LD_SCHEMA)
                    }}
                />
            </head>
            <body>
                <ThemeProvider>
                    <LanguageProvider />
                    <FontProvider>{children}</FontProvider>
                    <Toaster />
                </ThemeProvider>
            </body>
        </html>
    );
};

export default RootLayout;

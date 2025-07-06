// Next.js 15 - src/app/layout.tsx
import { ReactNode } from 'react';
import { ThemeProvider } from '@/providers/ThemeProvider';
import { LanguageProvider } from '@/providers/LanguageProvider';
import { FontProvider } from '@/providers/FontProvider';
import { Toaster } from '@/components/ui/sonner';
import { VIEWPORT, METADATA } from '@/configs/metadata';
import pkg from '../../package.json';
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
                        __html: JSON.stringify({
                            '@context': 'https://schema.org',
                            '@graph': [
                                {
                                    '@type': 'WebApplication',
                                    '@id': 'https://flyffskillsimulator.vercel.app',
                                    name: 'Flyff Universe Skill Simulator - Plan Your Character Skill Build',
                                    description:
                                        'Free online Flyff Universe Skill Simulator. Plan and visualize your character skill builds with our interactive skill tree.',
                                    url: 'https://flyffskillsimulator.vercel.app',
                                    applicationCategory: 'GameApplication',
                                    operatingSystem: 'Web Browser',
                                    softwareVersion: `${pkg.version}`,
                                    author: {
                                        '@type': 'Person',
                                        name: 'MeteorVIIx'
                                    },
                                    offers: {
                                        '@type': 'Offer',
                                        price: '0',
                                        priceCurrency: 'USD'
                                    }
                                }
                            ]
                        })
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

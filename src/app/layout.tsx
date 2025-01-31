import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    metadataBase: new URL('https://flyffskillsimulator.vercel.app'),
    title: 'Flyff - Skill Simulator',
    description: 'Flyff Universe - Skill Simulator (Data from API only), Created by MeteorVIIx, Flyff Skill Simulator is an open-source project developed using Next.js and React Flow technologies. The website serves as a simulator for planning and visualizing skill builds in the Flyff Universe server, allowing players to experiment with different skill combinations and paths.',
    openGraph: {
        type: 'website',
        title: 'Flyff - Skill Simulator',
        description: 'Flyff Universe - Skill Simulator (Data from API only), Created by MeteorVIIx, Flyff Skill Simulator is an open-source project developed using Next.js and React Flow technologies. The website serves as a simulator for planning and visualizing skill builds in the Flyff Universe server, allowing players to experiment with different skill combinations and paths.',
        url: 'https://flyffskillsimulator.vercel.app',
        siteName: 'Flyff - Skill Simulator',
        images: [
            {
                url: '/metadata/manifest.png',
                alt: 'Flyff Banner',
                width: 1684,
                height: 640
            }
        ]
    },
    keywords: ['Flyff', 'Skill Simulator', 'Flyff Simulator', 'Flyff Skill Simulator', 'MeteorVIIx', 'React Flow'],
    authors: [
        { name: 'Flyff - Skill Simulator' },
        {
            name: 'Flyff - Skill Simulator',
            url: 'https://flyffskillsimulator.vercel.app'
        },
    ],
    icons: [
        { rel: 'apple-touch-icon', url: '/apple-touch-icon.png' },
        { rel: 'icon', url: '/favicon.ico' }
    ]
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang='en'>
            <body className={inter.className}>{children}</body>
        </html>
    );
};
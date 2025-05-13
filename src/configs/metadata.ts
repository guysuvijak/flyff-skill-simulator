// Next.js 15 - src/configs/metadata.ts
import type { Viewport, Metadata } from 'next';

export const VIEWPORT: Viewport = {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
    themeColor: '#2eeeff'
};

export const METADATA: Metadata = {
    manifest: '/manifest.json',
    title: 'Flyff - Skill Simulator',
    description:
        'Flyff Universe - Skill Simulator (Data from API only), Created by MeteorVIIx, Flyff Skill Simulator is an open-source project developed using Next.js and React Flow technologies. The website serves as a simulator for planning and visualizing skill builds in the Flyff Universe server, allowing players to experiment with different skill combinations and paths.',
    metadataBase: new URL('https://flyffskillsimulator.vercel.app'),
    openGraph: {
        title: 'Flyff - Skill Simulator',
        description:
            'Flyff Universe - Skill Simulator (Data from API only), Created by MeteorVIIx, Flyff Skill Simulator is an open-source project developed using Next.js and React Flow technologies. The website serves as a simulator for planning and visualizing skill builds in the Flyff Universe server, allowing players to experiment with different skill combinations and paths.',
        url: 'https://flyffskillsimulator.vercel.app',
        siteName: 'Flyff - Skill Simulator',
        images: [
            {
                url: '/metadata/manifest.png',
                alt: 'Flyff Banner',
                width: 1200,
                height: 630
            }
        ],
        type: 'website'
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Flyff - Skill Simulator',
        description:
            'Flyff Universe - Skill Simulator (Data from API only), Created by MeteorVIIx, Flyff Skill Simulator is an open-source project developed using Next.js and React Flow technologies. The website serves as a simulator for planning and visualizing skill builds in the Flyff Universe server, allowing players to experiment with different skill combinations and paths.',
        images: ['https://flyffskillsimulator.vercel.app/metadata/manifest.png']
    },
    keywords: [
        'Flyff',
        'Skill Simulator',
        'Flyff Simulator',
        'Flyff Skill Simulator',
        'Flyff API',
        'MeteorVIIx',
        'React Flow'
    ],
    authors: [
        { name: 'Flyff - Skill Simulator' },
        {
            name: 'Flyff - Skill Simulator',
            url: 'https://flyffskillsimulator.vercel.app'
        }
    ],
    icons: {
        icon: [
            { url: '/favicon.ico', type: 'image/x-icon' },
            { url: '/icons/icon-48x48.png', type: 'image/png' },
            { url: '/icons/icon-72x72.png', type: 'image/png' },
            { url: '/icons/icon-96x96.png', type: 'image/png' },
            { url: '/icons/icon-128x128.png', type: 'image/png' }
        ],
        apple: [{ url: '/icons/icon-128x128.png', type: 'image/png' }]
    },
    appleWebApp: {
        capable: true,
        statusBarStyle: 'default',
        title: 'Flyff - Skill Simulator'
    },
    applicationName: 'Flyff - Skill Simulator',
    formatDetection: {
        telephone: false
    }
};

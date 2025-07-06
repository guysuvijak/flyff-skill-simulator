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
    title: 'Flyff Universe Skill Simulator - Plan Your Character Skill Build',
    description:
        'Free online Flyff Universe Skill Simulator. Plan and visualize your character skill builds with our interactive skill tree. Test different skill combinations for all classes including Knight, Blade, Elementor, and more. No download required.',
    metadataBase: new URL('https://flyffskillsimulator.vercel.app'),
    openGraph: {
        title: 'Flyff Universe Skill Simulator - Plan Your Character Skill Build',
        description:
            'Free online Flyff Universe Skill Simulator. Plan and visualize your character skill builds with our interactive skill tree. Test different skill combinations for all classes.',
        url: 'https://flyffskillsimulator.vercel.app',
        siteName: 'Flyff Universe Skill Simulator',
        images: [
            {
                url: '/metadata/manifest.png',
                alt: 'Flyff Universe Skill Simulator - Interactive Skill Tree',
                width: 1200,
                height: 630
            }
        ],
        type: 'website',
        locale: 'en_US'
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Flyff Universe Skill Simulator - Plan Your Character Skill Build',
        description:
            'Free online Flyff Universe Skill Simulator. Plan and visualize your character skill builds with our interactive skill tree.',
        images: [
            'https://flyffskillsimulator.vercel.app/metadata/manifest.png'
        ],
        creator: '@MeteorVIIx'
    },
    keywords: [
        'Flyff Universe',
        'Flyff Skill Simulator',
        'Flyff Character Builder',
        'Flyff Skill Tree',
        'Flyff Class Guide',
        'Flyff Knight Build',
        'Flyff Blade Build',
        'Flyff Elementor Build',
        'Flyff Ranger Build',
        'Flyff Billposter Build',
        'Flyff Ringmaster Build',
        'Flyff Jester Build',
        'Flyff Acrobat Build',
        'Flyff Assist Build',
        'Flyff Mercenary Build',
        'Flyff Psychikeeper Build',
        'Flyff Vagrant Build',
        'Flyff Magician Build',
        'Flyff Skill Calculator',
        'Flyff Build Planner',
        'Flyff Online Simulator',
        'Flyff Game Tools',
        'Flyff MMORPG',
        'Flyff Character Planning',
        'Flyff Skill Points',
        'Flyff Leveling Guide',
        'Flyff PvP Builds',
        'Flyff PvE Builds'
    ],
    authors: [
        {
            name: 'MeteorVIIx',
            url: 'https://github.com/MeteorVIIx'
        },
        {
            name: 'Flyff Universe Skill Simulator',
            url: 'https://flyffskillsimulator.vercel.app'
        }
    ],
    creator: 'MeteorVIIx',
    publisher: 'Flyff Universe Skill Simulator',
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1
        }
    },
    alternates: {
        canonical: 'https://flyffskillsimulator.vercel.app'
    },
    category: 'Gaming',
    classification: 'Game Tools',
    icons: {
        icon: [
            { url: '/favicon.ico', type: 'image/x-icon' },
            { url: '/icons/icon-48x48.png', type: 'image/png', sizes: '48x48' },
            { url: '/icons/icon-72x72.png', type: 'image/png', sizes: '72x72' },
            { url: '/icons/icon-96x96.png', type: 'image/png', sizes: '96x96' },
            {
                url: '/icons/icon-128x128.png',
                type: 'image/png',
                sizes: '128x128'
            },
            {
                url: '/icons/icon-192x192.png',
                type: 'image/png',
                sizes: '192x192'
            },
            {
                url: '/icons/icon-512x512.png',
                type: 'image/png',
                sizes: '512x512'
            }
        ],
        apple: [
            {
                url: '/icons/icon-152x152.png',
                type: 'image/png',
                sizes: '152x152'
            },
            {
                url: '/icons/icon-180x180.png',
                type: 'image/png',
                sizes: '180x180'
            }
        ],
        shortcut: '/favicon.ico'
    },
    appleWebApp: {
        capable: true,
        statusBarStyle: 'default',
        title: 'Flyff Skill Simulator'
    },
    applicationName:
        'Flyff Universe Skill Simulator - Plan Your Character Skill Build',
    formatDetection: {
        telephone: false,
        email: false,
        address: false
    },

    other: {
        'msapplication-TileColor': '#2eeeff',
        'msapplication-config': '/browserconfig.xml',
        'theme-color': '#2eeeff',
        'color-scheme': 'light dark',
        'mobile-web-app-capable': 'yes',
        'apple-mobile-web-app-capable': 'yes',
        'apple-mobile-web-app-status-bar-style': 'default',
        'apple-mobile-web-app-title': 'Flyff Skill Simulator',
        'application-name':
            'Flyff Universe Skill Simulator - Plan Your Character Skill Build',
        'msapplication-TileImage': '/icons/icon-144x144.png',
        'msapplication-square70x70logo': '/icons/icon-72x72.png',
        'msapplication-square150x150logo': '/icons/icon-144x144.png',
        'msapplication-wide310x150logo': '/icons/icon-310x150.png',
        'msapplication-square310x310logo': '/icons/icon-310x310.png'
    }
};

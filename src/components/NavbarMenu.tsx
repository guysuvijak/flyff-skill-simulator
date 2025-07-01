// Next.js 15 - src/components/NavbarMenu.tsx
'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import {
    Menubar,
    MenubarCheckboxItem,
    MenubarContent,
    MenubarItem,
    MenubarMenu,
    MenubarSeparator,
    MenubarShortcut,
    MenubarSub,
    MenubarSubContent,
    MenubarSubTrigger,
    MenubarTrigger
} from '@/components/ui/menubar';
import {
    Cloud,
    Blend,
    Ellipsis,
    ExternalLink,
    Download,
    Share2,
    RotateCcw,
    Camera
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { useWebsiteStore } from '@/stores/websiteStore';
import { shareBuild } from '@/utils/shareBuild';
import { toast } from 'sonner';
import pkg from '../../package.json';

const themeColors = [
    'default',
    'red',
    'rose',
    'orange',
    'green',
    'blue',
    'yellow',
    'violet'
];

export const NavbarMenu = () => {
    const { theme, setTheme } = useTheme();
    const { colorTheme, setColorTheme, skillStyle, setSkillStyle } =
        useWebsiteStore();
    const [isSharing, setIsSharing] = useState(false);

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', colorTheme);
    }, [colorTheme]);

    const handleShare = () => {
        const shareUrl = shareBuild();
        navigator.clipboard.writeText(shareUrl);
        setIsSharing(true);
        toast.success('Link copied to clipboard!');

        // Reset state after 2 seconds
        setTimeout(() => setIsSharing(false), 2000);
    };

    const ExternalLinkItem = ({
        href,
        label
    }: {
        href: string;
        label: string;
    }) => (
        <MenubarItem className='cursor-pointer'>
            <Link
                href={href}
                target='_blank'
                className='flex w-full justify-between items-center'
            >
                {label}
                <MenubarShortcut>
                    <ExternalLink size={16} />
                </MenubarShortcut>
            </Link>
        </MenubarItem>
    );

    return (
        <Menubar>
            {/* Build Menu */}
            <MenubarMenu>
                <MenubarTrigger>
                    <Cloud size={18} className='text-primary' />
                    <span className='ml-1 hidden md:inline'>Build</span>
                </MenubarTrigger>
                <MenubarContent className='mr-2'>
                    <MenubarItem disabled>
                        <Download size={18} className='mr-2' /> Load Build{' '}
                        <MenubarShortcut>soon</MenubarShortcut>
                    </MenubarItem>
                    <MenubarItem onClick={handleShare} disabled={isSharing}>
                        <Share2 size={18} className='mr-2 text-primary' /> Share
                        Build
                    </MenubarItem>
                    <MenubarSeparator />
                    <MenubarItem disabled>
                        <Camera size={18} className='mr-2' /> Screenshot{' '}
                        <MenubarShortcut>soon</MenubarShortcut>
                    </MenubarItem>
                    <MenubarSeparator />
                    <MenubarItem onClick={() => (window.location.href = '/')}>
                        <RotateCcw
                            size={18}
                            className='mr-2 text-destructive'
                        />{' '}
                        Reset Build
                    </MenubarItem>
                </MenubarContent>
            </MenubarMenu>

            {/* Theme Menu */}
            <MenubarMenu>
                <MenubarTrigger>
                    <Blend size={18} className='text-primary' />
                    <span className='ml-1 hidden md:inline'>Theme</span>
                </MenubarTrigger>
                <MenubarContent className='mr-2'>
                    <MenubarCheckboxItem
                        onClick={() => setSkillStyle('colored')}
                        checked={skillStyle === 'colored'}
                    >
                        Icon - Colored
                    </MenubarCheckboxItem>
                    <MenubarCheckboxItem
                        onClick={() => setSkillStyle('old')}
                        checked={skillStyle === 'old'}
                    >
                        Icon - Old
                    </MenubarCheckboxItem>
                    <MenubarSeparator />
                    <MenubarCheckboxItem
                        onClick={() => setTheme('light')}
                        checked={theme === 'light'}
                    >
                        Theme - Light
                    </MenubarCheckboxItem>
                    <MenubarCheckboxItem
                        onClick={() => setTheme('dark')}
                        checked={theme === 'dark'}
                    >
                        Theme - Dark
                    </MenubarCheckboxItem>
                    <MenubarSeparator />
                    <MenubarSub>
                        <MenubarSubTrigger>Theme Color</MenubarSubTrigger>
                        <MenubarSubContent className='mr-2'>
                            {themeColors.map((color) => (
                                <MenubarCheckboxItem
                                    key={color}
                                    onClick={() => setColorTheme(color)}
                                    checked={colorTheme === color}
                                >
                                    {color.charAt(0).toUpperCase() +
                                        color.slice(1)}
                                </MenubarCheckboxItem>
                            ))}
                        </MenubarSubContent>
                    </MenubarSub>
                </MenubarContent>
            </MenubarMenu>

            {/* Other Menu */}
            <MenubarMenu>
                <MenubarTrigger>
                    <Ellipsis size={18} className='text-primary' />
                    <span className='ml-1 hidden md:inline'>Other</span>
                </MenubarTrigger>
                <MenubarContent className='mr-2'>
                    <ExternalLinkItem
                        href='https://api.flyff.com'
                        label='Flyff Universe API'
                    />
                    <ExternalLinkItem
                        href='https://github.com/guysuvijak/flyff-skill-simulator'
                        label='Source Code'
                    />
                    <MenubarSeparator />
                    <ExternalLinkItem
                        href='https://github.com/guysuvijak'
                        label='Github Me'
                    />
                    <ExternalLinkItem
                        href='https://facebook.com/guy.suvijak'
                        label='Contact Me'
                    />
                    <ExternalLinkItem
                        href='https://ko-fi.com/guysuvijak'
                        label='Donate Me (Ko-fi)'
                    />
                    <MenubarSeparator />
                    <ExternalLinkItem
                        href='https://github.com/guysuvijak/flyff-skill-simulator/blob/main/CHANGELOG.md'
                        label='Changelog'
                    />
                    <MenubarSeparator />
                    <MenubarItem disabled>
                        Current version: {pkg.version}
                    </MenubarItem>
                    <MenubarItem disabled>
                        Last updated: {pkg.updated}
                    </MenubarItem>
                </MenubarContent>
            </MenubarMenu>
        </Menubar>
    );
};

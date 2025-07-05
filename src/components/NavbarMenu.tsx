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
import { useTranslation } from '@/hooks/useTranslation';
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

const languages = ['en', 'th', 'jp', 'cns', 'vi'];

export const NavbarMenu = () => {
    const { t } = useTranslation();
    const { theme, setTheme } = useTheme();
    const {
        lang,
        setLang,
        colorTheme,
        setColorTheme,
        skillStyle,
        setSkillStyle
    } = useWebsiteStore();
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
                <MenubarTrigger className='hover:bg-muted cursor-pointer'>
                    <Cloud size={18} className='text-primary' />
                    <span className='ml-1 hidden md:inline whitespace-nowrap break-keep'>
                        {t(`navbar.menu.build.main`)}
                    </span>
                </MenubarTrigger>
                <MenubarContent className='mr-2'>
                    <MenubarItem disabled>
                        <Download size={18} className='mr-2' />
                        {t(`navbar.menu.build.load`)}
                        <MenubarShortcut>
                            {t(`navbar.menu.soon`)}
                        </MenubarShortcut>
                    </MenubarItem>
                    <MenubarItem onClick={handleShare} disabled={isSharing} className={`${isSharing ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
                        <Share2 size={18} className='mr-2 text-primary' />
                        {t(`navbar.menu.build.share`)}
                    </MenubarItem>
                    <MenubarSeparator />
                    <MenubarItem disabled>
                        <Camera size={18} className='mr-2' />
                        {t(`navbar.menu.build.screenshot`)}
                        <MenubarShortcut>
                            {t(`navbar.menu.soon`)}
                        </MenubarShortcut>
                    </MenubarItem>
                    <MenubarSeparator />
                    <MenubarItem onClick={() => (window.location.href = '/')} className='cursor-pointer'>
                        <RotateCcw
                            size={18}
                            className='mr-2 text-destructive'
                        />
                        {t(`navbar.menu.build.reset`)}
                    </MenubarItem>
                </MenubarContent>
            </MenubarMenu>

            {/* Theme Menu */}
            <MenubarMenu>
                <MenubarTrigger className='hover:bg-muted cursor-pointer'>
                    <Blend size={18} className='text-primary' />
                    <span className='ml-1 hidden md:inline whitespace-nowrap break-keep'>
                        {t(`navbar.menu.theme.main`)}
                    </span>
                </MenubarTrigger>
                <MenubarContent className='mr-2'>
                    <MenubarCheckboxItem
                        onClick={() => setSkillStyle('colored')}
                        checked={skillStyle === 'colored'}
                        className='cursor-pointer'
                    >
                        {t(`navbar.menu.theme.icon-colored`)}
                    </MenubarCheckboxItem>
                    <MenubarCheckboxItem
                        onClick={() => setSkillStyle('old')}
                        checked={skillStyle === 'old'}
                        className='cursor-pointer'
                    >
                        {t(`navbar.menu.theme.icon-old`)}
                    </MenubarCheckboxItem>
                    <MenubarSeparator />
                    <MenubarCheckboxItem
                        onClick={() => setTheme('light')}
                        checked={theme === 'light'}
                        className='cursor-pointer'
                    >
                        {t(`navbar.menu.theme.theme-light`)}
                    </MenubarCheckboxItem>
                    <MenubarCheckboxItem
                        onClick={() => setTheme('dark')}
                        checked={theme === 'dark'}
                        className='cursor-pointer'
                    >
                        {t(`navbar.menu.theme.theme-dark`)}
                    </MenubarCheckboxItem>
                    <MenubarSeparator />
                    <MenubarSub>
                        <MenubarSubTrigger className='cursor-pointer'>
                            {t(`navbar.menu.theme.theme-color.main`)}
                        </MenubarSubTrigger>
                        <MenubarSubContent className='mr-2'>
                            {themeColors.map((color) => (
                                <MenubarCheckboxItem
                                    key={color}
                                    onClick={() => setColorTheme(color)}
                                    checked={colorTheme === color}
                                    className='cursor-pointer'
                                >
                                    {t(
                                        `navbar.menu.theme.theme-color.${color}`
                                    )}
                                </MenubarCheckboxItem>
                            ))}
                        </MenubarSubContent>
                    </MenubarSub>
                    <MenubarSub>
                        <MenubarSubTrigger className='cursor-pointer'>
                            {t(`navbar.menu.theme.language.main`)}
                        </MenubarSubTrigger>
                        <MenubarSubContent className='mr-2'>
                            {languages.map((item) => (
                                <MenubarCheckboxItem
                                    key={item}
                                    onClick={() => setLang(item)}
                                    checked={lang === item}
                                    className='cursor-pointer'
                                >
                                    {t(`navbar.menu.theme.language.${item}`)}
                                </MenubarCheckboxItem>
                            ))}
                        </MenubarSubContent>
                    </MenubarSub>
                </MenubarContent>
            </MenubarMenu>

            {/* Other Menu */}
            <MenubarMenu>
                <MenubarTrigger className='hover:bg-muted cursor-pointer'>
                    <Ellipsis size={18} className='text-primary' />
                    <span className='ml-1 hidden md:inline whitespace-nowrap break-keep'>
                        {t(`navbar.menu.other.main`)}
                    </span>
                </MenubarTrigger>
                <MenubarContent className='mr-2'>
                    <ExternalLinkItem
                        href='https://api.flyff.com'
                        label={t(`navbar.menu.other.flyff-api`)}
                    />
                    <ExternalLinkItem
                        href='https://github.com/guysuvijak/flyff-skill-simulator'
                        label={t(`navbar.menu.other.source-code`)}
                    />
                    <MenubarSeparator />
                    <ExternalLinkItem
                        href='https://github.com/guysuvijak'
                        label={t(`navbar.menu.other.github-me`)}
                    />
                    <ExternalLinkItem
                        href='https://facebook.com/guy.suvijak'
                        label={t(`navbar.menu.other.contact-me`)}
                    />
                    <ExternalLinkItem
                        href='https://ko-fi.com/guysuvijak'
                        label={t(`navbar.menu.other.donate-me`)}
                    />
                    <MenubarSeparator />
                    <ExternalLinkItem
                        href='https://github.com/guysuvijak/flyff-skill-simulator/blob/main/CHANGELOG.md'
                        label={t(`navbar.menu.other.changelog`)}
                    />
                    <MenubarSeparator />
                    <MenubarItem disabled>
                        {t(`navbar.menu.other.current-version`, {
                            version: pkg.version
                        })}
                    </MenubarItem>
                    <MenubarItem disabled>
                        {t(`navbar.menu.other.last-updated`, {
                            date: pkg.updated
                        })}
                    </MenubarItem>
                </MenubarContent>
            </MenubarMenu>
        </Menubar>
    );
};

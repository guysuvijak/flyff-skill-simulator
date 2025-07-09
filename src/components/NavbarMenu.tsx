// Next.js 15 - src/components/NavbarMenu.tsx
'use client';
import Link from 'next/link';
import { useState } from 'react';
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
import { toast } from 'sonner';
import { useTranslation } from '@/hooks/useTranslation';
import { useSkillStore } from '@/stores/skillStore';
import pkg from '../../package.json';
import { LoadBuildDialog } from './LoadBuildDialog';
import { ShareBuildDialog } from './ShareBuildDialog';

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

const languages = [
    'en',
    'th',
    'jp',
    'cns',
    'vi',
    'br',
    'de',
    'fr',
    'id',
    'kr',
    'sp'
];

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
    const { resetSkillLevels } = useSkillStore();
    const [isLoadDialogOpen, setIsLoadDialogOpen] = useState(false);
    const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);

    const handleShare = () => {
        setIsShareDialogOpen(true);
    };

    const handleReset = () => {
        resetSkillLevels();
        toast.success(t(`navbar.menu.build.reset-toast`));
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

    const externalLinks = [
        {
            href: 'https://api.flyff.com',
            label: t(`navbar.menu.other.flyff-api`)
        },
        {
            href: 'https://github.com/guysuvijak/flyff-skill-simulator',
            label: t(`navbar.menu.other.source-code`)
        },
        {
            href: 'https://github.com/guysuvijak',
            label: t(`navbar.menu.other.github-me`)
        },
        {
            href: 'https://facebook.com/guy.suvijak',
            label: t(`navbar.menu.other.contact-me`)
        },
        {
            href: 'https://ko-fi.com/guysuvijak',
            label: t(`navbar.menu.other.donate-me`)
        },
        {
            href: 'https://github.com/guysuvijak/flyff-skill-simulator/blob/main/CHANGELOG.md',
            label: t(`navbar.menu.other.changelog`)
        }
    ];

    return (
        <>
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
                        <MenubarItem
                            onClick={() => setIsLoadDialogOpen(true)}
                            className='cursor-pointer'
                        >
                            <Download size={18} className='mr-2 text-primary' />
                            {t(`navbar.menu.build.load`)}
                        </MenubarItem>
                        <MenubarItem
                            onClick={handleShare}
                            className='cursor-pointer'
                        >
                            <Share2 size={18} className='mr-2 text-primary' />
                            {t(`navbar.menu.build.share`)}
                        </MenubarItem>
                        <MenubarSeparator />
                        <MenubarItem disabled>
                            <Camera size={18} className='mr-2 text-primary' />
                            {t(`navbar.menu.build.screenshot`)}
                            <MenubarShortcut>
                                {t(`navbar.menu.soon`)}
                            </MenubarShortcut>
                        </MenubarItem>
                        <MenubarSeparator />
                        <MenubarItem
                            onClick={handleReset}
                            className='cursor-pointer'
                        >
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
                            {t(`navbar.menu.setting.main`)}
                        </span>
                    </MenubarTrigger>
                    <MenubarContent className='mr-2'>
                        <MenubarCheckboxItem
                            onClick={() => setSkillStyle('colored')}
                            checked={skillStyle === 'colored'}
                            className='cursor-pointer'
                        >
                            {t(`navbar.menu.setting.icon-colored`)}
                        </MenubarCheckboxItem>
                        <MenubarCheckboxItem
                            onClick={() => setSkillStyle('old')}
                            checked={skillStyle === 'old'}
                            className='cursor-pointer'
                        >
                            {t(`navbar.menu.setting.icon-old`)}
                        </MenubarCheckboxItem>
                        <MenubarSeparator />
                        <MenubarCheckboxItem
                            onClick={() => setTheme('light')}
                            checked={theme === 'light'}
                            className='cursor-pointer'
                        >
                            {t(`navbar.menu.setting.theme-light`)}
                        </MenubarCheckboxItem>
                        <MenubarCheckboxItem
                            onClick={() => setTheme('dark')}
                            checked={theme === 'dark'}
                            className='cursor-pointer'
                        >
                            {t(`navbar.menu.setting.theme-dark`)}
                        </MenubarCheckboxItem>
                        <MenubarSeparator />
                        <MenubarSub>
                            <MenubarSubTrigger className='cursor-pointer'>
                                {t(`navbar.menu.setting.theme-color.main`)}
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
                                            `navbar.menu.setting.theme-color.${color}`
                                        )}
                                    </MenubarCheckboxItem>
                                ))}
                            </MenubarSubContent>
                        </MenubarSub>
                        <MenubarSub>
                            <MenubarSubTrigger className='cursor-pointer'>
                                {t(`navbar.menu.setting.language.main`)}
                            </MenubarSubTrigger>
                            <MenubarSubContent className='mr-2 max-h-[250px] md:max-h-full overflow-y-auto'>
                                {languages.map((item) => (
                                    <MenubarCheckboxItem
                                        key={item}
                                        onClick={() => setLang(item)}
                                        checked={lang === item}
                                        className='cursor-pointer'
                                    >
                                        {t(
                                            `navbar.menu.setting.language.${item}`
                                        )}
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
                        {externalLinks.map((link, index) => (
                            <div key={link.href}>
                                <ExternalLinkItem
                                    href={link.href}
                                    label={link.label}
                                />
                                {/* Add separators after specific items */}
                                {(index === 1 || index === 4) && (
                                    <MenubarSeparator />
                                )}
                            </div>
                        ))}
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

            {/* Load Build Dialog */}
            <LoadBuildDialog
                open={isLoadDialogOpen}
                onOpenChange={setIsLoadDialogOpen}
            />

            {/* Share Build Dialog */}
            <ShareBuildDialog
                open={isShareDialogOpen}
                onOpenChange={setIsShareDialogOpen}
            />
        </>
    );
};

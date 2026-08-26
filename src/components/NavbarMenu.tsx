// Next.js 16 - src/components/NavbarMenu.tsx
'use client';
import Link from 'next/link';
import {
    useState,
    useRef,
    useCallback,
    useEffect,
    type ReactNode,
    type MouseEvent,
    type PointerEvent as ReactPointerEvent,
    type FocusEvent as ReactFocusEvent
} from 'react';
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
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import {
    Cloud,
    Blend,
    Ellipsis,
    ExternalLink,
    Download,
    Share2,
    RotateCcw,
    Camera,
    Check,
    ChevronRight,
    Menu,
    Paintbrush,
    Image,
    Sun,
    Moon,
    Palette,
    Languages
} from 'lucide-react';
import {
    US,
    TH,
    JP,
    CN,
    VN,
    BR,
    DE,
    FR,
    ID,
    KR,
    ES
} from 'country-flag-icons/react/3x2';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from 'next-themes';
import { useWebsiteStore } from '@/stores/websiteStore';
import { toast } from 'sonner';
import { useTranslation } from '@/hooks/useTranslation';
import { useSkillStore } from '@/stores/skillStore';
import pkg from '../../package.json';
import { LoadBuildDialog } from './LoadBuildDialog';
import { ShareBuildDialog } from './ShareBuildDialog';
import { startAnimatedThemeChange } from '@/utils/animatedTheme';
import { cn } from '@/lib/utils';

const themeColors = [
    'default',
    'red',
    'rose',
    'orange',
    'green',
    'blue',
    'yellow',
    'violet'
] as const;

/** Light-mode primary HSL (matches globals.css data-theme swatches) */
const themeColorSwatches: Record<(typeof themeColors)[number], string> = {
    default: 'hsl(240 5.9% 10%)',
    red: 'hsl(0 72.2% 50.6%)',
    rose: 'hsl(346.8 77.2% 49.8%)',
    orange: 'hsl(24.6 95% 53.1%)',
    green: 'hsl(142.1 76.2% 36.3%)',
    blue: 'hsl(221.2 83.2% 53.3%)',
    yellow: 'hsl(47.9 95.8% 53.1%)',
    violet: 'hsl(262.1 83.3% 57.8%)'
};

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
] as const;

const languageFlagIcons: Record<
    (typeof languages)[number],
    typeof US
> = {
    en: US,
    th: TH,
    jp: JP,
    cns: CN,
    vi: VN,
    br: BR,
    de: DE,
    fr: FR,
    id: ID,
    kr: KR,
    sp: ES
};

const LanguageFlag = ({
    code,
    className
}: {
    code: (typeof languages)[number];
    className?: string;
}) => {
    const Flag = languageFlagIcons[code];
    return (
        <Flag
            aria-hidden
            className={cn(
                'h-3.5 w-5 shrink-0 rounded-[2px] object-cover shadow-sm ring-1 ring-border/50',
                className
            )}
        />
    );
};

type SettingsSection = 'color' | 'lang' | null;
type HighlightRect = { top: number; height: number };

const MOBILE_MENU_ITEM_SELECTOR = '[data-mobile-menu-item]';

const MobileSectionLabel = ({
    icon,
    children
}: {
    icon: ReactNode;
    children: ReactNode;
}) => (
    <div className='relative z-10 flex items-center gap-3 px-3 pb-1.5 pt-4 text-base font-bold uppercase tracking-wider text-foreground'>
        {icon}
        {children}
    </div>
);

const MobileMenuRow = ({
    onClick,
    disabled,
    destructive,
    children,
    trailing
}: {
    onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
    disabled?: boolean;
    destructive?: boolean;
    children: ReactNode;
    trailing?: ReactNode;
}) => (
    <button
        type='button'
        disabled={disabled}
        onClick={onClick}
        data-mobile-menu-item={!disabled ? '' : undefined}
        className={cn(
            'relative z-10 flex w-full items-center gap-3 rounded-lg px-3 py-3.5 text-left text-base',
            disabled
                ? 'cursor-not-allowed opacity-50'
                : 'cursor-pointer',
            destructive && !disabled && 'text-destructive'
        )}
    >
        <span className='flex min-w-0 flex-1 items-center gap-3'>
            {children}
        </span>
        {trailing}
    </button>
);

const MobileCheckRow = ({
    checked,
    onClick,
    children
}: {
    checked: boolean;
    onClick: (e: MouseEvent<HTMLButtonElement>) => void;
    children: ReactNode;
}) => (
    <MobileMenuRow
        onClick={onClick}
        trailing={
            checked ? (
                <Check size={18} className='shrink-0 text-primary' />
            ) : (
                <span className='h-[18px] w-[18px] shrink-0' />
            )
        }
    >
        {children}
    </MobileMenuRow>
);

const MobileCollapsible = ({
    open,
    children
}: {
    open: boolean;
    children: ReactNode;
}) => (
    <AnimatePresence initial={false}>
        {open && (
            <motion.div
                key='content'
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                className='overflow-hidden'
            >
                <div className='ml-2 border-l pl-2'>{children}</div>
            </motion.div>
        )}
    </AnimatePresence>
);

const MobileChevron = ({ open }: { open: boolean }) => (
    <motion.span
        aria-hidden
        animate={{ rotate: open ? 90 : 0 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className='inline-flex shrink-0'
    >
        <ChevronRight size={18} />
    </motion.span>
);

const useMobileSheetHighlight = () => {
    const listRef = useRef<HTMLDivElement>(null);
    const [highlight, setHighlight] = useState<HighlightRect | null>(null);
    const lastHighlightRef = useRef<HighlightRect>({ top: 0, height: 48 });

    const updateFromElement = useCallback((item: HTMLElement | null) => {
        const list = listRef.current;
        if (!list || !item) {
            setHighlight(null);
            return;
        }
        if (
            (item instanceof HTMLButtonElement && item.disabled) ||
            item.getAttribute('aria-disabled') === 'true'
        ) {
            return;
        }

        const listRect = list.getBoundingClientRect();
        const itemRect = item.getBoundingClientRect();
        const next = {
            top: itemRect.top - listRect.top + list.scrollTop,
            height: itemRect.height
        };
        lastHighlightRef.current = next;
        setHighlight(next);
    }, []);

    const onPointerMove = useCallback(
        (event: ReactPointerEvent<HTMLDivElement>) => {
            const item = (event.target as HTMLElement).closest(
                MOBILE_MENU_ITEM_SELECTOR
            ) as HTMLElement | null;
            updateFromElement(item);
        },
        [updateFromElement]
    );

    const onPointerLeave = useCallback(() => {
        setHighlight(null);
    }, []);

    const onFocusCapture = useCallback(
        (event: ReactFocusEvent<HTMLDivElement>) => {
            const item = (event.target as HTMLElement).closest(
                MOBILE_MENU_ITEM_SELECTOR
            ) as HTMLElement | null;
            updateFromElement(item);
        },
        [updateFromElement]
    );

    return {
        listRef,
        highlight,
        lastHighlightRef,
        onPointerMove,
        onPointerLeave,
        onFocusCapture
    };
};
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
    const [isMobileSheetOpen, setIsMobileSheetOpen] = useState(false);
    const [settingsSection, setSettingsSection] =
        useState<SettingsSection>(null);
    const {
        listRef,
        highlight,
        lastHighlightRef,
        onPointerMove,
        onPointerLeave,
        onFocusCapture
    } = useMobileSheetHighlight();

    const handleShare = () => {
        setIsMobileSheetOpen(false);
        setIsShareDialogOpen(true);
    };

    const handleLoad = () => {
        setIsMobileSheetOpen(false);
        setIsLoadDialogOpen(true);
    };

    const handleReset = () => {
        resetSkillLevels();
        toast.success(t(`navbar.menu.build.reset-toast`));
        setIsMobileSheetOpen(false);
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

    const closeMobileSheet = (open: boolean) => {
        setIsMobileSheetOpen(open);
        if (!open) {
            setSettingsSection(null);
        }
    };

    // Force-close mobile sheet when viewport leaves mobile (< md)
    useEffect(() => {
        const media = window.matchMedia('(min-width: 768px)');
        const handleChange = (event: MediaQueryListEvent | MediaQueryList) => {
            if (event.matches) {
                setIsMobileSheetOpen(false);
                setSettingsSection(null);
            }
        };

        handleChange(media);
        media.addEventListener('change', handleChange);
        return () => media.removeEventListener('change', handleChange);
    }, []);

    return (
        <>
            {/* Mobile: single menu trigger → combined sheet */}
            <Button
                type='button'
                variant='outline'
                size='icon'
                className='h-9 w-9 shrink-0 hover:bg-muted md:hidden'
                aria-label='Menu'
                onClick={() => setIsMobileSheetOpen(true)}
            >
                <Menu size={20} className='text-primary' />
            </Button>

            {/* Desktop: menubar dropdowns */}
            <Menubar className='hidden md:flex'>
                {/* Build Menu */}
                <MenubarMenu>
                    <MenubarTrigger className='hover:bg-muted cursor-pointer'>
                        <Cloud size={18} className='text-primary' />
                        <span className='ml-1 whitespace-nowrap break-keep'>
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
                        <span className='ml-1 whitespace-nowrap break-keep'>
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
                            onClick={(e) =>
                                startAnimatedThemeChange({
                                    theme: 'light',
                                    currentTheme: theme,
                                    setTheme,
                                    event: e
                                })
                            }
                            checked={theme === 'light'}
                            className='cursor-pointer'
                        >
                            {t(`navbar.menu.setting.theme-light`)}
                        </MenubarCheckboxItem>
                        <MenubarCheckboxItem
                            onClick={(e) =>
                                startAnimatedThemeChange({
                                    theme: 'dark',
                                    currentTheme: theme,
                                    setTheme,
                                    event: e
                                })
                            }
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
                                        <span className='flex items-center gap-2'>
                                            <span
                                                aria-hidden
                                                className='h-3 w-3 shrink-0 rounded-full border border-border/60'
                                                style={{
                                                    backgroundColor:
                                                        themeColorSwatches[
                                                            color
                                                        ]
                                                }}
                                            />
                                            {t(
                                                `navbar.menu.setting.theme-color.${color}`
                                            )}
                                        </span>
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
                                        <span className='flex items-center gap-2'>
                                            <LanguageFlag code={item} />
                                            {t(
                                                `navbar.menu.setting.language.${item}`
                                            )}
                                        </span>
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
                        <span className='ml-1 whitespace-nowrap break-keep'>
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

            {/* Mobile: combined Build + Settings + Other sheet */}
            <Sheet open={isMobileSheetOpen} onOpenChange={closeMobileSheet}>
                <SheetContent
                    side='right'
                    className='flex w-full max-w-sm flex-col gap-0 p-0'
                    onOpenAutoFocus={(event) => event.preventDefault()}
                >
                    <SheetHeader className='shrink-0 border-b px-4 py-4 pr-14 text-left'>
                        <SheetTitle className='flex items-center gap-3'>
                            <Menu size={18} className='text-primary' />
                            Menu
                        </SheetTitle>
                    </SheetHeader>
                    <div
                        ref={listRef}
                        className='relative flex-1 overflow-y-auto px-2 pb-4'
                        onPointerMove={onPointerMove}
                        onPointerLeave={onPointerLeave}
                        onFocusCapture={onFocusCapture}
                    >
                        <motion.div
                            aria-hidden
                            className='pointer-events-none absolute left-2 right-2 z-0 rounded-lg bg-accent'
                            initial={false}
                            animate={{
                                top: lastHighlightRef.current.top,
                                height: lastHighlightRef.current.height,
                                opacity: highlight ? 1 : 0
                            }}
                            transition={{
                                top: highlight
                                    ? {
                                          type: 'spring',
                                          stiffness: 450,
                                          damping: 35
                                      }
                                    : { duration: 0 },
                                height: highlight
                                    ? {
                                          type: 'spring',
                                          stiffness: 450,
                                          damping: 35
                                      }
                                    : { duration: 0 },
                                opacity: { duration: 0.15, ease: 'easeOut' }
                            }}
                        />
                        {/* Build */}
                        <MobileSectionLabel
                            icon={<Cloud size={16} className='text-foreground' />}
                        >
                            {t(`navbar.menu.build.main`)}
                        </MobileSectionLabel>
                        <MobileMenuRow onClick={handleLoad}>
                            <Download size={18} className='text-primary' />
                            {t(`navbar.menu.build.load`)}
                        </MobileMenuRow>
                        <MobileMenuRow onClick={handleShare}>
                            <Share2 size={18} className='text-primary' />
                            {t(`navbar.menu.build.share`)}
                        </MobileMenuRow>
                        <MobileMenuRow
                            disabled
                            trailing={
                                <span className='text-xs text-muted-foreground'>
                                    {t(`navbar.menu.soon`)}
                                </span>
                            }
                        >
                            <Camera size={18} className='text-primary' />
                            {t(`navbar.menu.build.screenshot`)}
                        </MobileMenuRow>
                        <MobileMenuRow onClick={handleReset} destructive>
                            <RotateCcw size={18} />
                            {t(`navbar.menu.build.reset`)}
                        </MobileMenuRow>

                        <div className='my-2 border-t' />

                        {/* Settings */}
                        <MobileSectionLabel
                            icon={<Blend size={16} className='text-foreground' />}
                        >
                            {t(`navbar.menu.setting.main`)}
                        </MobileSectionLabel>
                        <MobileCheckRow
                            checked={skillStyle === 'colored'}
                            onClick={() => setSkillStyle('colored')}
                        >
                            <Paintbrush size={18} className='text-muted-foreground' />
                            {t(`navbar.menu.setting.icon-colored`)}
                        </MobileCheckRow>
                        <MobileCheckRow
                            checked={skillStyle === 'old'}
                            onClick={() => setSkillStyle('old')}
                        >
                            <Image size={18} className='text-muted-foreground' />
                            {t(`navbar.menu.setting.icon-old`)}
                        </MobileCheckRow>
                        <div className='my-1 border-t' />
                        <MobileCheckRow
                            checked={theme === 'light'}
                            onClick={(e) =>
                                startAnimatedThemeChange({
                                    theme: 'light',
                                    currentTheme: theme,
                                    setTheme,
                                    event: e
                                })
                            }
                        >
                            <Sun size={18} className='text-muted-foreground' />
                            {t(`navbar.menu.setting.theme-light`)}
                        </MobileCheckRow>
                        <MobileCheckRow
                            checked={theme === 'dark'}
                            onClick={(e) =>
                                startAnimatedThemeChange({
                                    theme: 'dark',
                                    currentTheme: theme,
                                    setTheme,
                                    event: e
                                })
                            }
                        >
                            <Moon size={18} className='text-muted-foreground' />
                            {t(`navbar.menu.setting.theme-dark`)}
                        </MobileCheckRow>
                        <div className='my-1 border-t' />
                        <MobileMenuRow
                            onClick={() =>
                                setSettingsSection((prev) =>
                                    prev === 'color' ? null : 'color'
                                )
                            }
                            trailing={
                                <MobileChevron
                                    open={settingsSection === 'color'}
                                />
                            }
                        >
                            <Palette size={18} className='text-muted-foreground' />
                            {t(`navbar.menu.setting.theme-color.main`)}
                        </MobileMenuRow>
                        <MobileCollapsible open={settingsSection === 'color'}>
                            {themeColors.map((color) => (
                                <MobileCheckRow
                                    key={color}
                                    checked={colorTheme === color}
                                    onClick={() => setColorTheme(color)}
                                >
                                    <span className='flex items-center gap-2'>
                                        <span
                                            aria-hidden
                                            className='h-3 w-3 shrink-0 rounded-full border border-border/60'
                                            style={{
                                                backgroundColor:
                                                    themeColorSwatches[color]
                                            }}
                                        />
                                        {t(
                                            `navbar.menu.setting.theme-color.${color}`
                                        )}
                                    </span>
                                </MobileCheckRow>
                            ))}
                        </MobileCollapsible>
                        <MobileMenuRow
                            onClick={() =>
                                setSettingsSection((prev) =>
                                    prev === 'lang' ? null : 'lang'
                                )
                            }
                            trailing={
                                <MobileChevron
                                    open={settingsSection === 'lang'}
                                />
                            }
                        >
                            <Languages
                                size={18}
                                className='text-muted-foreground'
                            />
                            {t(`navbar.menu.setting.language.main`)}
                        </MobileMenuRow>
                        <MobileCollapsible open={settingsSection === 'lang'}>
                            {languages.map((item) => (
                                <MobileCheckRow
                                    key={item}
                                    checked={lang === item}
                                    onClick={() => setLang(item)}
                                >
                                    <span className='flex items-center gap-2'>
                                        <LanguageFlag code={item} />
                                        {t(
                                            `navbar.menu.setting.language.${item}`
                                        )}
                                    </span>
                                </MobileCheckRow>
                            ))}
                        </MobileCollapsible>

                        <div className='my-2 border-t' />

                        {/* Other */}
                        <MobileSectionLabel
                            icon={
                                <Ellipsis size={16} className='text-foreground' />
                            }
                        >
                            {t(`navbar.menu.other.main`)}
                        </MobileSectionLabel>
                        {externalLinks.map((link, index) => (
                            <div key={link.href}>
                                <MobileMenuRow
                                    onClick={() =>
                                        window.open(
                                            link.href,
                                            '_blank',
                                            'noopener,noreferrer'
                                        )
                                    }
                                    trailing={
                                        <ExternalLink
                                            size={16}
                                            className='text-muted-foreground'
                                        />
                                    }
                                >
                                    {link.label}
                                </MobileMenuRow>
                                {(index === 1 || index === 4) && (
                                    <div className='my-1 border-t' />
                                )}
                            </div>
                        ))}
                        <div className='my-1 border-t' />
                        <MobileMenuRow disabled>
                            {t(`navbar.menu.other.current-version`, {
                                version: pkg.version
                            })}
                        </MobileMenuRow>
                        <MobileMenuRow disabled>
                            {t(`navbar.menu.other.last-updated`, {
                                date: pkg.updated
                            })}
                        </MobileMenuRow>
                    </div>
                </SheetContent>
            </Sheet>

            <LoadBuildDialog
                open={isLoadDialogOpen}
                onOpenChange={setIsLoadDialogOpen}
            />

            <ShareBuildDialog
                open={isShareDialogOpen}
                onOpenChange={setIsShareDialogOpen}
            />
        </>
    );
};

// Next.js 15 - src/components/NavbarMenu.tsx
'use client';
import Link from 'next/link';
import { useState, FormEvent, useRef } from 'react';
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
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from '@/components/ui/dialog';
import {
    Cloud,
    Blend,
    Ellipsis,
    ExternalLink,
    Download,
    Share2,
    RotateCcw,
    Camera,
    Loader2,
    Check,
    X
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { useWebsiteStore } from '@/stores/websiteStore';
import {
    shareBuild,
    shareBuildOptimized,
    loadBuildFromUrl,
    decodeBuildData,
    loadClassById
} from '@/utils/shareBuild';
import { toast } from 'sonner';
import { useTranslation } from '@/hooks/useTranslation';
import { useSkillStore } from '@/stores/skillStore';
import { useClassStore } from '@/stores/classStore';
import { useCharacterStore } from '@/stores/characterStore';
import { ClassData } from '@/types/class';
import pkg from '../../package.json';
import { Button } from './ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from './ui/label';

// Type definitions for File System Access API
declare global {
    interface Window {
        showSaveFilePicker?: (options?: {
            suggestedName?: string;
            types?: Array<{
                description: string;
                accept: Record<string, string[]>;
            }>;
        }) => Promise<FileSystemFileHandle>;
    }

    interface FileSystemFileHandle {
        createWritable(): Promise<FileSystemWritableFileStream>;
    }

    interface FileSystemWritableFileStream extends WritableStream {
        write(data: string | BufferSource | Blob): Promise<void>;
        close(): Promise<void>;
    }
}

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
    const [buildLink, setBuildLink] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [loadingSteps, setLoadingSteps] = useState<
        Array<{
            id: string;
            label: string;
            status: 'pending' | 'loading' | 'success' | 'error';
            error?: string;
        }>
    >([]);
    const [copiedStates, setCopiedStates] = useState<{
        link: boolean;
        data: boolean;
    }>({
        link: false,
        data: false
    });
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleShare = () => {
        setIsShareDialogOpen(true);
    };

    const handleReset = () => {
        resetSkillLevels();
        toast.success(t(`navbar.menu.build.reset-toast`));
    };

    const updateLoadingStep = (
        id: string,
        status: 'pending' | 'loading' | 'success' | 'error',
        error?: string
    ) => {
        setLoadingSteps((prev) =>
            prev.map((step) =>
                step.id === id ? { ...step, status, error } : step
            )
        );
    };

    const handleLoadBuild = async (e: FormEvent) => {
        e.preventDefault();
        setError(''); // Clear previous errors

        if (!buildLink.trim()) {
            setError(t('menu.build.enter-link'));
            return;
        }

        // Basic validation for the encoded data
        const trimmedLink = buildLink.trim();
        if (trimmedLink.length < 10) {
            setError(t('menu.build.link-short'));
            return;
        }

        // Initialize loading steps
        const steps = [
            {
                id: 'validate',
                label: t('menu.build.load-build.step.validate'),
                status: 'pending' as const
            },
            {
                id: 'decode',
                label: t('menu.build.load-build.step.decode'),
                status: 'pending' as const
            },
            {
                id: 'load-class',
                label: t('menu.build.load-build.step.load-class'),
                status: 'pending' as const
            },
            {
                id: 'load-skills',
                label: t('menu.build.load-build.step.load-skills'),
                status: 'pending' as const
            },
            {
                id: 'apply',
                label: t('menu.build.load-build.step.apply'),
                status: 'pending' as const
            }
        ];

        setLoadingSteps(steps);
        setIsLoading(true);

        try {
            let encodedData = buildLink.trim();
            let decodedData: any = null;

            // Step 1: Validate build data
            updateLoadingStep('validate', 'loading');
            await new Promise((resolve) => setTimeout(resolve, 300));

            // If it's a full URL, extract the data parameter
            if (buildLink.includes('http') || buildLink.includes('localhost')) {
                try {
                    const url = new URL(buildLink);
                    encodedData =
                        url.searchParams.get('data') ||
                        url.searchParams.get('b') ||
                        '';

                    if (!encodedData) {
                        updateLoadingStep(
                            'validate',
                            'error',
                            t('menu.build.load-build.error.invalid-link')
                        );
                        setError(t('menu.build.load-build.error.invalid-link'));
                        setIsLoading(false);
                        return;
                    }
                } catch (urlError) {
                    updateLoadingStep(
                        'validate',
                        'error',
                        t('menu.build.load-build.error.invalid-url')
                    );
                    setError(t('menu.build.load-build.error.invalid-url'));
                    setIsLoading(false);
                    return;
                }
            }
            updateLoadingStep('validate', 'success');

            // Step 2: Decode build data
            updateLoadingStep('decode', 'loading');
            await new Promise((resolve) => setTimeout(resolve, 400));

            try {
                decodedData = decodeBuildData(encodedData);
                updateLoadingStep('decode', 'success');
            } catch (decodeError) {
                updateLoadingStep(
                    'decode',
                    'error',
                    t('menu.build.load-build.error.fail-decode')
                );
                setError(t('menu.build.load-build.error.fail-decode'));
                setIsLoading(false);
                return;
            }

            // Step 3: Load class data
            updateLoadingStep('load-class', 'loading');
            await new Promise((resolve) => setTimeout(resolve, 500));

            try {
                let selectedClass;
                if (decodedData.format === 'old') {
                    selectedClass = decodedData.selectedClass;
                } else {
                    // New format - load class by ID
                    selectedClass = await loadClassById(decodedData.classId);
                }

                // Update class store
                useClassStore.setState({ selectedClass });
                updateLoadingStep('load-class', 'success');
            } catch (classError) {
                updateLoadingStep(
                    'load-class',
                    'error',
                    t('menu.build.load-build.error.fail-class')
                );
                // Use default class (Blade) if class loading fails
                const defaultClass: ClassData = {
                    id: 2246,
                    name: {
                        en: 'Blade',
                        th: 'Blade',
                        jp: 'ブレード',
                        cns: '刀锋战士',
                        vi: 'Blade',
                        br: 'Blade',
                        de: 'Blade',
                        fr: 'Assassin',
                        id: 'Blade',
                        kr: '블레이드',
                        sp: 'Blade'
                    },
                    type: 'professional' as const,
                    tree: 'Blade.png',
                    parent: 764,
                    icon: 'blade.png',
                    minLevel: 60,
                    maxLevel: 165,
                    hp: 1.5,
                    maxHP: '150+level*30+sta*level*0.3',
                    fp: 1.2,
                    maxFP: 'level*2.4+sta*8.400001',
                    mp: 0.6,
                    maxMP: '22+level*1.2+int*5.4',
                    attackSpeed: 87,
                    block: 1.2,
                    critical: 1,
                    autoAttackFactors: {
                        sword: 4.7,
                        axe: 5.7,
                        staff: 0.8,
                        stick: 4,
                        knuckle: 5,
                        yoyo: 4.2,
                        bow: 2.8,
                        wand: 5.5
                    }
                };
                useClassStore.setState({ selectedClass: defaultClass });
            }

            // Step 4: Load skill data
            updateLoadingStep('load-skills', 'loading');
            await new Promise((resolve) => setTimeout(resolve, 400));

            try {
                // Load skill data from JSON
                const response = await fetch('/data/skillall.json');
                if (!response.ok) {
                    throw new Error(
                        t('menu.build.load-build.error.fail-fetch')
                    );
                }
                const skillData = await response.json();
                updateLoadingStep('load-skills', 'success');
            } catch (skillError) {
                updateLoadingStep(
                    'load-skills',
                    'error',
                    t('menu.build.load-build.error.fail-skill')
                );
                // Continue with default skill data
            }

            // Step 5: Apply build to simulator
            updateLoadingStep('apply', 'loading');
            await new Promise((resolve) => setTimeout(resolve, 300));

            try {
                // Update character data
                useCharacterStore.getState().updateCharacter({
                    characterLevel: decodedData.characterLevel || 15,
                    skillPoints: decodedData.skillPoints || 0
                });

                // Update skill levels
                useSkillStore.setState({
                    skillLevels: decodedData.skillLevels || {}
                });

                updateLoadingStep('apply', 'success');
            } catch (applyError) {
                updateLoadingStep(
                    'apply',
                    'error',
                    t('menu.build.load-build.error.fail-apply')
                );

                // Use default values if application fails
                useCharacterStore.getState().updateCharacter({
                    characterLevel: 15,
                    skillPoints: 0
                });
                useSkillStore.setState({ skillLevels: {} });
            }

            // Show success state for a moment before closing
            await new Promise((resolve) => setTimeout(resolve, 1000));

            // Close dialog and show success message
            setIsLoadDialogOpen(false);
            setBuildLink('');
            setError('');
            setIsLoading(false);
            setLoadingSteps([]);
            toast.success(t('menu.build.load-build.toast.success'));
        } catch (error) {
            setError(t('menu.build.load-build.error.fail-load'));
            setIsLoading(false);
        }
    };

    const handleDialogClose = () => {
        if (!isLoading) {
            setIsLoadDialogOpen(false);
            setBuildLink('');
            setSelectedFile(null);
            setError('');
            setLoadingSteps([]);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const handleShareDialogClose = () => {
        setIsShareDialogOpen(false);
        // Reset copied states when dialog closes
        setCopiedStates({
            link: false,
            data: false
        });
    };

    const copyToClipboard = async (text: string, type: 'link' | 'data') => {
        try {
            await navigator.clipboard.writeText(text);

            // Set copied state
            setCopiedStates((prev) => ({
                ...prev,
                [type]: true
            }));

            // Reset after 2 seconds
            setTimeout(() => {
                setCopiedStates((prev) => ({
                    ...prev,
                    [type]: false
                }));
            }, 2000);

            toast.success(
                `${type === 'link' ? t('menu.build.load-build.toast.link-copy') : t('menu.build.load-build.toast.data-copy')}`
            );
        } catch (error) {
            toast.error(t('menu.build.load-build.toast.fail-copy'));
        }
    };

    const downloadBuildData = async () => {
        const { selectedClass } = useClassStore.getState();
        const { characterLevel } = useCharacterStore.getState();
        const { skillLevels } = useSkillStore.getState();

        const buildData = {
            selectedClass,
            characterLevel,
            skillPoints: useCharacterStore.getState().skillPoints,
            skillLevels
        };

        const dataString = JSON.stringify(buildData, null, 2);
        const blob = new Blob([dataString], { type: 'application/json' });

        const className = selectedClass?.name?.en || 'Unknown';
        const fileName = `flyffsimulator-lv${characterLevel}-${className}.json`;

        try {
            // Check if the browser supports the File System Access API
            if (window.showSaveFilePicker) {
                // Modern browsers with File System Access API
                const fileHandle = await window.showSaveFilePicker({
                    suggestedName: fileName,
                    types: [
                        {
                            description: 'JSON Files',
                            accept: {
                                'application/json': ['.json']
                            }
                        }
                    ]
                });

                const writable = await fileHandle.createWritable();
                await writable.write(dataString);
                await writable.close();
                toast.success(t('menu.build.download-build.build-save'));
            } else {
                // Fallback for older browsers - use traditional download
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = fileName;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);

                toast.success(t('menu.build.download-build.build-download'));
            }
        } catch (error: any) {
            if (error.name === 'AbortError') {
                // User cancelled the save dialog
            } else {
                toast.error(t('menu.build.download-build.build-fail'));
            }
        }
    };

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            setError(''); // Clear previous errors
        }
    };

    const handleFileUpload = async () => {
        if (!selectedFile) {
            setError(t('menu.build.load-build.error.select-file'));
            return;
        }

        // Check file type
        const allowedTypes = ['application/json'];
        if (!allowedTypes.includes(selectedFile.type)) {
            setError(t('menu.build.load-build.error.select-json'));
            return;
        }

        // Check file size (max 1MB)
        if (selectedFile.size > 1024 * 1024) {
            setError(t('menu.build.load-build.error.file-1mb'));
            return;
        }

        setIsLoading(true);
        setLoadingSteps([
            {
                id: 'read',
                label: t('menu.build.load-build.step.read'),
                status: 'pending' as const
            },
            {
                id: 'parse',
                label: t('menu.build.load-build.step.parse'),
                status: 'pending' as const
            },
            {
                id: 'validate',
                label: t('menu.build.load-build.step.validate'),
                status: 'pending' as const
            },
            {
                id: 'apply',
                label: t('menu.build.load-build.step.apply'),
                status: 'pending' as const
            }
        ]);

        try {
            // Step 1: Read file
            updateLoadingStep('read', 'loading');
            const text = await selectedFile.text();
            updateLoadingStep('read', 'success');

            // Step 2: Parse JSON
            updateLoadingStep('parse', 'loading');
            let buildData;
            try {
                buildData = JSON.parse(text);
            } catch (parseError) {
                updateLoadingStep(
                    'parse',
                    'error',
                    t('menu.build.load-build.error.invalid-json')
                );
                setError(t('menu.build.load-build.error.invalid-json'));
                setIsLoading(false);
                return;
            }
            updateLoadingStep('parse', 'success');

            // Step 3: Validate build data
            updateLoadingStep('validate', 'loading');
            if (
                !buildData.selectedClass ||
                !buildData.characterLevel ||
                !buildData.skillLevels
            ) {
                updateLoadingStep(
                    'validate',
                    'error',
                    t('menu.build.load-build.error.missing-build')
                );
                setError(t('menu.build.load-build.error.invalid-field'));
                setIsLoading(false);
                return;
            }
            updateLoadingStep('validate', 'success');

            // Step 4: Apply build
            updateLoadingStep('apply', 'loading');

            // Update class store
            useClassStore.setState({ selectedClass: buildData.selectedClass });

            // Update character data
            useCharacterStore.getState().updateCharacter({
                characterLevel: buildData.characterLevel,
                skillPoints: buildData.skillPoints || 0
            });

            // Update skill levels
            useSkillStore.setState({ skillLevels: buildData.skillLevels });

            updateLoadingStep('apply', 'success');

            // Show success state for a moment before closing
            await new Promise((resolve) => setTimeout(resolve, 1000));

            // Close dialog and show success message
            setIsLoadDialogOpen(false);
            setSelectedFile(null);
            setError('');
            setIsLoading(false);
            setLoadingSteps([]);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
            toast.success(t('menu.build.load-build.toast.success-file'));
        } catch (error) {
            setError(t('menu.build.load-build.error.fail-load-file'));
            setIsLoading(false);
        }
    };

    const getStepIcon = (
        status: 'pending' | 'loading' | 'success' | 'error'
    ) => {
        switch (status) {
            case 'loading':
                return <Loader2 size={16} className='animate-spin' />;
            case 'success':
                return <Check size={16} className='text-green-500' />;
            case 'error':
                return <X size={16} className='text-destructive' />;
            default:
                return (
                    <div className='w-4 h-4 rounded-full border-2 border-border' />
                );
        }
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
            <Dialog open={isLoadDialogOpen} onOpenChange={handleDialogClose}>
                <form>
                    <DialogContent className='sm:max-w-[425px] max-h-[80vh] overflow-y-auto'>
                        <DialogHeader>
                            <DialogTitle className='flex items-center gap-2'>
                                <Download
                                    size={18}
                                    className='text-muted-foreground'
                                />
                                {t('menu.build.load-build.dialog.title')}
                            </DialogTitle>
                            <DialogDescription className='whitespace-pre-line'>
                                {t('menu.build.load-build.dialog.description')}
                            </DialogDescription>
                        </DialogHeader>

                        {!isLoading ? (
                            <div className='grid gap-4'>
                                {/* File Upload Section */}
                                <div className='grid gap-3'>
                                    <Label htmlFor='file-input'>
                                        {t(
                                            'menu.build.load-build.dialog.upload-file'
                                        )}
                                    </Label>
                                    <div className='flex gap-2'>
                                        <input
                                            ref={fileInputRef}
                                            id='file-input'
                                            type='file'
                                            accept='.json'
                                            onChange={handleFileSelect}
                                            className='flex-1 cursor-pointer file:mr-2 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/90'
                                        />
                                    </div>
                                    {selectedFile && (
                                        <p className='text-sm text-muted-foreground'>
                                            {t(
                                                'menu.build.load-build.dialog.select-file',
                                                {
                                                    filename: selectedFile.name,
                                                    size: (
                                                        selectedFile.size / 1024
                                                    ).toFixed(1)
                                                }
                                            )}
                                        </p>
                                    )}
                                    <Button
                                        type='button'
                                        onClick={handleFileUpload}
                                        className='px-4 cursor-pointer'
                                        disabled={selectedFile ? false : true}
                                    >
                                        {t(
                                            'menu.build.load-build.dialog.load-button'
                                        )}
                                    </Button>
                                </div>

                                <div className='relative'>
                                    <div className='absolute inset-0 flex items-center'>
                                        <span className='w-full border-t' />
                                    </div>
                                    <div className='relative flex justify-center text-xs uppercase'>
                                        <span className='bg-background px-2 text-muted-foreground'>
                                            {t(
                                                'menu.build.load-build.dialog.or'
                                            )}
                                        </span>
                                    </div>
                                </div>

                                {/* Link/Code Section */}
                                <div className='grid gap-3'>
                                    <Label htmlFor='link-textarea'>
                                        {t(
                                            'menu.build.load-build.dialog.link-code'
                                        )}
                                    </Label>
                                    <Textarea
                                        id='link-textarea'
                                        placeholder={t(
                                            'menu.build.load-build.dialog.example-placeholder'
                                        )}
                                        value={buildLink}
                                        onChange={(e) => {
                                            setBuildLink(e.target.value);
                                            setError(''); // Clear error when user types
                                        }}
                                        className={`min-h-[100px] max-h-[180px] ${error ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                                    />
                                </div>

                                {error && (
                                    <p className='text-sm text-destructive'>
                                        {error}
                                    </p>
                                )}
                            </div>
                        ) : (
                            <div className='grid gap-4'>
                                <div className='space-y-3'>
                                    <Label>
                                        {t(
                                            'menu.build.load-build.dialog.load-build'
                                        )}
                                    </Label>
                                    <div className='space-y-2'>
                                        {loadingSteps.map((step) => (
                                            <div
                                                key={step.id}
                                                className='flex items-center gap-3 p-2 rounded-md border'
                                            >
                                                {getStepIcon(step.status)}
                                                <div className='flex-1'>
                                                    <span
                                                        className={`text-sm ${
                                                            step.status ===
                                                            'error'
                                                                ? 'text-destructive'
                                                                : step.status ===
                                                                    'success'
                                                                  ? 'text-green-600'
                                                                  : 'text-foreground'
                                                        }`}
                                                    >
                                                        {step.label}
                                                    </span>
                                                    {step.error && (
                                                        <p className='text-xs text-destructive mt-1'>
                                                            {step.error}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    {loadingSteps.some(
                                        (step) => step.status === 'error'
                                    ) && (
                                        <p className='text-sm text-destructive mt-2'>
                                            {t(
                                                'menu.build.load-build.dialog.step-fail'
                                            )}
                                        </p>
                                    )}
                                </div>
                            </div>
                        )}

                        <DialogFooter className='gap-3 sm:gap-0'>
                            {!isLoading && (
                                <DialogClose asChild>
                                    <Button
                                        type='button'
                                        variant='outline'
                                        onClick={handleDialogClose}
                                    >
                                        {t(
                                            'menu.build.load-build.dialog.cancel-button'
                                        )}
                                    </Button>
                                </DialogClose>
                            )}
                            {!isLoading && (
                                <Button
                                    type='submit'
                                    onClick={handleLoadBuild}
                                    disabled={buildLink.trim() ? false : true}
                                >
                                    {t(
                                        'menu.build.load-build.dialog.load-button'
                                    )}
                                </Button>
                            )}
                        </DialogFooter>
                    </DialogContent>
                </form>
            </Dialog>

            {/* Share Build Dialog */}
            <Dialog
                open={isShareDialogOpen}
                onOpenChange={handleShareDialogClose}
            >
                <DialogContent className='sm:max-w-[600px] max-h-[80vh] overflow-y-auto'>
                    <DialogHeader>
                        <DialogTitle className='flex items-center gap-2'>
                            <Share2
                                size={18}
                                className='text-muted-foreground'
                            />
                            {t(`navbar.menu.build.share-build.dialog.title`)}
                        </DialogTitle>
                        <DialogDescription>
                            {t(
                                `navbar.menu.build.share-build.dialog.description`
                            )}
                        </DialogDescription>
                    </DialogHeader>

                    <div className='grid gap-6'>
                        {/* Full Link Section */}
                        <div className='grid gap-3'>
                            <Label htmlFor='full-link-textarea'>
                                {t(
                                    `navbar.menu.build.share-build.dialog.full-link`
                                )}
                            </Label>
                            <div className='flex gap-2'>
                                <Textarea
                                    id='full-link-textarea'
                                    value={shareBuildOptimized()}
                                    readOnly
                                    className='flex-1 min-h-[60px] max-h-[180px] font-mono text-sm'
                                />
                                <Button
                                    type='button'
                                    variant='outline'
                                    onClick={() =>
                                        copyToClipboard(
                                            shareBuildOptimized(),
                                            'link'
                                        )
                                    }
                                    disabled={copiedStates.link}
                                    className='h-full w-[80px]'
                                >
                                    {copiedStates.link
                                        ? t(
                                              `navbar.menu.build.share-build.dialog.copied-button`
                                          )
                                        : t(
                                              `navbar.menu.build.share-build.dialog.copy-button`
                                          )}
                                </Button>
                            </div>
                        </div>

                        {/* Data Only Section */}
                        <div className='grid gap-3'>
                            <Label htmlFor='data-only-textarea'>
                                {t(
                                    `navbar.menu.build.share-build.dialog.data-only`
                                )}
                            </Label>
                            <div className='flex gap-2'>
                                <Textarea
                                    id='data-only-textarea'
                                    value={
                                        shareBuildOptimized().split('?b=')[1] ||
                                        ''
                                    }
                                    readOnly
                                    className='flex-1 min-h-[60px] max-h-[180px] font-mono text-sm'
                                />
                                <Button
                                    type='button'
                                    variant='outline'
                                    onClick={() =>
                                        copyToClipboard(
                                            shareBuildOptimized().split(
                                                '?b='
                                            )[1] || '',
                                            'data'
                                        )
                                    }
                                    disabled={copiedStates.data}
                                    className={`h-full w-[80px]`}
                                >
                                    {copiedStates.data
                                        ? t(
                                              `navbar.menu.build.share-build.dialog.copied-button`
                                          )
                                        : t(
                                              `navbar.menu.build.share-build.dialog.copy-button`
                                          )}
                                </Button>
                            </div>
                        </div>

                        {/* Download Section */}
                        <div className='grid gap-3'>
                            <Label>
                                {t(
                                    `navbar.menu.build.share-build.dialog.download-title`
                                )}
                            </Label>
                            <p className='text-sm text-muted-foreground'>
                                {t(
                                    `navbar.menu.build.share-build.dialog.download-desc`
                                )}
                            </p>
                            <Button
                                type='button'
                                variant='outline'
                                onClick={downloadBuildData}
                                className='w-full'
                            >
                                <Download size={16} />
                                {t(
                                    `navbar.menu.build.share-build.dialog.download-button`
                                )}
                            </Button>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button type='button' onClick={handleShareDialogClose}>
                            {t(
                                `navbar.menu.build.share-build.dialog.close-button`
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
};

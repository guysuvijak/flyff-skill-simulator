'use client';
import { useState, FormEvent, useRef } from 'react';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from '@/components/ui/dialog';
import { Button } from './ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from './ui/label';
import { Download, Loader2, Check, X } from 'lucide-react';
import { toast } from 'sonner';
import { useTranslation } from '@/hooks/useTranslation';
import { useSkillStore } from '@/stores/skillStore';
import { useClassStore } from '@/stores/classStore';
import { useCharacterStore } from '@/stores/characterStore';
import { ClassData } from '@/types/class';
import { decodeBuildData, loadClassById } from '@/utils/shareBuild';

interface LoadBuildDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export const LoadBuildDialog = ({
    open,
    onOpenChange
}: LoadBuildDialogProps) => {
    const { t } = useTranslation();
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
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

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
                label: t('navbar.menu.build.load-build.step.validate'),
                status: 'pending' as const
            },
            {
                id: 'decode',
                label: t('navbar.menu.build.load-build.step.decode'),
                status: 'pending' as const
            },
            {
                id: 'load-class',
                label: t('navbar.menu.build.load-build.step.load-class'),
                status: 'pending' as const
            },
            {
                id: 'load-skills',
                label: t('navbar.menu.build.load-build.step.load-skills'),
                status: 'pending' as const
            },
            {
                id: 'apply',
                label: t('navbar.menu.build.load-build.step.apply'),
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
                            t('navbar.menu.build.load-build.error.invalid-link')
                        );
                        setError(
                            t('navbar.menu.build.load-build.error.invalid-link')
                        );
                        setIsLoading(false);
                        return;
                    }
                } catch (urlError) {
                    updateLoadingStep(
                        'validate',
                        'error',
                        t('navbar.menu.build.load-build.error.invalid-url')
                    );
                    setError(
                        t('navbar.menu.build.load-build.error.invalid-url')
                    );
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
                    t('navbar.menu.build.load-build.error.fail-decode')
                );
                setError(t('navbar.menu.build.load-build.error.fail-decode'));
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
                    t('navbar.menu.build.load-build.error.fail-class')
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
                        t('navbar.menu.build.load-build.error.fail-fetch')
                    );
                }
                const skillData = await response.json();
                updateLoadingStep('load-skills', 'success');
            } catch (skillError) {
                updateLoadingStep(
                    'load-skills',
                    'error',
                    t('navbar.menu.build.load-build.error.fail-skill')
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
                    t('navbar.menu.build.load-build.error.fail-apply')
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
            onOpenChange(false);
            setBuildLink('');
            setError('');
            setIsLoading(false);
            setLoadingSteps([]);
            toast.success(t('navbar.menu.build.load-build.toast.success'));
        } catch (error) {
            setError(t('navbar.menu.build.load-build.error.fail-load'));
            setIsLoading(false);
        }
    };

    const handleDialogClose = () => {
        if (!isLoading) {
            onOpenChange(false);
            setBuildLink('');
            setSelectedFile(null);
            setError('');
            setLoadingSteps([]);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
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
            setError(t('navbar.menu.build.load-build.error.select-file'));
            return;
        }

        // Check file type
        const allowedTypes = ['application/json'];
        if (!allowedTypes.includes(selectedFile.type)) {
            setError(t('navbar.menu.build.load-build.error.select-json'));
            return;
        }

        // Check file size (max 1MB)
        if (selectedFile.size > 1024 * 1024) {
            setError(t('navbar.menu.build.load-build.error.file-1mb'));
            return;
        }

        setIsLoading(true);
        setLoadingSteps([
            {
                id: 'read',
                label: t('navbar.menu.build.load-build.step.read'),
                status: 'pending' as const
            },
            {
                id: 'parse',
                label: t('navbar.menu.build.load-build.step.parse'),
                status: 'pending' as const
            },
            {
                id: 'validate',
                label: t('navbar.menu.build.load-build.step.validate'),
                status: 'pending' as const
            },
            {
                id: 'load-class',
                label: t('navbar.menu.build.load-build.step.load-class'),
                status: 'pending' as const
            },
            {
                id: 'load-skills',
                label: t('navbar.menu.build.load-build.step.load-skills'),
                status: 'pending' as const
            },
            {
                id: 'apply',
                label: t('navbar.menu.build.load-build.step.apply'),
                status: 'pending' as const
            }
        ]);

        try {
            let buildData: any = null;

            // Step 1: Read file
            updateLoadingStep('read', 'loading');
            await new Promise((resolve) => setTimeout(resolve, 300));
            const text = await selectedFile.text();
            updateLoadingStep('read', 'success');

            // Step 2: Parse JSON
            updateLoadingStep('parse', 'loading');
            await new Promise((resolve) => setTimeout(resolve, 400));
            try {
                buildData = JSON.parse(text);
                updateLoadingStep('parse', 'success');
            } catch (parseError) {
                updateLoadingStep(
                    'parse',
                    'error',
                    t('navbar.menu.build.load-build.error.invalid-json')
                );
                setError(t('navbar.menu.build.load-build.error.invalid-json'));
                setIsLoading(false);
                return;
            }

            // Step 3: Validate build data
            updateLoadingStep('validate', 'loading');
            await new Promise((resolve) => setTimeout(resolve, 300));
            if (
                !buildData.selectedClass ||
                !buildData.characterLevel ||
                !buildData.skillLevels
            ) {
                updateLoadingStep(
                    'validate',
                    'error',
                    t('navbar.menu.build.load-build.error.missing-build')
                );
                setError(t('navbar.menu.build.load-build.error.invalid-field'));
                setIsLoading(false);
                return;
            }
            updateLoadingStep('validate', 'success');

            // Step 4: Load class data
            updateLoadingStep('load-class', 'loading');
            await new Promise((resolve) => setTimeout(resolve, 500));
            try {
                // Update class store
                useClassStore.setState({
                    selectedClass: buildData.selectedClass
                });
                updateLoadingStep('load-class', 'success');
            } catch (classError) {
                updateLoadingStep(
                    'load-class',
                    'error',
                    t('navbar.menu.build.load-build.error.fail-class')
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

            // Step 5: Load skill data
            updateLoadingStep('load-skills', 'loading');
            await new Promise((resolve) => setTimeout(resolve, 400));
            try {
                // Load skill data from JSON
                const response = await fetch('/data/skillall.json');
                if (!response.ok) {
                    throw new Error(
                        t('navbar.menu.build.load-build.error.fail-fetch')
                    );
                }
                const skillData = await response.json();
                updateLoadingStep('load-skills', 'success');
            } catch (skillError) {
                updateLoadingStep(
                    'load-skills',
                    'error',
                    t('navbar.menu.build.load-build.error.fail-skill')
                );
                // Continue with default skill data
            }

            // Step 6: Apply build to simulator
            updateLoadingStep('apply', 'loading');
            await new Promise((resolve) => setTimeout(resolve, 300));
            try {
                // Update character data
                useCharacterStore.getState().updateCharacter({
                    characterLevel: buildData.characterLevel,
                    skillPoints: buildData.skillPoints || 0
                });

                // Update skill levels
                useSkillStore.setState({
                    skillLevels: buildData.skillLevels
                });

                updateLoadingStep('apply', 'success');
            } catch (applyError) {
                updateLoadingStep(
                    'apply',
                    'error',
                    t('navbar.menu.build.load-build.error.fail-apply')
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
            onOpenChange(false);
            setSelectedFile(null);
            setError('');
            setIsLoading(false);
            setLoadingSteps([]);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
            toast.success(t('navbar.menu.build.load-build.toast.success-file'));
        } catch (error) {
            setError(t('navbar.menu.build.load-build.error.fail-load-file'));
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

    return (
        <Dialog open={open} onOpenChange={handleDialogClose}>
            <form>
                <DialogContent className='sm:max-w-[425px] max-h-[80vh] overflow-y-auto'>
                    <DialogHeader>
                        <DialogTitle className='flex items-center gap-2'>
                            <Download
                                size={18}
                                className='text-muted-foreground'
                            />
                            {t('navbar.menu.build.load-build.dialog.title')}
                        </DialogTitle>
                        <DialogDescription className='whitespace-pre-line'>
                            {t(
                                'navbar.menu.build.load-build.dialog.description'
                            )}
                        </DialogDescription>
                    </DialogHeader>

                    {!isLoading ? (
                        <div className='grid gap-4'>
                            {/* File Upload Section */}
                            <div className='grid gap-3'>
                                <Label htmlFor='file-input'>
                                    {t(
                                        'navbar.menu.build.load-build.dialog.upload-file'
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
                                            'navbar.menu.build.load-build.dialog.select-file',
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
                                        'navbar.menu.build.load-build.dialog.load-button'
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
                                            'navbar.menu.build.load-build.dialog.or'
                                        )}
                                    </span>
                                </div>
                            </div>

                            {/* Link/Code Section */}
                            <div className='grid gap-3'>
                                <Label htmlFor='link-textarea'>
                                    {t(
                                        'navbar.menu.build.load-build.dialog.link-code'
                                    )}
                                </Label>
                                <Textarea
                                    id='link-textarea'
                                    placeholder={t(
                                        'navbar.menu.build.load-build.dialog.example-placeholder'
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
                                        'navbar.menu.build.load-build.dialog.load-build'
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
                                                        step.status === 'error'
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
                                            'navbar.menu.build.load-build.dialog.step-fail'
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
                                        'navbar.menu.build.load-build.dialog.cancel-button'
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
                                    'navbar.menu.build.load-build.dialog.load-button'
                                )}
                            </Button>
                        )}
                    </DialogFooter>
                </DialogContent>
            </form>
        </Dialog>
    );
};

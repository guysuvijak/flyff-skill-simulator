'use client';
import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from '@/components/ui/dialog';
import { Button } from './ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from './ui/label';
import { Share2, Download } from 'lucide-react';
import { toast } from 'sonner';
import { useTranslation } from '@/hooks/useTranslation';
import { useClassStore } from '@/stores/classStore';
import { useCharacterStore } from '@/stores/characterStore';
import { useSkillStore } from '@/stores/skillStore';
import { shareBuildOptimized } from '@/utils/shareBuild';

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

interface ShareBuildDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export const ShareBuildDialog = ({
    open,
    onOpenChange
}: ShareBuildDialogProps) => {
    const { t } = useTranslation();
    const [copiedStates, setCopiedStates] = useState<{
        link: boolean;
        data: boolean;
    }>({
        link: false,
        data: false
    });

    const handleShareDialogClose = () => {
        onOpenChange(false);
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
                `${type === 'link' ? t('navbar.menu.build.load-build.toast.link-copy') : t('navbar.menu.build.load-build.toast.data-copy')}`
            );
        } catch (error) {
            toast.error(t('navbar.menu.build.load-build.toast.fail-copy'));
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
                toast.success(t('navbar.menu.build.download-build.build-save'));
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

                toast.success(
                    t('navbar.menu.build.download-build.build-download')
                );
            }
        } catch (error: any) {
            if (error.name === 'AbortError') {
                // User cancelled the save dialog
            } else {
                toast.error(t('navbar.menu.build.download-build.build-fail'));
            }
        }
    };

    return (
        <Dialog open={open} onOpenChange={handleShareDialogClose}>
            <DialogContent className='sm:max-w-[600px] max-h-[80vh] overflow-y-auto'>
                <DialogHeader>
                    <DialogTitle className='flex items-center gap-2'>
                        <Share2 size={18} className='text-muted-foreground' />
                        {t(`navbar.menu.build.share-build.dialog.title`)}
                    </DialogTitle>
                    <DialogDescription>
                        {t(`navbar.menu.build.share-build.dialog.description`)}
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
                                    shareBuildOptimized().split('?b=')[1] || ''
                                }
                                readOnly
                                className='flex-1 min-h-[60px] max-h-[180px] font-mono text-sm'
                            />
                            <Button
                                type='button'
                                variant='outline'
                                onClick={() =>
                                    copyToClipboard(
                                        shareBuildOptimized().split('?b=')[1] ||
                                            '',
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
                        {t(`navbar.menu.build.share-build.dialog.close-button`)}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

// Next.js 15 - src/components/UpdateVersionDialog.tsx
'use client';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useWebsiteStore } from '@/stores/websiteStore';
import { useTranslation } from '@/hooks/useTranslation';
import { updatedList } from '@/configs/updatedList';
import pkg from '../../package.json';

export const UpdateVersionDialog = () => {
    const { t } = useTranslation();
    const { setUpdatedDialog, setLatestVersion } = useWebsiteStore();

    const handleClose = () => {
        setUpdatedDialog(true);
        setLatestVersion(pkg.version);
    };

    return (
        <Dialog open={true}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {t('update-version-dialog.title', {
                            version: pkg.version
                        })}
                    </DialogTitle>
                    <DialogDescription>
                        <p>
                            {t('update-version-dialog.description', {
                                date: pkg.updated
                            })}
                        </p>
                    </DialogDescription>
                </DialogHeader>
                <div className='space-y-2 max-h-[calc(100vh-20rem)] overflow-y-auto'>
                    <h4 className='font-semibold text-sm'>
                        {t('update-version-dialog.whats-new')}
                    </h4>
                    <ul className='list-disc list-inside space-y-1 text-sm'>
                        {updatedList.map((item, index) => (
                            <li key={index}>
                                <span>{item}</span>
                            </li>
                        ))}
                    </ul>
                </div>
                <DialogFooter>
                    <Button onClick={handleClose}>
                        {t('update-version-dialog.ok')}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

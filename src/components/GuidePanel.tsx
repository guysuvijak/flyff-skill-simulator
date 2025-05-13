// Next.js 15 - src/components/GuidePanel.tsx
'use client';
import { FaStar, FaFacebook, FaGithub } from 'react-icons/fa';
import { useWebsiteStore } from '@/stores/websiteStore';
import { Dialog, DialogTitle, DialogContent } from '@/components/ui/dialog';
import pkg from '../../package.json';

const GuidePanel = () => {
    const { guidePanelVisible, setGuidePanelVisible } = useWebsiteStore();

    const handleInnerClick = (e: React.MouseEvent) => {
        e.stopPropagation();
    };

    return (
        <Dialog open={guidePanelVisible} onOpenChange={setGuidePanelVisible}>
            <DialogTitle></DialogTitle>
            <DialogContent
                className='bg-background text-foreground p-6 rounded-lg shadow-lg max-w-md w-full mx-auto'
                onClick={handleInnerClick}
            >
                <div className='flex flex-col items-center space-y-4'>
                    <div className='flex flex-col items-center text-center'>
                        <div className='flex items-center space-x-2'>
                            <FaStar
                                size={20}
                                className='text-yellow-400 rotate-180'
                            />
                            <h2 className='text-lg font-bold'>
                                Flyff Universe - Skill Simulator
                            </h2>
                        </div>
                        <p className='text-muted-foreground text-sm'>
                            Powered by Next.js 15 & React Flow
                        </p>
                        <ul className='list-disc list-inside space-y-1 py-2 text-sm text-left'>
                            <li>Plan and visualize skill builds</li>
                            <li>Calculate optimal skill point distribution</li>
                            <li>Share builds via unique URLs</li>
                            <li>Data from the API Flyff Universe</li>
                        </ul>
                        <p className='text-foreground'>
                            Created by{' '}
                            <span className='font-medium text-primary'>
                                MeteorVIIx
                            </span>
                        </p>
                        <a
                            href='https://facebook.com/guy.suvijak'
                            target='_blank'
                            rel='noopener noreferrer'
                            className='flex items-center text-blue-500 hover:underline transition-colors text-sm mt-2'
                        >
                            <FaFacebook size={20} className='mr-1' />
                            Suvijak Kasemwutthiphong
                        </a>
                        <a
                            href='https://github.com/guysuvijak'
                            target='_blank'
                            rel='noopener noreferrer'
                            className='flex items-center text-foreground hover:underline transition-colors text-sm mt-1 mb-2'
                        >
                            <FaGithub size={20} className='mr-1' />
                            Suvijak (Guy)
                        </a>
                        <p className='text-muted-foreground text-xs'>
                            updated latest: {pkg.updated} | Version{' '}
                            {pkg.version}
                        </p>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default GuidePanel;

// Next.js 15 - src/components/GuideButton.tsx
'use client';
import { Button } from '@/components/ui/button';
import { Info } from 'lucide-react';
import { useWebsiteStore } from '@/stores/websiteStore';

const GuideButton = () => {
    const { setGuidePanelVisible } = useWebsiteStore();

    const handleGuideButton = () => {
        setGuidePanelVisible(true);
    };

    return (
        <div className='relative inline-block ml-2'>
            <Button
                variant='outline'
                size='sm'
                onClick={handleGuideButton}
                aria-label='Guide Button'
                className='cursor-pointer'
            >
                <Info size={18} />
            </Button>
        </div>
    );
};

export default GuideButton;

// Next.js 15 - src/components/GuideButton.tsx
'use client';
import { Button } from '@/components/ui/button';
import { Info } from 'lucide-react';
import { useWebsiteStore } from '@/stores/websiteStore';
import { TooltipWrapper } from '@/components/TooltipWrapper';

interface GuideButtonProps {
    mode: 'icon' | 'text';
}

export const GuideButton = ({ mode }: GuideButtonProps) => {
    const { setGuidePanelVisible } = useWebsiteStore();

    const handleGuideButton = () => {
        setGuidePanelVisible(true);
    };

    return (
        <>
            {mode === 'icon' ? (
                <TooltipWrapper message='Info'>
                    <Button
                        variant='outline'
                        size='sm'
                        onClick={handleGuideButton}
                        aria-label='Guide Button'
                    >
                        <Info size={18} />
                    </Button>
                </TooltipWrapper>
            ) : (
                <Button
                    variant='ghost'
                    size='sm'
                    onClick={handleGuideButton}
                    aria-label='Guide Button'
                    className='flex justify-start'
                >
                    <Info size={18} />
                    <p>Info / Detail</p>
                </Button>
            )}
        </>
    );
};

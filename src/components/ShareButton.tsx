// Next.js 15 - src/components/ShareButton.tsx
'use client';
import { useState } from 'react';
import { shareBuild } from '@/utils/shareBuild';
import { Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { TooltipWrapper } from '@/components/TooltipWrapper';

interface ShareButtonProps {
    mode: 'icon' | 'text';
}

export const ShareButton = ({ mode }: ShareButtonProps) => {
    const [isSharing, setIsSharing] = useState(false);

    const handleShare = () => {
        const shareUrl = shareBuild();
        navigator.clipboard.writeText(shareUrl);
        setIsSharing(true);
        toast.success('Link copied to clipboard!');

        // Reset state after 2 seconds
        setTimeout(() => setIsSharing(false), 2000);
    };

    return (
        <>
            {mode === 'icon' ? (
                <TooltipWrapper message='Share'>
                    <Button
                        variant='outline'
                        size='sm'
                        onClick={handleShare}
                        aria-label='Share Button'
                        disabled={isSharing}
                    >
                        <Share2 size={18} />
                    </Button>
                </TooltipWrapper>
            ) : (
                <Button
                    variant='ghost'
                    size='sm'
                    onClick={handleShare}
                    aria-label='Share Button'
                    disabled={isSharing}
                    className='flex justify-start'
                >
                    <Share2 size={18} />
                    <p>Share Build</p>
                </Button>
            )}
        </>
    );
};

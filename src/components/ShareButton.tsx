// Next.js 15 - src/components/ShareButton.tsx
'use client';
import { useState } from 'react';
import { shareBuild } from '@/utils/shareBuild';
import { Share2 } from 'lucide-react';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger
} from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';

const ShareButton = () => {
    const [tooltipVisible, setTooltipVisible] = useState(false);

    const handleShare = () => {
        const shareUrl = shareBuild();
        navigator.clipboard.writeText(shareUrl);
        setTooltipVisible(true);

        // Hide tooltip after 2 seconds
        setTimeout(() => setTooltipVisible(false), 2000);
    };

    return (
        <TooltipProvider>
            <Tooltip open={tooltipVisible}>
                <TooltipTrigger asChild>
                    <Button
                        variant='outline'
                        size='sm'
                        onClick={handleShare}
                        aria-label='Share Button'
                        className='cursor-pointer'
                    >
                        <Share2 size={18} />
                    </Button>
                </TooltipTrigger>
                <TooltipContent className='text-sm bg-gray-800 text-white p-2 rounded'>
                    ✔ Link copied to clipboard!
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
};

export default ShareButton;

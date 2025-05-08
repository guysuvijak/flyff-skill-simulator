'use client';
import React, { useState } from 'react';
import { shareBuild } from '@/utils/shareBuild';
import { motion } from 'framer-motion';
import { Share2 } from 'lucide-react';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger
} from '@/components/ui/tooltip';

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
                    <motion.button
                        onClick={handleShare}
                        className='bg-slate-600 p-3 rounded-md hover:bg-slate-500 flex items-center justify-center'
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        aria-label='share-button'
                    >
                        <Share2 size={18} />
                    </motion.button>
                </TooltipTrigger>
                <TooltipContent className='text-sm bg-gray-800 text-white p-2 rounded'>
                    ✔ Link copied to clipboard!
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
};

export default ShareButton;

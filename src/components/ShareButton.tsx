'use client';
import React, { useState } from 'react';
import { shareBuild } from '@/utils/shareBuild';
import { motion } from 'framer-motion';
import { FiShare2 } from 'react-icons/fi';
import { Tooltip } from 'react-tooltip';

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
        <div className='relative inline-block'>
            <motion.button
                onClick={handleShare}
                className='bg-slate-600 p-3 rounded-md hover:bg-slate-500 flex items-center justify-center'
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                data-tooltip-id='share-tooltip'
                aria-label={'share-button'}
            >
                <FiShare2 size={18} />
            </motion.button>
            <Tooltip
                id='share-tooltip'
                isOpen={tooltipVisible}
                className='text-sm bg-gray-800 text-#ffffff p-2 rounded'
                place='top'
            >
                ✔ Link copied to clipboard!
            </Tooltip>
        </div>
    );
};

export default ShareButton;
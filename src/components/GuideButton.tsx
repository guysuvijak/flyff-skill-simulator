'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { Info } from 'lucide-react';
import { useWebsiteStore } from '@/stores/websiteStore';

const GuideButton = () => {
    const { setGuidePanelVisible } = useWebsiteStore();

    const handleGuideButton = () => {
        setGuidePanelVisible(true);
    };

    return (
        <div className='relative inline-block ml-2'>
            <motion.button
                onClick={handleGuideButton}
                className='bg-slate-600 p-3 rounded-md hover:bg-slate-500 flex items-center justify-center'
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                aria-label={'guide-button'}
            >
                <Info size={18} />
            </motion.button>
        </div>
    );
};

export default GuideButton;

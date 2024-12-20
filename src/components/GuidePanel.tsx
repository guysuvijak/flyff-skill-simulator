import React from 'react';
import { motion } from 'framer-motion';
import { FaTimes, FaStar, FaFacebook, FaGithub } from 'react-icons/fa';
import { useWebsiteStore } from '@/stores/websiteStore';

const GuidePanel = () => {
    const { guidePanelVisible, setGuidePanelVisible } = useWebsiteStore();

    const handleGuideClick = () => {
        setGuidePanelVisible(false);
    };

    const handleInnerClick = (e: React.MouseEvent) => {
        e.stopPropagation();
    };

    return (
        <>
            {guidePanelVisible &&
                <div onClick={handleGuideClick} className='flex w-screen h-screen justify-center items-center absolute z-20 bg-[#00000090]'>
                    <div onClick={handleInnerClick} className='flex flex-col justify-center items-center p-8 bg-[#FFFFFF] rounded-md z-30 shadow-lg'>
                        <div className='flex flex-col items-center pb-5'>
                            <span className='flex items-center justify-center font-bold text-[18px]'>
                                <FaStar size={20} className='text-[#ffda21] mr-1 rotate-180' />
                                Flyff Universe - Skill Simulator
                            </span>
                            <span className='pb-2 text-slate-500'>Powered by Next.js 14 & React Flow</span>
                            <ul className='space-y-1 py-2 border-y-2'>
                                <li>• Plan and visualize skill builds</li>
                                <li>• Calculate optimal skill point distribution</li>
                                <li>• Share builds via unique URLs</li>
                                <li>• Data from the API Flyff Universe</li>
                            </ul>
                            <span className='pt-2'>Created by <span className='font-medium text-orange-700'>MeteorVIIx</span></span>
                            <a href="https://facebook.com/guy.suvijak" target="_blank" rel="noopener noreferrer"  className='flex items-center text-blue-800 hover:text-blue-900 hover:underline transition-colors'>
                                <FaFacebook size={20} className='mr-1 text-blue-600' />
                                Suvijak Nopparatcharoensuk
                            </a>
                            <a href="https://github.com/guysuvijak" target="_blank" rel="noopener noreferrer"  className='flex items-center text-blue-800 hover:text-blue-900 hover:underline transition-colors'>
                                <FaGithub size={20} className='mr-1 text-slate-800' />
                                Suvijak (Guy)
                            </a>
                            <span className='text-slate-600'>(Last Updated: 2024/12/20)</span>
                        </div>
                        <motion.button
                            onClick={handleGuideClick}
                            className='bg-slate-600 p-3 rounded-md hover:bg-slate-700 flex items-center justify-center text-white'
                            whileHover={{ scale: 0.95 }}
                            whileTap={{ scale: 0.90 }}
                            aria-label={'guide-button'}
                        >
                            <FaTimes size={18} />
                            Close
                        </motion.button>
                    </div>
                </div>
            }
        </>
    )
};

export default GuidePanel;
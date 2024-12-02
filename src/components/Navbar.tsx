'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import ClassSelected from '@/components/ClassSelected';
import { useClassStore } from '@/stores/classStore';
import { useCharacterStore } from '@/stores/characterStore';
import { calculateSkillPoints } from '@/utils/calculateSkillPoints';
import { calculateTotalPointsUsed } from '@/utils/calculateSkillPoints';
import ShareButton from '@/components/ShareButton';

const Navbar = () => {
    const router = useRouter();
    const { selectedClass } = useClassStore();
    const { characterLevel, setCharacterLevel, skillPoints, setSkillPoints } = useCharacterStore();

    const handleLevelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let newLevel: string | number = e.target.value;

        if (/^\d+$/.test(newLevel)) {
            newLevel = parseInt(newLevel);
            if (newLevel < 15) newLevel = 15;
            if (newLevel > selectedClass.maxLevel) newLevel = selectedClass.maxLevel;
            setCharacterLevel(Number(newLevel));
            const bonusPoint = calculateSkillPoints(Number(newLevel), selectedClass.id, selectedClass.parent);
            setSkillPoints(bonusPoint - calculateTotalPointsUsed());
        }
    };

    return (
        <nav className="bg-gray-800 text-white py-4 fixed w-full top-0 z-10">
            <div className="container mx-auto flex flex-col sm:flex-row w-full justify-between items-center">
                <button
                    onClick={() => router.push('/')}
                    className="absolute top-4 left-4 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded"
                >
                    Home
                </button>
                <h1 className='flex items-center justify-center'>
                    Level
                    <input
                        type="number"
                        value={characterLevel}
                        onChange={handleLevelChange}
                        min="15"
                        max={selectedClass.maxLevel}
                        className="bg-gray-700 text-white rounded sm:p-2 mx-2 w-12 sm:w-20 text-center"
                    />
                    / {selectedClass.maxLevel}
                </h1>
                <h1 className='flex items-center justify-center'>
                    Skill Points: {skillPoints}
                </h1>
                <div className='flex w-full sm:w-80 px-4'>
                    <ClassSelected />
                    <ShareButton />
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
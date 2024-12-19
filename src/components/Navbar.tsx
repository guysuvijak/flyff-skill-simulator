'use client';
import React from 'react';
import ClassSelected from '@/components/ClassSelected';
import { useClassStore } from '@/stores/classStore';
import { useCharacterStore } from '@/stores/characterStore';
import { calculateSkillPoints } from '@/utils/calculateSkillPoints';
import { calculateTotalPointsUsed } from '@/utils/calculateSkillPoints';
import ShareButton from '@/components/ShareButton';

const Navbar = () => {
    const { selectedClass } = useClassStore();
    const { characterLevel, setCharacterLevel, skillPoints, setSkillPoints } = useCharacterStore();

    const handleLevelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let newLevel: string | number = e.target.value;

        if (/^\d+$/.test(newLevel)) {
            newLevel = parseInt(newLevel);
            setCharacterLevel(Number(newLevel));
            const bonusPoint = calculateSkillPoints(Number(newLevel), selectedClass.id, selectedClass.parent);
            setSkillPoints(bonusPoint - calculateTotalPointsUsed());
        }
    };

    return (
        <nav className="bg-gray-800 text-white py-4 fixed w-full top-0 z-10">
            <div className="container mx-auto flex flex-col sm:flex-row w-full justify-between items-center">
                <button
                    onClick={() => {window.location.href = '/'}}
                    className="top-4 left-4 mr-5 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded"
                >
                    Reset
                </button>
                <div className='flex'>
                    <h1 className='flex items-center justify-center'>
                        Level
                        <input
                            type="number"
                            value={characterLevel}
                            maxLength={4}
                            onChange={handleLevelChange}
                            className="bg-gray-700 text-white rounded sm:p-2 mx-2 w-12 sm:w-20 text-center"
                        />
                        / {selectedClass.maxLevel}
                    </h1>
                    <h1 className='flex ml-5 items-center justify-center'>
                        Skill Points: {skillPoints}
                        <span className='pl-1 text-[#ff3939]'>
                            {characterLevel > selectedClass.maxLevel ? '*Max Level is ' + selectedClass.maxLevel + '*' :
                            characterLevel < 15 ? '*Min Level is 15*' :
                            ''}
                        </span>
                    </h1>
                </div>
                <div className='flex w-full sm:w-80 px-4'>
                    <ClassSelected />
                    <ShareButton />
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
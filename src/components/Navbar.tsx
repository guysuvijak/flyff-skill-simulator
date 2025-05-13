// Next.js 15 - src/components/Navbar.tsx
'use client';
import { useState } from 'react';
import { useClassStore } from '@/stores/classStore';
import { useCharacterStore } from '@/stores/characterStore';
import { calculateSkillPoints } from '@/utils/calculateSkillPoints';
import { calculateTotalPointsUsed } from '@/utils/calculateSkillPoints';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import ClassSelected from '@/components/ClassSelected';
import ShareButton from '@/components/ShareButton';
import GuideButton from '@/components/GuideButton';
import ThemeToggle from './ThemeToggle';
import { RotateCcw } from 'lucide-react';

const Navbar = () => {
    const { selectedClass } = useClassStore();
    const { characterLevel, setCharacterLevel, skillPoints, setSkillPoints } =
        useCharacterStore();
    const [inputValue, setInputValue] = useState(characterLevel.toString());

    const handleLevelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let newLevel: string | number = e.target.value;

        if (newLevel.length > 5) return;

        setInputValue(newLevel);

        if (newLevel === '') {
            setCharacterLevel(1);
            const bonusPoint = calculateSkillPoints(
                1,
                selectedClass.id,
                selectedClass.parent
            );
            setSkillPoints(bonusPoint - calculateTotalPointsUsed());
            return;
        }

        if (/^\d+$/.test(newLevel)) {
            newLevel = parseInt(newLevel);
            setCharacterLevel(Number(newLevel));
            const bonusPoint = calculateSkillPoints(
                Number(newLevel),
                selectedClass.id,
                selectedClass.parent
            );
            setSkillPoints(bonusPoint - calculateTotalPointsUsed());
        }
    };

    return (
        <nav className='bg-background border-b sticky top-0 z-10'>
            <div className='container mx-auto flex flex-col md:flex-row items-center justify-between gap-2 py-4 px-4 sm:px-6'>
                <Button
                    variant='default'
                    onClick={() => (window.location.href = '/')}
                    className='hidden lg:block mb-2 sm:mb-0 mr-2'
                >
                    Reset
                </Button>
                <div className='flex items-center gap-2'>
                    <Button
                        size={'sm'}
                        variant='default'
                        onClick={() => (window.location.href = '/')}
                        className='block lg:hidden'
                    >
                        <RotateCcw />
                    </Button>
                    <div className='flex items-center space-x-2 text-sm sm:text-base'>
                        <span className='text-foreground'>Level</span>
                        <Input
                            id='level-input'
                            type='number'
                            value={inputValue}
                            onChange={handleLevelChange}
                            className='w-14 sm:w-20 h-8 text-center'
                        />
                        <span className='text-foreground'>
                            / {selectedClass.maxLevel}
                        </span>
                    </div>
                    <div className='flex items-center space-x-1 text-sm sm:text-base'>
                        <span className='text-foreground'>SP:</span>
                        <span className='text-foreground'>{skillPoints}</span>
                        <span className='text-red-500'>
                            {characterLevel > selectedClass.maxLevel
                                ? `*Max Lvl.${selectedClass.maxLevel}`
                                : characterLevel < 15
                                  ? `*Min Lvl.15`
                                  : ''}
                        </span>
                    </div>
                </div>
                <div className='flex items-center space-x-2 mt-2 sm:mt-0'>
                    <ClassSelected />
                    <ShareButton />
                    <ThemeToggle />
                    <GuideButton />
                </div>
            </div>
        </nav>
    );
};

export default Navbar;

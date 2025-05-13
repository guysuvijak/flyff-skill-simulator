// Next.js 15 - src/components/Navbar.tsx
'use client';
import { useState } from 'react';
import { useClassStore } from '@/stores/classStore';
import { useCharacterStore } from '@/stores/characterStore';
import { calculateSkillPoints } from '@/utils/calculateSkillPoints';
import { calculateTotalPointsUsed } from '@/utils/calculateSkillPoints';
import { Menu, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { ClassSelected } from '@/components/ClassSelected';
import { ShareButton } from '@/components/ShareButton';
import { GuideButton } from '@/components/GuideButton';
import { ThemeToggle } from '@/components/ThemeToggle';
import { SkillStyleToggle } from '@/components/SkillStyleToggle';

export const Navbar = () => {
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
            <div className='container mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 py-4 px-4'>
                <div className='flex items-center gap-2'>
                    <div className='flex items-center space-x-2 text-sm sm:text-base'>
                        <span className='text-foreground'>Level</span>
                        <Input
                            id='level-input'
                            type='number'
                            value={inputValue}
                            onChange={handleLevelChange}
                            className='w-20 h-8 text-center'
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
                {/* Desktop Menu (md and above) */}
                <div className='flex items-center gap-2'>
                    <Button
                        variant='default'
                        size={'sm'}
                        aria-label='Reset Button'
                        onClick={() => (window.location.href = '/')}
                    >
                        <RotateCcw size={18} />
                    </Button>
                    <ClassSelected />
                    <div className='hidden lg:flex gap-1'>
                        <ShareButton mode='icon' />
                        <SkillStyleToggle mode='icon' />
                        <ThemeToggle mode='icon' />
                        <GuideButton mode='icon' />
                    </div>
                    {/* Mobile Dropdown Menu (below md) */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild className='lg:hidden'>
                            <Button variant='outline' size='sm'>
                                <Menu size={18} />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                            align='end'
                            className='flex flex-col space-y-1'
                        >
                            <DropdownMenuItem asChild>
                                <ShareButton mode='text' />
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <SkillStyleToggle mode='text' />
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <ThemeToggle mode='text' />
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <GuideButton mode='text' />
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </nav>
    );
};

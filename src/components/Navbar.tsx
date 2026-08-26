// Next.js 15 - src/components/Navbar.tsx
'use client';
import { useState, useEffect, useRef, ChangeEvent } from 'react';
import { useClassStore } from '@/stores/classStore';
import { useCharacterStore } from '@/stores/characterStore';
import { calculateSkillPoints } from '@/utils/calculateSkillPoints';
import { calculateTotalPointsUsed } from '@/utils/calculateSkillPoints';
import { Input } from '@/components/ui/input';
import { ClassSelected } from '@/components/ClassSelected';
import { NavbarMenu } from '@/components/NavbarMenu';
import { TooltipWrapper } from '@/components/TooltipWrapper';
import { useTranslation } from '@/hooks/useTranslation';
import { cn } from '@/lib/utils';

const MIN_CHARACTER_LEVEL = 15;

const useCountAnimation = (value: number, duration = 450) => {
    const [display, setDisplay] = useState(value);
    const fromRef = useRef(value);
    const displayRef = useRef(value);
    const isFirstRender = useRef(true);

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            fromRef.current = value;
            displayRef.current = value;
            setDisplay(value);
            return;
        }

        const from = displayRef.current;
        const to = value;
        if (from === to) {
            fromRef.current = to;
            return;
        }

        const start = performance.now();
        let frame = 0;

        const tick = (now: number) => {
            const progress = Math.min(1, (now - start) / duration);
            const eased = 1 - Math.pow(1 - progress, 3);
            const next = Math.round(from + (to - from) * eased);
            displayRef.current = next;
            setDisplay(next);

            if (progress < 1) {
                frame = requestAnimationFrame(tick);
            } else {
                fromRef.current = to;
            }
        };

        frame = requestAnimationFrame(tick);
        return () => {
            cancelAnimationFrame(frame);
            fromRef.current = displayRef.current;
        };
    }, [value, duration]);

    return display;
};

export const Navbar = () => {
    const { t } = useTranslation();
    const { selectedClass } = useClassStore();
    const { characterLevel, setCharacterLevel, skillPoints, setSkillPoints } =
        useCharacterStore();
    const [inputValue, setInputValue] = useState(characterLevel.toString());
    const animatedSkillPoints = useCountAnimation(skillPoints);

    // Sync inputValue with characterLevel when it changes (e.g., from URL loading)
    useEffect(() => {
        setInputValue(characterLevel.toString());
    }, [characterLevel]);

    const isLevelOverMax = characterLevel > selectedClass.maxLevel;
    const isLevelUnderMin = characterLevel < MIN_CHARACTER_LEVEL;
    const isLevelInvalid = isLevelOverMax || isLevelUnderMin;

    const handleLevelChange = (e: ChangeEvent<HTMLInputElement>) => {
        const raw = e.target.value.replace(/\D/g, '');

        if (raw.length > 4) return;

        setInputValue(raw);

        if (raw === '') {
            setCharacterLevel(1);
            const bonusPoint = calculateSkillPoints(
                1,
                selectedClass.id,
                selectedClass.parent
            );
            setSkillPoints(bonusPoint - calculateTotalPointsUsed());
            return;
        }

        const newLevel = parseInt(raw, 10);
        setCharacterLevel(newLevel);
        const bonusPoint = calculateSkillPoints(
            newLevel,
            selectedClass.id,
            selectedClass.parent
        );
        setSkillPoints(bonusPoint - calculateTotalPointsUsed());
    };

    return (
        <nav className='bg-background border-b sticky top-0 z-10'>
            <div className='container mx-auto flex flex-row items-center justify-between gap-2 py-4 px-4'>
                <div className='flex min-w-0 items-center gap-2'>
                    <div className='relative flex items-center gap-2 text-sm sm:text-base'>
                        <label
                            htmlFor='level-input'
                            className='shrink-0 text-foreground'
                        >
                            <span className='sm:hidden'>LV</span>
                            <span className='hidden sm:inline'>
                                {t('navbar.level')}
                            </span>
                        </label>
                        <div className='relative'>
                            <div
                                className={cn(
                                    'flex h-8 items-center overflow-hidden rounded-md border bg-transparent shadow-sm focus-within:ring-1',
                                    isLevelInvalid
                                        ? 'border-destructive focus-within:ring-destructive'
                                        : 'border-input focus-within:ring-ring'
                                )}
                            >
                                <Input
                                    id='level-input'
                                    type='text'
                                    inputMode='numeric'
                                    pattern='[0-9]*'
                                    maxLength={4}
                                    value={inputValue}
                                    onChange={handleLevelChange}
                                    onKeyDown={(e) => {
                                        if (
                                            e.key === '-' ||
                                            e.key === '+' ||
                                            e.key === 'e' ||
                                            e.key === 'E' ||
                                            e.key === '.'
                                        ) {
                                            e.preventDefault();
                                        }
                                    }}
                                    className={cn(
                                        'h-full w-12 border-0 bg-transparent px-1 text-center shadow-none focus-visible:ring-0',
                                        isLevelInvalid && 'text-destructive'
                                    )}
                                />
                                <span
                                    className={cn(
                                        'shrink-0 border-l px-1.5 tabular-nums',
                                        isLevelInvalid
                                            ? 'border-destructive text-destructive'
                                            : 'border-input text-muted-foreground'
                                    )}
                                >
                                    {selectedClass.maxLevel}
                                </span>
                            </div>
                            {(isLevelUnderMin || isLevelOverMax) && (
                                <div
                                    role='status'
                                    className='absolute left-0 top-[calc(100%+6px)] z-20 whitespace-nowrap rounded-md border border-destructive/30 bg-background px-2 py-1 text-xs text-destructive shadow-md'
                                >
                                    {isLevelUnderMin
                                        ? t('navbar.min-level', {
                                              level: MIN_CHARACTER_LEVEL
                                          })
                                        : t('navbar.max-level', {
                                              level: selectedClass.maxLevel
                                          })}
                                    <span
                                        aria-hidden
                                        className='absolute -top-1 left-3 h-2 w-2 rotate-45 border-l border-t border-destructive/30 bg-background'
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                    <div className='flex items-center gap-2 text-sm sm:text-base'>
                        <TooltipWrapper
                            message={t('navbar.skill-points')}
                            position='bottom'
                        >
                            <div className='flex h-8 cursor-help items-center overflow-hidden rounded-md border border-input bg-transparent shadow-sm'>
                                <span className='shrink-0 px-2 text-foreground'>
                                    SP
                                </span>
                                <span className='flex h-full min-w-10 items-center justify-center border-l border-input px-2 tabular-nums text-foreground'>
                                    {animatedSkillPoints}
                                </span>
                            </div>
                        </TooltipWrapper>
                    </div>
                </div>
                {/* Right Menu */}
                <div className='flex shrink-0 items-center gap-2'>
                    <ClassSelected />
                    <NavbarMenu />
                </div>
            </div>
        </nav>
    );
};

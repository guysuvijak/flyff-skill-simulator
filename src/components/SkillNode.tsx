// Next.js 15 - src/components/SkillNode.tsx
'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Handle, Position } from '@xyflow/react';
import { motion } from 'framer-motion';
import { useSkillStore } from '@/stores/skillStore';
import { useClassStore } from '@/stores/classStore';
import { useCharacterStore } from '@/stores/characterStore';
import {
    TooltipProvider,
    Tooltip,
    TooltipTrigger,
    TooltipContent
} from '@/components/ui/tooltip';
import {
    Clock,
    ClockArrowUp,
    Expand,
    Loader,
    MousePointerClick,
    XCircle,
    ChevronsUp,
    ChevronsDown,
    Minus,
    Plus
} from 'lucide-react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

interface SkillSourceProps {
    class: number;
    name: string;
    parent: number;
    skills: number[];
}

interface SkillScaling {
    parameter?: string;
    stat?: string;
    scale?: number;
    pvp?: boolean;
    pve?: boolean;
}
interface SkillLevel {
    consumedMP?: number;
    consumedFP?: number;
    cooldown?: number;
    duration?: number;
    minAttack?: number;
    maxAttack?: number;
    casting?: number;
    scalingParameters?: SkillScaling[];
}

interface SkillRequirement {
    skill: number;
    level: number;
}

interface SkillData {
    id: number;
    class: number;
    level: number;
    skillPoints: number;
    description: {
        en: string;
        [key: string]: string;
    };
    requirements: SkillRequirement[];
    levels: SkillLevel[];
}

interface SkillNodeProps {
    data: {
        skillData: SkillData;
        label: string;
        image: string;
    };
}

export const SkillNode = ({ data }: SkillNodeProps) => {
    const { skillLevels, updateSkillLevel } = useSkillStore();
    const { selectedClass } = useClassStore();
    const { characterLevel, skillPoints, setSkillPoints } = useCharacterStore();
    const [skillSource, setSkillSource] = useState<SkillSourceProps[] | null>(
        null
    );
    const currentLevel = skillLevels[data.skillData.id]?.level || 0;

    const additionalTargetTop = [7266, 8356, 5041, 7429].includes(
        data.skillData.id
    );
    const additionalTargetBottom = [8348, 5559].includes(data.skillData.id);
    const additionalSourceTop = [51, 7429].includes(data.skillData.id);
    const additionalSourceBottom = [4729, 8140, 3840, 5559].includes(
        data.skillData.id
    );
    const [isHovered, setIsHovered] = useState(false);
    const [isClicked, setIsClicked] = useState(false);

    const handleMouseEnter = () => setIsHovered(true);
    const handleMouseLeave = () => setIsHovered(false);
    const handleClick = () => setIsClicked((prev) => !prev);

    useEffect(() => {
        const fetchSkillSource = async () => {
            try {
                const response = await axios.get('/data/skillsource.json');
                setSkillSource(response.data);
            } catch (error) {
                console.error('Error fetching skillsource:', error);
            }
        };
        fetchSkillSource();
    }, []);

    const isSourceSkill = (): boolean => {
        if (skillSource) {
            const classIndex = skillSource.findIndex(
                (cls) =>
                    cls.class === data.skillData.class ||
                    (selectedClass.id === cls.class &&
                        cls.parent === data.skillData.class)
            );
            if (
                classIndex !== -1 &&
                skillSource[classIndex].class === selectedClass.id
            ) {
                return skillSource[classIndex].skills.includes(
                    data.skillData.id
                );
            }
        }
        return false;
    };

    const canUpgrade = () => {
        return data.skillData.requirements.every((req) => {
            const currentReqLevel = skillLevels[req.skill]?.level || 0;
            return currentReqLevel >= req.level;
        });
    };

    const increaseLevel = () => {
        if (currentLevel < data.skillData.levels.length && canUpgrade()) {
            updateSkillLevel(
                data.skillData.id,
                currentLevel + 1,
                data.skillData.skillPoints
            );
            setSkillPoints(skillPoints - data.skillData.skillPoints);
        }
    };

    const decreaseLevel = () => {
        if (currentLevel > 0) {
            updateSkillLevel(
                data.skillData.id,
                currentLevel - 1,
                data.skillData.skillPoints
            );
            setSkillPoints(skillPoints + data.skillData.skillPoints);
        }
    };

    const setToMaxLevel = () => {
        if (canUpgrade() && currentLevel < data.skillData.levels.length) {
            const levelsToAdd = data.skillData.levels.length - currentLevel;
            const totalSkillPointsNeeded = levelsToAdd * data.skillData.skillPoints;
            
            if (skillPoints >= totalSkillPointsNeeded) {
                updateSkillLevel(
                    data.skillData.id,
                    data.skillData.levels.length,
                    data.skillData.skillPoints
                );
                setSkillPoints(skillPoints - totalSkillPointsNeeded);
            }
        }
    };

    const setToLevelZero = () => {
        if (currentLevel > 0) {
            updateSkillLevel(
                data.skillData.id,
                0,
                data.skillData.skillPoints
            );
            setSkillPoints(skillPoints + (currentLevel * data.skillData.skillPoints));
        }
    };

    const shimmer = (w: number, h: number) => `
    <svg width='${w}' height='${h}' xmlns='http://www.w3.org/2000/svg'>
        <defs>
            <linearGradient id='g'>
            <stop stop-color='#c7c7c7' offset='20%' />
            <stop stop-color='#9c9c9c' offset='50%' />
            <stop stop-color='#c7c7c7' offset='70%' />
            </linearGradient>
        </defs>
        <rect width='${w}' height='${h}' fill='#c7c7c7' />
        <rect id='r' width='${w}' height='${h}' fill='url(#g)' />
        <animate xlink:href='#r' attributeName='x' from='-${w}' to='${w}' dur='1s' repeatCount='indefinite' />
    </svg>`;

    const toBase64 = (str: string) =>
        typeof window === 'undefined'
            ? Buffer.from(str).toString('base64')
            : window.btoa(str);

    const levelData = data.skillData.levels[Math.max(currentLevel - 1, 0)];

    return (
        <div className='flex flex-col w-[72px] h-[78px] bg-background text-foreground border-2 border-border rounded shadow relative justify-center items-center'>
            {data.skillData.requirements.length !== 0 &&
                ![8348, 5559, 7266, 5041].includes(
                    data.skillData.id
                ) && (
                    <Handle
                        id='target-left'
                        type='target'
                        position={Position.Left}
                        className='w-3 h-3 rounded-full'
                    />
                )}
            {additionalTargetBottom && (
                <Handle
                    id='target-bottom'
                    type='target'
                    position={Position.Bottom}
                    className='w-3 h-3 rounded-full'
                />
            )}
            {additionalTargetTop && (
                <Handle
                    id='target-top'
                    type='target'
                    position={Position.Top}
                    className='w-3 h-3 rounded-full'
                />
            )}
            
            <TooltipProvider delayDuration={100}>
                <Tooltip open={isHovered || isClicked}>
                    <TooltipTrigger asChild>
                        <div 
                            className='flex relative cursor-pointer'
                            onPointerEnter={handleMouseEnter}
                            onPointerLeave={handleMouseLeave}
                            onClick={handleClick}
                        >
                            <Image
                                src={data.image}
                                alt={data.label || String(data.skillData.id)}
                                width={48}
                                height={48}
                                loading='lazy'
                                placeholder={`data:image/svg+xml;base64,${toBase64(shimmer(48, 48))}`}
                                className={`${(characterLevel < data.skillData.level || !canUpgrade()) ? 'grayscale' : 'hover:scale-110 transition-all duration-300'}`}
                            />
                            {currentLevel !== 0 && (
                                <p
                                    className={`absolute bottom-0 right-0 pr-1 font-bold text-white stroke-text-red ${currentLevel === data.skillData.levels.length ? 'text-[12px]' : ' text-[16px]'}`}
                                >
                                    {currentLevel ===
                                    data.skillData.levels.length
                                        ? 'MAX'
                                        : currentLevel}
                                </p>
                            )}
                        </div>
                    </TooltipTrigger>
                    <TooltipContent className='max-w-xs text-sm text-foreground bg-background border border-border shadow-md relative'>
                        <Button
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsClicked(false);
                            }}
                            variant={'ghost'}
                            className='absolute top-0 right-0'
                            aria-label='Close tooltip'
                        >
                            <XCircle size={20} className='text-destructive' />
                        </Button>
                        <div className='text-md sm:text-lg md:text-xl text-primary font-bold pr-6'>
                            {data.label}
                            <span className='text-muted-foreground ml-1'>
                                Lv.{currentLevel}/{data.skillData.levels.length}
                            </span>
                        </div>
                        {levelData?.consumedMP !== undefined && (
                            <span className='text-sm sm:text-md md:text-lg'>MP: {levelData.consumedMP}</span>
                        )}
                        {levelData?.consumedFP !== undefined && (
                            <span className='text-sm sm:text-md md:text-lg'>FP: {levelData.consumedFP}</span>
                        )}
                        <div
                            className={`text-sm sm:text-md md:text-lg
                                ${characterLevel < data.skillData.level
                                    ? 'text-destructive'
                                    : 'text-muted-foreground'}
                            `}
                        >
                            Character Level: {data.skillData.level}
                        </div>
                        {levelData?.minAttack !== undefined && (
                            <div className='text-sm sm:text-md md:text-lg'>
                                <span className='mx-1.5 text-muted-foreground'>
                                    -
                                </span>{' '}
                                Base Damage: {levelData.minAttack}{' '}
                                {levelData?.maxAttack !== undefined &&
                                    `~ ${levelData.maxAttack}`}
                            </div>
                        )}
                        {levelData?.duration !== undefined && (
                            <div className='text-sm sm:text-md md:text-lg'>
                                <span className='mx-1.5 text-muted-foreground'>
                                    -
                                </span>{' '}
                                Base Time: {levelData.duration}
                            </div>
                        )}
                        <Separator className='my-1' />
                        {levelData?.scalingParameters !== undefined && (
                            <>
                                {levelData?.scalingParameters[0]?.parameter ===
                                    'attack' && (
                                    <div className='flex items-center text-sm sm:text-md md:text-lg'>
                                        <Expand
                                            size={16}
                                            className='text-muted-foreground mr-1'
                                        />
                                        Attack Scaling:{' '}
                                        {levelData.scalingParameters[0].stat?.toUpperCase()}{' '}
                                        x{' '}
                                        {levelData.scalingParameters[0].scale?.toFixed(
                                            2
                                        )}
                                    </div>
                                )}
                                {levelData?.scalingParameters[0]?.parameter ===
                                    'duration' && (
                                    <div className='flex items-center text-sm sm:text-md md:text-lg'>
                                        <ClockArrowUp
                                            size={16}
                                            className='text-muted-foreground mr-1'
                                        />
                                        Time Scaling:{' '}
                                        {levelData.scalingParameters[0].stat?.toUpperCase()}{' '}
                                        x{' '}
                                        {levelData.scalingParameters[0].scale?.toFixed(
                                            2
                                        )}
                                    </div>
                                )}
                                {levelData?.scalingParameters[1]?.parameter ===
                                    'duration' && (
                                    <div className='flex items-center'>
                                        <ClockArrowUp
                                            size={16}
                                            className='text-muted-foreground mr-1'
                                        />
                                        Time Scaling:{' '}
                                        {levelData.scalingParameters[1].stat?.toUpperCase()}{' '}
                                        x{' '}
                                        {levelData.scalingParameters[1].scale?.toFixed(
                                            2
                                        )}
                                    </div>
                                )}
                            </>
                        )}
                        {levelData?.casting !== undefined && (
                            <div className='flex items-center text-sm sm:text-md md:text-lg'>
                                <Loader
                                    size={16}
                                    className='text-muted-foreground mr-1'
                                />{' '}
                                Casting Time: {levelData.casting.toFixed(2)}
                            </div>
                        )}
                        {levelData?.cooldown !== undefined && (
                            <div className='flex items-center text-sm sm:text-md md:text-lg'>
                                <Clock
                                    size={16}
                                    className='text-muted-foreground mr-1'
                                />{' '}
                                Cooldown: {levelData.cooldown.toFixed(2)}
                            </div>
                        )}
                        <div className='text-muted-foreground mt-1'>
                            {data.skillData.description.en}
                        </div>
                        <Separator className='my-2' />
                        <span className='flex text-muted-foreground'>
                            <MousePointerClick size={16} className='mx-1' /> Click
                            to hold/close the window.
                        </span>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>

            <div className='flex'>
                <motion.button
                    onClick={(e) => {
                        e.stopPropagation();
                        setToMaxLevel();
                    }}
                    onMouseEnter={(e) => e.stopPropagation()}
                    onMouseLeave={(e) => e.stopPropagation()}
                    whileTap={{
                        scale: currentLevel === data.skillData.levels.length ? 1 : 0.8
                    }}
                    aria-label={`Set skill to max level for ${data.label}`}
                    disabled={
                        skillPoints < (data.skillData.levels.length - currentLevel) * data.skillData.skillPoints ||
                        characterLevel < data.skillData.level ||
                        currentLevel === data.skillData.levels.length ||
                        !canUpgrade()
                    }
                    className='flex items-center justify-center'
                >
                    <ChevronsUp
                        size={16}
                        className={`${
                            skillPoints < (data.skillData.levels.length - currentLevel) * data.skillData.skillPoints ||
                            characterLevel < data.skillData.level ||
                            currentLevel === data.skillData.levels.length ||
                            !canUpgrade()
                                ? 'text-muted cursor-not-allowed'
                                : 'text-primary hover:text-primary/80 transition-all'
                        }`}
                    />
                </motion.button>
                <div className='flex items-center rounded-sm'>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            increaseLevel();
                        }}
                        onMouseEnter={(e) => e.stopPropagation()}
                        onMouseLeave={(e) => e.stopPropagation()}
                        aria-label={`Increase skill level for ${data.label}`}
                        disabled={
                            skillPoints < data.skillData.skillPoints ||
                            characterLevel < data.skillData.level ||
                            currentLevel ===
                                data.skillData.levels.length ||
                            !canUpgrade()
                        }
                        className={`rounded-tl-[3px] rounded-bl-[3px] bg-primary text-primary-foreground ${
                            skillPoints <
                                data.skillData.skillPoints ||
                            characterLevel < data.skillData.level ||
                            currentLevel ===
                                data.skillData.levels.length ||
                            !canUpgrade()
                                ? 'opacity-20 cursor-not-allowed'
                                : 'hover:bg-primary/80 hover:text-primary-foreground/80 group'
                        }`}
                    >
                        <Plus size={18} className='group-hover:scale-90 transition-all' />
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            decreaseLevel();
                        }}
                        onMouseEnter={(e) => e.stopPropagation()}
                        onMouseLeave={(e) => e.stopPropagation()}
                        aria-label={`Decrease skill level for ${data.label}`}
                        disabled={currentLevel === 0}
                        className={`rounded-tr-[3px] rounded-br-[3px] bg-destructive text-destructive-foreground ${currentLevel === 0
                            ? 'opacity-20 cursor-not-allowed'
                            : 'hover:bg-destructive/80 hover:text-destructive-foreground/80 group'
                        }`}
                    >
                        <Minus size={18} className='group-hover:scale-90 transition-all' />
                    </button>
                </div>
                <motion.button
                    onClick={(e) => {
                        e.stopPropagation();
                        setToLevelZero();
                    }}
                    onMouseEnter={(e) => e.stopPropagation()}
                    onMouseLeave={(e) => e.stopPropagation()}
                    whileTap={{
                        scale: currentLevel === 0 ? 1 : 0.8
                    }}
                    aria-label={`Reset skill to level 0 for ${data.label}`}
                    disabled={currentLevel === 0}
                    className='flex items-center justify-center'
                >
                    <ChevronsDown
                        size={16}
                        className={`${
                            currentLevel === 0
                                ? 'text-muted cursor-not-allowed'
                                : 'text-destructive hover:text-destructive/80 transition-all'
                        }`}
                    />
                </motion.button>
            </div>
            {!isSourceSkill() && data.skillData.id !== 3840 && (
                <Handle
                    id='source-right'
                    type='source'
                    position={Position.Right}
                    className='w-3 h-3 rounded-full'
                />
            )}
            {additionalSourceTop && (
                <Handle
                    id='source-top'
                    type='source'
                    position={Position.Top}
                    className='w-3 h-3 rounded-full'
                />
            )}
            {additionalSourceBottom && (
                <Handle
                    id='source-bottom'
                    type='source'
                    position={Position.Bottom}
                    className='w-3 h-3 rounded-full'
                />
            )}
        </div>
    );
};

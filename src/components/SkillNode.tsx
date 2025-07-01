// Next.js 15 - src/components/SkillNode.tsx
'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Handle, Position } from '@xyflow/react';
import { FaPlusSquare, FaMinusSquare } from 'react-icons/fa';
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
    MousePointerClick
} from 'lucide-react';
import axios from 'axios';

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
        <TooltipProvider delayDuration={100}>
            <Tooltip open={isHovered || isClicked}>
                <TooltipTrigger asChild>
                    <div
                        onPointerEnter={handleMouseEnter}
                        onPointerLeave={handleMouseLeave}
                        onClick={handleClick}
                        className='flex flex-col w-[50px] h-[70px] bg-background text-foreground border-2 border-border rounded shadow relative justify-center items-center'
                    >
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
                        <div className='flex relative cursor-pointer'>
                            <Image
                                src={data.image}
                                alt={data.label || String(data.skillData.id)}
                                width={40}
                                height={40}
                                loading='lazy'
                                placeholder={`data:image/svg+xml;base64,${toBase64(shimmer(40, 40))}`}
                                className={`${(characterLevel < data.skillData.level || !canUpgrade()) && 'grayscale'}`}
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
                        <div className='flex'>
                            <motion.button
                                onClick={increaseLevel}
                                whileTap={{
                                    scale: currentLevel === 0 ? 1 : 0.8
                                }}
                                aria-label={`Increase skill level for ${data.label}`}
                                disabled={
                                    skillPoints < data.skillData.skillPoints ||
                                    characterLevel < data.skillData.level ||
                                    currentLevel ===
                                        data.skillData.levels.length ||
                                    !canUpgrade()
                                }
                            >
                                <FaPlusSquare
                                    size={22}
                                    className={`${
                                        skillPoints <
                                            data.skillData.skillPoints ||
                                        characterLevel < data.skillData.level ||
                                        currentLevel ===
                                            data.skillData.levels.length ||
                                        !canUpgrade()
                                            ? 'text-muted cursor-not-allowed'
                                            : 'text-primary hover:text-primary/80'
                                    }`}
                                />
                            </motion.button>
                            <motion.button
                                onClick={decreaseLevel}
                                whileTap={{
                                    scale: currentLevel === 0 ? 1 : 0.8
                                }}
                                aria-label={`Decrease skill level for ${data.label}`}
                                disabled={currentLevel === 0}
                            >
                                <FaMinusSquare
                                    size={22}
                                    className={`${currentLevel === 0 ? 'text-muted cursor-not-allowed' : 'text-destructive hover:text-destructive/80'}`}
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
                </TooltipTrigger>
                <TooltipContent className='max-w-xs text-sm text-foreground bg-background border border-border shadow-md'>
                    <div className='text-primary font-bold'>
                        {data.label}
                        <span className='text-muted-foreground pl-1'>
                            Lv.{currentLevel}/{data.skillData.levels.length}
                        </span>
                    </div>
                    {levelData?.consumedMP !== undefined && (
                        <span>MP: {levelData.consumedMP}</span>
                    )}
                    {levelData?.consumedFP !== undefined && (
                        <span>FP: {levelData.consumedFP}</span>
                    )}
                    <div
                        className={
                            characterLevel < data.skillData.level
                                ? 'text-destructive'
                                : 'text-muted-foreground'
                        }
                    >
                        Character Level: {data.skillData.level}
                    </div>
                    {levelData?.minAttack !== undefined && (
                        <div>
                            <span className='mx-1.5 text-muted-foreground'>
                                -
                            </span>{' '}
                            Base Damage: {levelData.minAttack}{' '}
                            {levelData?.maxAttack !== undefined &&
                                `~ ${levelData.maxAttack}`}
                        </div>
                    )}
                    {levelData?.duration !== undefined && (
                        <div>
                            <span className='mx-1.5 text-muted-foreground'>
                                -
                            </span>{' '}
                            Base Time: {levelData.duration}
                        </div>
                    )}
                    <div className='w-full h-[1px] my-1 bg-muted/30' />
                    {levelData?.scalingParameters !== undefined && (
                        <>
                            {levelData?.scalingParameters[0]?.parameter ===
                                'attack' && (
                                <div className='flex items-center'>
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
                                <div className='flex items-center'>
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
                        <div className='flex items-center'>
                            <Loader
                                size={16}
                                className='text-muted-foreground mr-1'
                            />{' '}
                            Casting Time: {levelData.casting.toFixed(2)}
                        </div>
                    )}
                    {levelData?.cooldown !== undefined && (
                        <div className='flex items-center'>
                            <Clock
                                size={16}
                                className='text-muted-foreground mr-1'
                            />{' '}
                            Cooldown: {levelData.cooldown.toFixed(2)}
                        </div>
                    )}
                    <div className='text-muted-foreground'>
                        {data.skillData.description.en}
                    </div>
                    <div className='w-full h-[1px] my-1 bg-muted/30' />
                    <span className='flex text-muted-foreground'>
                        <MousePointerClick size={16} className='mx-1' /> Click
                        to hold/close the window.
                    </span>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
};

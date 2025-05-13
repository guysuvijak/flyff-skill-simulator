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
import axios from 'axios';
import {
    TooltipProvider,
    Tooltip,
    TooltipTrigger,
    TooltipContent
} from '@/components/ui/tooltip';

interface SkillSourceProps {
    class: number;
    name: string;
    parent: number;
    skills: number[];
}

interface SkillLevel {
    consumedMP?: number;
    consumedFP?: number;
    description?: string;
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

const SkillNode = ({ data }: SkillNodeProps) => {
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
            <Tooltip>
                <TooltipTrigger asChild>
                    <div className='flex flex-col w-[50px] h-[70px] bg-background text-foreground border-2 border-border rounded shadow relative justify-center items-center'>
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
                        <div className='flex relative'>
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
                                            ? 'text-muted'
                                            : 'text-green-500 hover:text-green-600'
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
                                    className={`${currentLevel === 0 ? 'text-muted' : 'text-red-500 hover:text-red-600'}`}
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
                <TooltipContent side='right' className='max-w-xs text-sm'>
                    <div className='text-green-500 font-bold'>
                        {data.label}
                        <span className='text-foreground pl-1'>
                            Lv.{currentLevel}/{data.skillData.levels.length}
                        </span>
                    </div>
                    {levelData?.consumedMP !== undefined && (
                        <div>MP: {levelData.consumedMP}</div>
                    )}
                    {levelData?.consumedFP !== undefined && (
                        <div>FP: {levelData.consumedFP}</div>
                    )}
                    <div
                        className={
                            characterLevel < data.skillData.level
                                ? 'text-red-500'
                                : 'text-secondary'
                        }
                    >
                        Character Level: {data.skillData.level}
                    </div>
                    <div className='text-gray-400'>
                        {data.skillData.description.en}
                    </div>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
};

export default SkillNode;

'use client'
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Handle, Position } from '@xyflow/react';
import { Tooltip } from 'react-tooltip';
import { FaPlusSquare, FaMinusSquare } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useSkillStore } from '@/stores/skillStore';
import { useClassStore } from '@/stores/classStore';
import { useCharacterStore } from '@/stores/characterStore';
import axios from 'axios';

interface SkillSourceProps {
    class: number;
    name: string;
    parent: number;
    skills: number[];
};

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
    const [ skillSource, setSkillSource ] = useState<SkillSourceProps[] | null>(null);
    const currentLevel = skillLevels[data.skillData.id]?.level || 0;
    const additionalTargetTop = data.skillData.id === 7266 || data.skillData.id === 8356 || data.skillData.id === 5041 || data.skillData.id === 7429;
    const additionalTargetBottom = data.skillData.id === 8348 || data.skillData.id === 5559;
    const additionalSourceTop = data.skillData.id === 51 || data.skillData.id === 7429;
    const additionalSourceBottom = data.skillData.id === 4729 || data.skillData.id === 8140 || data.skillData.id === 3840 || data.skillData.id === 5559;
    
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
            const classIndex = skillSource.findIndex((cls) => cls.class === data.skillData.class || (selectedClass.id === cls.class && cls.parent === data.skillData.class));
            if (classIndex !== -1 && skillSource[classIndex].class === selectedClass.id) {
                const isSkillInClassSkills = skillSource[classIndex].skills.includes(data.skillData.id);
                return isSkillInClassSkills;
            }
        }
        return false;
    };

    const canUpgrade = () => {
        return data.skillData.requirements.every((req) => {
            const requiredLevel = req.level;
            const currentReqLevel = skillLevels[req.skill]?.level || 0;
            return currentReqLevel >= requiredLevel;
        });
    };

    const increaseLevel = () => {
        if (currentLevel < data.skillData.levels.length && canUpgrade()) {
            updateSkillLevel(data.skillData.id, Number(currentLevel) + 1, data.skillData.skillPoints);
            setSkillPoints(skillPoints - data.skillData.skillPoints);
        }
    };

    const decreaseLevel = () => {
        if (currentLevel > 0) {
            updateSkillLevel(data.skillData.id, Number(currentLevel) - 1, data.skillData.skillPoints);
            setSkillPoints(skillPoints + data.skillData.skillPoints);
        }
    };

    const shimmer = (w: number, h: number) => `
        <svg width='${w}' height='${h}' version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'>
        <defs>
            <linearGradient id='g'>
            <stop stop-color='#c7c7c7' offset='20%' />
            <stop stop-color='#9c9c9c' offset='50%' />
            <stop stop-color='#c7c7c7' offset='70%' />
            </linearGradient>
        </defs>
        <rect width='${w}' height='${h}' fill='#c7c7c7' />
        <rect id='r' width='${w}' height='${h}' fill='url(#g)' />
        <animate xlink:href='#r' attributeName='x' from='-${w}' to='${w}' dur='1s' repeatCount='indefinite'  />
        </svg>`;

    const toBase64 = (str: string) => typeof window === 'undefined' ? Buffer.from(str).toString('base64') : window.btoa(str);

    return (
        <>
            <div
                className='flex flex-col w-[50px] h-[70px] bg-white text-white border-2 border-slate-400 rounded shadow relative justify-center items-center'
                data-tooltip-id={`node-tooltip-${data.skillData.id}`}
                data-tooltip-html={`
                    <strong style='color: #2db568;'>${data.label} <span style='padding-left: 5px; color: #ffffff;'>Lv.${currentLevel}/${data.skillData.levels.length}</span></strong><br />
                    ${data.skillData.levels[currentLevel === 0 ? currentLevel : currentLevel - 1]?.consumedMP !== undefined ? `MP: ${data.skillData.levels[currentLevel === 0 ? currentLevel : currentLevel - 1].consumedMP}<br />` : ''}
                    ${data.skillData.levels[currentLevel === 0 ? currentLevel : currentLevel - 1]?.consumedFP !== undefined ? `FP: ${data.skillData.levels[currentLevel === 0 ? currentLevel : currentLevel - 1].consumedFP}<br />` : ''}
                    <span style='color: ${characterLevel < data.skillData.level ? '#ff0000' : '#ffffff'};'>Character Level: ${data.skillData.level}</span><br />
                    <span style='color: #c5c5c5;'>${data.skillData.description.en}</span>
                `}
            >
                {(data.skillData.requirements.length !== 0 && data.skillData.id !== 8348 && data.skillData.id !== 5559 && data.skillData.id !== 7266 && data.skillData.id !== 5041) &&
                    <Handle
                        id='target-left'
                        type='target'
                        position={Position.Left}
                        className='w-3 h-3 rounded-full'
                    />
                }
                {additionalTargetBottom &&
                    <Handle
                        id='target-bottom'
                        type='target'
                        position={Position.Bottom}
                        className='w-3 h-3 rounded-full'
                    />
                }
                {additionalTargetTop &&
                    <Handle
                        id='target-top'
                        type='target'
                        position={Position.Top}
                        className='w-3 h-3 rounded-full'
                    />
                }
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
                    {currentLevel != 0 &&
                        <p className={`absolute bottom-0 right-0 pr-1 font-bold stroke-text-red ${currentLevel === data.skillData.levels.length ? 'text-[12px]' : ' text-[16px]'}`}>
                            {currentLevel === data.skillData.levels.length ? 'MAX' : currentLevel}
                        </p>
                    }
                </div>
                <div className='flex'>
                    <motion.button onClick={increaseLevel} whileTap={{ scale: currentLevel === 0 ? 1 : 0.8 }} aria-label={`Increase skill level for ${data.label}`} disabled={skillPoints < data.skillData.skillPoints || characterLevel < data.skillData.level || currentLevel === data.skillData.levels.length || !canUpgrade()}>
                        <FaPlusSquare
                            size={22}
                            className={`${skillPoints < data.skillData.skillPoints || characterLevel < data.skillData.level || currentLevel === data.skillData.levels.length || !canUpgrade() ? 'text-gray-400' : 'text-green-500 hover:text-green-600'}`}
                        />
                    </motion.button>
                    <motion.button onClick={decreaseLevel} whileTap={{ scale: currentLevel === 0 ? 1 : 0.8 }} aria-label={`Decrease skill level for ${data.label}`} disabled={currentLevel === 0}>
                        <FaMinusSquare
                            size={22}
                            className={`${currentLevel === 0 ? 'text-gray-400' : 'text-red-500 hover:text-red-600'}`}
                        />
                    </motion.button>
                </div>
                {(!isSourceSkill() && data.skillData.id !== 3840) && (
                    <Handle
                        id='source-right'
                        type='source'
                        position={Position.Right}
                        className='w-3 h-3 rounded-full'
                    />
                )}
                {additionalSourceTop &&
                    <Handle
                        id='source-top'
                        type='source'
                        position={Position.Top}
                        className='w-3 h-3 rounded-full'
                    />
                }
                {additionalSourceBottom &&
                    <Handle
                        id='source-bottom'
                        type='source'
                        position={Position.Bottom}
                        className='w-3 h-3 rounded-full'
                    />
                }
            </div>
            <Tooltip
                id={`node-tooltip-${data.skillData.id}`}
                className='custom-tooltip'
            />
        </>
    );
};

export default SkillNode;
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

const SkillNode = ({ data }: any) => {
    const { skillLevels, updateSkillLevel } = useSkillStore();
    const { selectedClass } = useClassStore();
    const { characterLevel, skillPoints, setSkillPoints } = useCharacterStore();
    const [skillSource, setSkillSource] = useState<SkillSourceProps[] | null>(null);
    const currentLevel = skillLevels[data.skillData.id]?.level || 0;

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
        return data.skillData.requirements.every((req: any) => {
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

    return (
        <>
            <div
                className="flex flex-col w-[50px] h-[70px] bg-white text-white border-2 border-slate-400 rounded shadow relative justify-center items-center"
                data-tooltip-id={`node-tooltip-${data.skillData.id}`}
                data-tooltip-html={`
                    <strong style="color: #2db568;">${data.skillData.id} ${data.label} <span style="padding-left: 5px; color: #ffffff;">Lv.${currentLevel}/${data.skillData.levels.length}</span></strong><br />
                    ${data.skillData.levels[currentLevel === 0 ? currentLevel : currentLevel - 1]?.consumedMP !== undefined ? `MP: ${data.skillData.levels[currentLevel === 0 ? currentLevel : currentLevel - 1].consumedMP}<br />` : ''}
                    ${data.skillData.levels[currentLevel === 0 ? currentLevel : currentLevel - 1]?.consumedFP !== undefined ? `FP: ${data.skillData.levels[currentLevel === 0 ? currentLevel : currentLevel - 1].consumedFP}<br />` : ''}
                    <span style="color: ${characterLevel < data.skillData.level ? '#ff0000' : '#ffffff'};">Character Level: ${data.skillData.level}</span><br />
                    <span style="color: #c5c5c5;">${data.skillData.description.en}</span>
                `}
            >
                {data.skillData.requirements.length !== 0 &&
                    <Handle
                        type="target"
                        position={Position.Left}
                        className="bg-green-500 w-3 h-3 rounded-full"
                    />
                }
                <div className='flex relative'>
                    <Image src={data.image} alt={data.skillData.id} width={40} height={40} priority className={`${(characterLevel < data.skillData.level || !canUpgrade()) && 'grayscale'}`} />
                    {currentLevel != 0 &&
                        <p className={`absolute bottom-0 right-0 pr-1 font-bold stroke-text-red ${currentLevel === data.skillData.levels.length ? 'text-[12px]' : ' text-[16px]'}`}>
                            {currentLevel === data.skillData.levels.length ? 'MAX' : currentLevel}
                        </p>
                    }
                </div>
                <div className='flex'>
                    <motion.button onClick={increaseLevel} whileTap={{ scale: 0.8 }} disabled={skillPoints < data.skillData.skillPoints || characterLevel < data.skillData.level || currentLevel === data.skillData.levels.length || !canUpgrade()}>
                        <FaPlusSquare size={18} className={`${skillPoints < data.skillData.skillPoints || characterLevel < data.skillData.level || currentLevel === data.skillData.levels.length || !canUpgrade() ? 'text-gray-400' : 'text-green-500 hover:text-green-600'}`} />
                    </motion.button>
                    <motion.button onClick={decreaseLevel} whileTap={{ scale: 0.8 }} disabled={currentLevel === 0}>
                        <FaMinusSquare size={18} className={`${currentLevel === 0 ? 'text-gray-400' : 'text-red-500 hover:text-red-600'}`} />
                    </motion.button>
                </div>
                {!isSourceSkill() && (
                    <Handle
                        type="source"
                        position={Position.Right}
                        className="bg-red-500 w-3 h-3 rounded-full"
                    />
                )}
            </div>
            <Tooltip
                id={`node-tooltip-${data.skillData.id}`}
                className="custom-tooltip"
            />
        </>
    );
};

export default SkillNode;
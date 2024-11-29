'use client'
import React from 'react';
import Image from 'next/image';
import { Handle, Position } from '@xyflow/react';
import { Tooltip } from 'react-tooltip';
import { FaPlusSquare, FaMinusSquare } from 'react-icons/fa';
import { useSkillStore } from '@/stores/skillStore';

const SkillNode = ({ data }: any) => {
    const { skillLevels, updateSkillLevel } = useSkillStore();
    const currentLevel = skillLevels[data.skillData.id] || 0;

    const canUpgrade = () => {
        return data.skillData.requirements.every((req: any) => {
            const requiredLevel = req.level;
            const currentReqLevel = skillLevels[req.skillId] || 0;
            return currentReqLevel >= requiredLevel;
        });
    };

    const increaseLevel = () => {
        if (currentLevel < data.skillData.levels.length && canUpgrade()) {
            updateSkillLevel(data.skillData.id, currentLevel + 1);
        }
    };

    const decreaseLevel = () => {
        if (currentLevel > 0) {
            updateSkillLevel(data.skillData.id, currentLevel - 1);
        }
    };

    return (
        <>
            <div
                className="flex flex-col w-[50px] h-[70px] bg-white text-white border-2 border-slate-400 rounded shadow relative justify-center items-center"
                data-tooltip-id={`node-tooltip-${data.skillData.id}`}
                data-tooltip-html={`
                    <strong style="color: #2db568;">${data.label} <span style="padding-left: 5px; color: #ffffff;">Lv.${currentLevel}/${data.skillData.levels.length}</span></strong><br />
                    ${data.skillData.levels[currentLevel === 0 ? currentLevel : currentLevel - 1]?.consumedMP !== undefined ? `MP: ${data.skillData.levels[currentLevel === 0 ? currentLevel : currentLevel - 1].consumedMP}<br />` : ''}
                    ${data.skillData.levels[currentLevel === 0 ? currentLevel : currentLevel - 1]?.consumedFP !== undefined ? `FP: ${data.skillData.levels[currentLevel === 0 ? currentLevel : currentLevel - 1].consumedFP}<br />` : ''}
                    Character Level: ${data.skillData.level}<br />
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
                        <Image src={data.image} alt={data.skillData.id} width={40} height={40} priority className={`${currentLevel === 0 && 'grayscale'}`} />
                        {currentLevel != 0 &&
                            <p className={`absolute bottom-0 right-0 pr-1 font-bold stroke-text-red ${currentLevel === data.skillData.levels.length ? 'text-[12px]' : ' text-[16px]'}`}>
                                {currentLevel === data.skillData.levels.length ? 'MAX' : currentLevel}
                            </p>
                        }
                    </div>
                    <div className='flex'>
                        <button onClick={increaseLevel} disabled={currentLevel === data.skillData.levels.length || !canUpgrade()}>
                            <FaPlusSquare size={18} className={`${currentLevel === data.skillData.levels.length || !canUpgrade() ? 'text-gray-400' : 'text-green-500 hover:text-green-600'}`} />
                        </button>
                        <button onClick={decreaseLevel} disabled={currentLevel === 0}>
                            <FaMinusSquare size={18} className={`${currentLevel === 0 ? 'text-gray-400' : 'text-red-500 hover:text-red-600'}`} />
                        </button>
                    </div>
                <Handle
                    type="source"
                    position={Position.Right}
                    className="bg-red-500 w-3 h-3 rounded-full"
                />
            </div>
            <Tooltip
                id={`node-tooltip-${data.skillData.id}`}
                className="custom-tooltip"
            />
        </>
    );
};

export default SkillNode;
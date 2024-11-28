'use client'
import React from 'react';
import Image from 'next/image';
import { Handle, Position } from '@xyflow/react';
import { Tooltip } from 'react-tooltip';
import { FaPlusSquare, FaMinusSquare } from 'react-icons/fa';

const SkillNode = ({ data }: any) => {
    return (
        <>
            <div
                className="flex flex-col w-[50px] h-[70px] bg-white text-white border-2 border-slate-400 rounded shadow relative justify-center items-center"
                data-tooltip-id={`node-tooltip-${data.id}`}
                data-tooltip-html={`
                    <strong>${data.label}</strong>
                    <br />
                    ${data.description}
                `}
            >
                <Handle
                    type="target"
                    position={Position.Top}
                    className="bg-green-500 w-3 h-3 rounded-full"
                />
                    <div className='flex relative'>
                        <Image src={data.image} alt={data.id} width={40} height={40} priority />
                        <p className='absolute bottom-0 right-0 pr-1 font-bold stroke-text-red'>10</p>
                    </div>
                    <div className='flex'>
                        <button><FaPlusSquare size={18} className='text-green-500' /></button>
                        <button><FaMinusSquare size={18} className='text-red-500' /></button>
                    </div>
                <Handle
                    type="source"
                    position={Position.Bottom}
                    className="bg-red-500 w-3 h-3 rounded-full"
                />
            </div>
            <Tooltip
                id={`node-tooltip-${data.id}`}
                className="custom-tooltip"
            />
        </>
    );
};

export default SkillNode;
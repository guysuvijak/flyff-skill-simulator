'use client'
import React, { useState, useEffect, useCallback } from 'react';
import {
  ReactFlow,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Position,
  getSmoothStepPath
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import SkillNode from '@/components/SkillNode';
import ClassSelected from '@/components/ClassSelected';

const getEdgeColor = (id: string) => {
    if (id === 'e-marketplace1-equipment') return '#2196f3';
    if (id === 'e-trave1-traveler1') return '#f44336';
    return '#8bc34a';
};

const edgeTypes = {
    smoothstep: ({ id, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, style = {} }: any) => {
        const edgeColor = getEdgeColor(id);
        
        let startX = sourceX;
        let startY = sourceY;
        let endX = targetX;
        let endY = targetY;
        
        if (sourcePosition === Position.Left) startX = sourceX - 5;
        if (sourcePosition === Position.Right) startX = sourceX + 5;
        if (targetPosition === Position.Left) endX = targetX - 5;
        if (targetPosition === Position.Right) endX = targetX + 5;

        const [edgePath] = getSmoothStepPath({
            sourceX: startX,
            sourceY: startY,
            sourcePosition,
            targetX: endX,
            targetY: endY,
            targetPosition,
            borderRadius: 0,
            offset: 25
        });
    
        return (
            <path
                id={id}
                style={{ ...style, strokeWidth: 2, stroke: edgeColor }}
                className="react-flow__edge-path"
                d={edgePath}
                markerEnd={`url(#arrow-end)`}
                markerStart={`url(#arrow-start)`}
            />
        );
    },
};

const Page = () => {
    const initialNodes = [
        { id: '1', position: { x: 0, y: 0 }, data: { label: '1', image: 'https://api.flyff.com/image/skill/colored/acrbowaimeds.png' }, type: 'custom' },
        { id: '2', position: { x: 0, y: 200 }, data: { label: '2', image: 'https://api.flyff.com/image/skill/colored/acrbowaimeds.png' }, type: 'custom' },
    ];

    const initialEdges = [{ id: 'e1-2', source: '1', target: '2', type: 'smoothstep', animated: true }];

    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

    const onConnect = useCallback(
        (params: any) => setEdges((eds) => addEdge(params, eds)),
        [setEdges]
    );

    return (
        <div className="w-screen h-screen">
            <div className='bg-red-500'>
                <ClassSelected />
            </div>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                nodeTypes={{ custom: SkillNode }}
                edgeTypes={edgeTypes}
                draggable={false}
                nodesDraggable={false}
                fitView
            >
            <Controls showInteractive={false} />
            <Background />
        </ReactFlow>
        </div>
    );
};

export default Page;
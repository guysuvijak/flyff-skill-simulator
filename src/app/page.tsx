'use client'
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
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
    return '#999999';
};

const edgeTypes = {
    smoothstep: ({ id, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, style = {}, data }: any) => {
        const edgeColor = getEdgeColor(id);
        let startX = sourceX;
        let startY = sourceY;
        let endX = targetX;
        let endY = targetY;
        
        if (sourcePosition === Position.Left) startX = sourceX - 5;
        if (sourcePosition === Position.Right) startX = sourceX + 5;
        if (targetPosition === Position.Left) endX = targetX - 5;
        if (targetPosition === Position.Right) endX = targetX + 5;

        const [edgePath, labelX, labelY] = getSmoothStepPath({
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
            <>
                <defs>
                    <marker
                        id="arrow-end"
                        markerWidth="4"
                        markerHeight="4"
                        viewBox="0 0 10 10"
                        refX="5"
                        refY="5"
                        orient="auto"
                    >
                        <path d="M 0 0 L 10 5 L 0 10 Z" fill={edgeColor} />
                    </marker>
                </defs>
                <path
                    id={id}
                    style={{ ...style, strokeWidth: 2, stroke: edgeColor }}
                    className="react-flow__edge-path"
                    d={edgePath}
                    markerEnd="url(#arrow-end)"
                />
                {data?.label && (
                    <text
                        x={labelX}
                        y={labelY}
                        fill={'#ffee03'}
                        fontSize="12"
                        textAnchor="middle"
                        dominantBaseline="middle"
                        style={{ pointerEvents: 'none' }}
                        className='stroke-text stroke-text-red'
                    >
                        {data.label}
                    </text>
                )}
            </>
        );
    },
};

const Page = () => {
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchSkillData = async () => {
            try {
                setIsLoading(true);
                const response = await axios.get('/data/skillall.json');

                const filteredSkills = response.data.filter((skill: any) => skill.class === 8962);
                
                const initialNodes = filteredSkills.map((skill: any) => ({
                    id: skill.id.toString(),
                    position: { 
                        x: skill.treePosition?.x * 3 || 0, 
                        y: skill.treePosition?.y * 3.5 || 0 
                    },
                    data: { 
                        label: skill.name.en,
                        image: `https://api.flyff.com/image/skill/colored/${skill.icon}`,
                        skillData: skill
                    },
                    type: 'custom'
                }));

                const initialEdges = filteredSkills.flatMap((skill: any) => 
                    (skill.requirements || []).map((req: any) => ({
                        id: `e-${req.skill}-${skill.id}`,
                        source: req.skill.toString(),
                        target: skill.id.toString(),
                        type: 'smoothstep',
                        animated: true,
                        data: { label: req.level.toString() }
                    }))
                );

                setNodes(initialNodes);
                setEdges(initialEdges);
                setIsLoading(false);
            } catch (err) {
                setError('Failed to fetch skill data');
                setIsLoading(false);
                console.error(err);
            }
        };

        fetchSkillData();
    }, [setNodes, setEdges]);

    const onConnect = useCallback(
        (params: any) => setEdges((eds) => addEdge(params, eds)),
        [setEdges]
    );

    if (isLoading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    if (error) {
        return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>;
    }

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
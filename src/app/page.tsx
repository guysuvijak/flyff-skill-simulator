// Next.js 15 - src/app/page.tsx
'use client';
import { useState, useEffect, useRef, CSSProperties } from 'react';
import {
    ReactFlow,
    Controls,
    Background,
    useNodesState,
    useEdgesState,
    Position,
    EdgeProps,
    getSimpleBezierPath
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { SkillNode } from '@/components/SkillNode';
import { Navbar } from '@/components/Navbar';
import { EdgeLabel } from '@/components/EdgeLabel';
import { UpdateVersionDialog } from '@/components/UpdateVersionDialog';
import { useClassStore } from '@/stores/classStore';
import { loadBuildFromUrl } from '@/utils/shareBuild';
import { useWebsiteStore } from '@/stores/websiteStore';
import { useTranslation } from '@/hooks/useTranslation';
import { Loader2 } from 'lucide-react';
import pkg from '../../package.json';

interface ClassSpaces {
    [key: number]: number;
}

interface TreePosition {
    x: number;
    y: number;
}

interface SkillRequirement {
    skill: number;
    level: number;
}

interface SkillName {
    en: string;
    [key: string]: string;
}

interface Skill {
    id: number;
    name: SkillName;
    class: number;
    icon: string;
    treePosition: TreePosition;
    requirements?: SkillRequirement[];
}

interface CustomEdgeProps extends EdgeProps {
    id: string;
    sourceX: number;
    sourceY: number;
    targetX: number;
    targetY: number;
    sourcePosition: Position;
    targetPosition: Position;
    style?: CSSProperties;
    data?: {
        label?: string;
    };
}

interface UniqueConnection {
    sourceHandle: string;
    targetHandle: string;
}

interface UniqueConnections {
    [key: string]: UniqueConnection;
}

const CLASS_SPACES: ClassSpaces = {
    2246: 700, // Blade
    3545: 700, // Jester
    5330: 700, // Knight
    5709: 700, // Psykeeper
    7424: 800, // Billposter
    9150: 700, // Elementor
    9295: 700, // Ranger
    9389: 800 // Ringmaster
};

const CLASS_SPACESY: ClassSpaces = {
    2246: 91, // Blade
    3545: 91, // Jester
    5330: 91, // Knight
    5709: 91, // Psykeeper
    7424: 91, // Billposter
    9150: 0, // Elementor
    9295: 91, // Ranger
    9389: 91 // Ringmaster
};

const edgeTypes = {
    smoothstep: ({
        id,
        sourceX,
        sourceY,
        targetX,
        targetY,
        sourcePosition,
        targetPosition,
        style = {},
        data
    }: CustomEdgeProps) => {
        const edgeColor = '#999999';

        let startX = sourceX;
        let startY = sourceY;
        let endX = targetX;
        let endY = targetY;

        if (sourcePosition === Position.Left) startX = sourceX - 5;
        if (sourcePosition === Position.Right) startX = sourceX + 5;
        if (targetPosition === Position.Left) endX = targetX - 5;
        if (targetPosition === Position.Right) endX = targetX + 5;
        if (sourcePosition === Position.Top) startY = sourceY - 5;
        if (targetPosition === Position.Bottom) endY = targetY + 5;
        if (sourcePosition === Position.Bottom) startY = sourceY + 5;
        if (targetPosition === Position.Top) endY = targetY - 5;

        const [edgePath, labelX, labelY] = getSimpleBezierPath({
            sourceX: startX,
            sourceY: startY,
            targetX: endX,
            targetY: endY,
            sourcePosition,
            targetPosition
        });

        return (
            <>
                <defs>
                    <marker
                        id='arrow-end'
                        markerWidth='8'
                        markerHeight='8'
                        viewBox='0 0 10 10'
                        refX='5'
                        refY='5'
                        orient='auto'
                    >
                        <path d='M 0 0 L 10 5 L 0 10 Z' fill={edgeColor} />
                    </marker>
                </defs>
                <path
                    id={id}
                    style={{ ...style, stroke: edgeColor }}
                    className='react-flow__edge-path'
                    d={edgePath}
                    markerEnd='url(#arrow-end)'
                />
                {data?.label && (
                    <EdgeLabel
                        x={labelX}
                        y={labelY}
                        text={data.label}
                        fontSize={14}
                        strokeWidth={3}
                        fontWeight='bold'
                        showMultipleStrokes={true}
                    />
                )}
            </>
        );
    }
};

const Page = () => {
    const { t } = useTranslation();
    const { skillStyle, latestVersion, updatedDialog } = useWebsiteStore();
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { selectedClass } = useClassStore();
    const hasLoaded = useRef(false);
    const lastLoadedClass = useRef<number | null>(null);

    useEffect(() => {
        const fetchSkillData = async () => {
            if (
                hasLoaded.current &&
                lastLoadedClass.current === selectedClass.id
            ) {
                return;
            }

            try {
                setIsLoading(true);
                const response = await fetch('/data/skillall.json');
                if (!response.ok) {
                    throw new Error('Failed to fetch skill data');
                }
                const skillData = await response.json();

                const selectedSkills = skillData.filter(
                    (skill: Skill) =>
                        skill.class === selectedClass.id ||
                        skill.class === selectedClass.parent
                );
                const classSpace = CLASS_SPACES[selectedClass.id] || 0;
                const classSpaceY = CLASS_SPACESY[selectedClass.id] || 0;

                const initialNodes = selectedSkills.map((skill: Skill) => ({
                    id: skill.id.toString(),
                    position: {
                        x:
                            (skill.treePosition?.x * 3.5 || 0) +
                            (skill.class === selectedClass.id ? classSpace : 0),
                        y:
                            (skill.treePosition?.y * 4 || 0) +
                            (skill.class === selectedClass.id ? classSpaceY : 0)
                    },
                    data: {
                        label: skill.name.en, // This will be overridden by the SkillNode component
                        image: `https://api.flyff.com/image/skill/${skillStyle}/${skill.icon}`,
                        skillData: skill
                    },
                    type: 'custom'
                }));

                const uniqueConnect: UniqueConnections = {
                    'e-51-8348': {
                        sourceHandle: 'source-top',
                        targetHandle: 'target-bottom'
                    },
                    'e-4729-7266': {
                        sourceHandle: 'source-bottom',
                        targetHandle: 'target-top'
                    },
                    'e-7429-5559': {
                        sourceHandle: 'source-top',
                        targetHandle: 'target-bottom'
                    },
                    'e-8140-8356': {
                        sourceHandle: 'source-bottom',
                        targetHandle: 'target-top'
                    },
                    'e-3840-5041': {
                        sourceHandle: 'source-bottom',
                        targetHandle: 'target-top'
                    }
                };

                const initialEdges = selectedSkills.flatMap((skill: Skill) =>
                    (skill.requirements || []).map((req: SkillRequirement) => {
                        const edgeId = `e-${req.skill}-${skill.id}`;
                        const uniqueConnectionConfig = uniqueConnect[edgeId];

                        return {
                            id: edgeId,
                            source: req.skill.toString(),
                            target: skill.id.toString(),
                            type: 'smoothstep',
                            sourceHandle:
                                uniqueConnectionConfig?.sourceHandle ||
                                'source-right',
                            targetHandle:
                                uniqueConnectionConfig?.targetHandle ||
                                'target-left',
                            animated: true,
                            data: { label: req.level.toString() }
                        };
                    })
                );

                setNodes(initialNodes);
                setEdges(initialEdges);
                await loadBuildFromUrl();
                setIsLoading(false);
            } catch (err) {
                setError('Failed to fetch skill data');
                setIsLoading(false);
                console.error(err);
            }
        };

        fetchSkillData();
    }, [
        setNodes,
        setEdges,
        selectedClass.id,
        selectedClass.parent,
        skillStyle
    ]);

    if (error) {
        return (
            <div className='w-screen h-screen'>
                <Navbar />
                <div className='flex justify-center items-center h-[calc(100vh-110px)] sm:h-[calc(100vh-70px)] md:h-[calc(100vh-70px)] text-destructive'>
                    {error}
                </div>
            </div>
        );
    }

    const onBeforeDelete = async () => {
        return false;
    };

    return (
        <div className='w-screen h-screen'>
            <Navbar />
            <div className='h-[calc(100vh-110px)] sm:h-[calc(100vh-70px)] md:h-[calc(100vh-70px)]'>
                {(!updatedDialog || latestVersion !== pkg.version) && (
                    <UpdateVersionDialog />
                )}

                {isLoading ? (
                    <div className='flex justify-center items-center h-full gap-2 text-xl text-muted-foreground'>
                        <Loader2 className='h-10 w-10 animate-spin' />
                        {t('loading')}
                    </div>
                ) : (
                    <ReactFlow
                        nodes={nodes}
                        edges={edges}
                        onNodesChange={onNodesChange}
                        onEdgesChange={onEdgesChange}
                        nodeTypes={{ custom: SkillNode }}
                        edgeTypes={edgeTypes}
                        onBeforeDelete={onBeforeDelete}
                        draggable={false}
                        nodesDraggable={false}
                        zoomOnDoubleClick={false}
                        fitView
                        className='text-black'
                    >
                        <Controls showInteractive={false} />
                        <Background />
                    </ReactFlow>
                )}
            </div>
        </div>
    );
};

export default Page;

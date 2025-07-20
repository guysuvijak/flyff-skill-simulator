// Next.js 15 - src/components/SkillNode.tsx
'use client';
import { useState, useEffect, Fragment } from 'react';
import Image from 'next/image';
import { Handle, Position } from '@xyflow/react';
import { motion } from 'framer-motion';
import { useSkillStore } from '@/stores/skillStore';
import { useClassStore } from '@/stores/classStore';
import { useCharacterStore } from '@/stores/characterStore';
import { useSkillLocalization } from '@/utils/skillUtils';
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
    Plus,
    LandPlot,
    Crosshair,
    EyeClosed,
    Shell,
    Snail,
    Droplets,
    Bubbles,
    Sparkles,
    Shield,
    Superscript,
    Footprints,
    HeartPlus,
    Brain,
    Atom,
    BicepsFlexed,
    Beef,
    ShieldHalf,
    Cross,
    Sword,
    Axe,
    ShieldCheck,
    ClockFading
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useTranslation } from '@/hooks/useTranslation';

interface SkillSourceProps {
    class: number;
    name: string;
    parent: number;
    skills: number[];
}

interface Abilities {
    parameter?: string;
    add?: number;
    rate?: boolean;
    attribute?: string;
}

interface SkillScaling {
    parameter?: string;
    stat?: string;
    scale?: number;
    pvp?: boolean;
    pve?: boolean;
    maximum?: number;
}
interface SkillLevel {
    consumedMP?: number;
    consumedFP?: number;
    cooldown?: number;
    duration?: number;
    minAttack?: number;
    maxAttack?: number;
    probability?: number;
    probabilityPVP?: number;
    casting?: number;
    spellRange?: number;
    dotTick?: number;
    abilities?: Abilities[];
    scalingParameters?: SkillScaling[];
}

interface SkillRequirement {
    skill: number;
    level: number;
}

interface SkillData {
    id: number;
    name: {
        en: string;
        [key: string]: string;
    };
    class: number;
    icon: string;
    treePosition: {
        x: number;
        y: number;
    };
    requirements?: SkillRequirement[];
    description?: {
        en: string;
        [key: string]: string;
    };
    levels?: SkillLevel[];
    level?: number;
    combo?: '' | 'general' | 'step' | 'circle' | 'finish';
    target?: 'currentplayer' | 'area' | 'single' | 'party';
    skillPoints?: number;
}

interface SkillNodeProps {
    data: {
        skillData: SkillData;
        label: string;
        image: string;
    };
}

export const SkillNode = ({ data }: SkillNodeProps) => {
    const { t } = useTranslation();
    const { skillLevels, updateSkillLevel } = useSkillStore();
    const { selectedClass } = useClassStore();
    const { characterLevel, skillPoints, setSkillPoints } = useCharacterStore();
    const { getSkillName, getSkillDescription } = useSkillLocalization();
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
                const response = await fetch('/data/skillsource.json');
                if (!response.ok) {
                    throw new Error('Failed to fetch skillsource data');
                }
                const data = await response.json();
                setSkillSource(data);
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
        return (data.skillData.requirements || []).every((req) => {
            const currentReqLevel = skillLevels[req.skill]?.level || 0;
            return currentReqLevel >= req.level;
        });
    };

    const increaseLevel = () => {
        const levels = data.skillData.levels || [];
        const skillPointsCost = data.skillData.skillPoints || 1;
        if (currentLevel < levels.length && canUpgrade()) {
            updateSkillLevel(
                data.skillData.id,
                currentLevel + 1,
                skillPointsCost
            );
            setSkillPoints(skillPoints - skillPointsCost);
        }
    };

    const decreaseLevel = () => {
        const skillPointsCost = data.skillData.skillPoints || 1;
        if (currentLevel > 0) {
            updateSkillLevel(
                data.skillData.id,
                currentLevel - 1,
                skillPointsCost
            );
            setSkillPoints(skillPoints + skillPointsCost);
        }
    };

    const setToMaxLevel = () => {
        const levels = data.skillData.levels || [];
        const skillPointsCost = data.skillData.skillPoints || 1;
        if (canUpgrade() && currentLevel < levels.length) {
            const levelsToAdd = levels.length - currentLevel;
            const totalSkillPointsNeeded = levelsToAdd * skillPointsCost;

            if (skillPoints >= totalSkillPointsNeeded) {
                // Have enough points to upgrade all
                updateSkillLevel(
                    data.skillData.id,
                    levels.length,
                    skillPointsCost
                );
                setSkillPoints(skillPoints - totalSkillPointsNeeded);
            } else {
                // Don't have enough points, upgrade as much as can.
                const levelsCanUpgrade = Math.floor(
                    skillPoints / skillPointsCost
                );
                const newLevel = Math.min(
                    currentLevel + levelsCanUpgrade,
                    levels.length
                );
                const actualSkillPointsUsed =
                    (newLevel - currentLevel) * skillPointsCost;

                updateSkillLevel(data.skillData.id, newLevel, skillPointsCost);
                setSkillPoints(skillPoints - actualSkillPointsUsed);
            }
        }
    };

    const setToLevelZero = () => {
        const skillPointsCost = data.skillData.skillPoints || 1;
        if (currentLevel > 0) {
            updateSkillLevel(data.skillData.id, 0, skillPointsCost);
            setSkillPoints(skillPoints + currentLevel * skillPointsCost);
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

    const levels = data.skillData.levels || [];
    const levelData = levels[Math.max(currentLevel - 1, 0)];

    // function to calculate Stat Scaling for all stats (str, sta, int, dex)
    const calculateStatScaling = (scaling: SkillScaling) => {
        const statTypes = ['str', 'sta', 'int', 'dex'];
        if (
            statTypes.includes(scaling.parameter || '') &&
            scaling.scale &&
            scaling.scale < 1
        ) {
            // calculate the number of stat required to get +1
            const statRequired = Math.ceil(1 / scaling.scale);
            return {
                scale: 1,
                statRequired: statRequired,
                originalScale: scaling.scale
            };
        }
        return null;
    };

    // function to calculate % Scaling for all skills
    const calculateSkillScaling = (scaling: SkillScaling) => {
        const statTypes = [
            'magicdefense',
            'def',
            'maxhp',
            'speed',
            'attackspeed',
            'decreasedcastingtime',
            'block',
            'hitrate'
        ];
        if (
            statTypes.includes(scaling.parameter || '') &&
            scaling.scale &&
            scaling.scale < 1
        ) {
            // calculate the number of stat required to get +0.5
            const statRequired = Math.ceil(0.5 / scaling.scale);
            return {
                scale: 0.5,
                statRequired: statRequired,
                originalScale: scaling.scale
            };
        }
        return null;
    };

    return (
        <div className='flex flex-col w-[72px] h-[78px] bg-background text-foreground border-2 border-border rounded shadow relative justify-center items-center'>
            {(data.skillData.requirements || []).length !== 0 &&
                ![8348, 5559, 7266, 5041].includes(data.skillData.id) && (
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
                                alt={
                                    getSkillName(data.skillData.name) ||
                                    String(data.skillData.id)
                                }
                                width={48}
                                height={48}
                                loading='lazy'
                                placeholder={`data:image/svg+xml;base64,${toBase64(shimmer(48, 48))}`}
                                className={`${characterLevel < (data.skillData.level || 0) || !canUpgrade() ? 'grayscale' : 'hover:scale-110 transition-all duration-300'}`}
                                draggable={false}
                            />
                            {currentLevel !== 0 && (
                                <p
                                    className={`absolute bottom-0 right-0 pr-1 font-bold text-white stroke-text-red ${currentLevel === levels.length ? 'text-[12px]' : ' text-[16px]'}`}
                                >
                                    {currentLevel === levels.length
                                        ? 'MAX'
                                        : currentLevel}
                                </p>
                            )}
                        </div>
                    </TooltipTrigger>
                    <TooltipContent className='max-w-xs md:max-w-sm lg:max-w-md text-sm text-foreground bg-background border border-border shadow-md relative'>
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
                        <div className='text-sm sm:text-base md:text-lg text-primary font-bold pr-6'>
                            {getSkillName(data.skillData.name)}
                            <span className='text-muted-foreground ml-1'>
                                {`Lv.${currentLevel}/${levels.length}`}
                            </span>
                        </div>
                        {levelData?.consumedMP !== undefined && (
                            <span className='text-sm sm:text-base md:text-lg'>{`MP: ${levelData.consumedMP}`}</span>
                        )}
                        {levelData?.consumedFP !== undefined && (
                            <span className='text-sm sm:text-base md:text-lg'>{`FP: ${levelData.consumedFP}`}</span>
                        )}
                        <div
                            className={`text-sm sm:text-base md:text-lg
                                ${
                                    characterLevel < (data.skillData.level || 0)
                                        ? 'text-destructive'
                                        : 'text-muted-foreground'
                                }
                            `}
                        >
                            {t('skill-node.character-level', {
                                level: data.skillData.level || 0
                            })}
                        </div>
                        {levelData?.minAttack !== undefined && (
                            <div className='text-sm sm:text-base md:text-lg'>
                                <span className='mx-1.5 text-muted-foreground'>
                                    {'-'}
                                </span>
                                {t('skill-node.base-damage', {
                                    minAttack: levelData.minAttack,
                                    maxAttack: levelData.maxAttack
                                })}
                            </div>
                        )}
                        {levelData?.duration !== undefined && (
                            <div className='text-sm sm:text-base md:text-lg'>
                                <span className='mx-1.5 text-muted-foreground'>
                                    {'-'}
                                </span>
                                {t('skill-node.base-time', {
                                    duration: levelData.duration
                                })}
                            </div>
                        )}
                        {data.skillData.combo !== '' &&
                            data.skillData.combo !== 'general' && (
                                <div className='text-sm sm:text-base md:text-lg'>
                                    <span className='mx-1.5 text-muted-foreground'>
                                        {'-'}
                                    </span>
                                    {t('skill-node.combo', {
                                        combo: data.skillData.combo
                                            ? data.skillData.combo
                                                  .charAt(0)
                                                  .toUpperCase() +
                                              data.skillData.combo.slice(1)
                                            : ''
                                    })}
                                </div>
                            )}
                        <Separator className='my-1' />
                        {levelData?.scalingParameters !== undefined && (
                            <>
                                {levelData.scalingParameters.map(
                                    (scaling, index) => {
                                        if (scaling.parameter === 'attack') {
                                            return (
                                                <div
                                                    key={`attack-${index}`}
                                                    className='flex text-sm sm:text-base md:text-lg gap-1'
                                                >
                                                    <Expand
                                                        size={14}
                                                        className='text-muted-foreground mt-0.5 sm:mt-1.5 md:mt-2'
                                                    />
                                                    <span>
                                                        {t(
                                                            'skill-node.attack-scaling',
                                                            {
                                                                stat: scaling.stat?.toUpperCase(),
                                                                scale: scaling.scale?.toFixed(
                                                                    2
                                                                )
                                                            }
                                                        )}
                                                    </span>
                                                </div>
                                            );
                                        }
                                        if (scaling.parameter === 'hp') {
                                            return (
                                                <div
                                                    key={`hp-scaling-${index}`}
                                                    className='flex text-sm sm:text-base md:text-lg gap-1'
                                                >
                                                    <Expand
                                                        size={14}
                                                        className='text-muted-foreground mt-0.5 sm:mt-1.5 md:mt-2'
                                                    />
                                                    <span>
                                                        {t(
                                                            'skill-node.hp-scaling',
                                                            {
                                                                stat: scaling.stat?.toUpperCase(),
                                                                scale: scaling.scale?.toFixed(
                                                                    2
                                                                )
                                                            }
                                                        )}
                                                    </span>
                                                </div>
                                            );
                                        }
                                        if (
                                            [
                                                'str',
                                                'sta',
                                                'int',
                                                'dex',
                                                'damage'
                                            ].includes(scaling.parameter || '')
                                        ) {
                                            const statScaling =
                                                calculateStatScaling(scaling);
                                            if (statScaling) {
                                                return (
                                                    <div
                                                        key={`${scaling.parameter}-scaling-${index}`}
                                                        className='flex text-sm sm:text-base md:text-lg gap-1'
                                                    >
                                                        <Expand
                                                            size={14}
                                                            className='text-muted-foreground mt-0.5 sm:mt-1.5 md:mt-2'
                                                        />
                                                        <span>
                                                            {t(
                                                                `skill-node.${scaling.parameter}-scaling`,
                                                                {
                                                                    scale: statScaling.scale,
                                                                    stat: scaling.stat?.toUpperCase(),
                                                                    max: scaling.maximum,
                                                                    intRequired:
                                                                        statScaling.statRequired
                                                                }
                                                            )}
                                                        </span>
                                                    </div>
                                                );
                                            }
                                            // if scale >= 1 or no scale
                                            return (
                                                <div
                                                    key={`${scaling.parameter}-scaling-${index}`}
                                                    className='flex text-sm sm:text-base md:text-lg gap-1'
                                                >
                                                    <Expand
                                                        size={14}
                                                        className='text-muted-foreground mt-0.5 sm:mt-1.5 md:mt-2'
                                                    />
                                                    <span>
                                                        {t(
                                                            `skill-node.${scaling.parameter}-scaling`,
                                                            {
                                                                scale: scaling.scale,
                                                                stat: scaling.stat?.toUpperCase(),
                                                                max: scaling.maximum,
                                                                intRequired: 1
                                                            }
                                                        )}
                                                    </span>
                                                </div>
                                            );
                                        }
                                        if (scaling.parameter === 'duration') {
                                            return (
                                                <div
                                                    key={`duration-${index}`}
                                                    className='flex text-sm sm:text-base md:text-lg gap-1'
                                                >
                                                    <ClockArrowUp
                                                        size={14}
                                                        className='text-muted-foreground mt-0.5 sm:mt-1.5 md:mt-2'
                                                    />
                                                    <span>
                                                        {t(
                                                            'skill-node.time-scaling',
                                                            {
                                                                stat: scaling.stat?.toUpperCase(),
                                                                scale: scaling.scale?.toFixed(
                                                                    2
                                                                )
                                                            }
                                                        )}
                                                    </span>
                                                </div>
                                            );
                                        }
                                        if (
                                            [
                                                'magicdefense',
                                                'def',
                                                'maxhp',
                                                'speed',
                                                'attackspeed',
                                                'decreasedcastingtime',
                                                'block',
                                                'hitrate'
                                            ].includes(scaling.parameter || '')
                                        ) {
                                            const skillScaling =
                                                calculateSkillScaling(scaling);
                                            if (skillScaling) {
                                                return (
                                                    <div
                                                        key={`${scaling.parameter}-scaling-${index}`}
                                                        className='flex text-sm sm:text-base md:text-lg gap-1'
                                                    >
                                                        <Expand
                                                            size={14}
                                                            className='text-muted-foreground mt-0.5 sm:mt-1.5 md:mt-2'
                                                        />
                                                        <span>
                                                            {t(
                                                                `skill-node.${scaling.parameter}-scaling`,
                                                                {
                                                                    scale: skillScaling.scale,
                                                                    stat: scaling.stat?.toUpperCase(),
                                                                    max: scaling.maximum,
                                                                    intRequired:
                                                                        skillScaling.statRequired
                                                                }
                                                            )}
                                                        </span>
                                                    </div>
                                                );
                                            }
                                            return (
                                                <div
                                                    key={`${scaling.parameter}-scaling-${index}`}
                                                    className='flex text-sm sm:text-base md:text-lg gap-1'
                                                >
                                                    <Expand
                                                        size={14}
                                                        className='text-muted-foreground mt-0.5 sm:mt-1.5 md:mt-2'
                                                    />
                                                    <span>
                                                        {t(
                                                            `skill-node.${scaling.parameter}-scaling`,
                                                            {
                                                                scale: scaling.scale,
                                                                stat: scaling.stat?.toUpperCase(),
                                                                max: scaling.maximum,
                                                                intRequired: 1
                                                            }
                                                        )}
                                                    </span>
                                                </div>
                                            );
                                        }
                                        return null;
                                    }
                                )}
                            </>
                        )}
                        {levelData?.casting !== undefined && (
                            <div className='flex text-sm sm:text-base md:text-lg gap-1'>
                                <Loader
                                    size={14}
                                    className='text-muted-foreground mt-0.5 sm:mt-1.5 md:mt-2'
                                />
                                <span>
                                    {t('skill-node.casting-time', {
                                        casting: levelData.casting.toFixed(2)
                                    })}
                                </span>
                            </div>
                        )}
                        {levelData?.cooldown !== undefined && (
                            <div className='flex text-sm sm:text-base md:text-lg gap-1'>
                                <Clock
                                    size={14}
                                    className='text-muted-foreground mt-0.5 sm:mt-1.5 md:mt-2'
                                />
                                <span>
                                    {t('skill-node.cooldown', {
                                        cooldown: levelData.cooldown.toFixed(2)
                                    })}
                                </span>
                            </div>
                        )}
                        {levelData?.spellRange !== undefined && (
                            <div className='flex text-sm sm:text-base md:text-lg gap-1'>
                                <LandPlot
                                    size={14}
                                    className='text-muted-foreground mt-0.5 sm:mt-1.5 md:mt-2'
                                />
                                <span className='flex gap-1'>
                                    {t('skill-node.spell-range', {
                                        spellRange:
                                            levelData.spellRange.toFixed(2)
                                    })}
                                    {data.skillData.target === 'area' &&
                                        t('skill-node.target-area')}
                                    {data.skillData.target === 'party' &&
                                        t('skill-node.target-party')}
                                </span>
                            </div>
                        )}
                        {levelData?.dotTick !== undefined && (
                            <div className='flex text-sm sm:text-base md:text-lg gap-1'>
                                <ClockFading
                                    size={14}
                                    className='text-muted-foreground mt-0.5 sm:mt-1.5 md:mt-2'
                                />
                                <span className='flex gap-1'>
                                    {t('skill-node.dot-tick', {
                                        dotTick: levelData.dotTick.toFixed(2)
                                    })}
                                </span>
                            </div>
                        )}
                        {levelData?.abilities !== undefined && (
                            <>
                                {levelData.abilities.map((ability, index) => {
                                    if (ability.parameter === 'attribute') {
                                        const attributeType = ability.attribute;

                                        if (attributeType === 'double') {
                                            return (
                                                <div
                                                    key={`attribute-double-${index}`}
                                                    className='flex text-sm sm:text-base md:text-lg gap-1'
                                                >
                                                    <Superscript
                                                        size={14}
                                                        className='text-muted-foreground mt-0.5 sm:mt-1.5 md:mt-2'
                                                    />
                                                    <span>
                                                        {t(
                                                            'skill-node.attribute-double',
                                                            {
                                                                duration:
                                                                    levelData.duration ||
                                                                    0
                                                            }
                                                        )}
                                                    </span>
                                                </div>
                                            );
                                        }

                                        if (attributeType === 'slow') {
                                            return (
                                                <div
                                                    key={`attribute-slow-${index}`}
                                                    className='flex text-sm sm:text-base md:text-lg gap-1'
                                                >
                                                    <Snail
                                                        size={14}
                                                        className='text-muted-foreground mt-0.5 sm:mt-1.5 md:mt-2'
                                                    />
                                                    <span>
                                                        {t(
                                                            'skill-node.attribute-slow',
                                                            {
                                                                speed:
                                                                    levelData.abilities?.find(
                                                                        (a) =>
                                                                            a.parameter ===
                                                                            'speed'
                                                                    )?.add || 0,
                                                                rate: levelData.abilities?.find(
                                                                    (a) =>
                                                                        a.parameter ===
                                                                        'speed'
                                                                )?.rate
                                                                    ? '%'
                                                                    : ''
                                                            }
                                                        )}
                                                    </span>
                                                </div>
                                            );
                                        }

                                        if (attributeType === 'stun') {
                                            return (
                                                <div
                                                    key={`attribute-stun-${index}`}
                                                    className='flex text-sm sm:text-base md:text-lg gap-1'
                                                >
                                                    <Shell
                                                        size={14}
                                                        className='text-muted-foreground mt-0.5 sm:mt-1.5 md:mt-2'
                                                    />
                                                    <span>
                                                        {t(
                                                            'skill-node.attribute-stun',
                                                            {
                                                                duration:
                                                                    levelData.duration ||
                                                                    0,
                                                                probability:
                                                                    levelData.probability ||
                                                                    100
                                                            }
                                                        )}
                                                    </span>
                                                </div>
                                            );
                                        }

                                        if (attributeType === 'bleeding') {
                                            return (
                                                <div
                                                    key={`attribute-bleeding-${index}`}
                                                    className='flex text-sm sm:text-base md:text-lg gap-1'
                                                >
                                                    <Droplets
                                                        size={14}
                                                        className='text-muted-foreground mt-0.5 sm:mt-1.5 md:mt-2'
                                                    />
                                                    <span>
                                                        {t(
                                                            'skill-node.attribute-bleeding',
                                                            {
                                                                duration:
                                                                    levelData.duration ||
                                                                    0
                                                            }
                                                        )}
                                                    </span>
                                                </div>
                                            );
                                        }

                                        if (attributeType === 'poison') {
                                            return (
                                                <div
                                                    key={`attribute-poison-${index}`}
                                                    className='flex text-sm sm:text-base md:text-lg gap-1'
                                                >
                                                    <Bubbles
                                                        size={14}
                                                        className='text-muted-foreground mt-0.5 sm:mt-1.5 md:mt-2'
                                                    />
                                                    <span>
                                                        {t(
                                                            'skill-node.attribute-poison',
                                                            {
                                                                duration:
                                                                    levelData.duration ||
                                                                    0
                                                            }
                                                        )}
                                                    </span>
                                                </div>
                                            );
                                        }

                                        if (attributeType === 'forcedblock') {
                                            return (
                                                <div
                                                    key={`attribute-forcedblock-${index}`}
                                                    className='flex text-sm sm:text-base md:text-lg gap-1'
                                                >
                                                    <Shield
                                                        size={14}
                                                        className='text-muted-foreground mt-0.5 sm:mt-1.5 md:mt-2'
                                                    />
                                                    <span>
                                                        {t(
                                                            'skill-node.attribute-forcedblock'
                                                        )}
                                                    </span>
                                                </div>
                                            );
                                        }

                                        if (attributeType === 'invisibility') {
                                            return (
                                                <div
                                                    key={`attribute-invisibility-${index}`}
                                                    className='flex text-sm sm:text-base md:text-lg gap-1'
                                                >
                                                    <EyeClosed
                                                        size={14}
                                                        className='text-muted-foreground mt-0.5 sm:mt-1.5 md:mt-2'
                                                    />
                                                    <span>
                                                        {t(
                                                            'skill-node.attribute-invisibility',
                                                            {
                                                                duration:
                                                                    levelData.duration ||
                                                                    0
                                                            }
                                                        )}
                                                    </span>
                                                </div>
                                            );
                                        }
                                    }
                                    if (
                                        ability.parameter === 'removealldebuff'
                                    ) {
                                        return (
                                            <Fragment
                                                key={`remove-all-debuff-${index}`}
                                            >
                                                <div className='flex text-sm sm:text-base md:text-lg gap-1'>
                                                    <Bubbles
                                                        size={14}
                                                        className='text-muted-foreground mt-0.5 sm:mt-1.5 md:mt-2'
                                                    />
                                                    <span>
                                                        {t(
                                                            `skill-node.remove-all-debuff`,
                                                            {
                                                                probability:
                                                                    levelData.probability ||
                                                                    100
                                                            }
                                                        )}
                                                    </span>
                                                </div>

                                                {data.skillData.id === 1555 && (
                                                    <p className='text-muted-foreground whitespace-pre-wrap'>
                                                        {t(
                                                            `skill-node.remove-all-debuff-1555`
                                                        )}
                                                    </p>
                                                )}
                                            </Fragment>
                                        );
                                    }
                                    if (ability.parameter === 'hp') {
                                        return (
                                            <div
                                                key={`hp-${index}`}
                                                className='flex text-sm sm:text-base md:text-lg gap-1'
                                            >
                                                <Cross
                                                    size={14}
                                                    className='text-muted-foreground mt-0.5 sm:mt-1.5 md:mt-2'
                                                />
                                                <span>
                                                    {t('skill-node.hp', {
                                                        result:
                                                            ability.add &&
                                                            ability.add >= 0
                                                                ? '+'
                                                                : '',
                                                        hp: ability.add || 0,
                                                        rate: ability.rate
                                                            ? '%'
                                                            : ''
                                                    })}
                                                </span>
                                            </div>
                                        );
                                    }
                                    if (ability.parameter === 'damage') {
                                        return (
                                            <div
                                                key={`damage-${index}`}
                                                className='flex text-sm sm:text-base md:text-lg gap-1'
                                            >
                                                <ChevronsUp
                                                    size={14}
                                                    className='text-muted-foreground mt-0.5 sm:mt-1.5 md:mt-2'
                                                />
                                                <span>
                                                    {t('skill-node.damage', {
                                                        result:
                                                            ability.add &&
                                                            ability.add >= 0
                                                                ? '+'
                                                                : '',
                                                        damage:
                                                            ability.add || 0,
                                                        duration:
                                                            levelData.duration ||
                                                            0,
                                                        rate: ability.rate
                                                            ? '%'
                                                            : ''
                                                    })}
                                                </span>
                                            </div>
                                        );
                                    }
                                    if (
                                        ability.parameter === 'criticalresist'
                                    ) {
                                        return (
                                            <div
                                                key={`critical-resist-${index}`}
                                                className='flex text-sm sm:text-base md:text-lg gap-1'
                                            >
                                                <ShieldCheck
                                                    size={14}
                                                    className='text-muted-foreground mt-0.5 sm:mt-1.5 md:mt-2'
                                                />
                                                <span>
                                                    {t(
                                                        'skill-node.critical-resist',
                                                        {
                                                            result:
                                                                ability.add &&
                                                                ability.add >= 0
                                                                    ? '+'
                                                                    : '',
                                                            criticalResist:
                                                                ability.add ||
                                                                0,
                                                            duration:
                                                                levelData.duration ||
                                                                0,
                                                            rate: ability.rate
                                                                ? '%'
                                                                : ''
                                                        }
                                                    )}
                                                </span>
                                            </div>
                                        );
                                    }
                                    if (ability.parameter === 'maxhp') {
                                        return (
                                            <div
                                                key={`maxhp-${index}`}
                                                className='flex text-sm sm:text-base md:text-lg gap-1'
                                            >
                                                <HeartPlus
                                                    size={14}
                                                    className='text-muted-foreground mt-0.5 sm:mt-1.5 md:mt-2'
                                                />
                                                <span>
                                                    {t('skill-node.maxhp', {
                                                        result:
                                                            ability.add &&
                                                            ability.add >= 0
                                                                ? '+'
                                                                : '',
                                                        maxhp: ability.add || 0,
                                                        duration:
                                                            levelData.duration ||
                                                            0,
                                                        rate: ability.rate
                                                            ? '%'
                                                            : ''
                                                    })}
                                                </span>
                                            </div>
                                        );
                                    }
                                    if (ability.parameter === 'speed') {
                                        return (
                                            <div
                                                key={`speed-${index}`}
                                                className='flex text-sm sm:text-base md:text-lg gap-1'
                                            >
                                                <Footprints
                                                    size={14}
                                                    className='text-muted-foreground mt-0.5 sm:mt-1.5 md:mt-2'
                                                />
                                                <span>
                                                    {t('skill-node.speed', {
                                                        result:
                                                            ability.add &&
                                                            ability.add >= 0
                                                                ? '+'
                                                                : '',
                                                        speed: ability.add || 0,
                                                        duration:
                                                            levelData.duration ||
                                                            0,
                                                        rate: ability.rate
                                                            ? '%'
                                                            : ''
                                                    })}
                                                </span>
                                            </div>
                                        );
                                    }
                                    if (ability.parameter === 'str') {
                                        return (
                                            <div
                                                key={`str-${index}`}
                                                className='flex text-sm sm:text-base md:text-lg gap-1'
                                            >
                                                <BicepsFlexed
                                                    size={14}
                                                    className='text-muted-foreground mt-0.5 sm:mt-1.5 md:mt-2'
                                                />
                                                <span>
                                                    {t('skill-node.str', {
                                                        result:
                                                            ability.add &&
                                                            ability.add >= 0
                                                                ? '+'
                                                                : '',
                                                        str: ability.add || 0,
                                                        duration:
                                                            levelData.duration ||
                                                            0,
                                                        rate: ability.rate
                                                            ? '%'
                                                            : ''
                                                    })}
                                                </span>
                                            </div>
                                        );
                                    }
                                    if (ability.parameter === 'sta') {
                                        return (
                                            <div
                                                key={`sta-${index}`}
                                                className='flex text-sm sm:text-base md:text-lg gap-1'
                                            >
                                                <Beef
                                                    size={14}
                                                    className='text-muted-foreground mt-0.5 sm:mt-1.5 md:mt-2'
                                                />
                                                <span>
                                                    {t('skill-node.sta', {
                                                        result:
                                                            ability.add &&
                                                            ability.add >= 0
                                                                ? '+'
                                                                : '',
                                                        sta: ability.add || 0,
                                                        duration:
                                                            levelData.duration ||
                                                            0,
                                                        rate: ability.rate
                                                            ? '%'
                                                            : ''
                                                    })}
                                                </span>
                                            </div>
                                        );
                                    }
                                    if (ability.parameter === 'int') {
                                        return (
                                            <div
                                                key={`int-${index}`}
                                                className='flex text-sm sm:text-base md:text-lg gap-1'
                                            >
                                                <Brain
                                                    size={14}
                                                    className='text-muted-foreground mt-0.5 sm:mt-1.5 md:mt-2'
                                                />
                                                <span>
                                                    {t('skill-node.int', {
                                                        result:
                                                            ability.add &&
                                                            ability.add >= 0
                                                                ? '+'
                                                                : '',
                                                        int: ability.add || 0,
                                                        duration:
                                                            levelData.duration ||
                                                            0,
                                                        rate: ability.rate
                                                            ? '%'
                                                            : ''
                                                    })}
                                                </span>
                                            </div>
                                        );
                                    }
                                    if (ability.parameter === 'dex') {
                                        return (
                                            <div
                                                key={`dex-${index}`}
                                                className='flex text-sm sm:text-base md:text-lg gap-1'
                                            >
                                                <Atom
                                                    size={14}
                                                    className='text-muted-foreground mt-0.5 sm:mt-1.5 md:mt-2'
                                                />
                                                <span>
                                                    {t('skill-node.dex', {
                                                        result:
                                                            ability.add &&
                                                            ability.add >= 0
                                                                ? '+'
                                                                : '',
                                                        dex: ability.add || 0,
                                                        duration:
                                                            levelData.duration ||
                                                            0,
                                                        rate: ability.rate
                                                            ? '%'
                                                            : ''
                                                    })}
                                                </span>
                                            </div>
                                        );
                                    }
                                    if (ability.parameter === 'attackspeed') {
                                        return (
                                            <div
                                                key={`attackspeed-${index}`}
                                                className='flex text-sm sm:text-base md:text-lg gap-1'
                                            >
                                                <ChevronsUp
                                                    size={14}
                                                    className='text-muted-foreground mt-0.5 sm:mt-1.5 md:mt-2'
                                                />
                                                <span>
                                                    {t(
                                                        'skill-node.attack-speed',
                                                        {
                                                            result:
                                                                ability.add &&
                                                                ability.add >= 0
                                                                    ? '+'
                                                                    : '',
                                                            attackSpeed:
                                                                ability.add ||
                                                                0,
                                                            duration:
                                                                levelData.duration ||
                                                                0,
                                                            rate: ability.rate
                                                                ? '%'
                                                                : ''
                                                        }
                                                    )}
                                                </span>
                                            </div>
                                        );
                                    }
                                    if (
                                        ability.parameter ===
                                        'decreasedcastingtime'
                                    ) {
                                        return (
                                            <div
                                                key={`decreased-casting-time-${index}`}
                                                className='flex text-sm sm:text-base md:text-lg gap-1'
                                            >
                                                <Loader
                                                    size={14}
                                                    className='text-muted-foreground mt-0.5 sm:mt-1.5 md:mt-2'
                                                />
                                                <span>
                                                    {t(
                                                        'skill-node.decreased-casting-time',
                                                        {
                                                            result:
                                                                ability.add &&
                                                                ability.add >= 0
                                                                    ? '+'
                                                                    : '',
                                                            castingTime:
                                                                ability.add ||
                                                                0,
                                                            duration:
                                                                levelData.duration ||
                                                                0,
                                                            rate: ability.rate
                                                                ? '%'
                                                                : ''
                                                        }
                                                    )}
                                                </span>
                                            </div>
                                        );
                                    }
                                    if (ability.parameter === 'block') {
                                        return (
                                            <div
                                                key={`block-${index}`}
                                                className='flex text-sm sm:text-base md:text-lg gap-1'
                                            >
                                                <Shield
                                                    size={14}
                                                    className='text-muted-foreground mt-0.5 sm:mt-1.5 md:mt-2'
                                                />
                                                <span>
                                                    {t('skill-node.block', {
                                                        result:
                                                            ability.add &&
                                                            ability.add >= 0
                                                                ? '+'
                                                                : '',
                                                        block: ability.add || 0,
                                                        duration:
                                                            levelData.duration ||
                                                            0,
                                                        rate: ability.rate
                                                            ? '%'
                                                            : ''
                                                    })}
                                                </span>
                                            </div>
                                        );
                                    }
                                    if (ability.parameter === 'rangedblock') {
                                        return (
                                            <div
                                                key={`ranged-block-${index}`}
                                                className='flex text-sm sm:text-base md:text-lg gap-1'
                                            >
                                                <Shield
                                                    size={14}
                                                    className='text-muted-foreground mt-0.5 sm:mt-1.5 md:mt-2'
                                                />
                                                <span>
                                                    {t(
                                                        'skill-node.ranged-block',
                                                        {
                                                            result:
                                                                ability.add &&
                                                                ability.add >= 0
                                                                    ? '+'
                                                                    : '',
                                                            rangedBlock:
                                                                ability.add ||
                                                                0,
                                                            duration:
                                                                levelData.duration ||
                                                                0,
                                                            rate: ability.rate
                                                                ? '%'
                                                                : ''
                                                        }
                                                    )}
                                                </span>
                                            </div>
                                        );
                                    }
                                    if (ability.parameter === 'magicdefense') {
                                        return (
                                            <div
                                                key={`magic-defense-${index}`}
                                                className='flex text-sm sm:text-base md:text-lg gap-1'
                                            >
                                                <ShieldHalf
                                                    size={14}
                                                    className='text-muted-foreground mt-0.5 sm:mt-1.5 md:mt-2'
                                                />
                                                <span>
                                                    {t(
                                                        'skill-node.magic-defense',
                                                        {
                                                            result:
                                                                ability.add &&
                                                                ability.add >= 0
                                                                    ? '+'
                                                                    : '',
                                                            magicDefense:
                                                                ability.add ||
                                                                0,
                                                            duration:
                                                                levelData.duration ||
                                                                0,
                                                            rate: ability.rate
                                                                ? '%'
                                                                : ''
                                                        }
                                                    )}
                                                </span>
                                            </div>
                                        );
                                    }
                                    if (ability.parameter === 'def') {
                                        return (
                                            <div
                                                key={`def-${index}`}
                                                className='flex text-sm sm:text-base md:text-lg gap-1'
                                            >
                                                <Shield
                                                    size={14}
                                                    className='text-muted-foreground mt-0.5 sm:mt-1.5 md:mt-2'
                                                />
                                                <span>
                                                    {t('skill-node.def', {
                                                        result:
                                                            ability.add &&
                                                            ability.add >= 0
                                                                ? '+'
                                                                : '',
                                                        def: ability.add || 0,
                                                        duration:
                                                            levelData.duration ||
                                                            0,
                                                        rate: ability.rate
                                                            ? '%'
                                                            : ''
                                                    })}
                                                </span>
                                            </div>
                                        );
                                    }
                                    if (
                                        ability.parameter === 'criticaldamage'
                                    ) {
                                        return (
                                            <div
                                                key={`criticaldamage-${index}`}
                                                className='flex text-sm sm:text-base md:text-lg gap-1'
                                            >
                                                <Sparkles
                                                    size={14}
                                                    className='text-muted-foreground mt-0.5 sm:mt-1.5 md:mt-2'
                                                />
                                                <span>
                                                    {t(
                                                        'skill-node.critical-damage',
                                                        {
                                                            result:
                                                                ability.add &&
                                                                ability.add >= 0
                                                                    ? '+'
                                                                    : '',
                                                            criticalDamage:
                                                                ability.add,
                                                            rate: ability.rate
                                                                ? '%'
                                                                : ''
                                                        }
                                                    )}
                                                </span>
                                            </div>
                                        );
                                    }
                                    if (
                                        ability.parameter === 'criticalchance'
                                    ) {
                                        return (
                                            <div
                                                key={`criticalchance-${index}`}
                                                className='flex text-sm sm:text-base md:text-lg gap-1'
                                            >
                                                <Crosshair
                                                    size={14}
                                                    className='text-muted-foreground mt-0.5 sm:mt-1.5 md:mt-2'
                                                />
                                                <span>
                                                    {t(
                                                        'skill-node.critical-chance',
                                                        {
                                                            result:
                                                                ability.add &&
                                                                ability.add >= 0
                                                                    ? '+'
                                                                    : '',
                                                            criticalChance:
                                                                ability.add,
                                                            rate: ability.rate
                                                                ? '%'
                                                                : ''
                                                        }
                                                    )}
                                                </span>
                                            </div>
                                        );
                                    }
                                    if (
                                        ability.parameter === 'blockpenetration'
                                    ) {
                                        return (
                                            <div
                                                key={`blockpenetration-${index}`}
                                                className='flex text-sm sm:text-base md:text-lg gap-1'
                                            >
                                                <Crosshair
                                                    size={14}
                                                    className='text-muted-foreground mt-0.5 sm:mt-1.5 md:mt-2'
                                                />
                                                <span>
                                                    {t(
                                                        'skill-node.block-penetration',
                                                        {
                                                            result:
                                                                ability.add &&
                                                                ability.add >= 0
                                                                    ? '+'
                                                                    : '',
                                                            blockPenetration:
                                                                ability.add,
                                                            rate: ability.rate
                                                                ? '%'
                                                                : ''
                                                        }
                                                    )}
                                                </span>
                                            </div>
                                        );
                                    }
                                    if (ability.parameter === 'swordattack') {
                                        return (
                                            <div
                                                key={`sword-attack-${index}`}
                                                className='flex text-sm sm:text-base md:text-lg gap-1'
                                            >
                                                <Sword
                                                    size={14}
                                                    className='text-muted-foreground mt-0.5 sm:mt-1.5 md:mt-2'
                                                />
                                                <span>
                                                    {t(
                                                        'skill-node.sword-attack',
                                                        {
                                                            result:
                                                                ability.add &&
                                                                ability.add >= 0
                                                                    ? '+'
                                                                    : '',
                                                            swordAttack:
                                                                ability.add,
                                                            rate: ability.rate
                                                                ? '%'
                                                                : '',
                                                            duration:
                                                                levelData.duration
                                                        }
                                                    )}
                                                </span>
                                            </div>
                                        );
                                    }
                                    if (ability.parameter === 'axeattack') {
                                        return (
                                            <div
                                                key={`axe-attack-${index}`}
                                                className='flex text-sm sm:text-base md:text-lg gap-1'
                                            >
                                                <Axe
                                                    size={14}
                                                    className='text-muted-foreground mt-0.5 sm:mt-1.5 md:mt-2'
                                                />
                                                <span>
                                                    {t(
                                                        'skill-node.axe-attack',
                                                        {
                                                            result:
                                                                ability.add &&
                                                                ability.add >= 0
                                                                    ? '+'
                                                                    : '',
                                                            axeAttack:
                                                                ability.add,
                                                            rate: ability.rate
                                                                ? '%'
                                                                : '',
                                                            duration:
                                                                levelData.duration
                                                        }
                                                    )}
                                                </span>
                                            </div>
                                        );
                                    }
                                    if (ability.parameter === 'hitrate') {
                                        return (
                                            <div
                                                key={`hitrate-${index}`}
                                                className='flex text-sm sm:text-base md:text-lg gap-1'
                                            >
                                                <Crosshair
                                                    size={14}
                                                    className='text-muted-foreground mt-0.5 sm:mt-1.5 md:mt-2'
                                                />
                                                <span>
                                                    {t('skill-node.hit-rate', {
                                                        result:
                                                            ability.add &&
                                                            ability.add >= 0
                                                                ? '+'
                                                                : '',
                                                        hitRate: ability.add,
                                                        rate: ability.rate
                                                            ? '%'
                                                            : '',
                                                        duration:
                                                            levelData.duration
                                                    })}
                                                </span>
                                            </div>
                                        );
                                    }
                                    if (ability.parameter === 'elementattack') {
                                        return (
                                            <div
                                                key={`element-attack-${index}`}
                                                className='flex text-sm sm:text-base md:text-lg gap-1'
                                            >
                                                <Atom
                                                    size={14}
                                                    className='text-muted-foreground mt-0.5 sm:mt-1.5 md:mt-2'
                                                />
                                                <span>
                                                    {t(
                                                        'skill-node.element-attack',
                                                        {
                                                            result:
                                                                ability.add &&
                                                                ability.add >= 0
                                                                    ? '+'
                                                                    : '',
                                                            elementAttack:
                                                                ability.add,
                                                            rate: ability.rate
                                                                ? '%'
                                                                : '',
                                                            duration:
                                                                levelData.duration
                                                        }
                                                    )}
                                                </span>
                                            </div>
                                        );
                                    }
                                    return null;
                                })}
                            </>
                        )}
                        <div className='text-muted-foreground mt-1'>
                            {data.skillData.description
                                ? getSkillDescription(
                                      data.skillData.description
                                  )
                                : t('skill-node.no-description')}
                        </div>
                        <Separator className='my-2' />
                        <span className='flex text-muted-foreground'>
                            <MousePointerClick size={16} className='mx-1' />
                            {t('skill-node.click-to-hold')}
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
                        scale:
                            currentLevel ===
                            (data.skillData.levels?.length || 0)
                                ? 1
                                : 0.8
                    }}
                    aria-label={`Set skill to max level for ${getSkillName(data.skillData.name)}`}
                    disabled={
                        skillPoints < (data.skillData.skillPoints || 1) ||
                        characterLevel < (data.skillData.level || 0) ||
                        currentLevel === levels.length ||
                        !canUpgrade()
                    }
                    className='flex items-center justify-center'
                >
                    <ChevronsUp
                        size={16}
                        className={`${
                            skillPoints < (data.skillData.skillPoints || 1) ||
                            characterLevel < (data.skillData.level || 0) ||
                            currentLevel === levels.length ||
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
                        aria-label={`Increase skill level for ${getSkillName(data.skillData.name)}`}
                        disabled={
                            skillPoints < (data.skillData.skillPoints || 1) ||
                            characterLevel < (data.skillData.level || 0) ||
                            currentLevel === levels.length ||
                            !canUpgrade()
                        }
                        className={`rounded-tl-[3px] rounded-bl-[3px] bg-primary text-primary-foreground ${
                            skillPoints < (data.skillData.skillPoints || 1) ||
                            characterLevel < (data.skillData.level || 0) ||
                            currentLevel === levels.length ||
                            !canUpgrade()
                                ? 'opacity-20 cursor-not-allowed'
                                : 'hover:bg-primary/80 hover:text-primary-foreground/80 group'
                        }`}
                    >
                        <Plus
                            size={18}
                            className='group-hover:scale-90 transition-all'
                        />
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            decreaseLevel();
                        }}
                        onMouseEnter={(e) => e.stopPropagation()}
                        onMouseLeave={(e) => e.stopPropagation()}
                        aria-label={`Decrease skill level for ${getSkillName(data.skillData.name)}`}
                        disabled={currentLevel === 0}
                        className={`rounded-tr-[3px] rounded-br-[3px] bg-destructive text-destructive-foreground ${
                            currentLevel === 0
                                ? 'opacity-20 cursor-not-allowed'
                                : 'hover:bg-destructive/80 hover:text-destructive-foreground/80 group'
                        }`}
                    >
                        <Minus
                            size={18}
                            className='group-hover:scale-90 transition-all'
                        />
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
                    aria-label={`Reset skill to level 0 for ${getSkillName(data.skillData.name)}`}
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

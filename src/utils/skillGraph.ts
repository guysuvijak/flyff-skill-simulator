// Next.js 15 - src/utils/skillGraph.ts
import { calculateSkillPoints } from '@/utils/calculateSkillPoints';

interface SkillGraphRequirement {
    skill: number;
    level: number;
}

interface SkillGraphData {
    id: number;
    requirements?: SkillGraphRequirement[];
    levels?: unknown[];
    level?: number;
    skillPoints?: number;
}

export interface PrerequisiteUpdate {
    skillId: number;
    fromLevel: number;
    toLevel: number;
    pointsPerLevel: number;
}

export interface PrerequisitePlan {
    updates: PrerequisiteUpdate[];
    totalPointsNeeded: number;
    /** Minimum character level required by the target skill and its prerequisites. */
    minCharacterLevel: number;
}

/**
 * Finds the lowest character level in [minLevel, maxLevel] that yields at least
 * `requiredAvailablePoints` free SP after subtracting already-spent points.
 */
export function findMinimumLevelForAvailablePoints(
    requiredAvailablePoints: number,
    currentUsedPoints: number,
    job: number,
    parent: number,
    minLevel: number,
    maxLevel: number
): number | null {
    const startLevel = Math.max(1, Math.min(minLevel, maxLevel));
    for (let level = startLevel; level <= maxLevel; level++) {
        const totalPoints = calculateSkillPoints(level, job, parent);
        if (totalPoints - currentUsedPoints >= requiredAvailablePoints) {
            return level;
        }
    }
    return null;
}

/**
 * Resolves the minimum level every ancestor of `targetSkillId` must reach to
 * satisfy that skill's requirement chain, in an order safe to apply
 * sequentially (a skill's own prerequisites always precede it).
 */
export function computeRaisePrerequisitesPlan(
    targetSkillId: number,
    skillsById: Record<number, SkillGraphData>,
    skillLevels: Record<number, { level: number; points: number }>
): PrerequisitePlan {
    const requiredLevel = new Map<number, number>();
    const visiting = new Set<number>();
    const ordered = new Set<number>();
    const order: number[] = [];

    const visit = (skillId: number, neededLevel: number) => {
        const skill = skillsById[skillId];
        if (!skill) {
            return;
        }

        requiredLevel.set(
            skillId,
            Math.max(requiredLevel.get(skillId) ?? 0, neededLevel)
        );

        if (visiting.has(skillId) || ordered.has(skillId)) {
            return;
        }
        visiting.add(skillId);

        (skill.requirements || []).forEach((req) =>
            visit(req.skill, req.level)
        );

        visiting.delete(skillId);
        ordered.add(skillId);
        order.push(skillId);
    };

    const target = skillsById[targetSkillId];
    (target?.requirements || []).forEach((req) => visit(req.skill, req.level));

    const updates: PrerequisiteUpdate[] = [];
    let totalPointsNeeded = 0;
    let minCharacterLevel = target?.level ?? 1;

    order.forEach((skillId) => {
        const skill = skillsById[skillId];
        const fromLevel = skillLevels[skillId]?.level ?? 0;
        const needed = requiredLevel.get(skillId) ?? fromLevel;
        const toLevel = Math.min(needed, skill.levels?.length ?? needed);

        minCharacterLevel = Math.max(minCharacterLevel, skill.level ?? 1);

        if (toLevel > fromLevel) {
            const pointsPerLevel = skill.skillPoints ?? 1;
            updates.push({ skillId, fromLevel, toLevel, pointsPerLevel });
            totalPointsNeeded += (toLevel - fromLevel) * pointsPerLevel;
        }
    });

    return { updates, totalPointsNeeded, minCharacterLevel };
}

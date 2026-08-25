// Next.js 15 - src/utils/skillGraph.ts

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
    blockedByCharacterLevel: number[];
}

/**
 * Resolves the minimum level every ancestor of `targetSkillId` must reach to
 * satisfy that skill's requirement chain, in an order safe to apply
 * sequentially (a skill's own prerequisites always precede it).
 */
export function computeRaisePrerequisitesPlan(
    targetSkillId: number,
    skillsById: Record<number, SkillGraphData>,
    skillLevels: Record<number, { level: number; points: number }>,
    characterLevel: number
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
    const blockedByCharacterLevel: number[] = [];
    let totalPointsNeeded = 0;

    order.forEach((skillId) => {
        const skill = skillsById[skillId];
        const fromLevel = skillLevels[skillId]?.level ?? 0;
        const target = requiredLevel.get(skillId) ?? fromLevel;
        const toLevel = Math.min(target, skill.levels?.length ?? target);

        if (toLevel > fromLevel) {
            if (characterLevel < (skill.level ?? 0)) {
                blockedByCharacterLevel.push(skillId);
            }
            const pointsPerLevel = skill.skillPoints ?? 1;
            updates.push({ skillId, fromLevel, toLevel, pointsPerLevel });
            totalPointsNeeded += (toLevel - fromLevel) * pointsPerLevel;
        }
    });

    return { updates, totalPointsNeeded, blockedByCharacterLevel };
}

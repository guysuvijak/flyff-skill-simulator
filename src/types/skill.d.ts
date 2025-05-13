// Next.js 15 - src/types/skill.d.ts
interface SkillLevel {
    level: number;
    points: number;
}

export interface SkillState {
    skillLevels: Record<number, SkillLevel>;
    updateSkillLevel: (skillId: number, level: number, points: number) => void;
    resetSkillLevels: () => void;
}

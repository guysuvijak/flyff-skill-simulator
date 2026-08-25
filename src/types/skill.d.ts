// Next.js 15 - src/types/skill.d.ts
interface SkillLevel {
    level: number;
    points: number;
}

export interface SkillRequirement {
    skill: number;
    level: number;
}

export interface SkillData {
    id: number;
    requirements?: SkillRequirement[];
    levels?: unknown[];
    level?: number;
    skillPoints?: number;
}

export interface SkillState {
    skillLevels: Record<number, SkillLevel>;
    updateSkillLevel: (skillId: number, level: number, points: number) => void;
    resetSkillLevels: () => void;
    skillsById: Record<number, SkillData>;
    setSkillsById: (skills: SkillData[]) => void;
}

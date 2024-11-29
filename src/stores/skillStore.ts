import { create } from 'zustand';

interface SkillState {
    skillLevels: Record<string, number>;
    updateSkillLevel: (skillId: string, level: number) => void;
}

export const useSkillStore = create<SkillState>((set) => ({
    skillLevels: {},
    updateSkillLevel: (skillId, level) =>
        set((state) => {
            if (!skillId) {
                return state;
            }
            return {
                skillLevels: { ...state.skillLevels, [skillId]: level },
            };
        }),
}));
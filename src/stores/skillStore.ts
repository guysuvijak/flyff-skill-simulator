import { create } from 'zustand';

interface SkillState {
    skillLevels: Record<
        string,
        {
            level: number;
            points: number;
        }
    >;
    updateSkillLevel: (skillId: string, level: number, points: number) => void;
    resetSkillLevels: () => void;
}

export const useSkillStore = create<SkillState>((set) => ({
    skillLevels: {},
    updateSkillLevel: (skillId, level, points) =>
        set((state) => {
            if (!skillId) {
                return state;
            }
            return {
                skillLevels: {
                    ...state.skillLevels,
                    [skillId]: {
                        level,
                        points,
                    },
                },
            };
        }),
    resetSkillLevels: () =>
        set(() => ({
            skillLevels: {}
        })),
}));
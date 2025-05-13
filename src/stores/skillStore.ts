// Next.js 15 - src/stores/skillStore.ts
import { create } from 'zustand';
import { SkillState } from '@/types/skill';

export const useSkillStore = create<SkillState>((set) => ({
    skillLevels: {},
    updateSkillLevel: (skillId, level, points) =>
        set((state) => {
            if (skillId === undefined || skillId === null) {
                return state;
            }
            return {
                skillLevels: {
                    ...state.skillLevels,
                    [skillId]: {
                        level,
                        points
                    }
                }
            };
        }),
    resetSkillLevels: () =>
        set(() => ({
            skillLevels: {}
        }))
}));

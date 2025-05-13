// Next.js 15 - src/stores/characterStore.ts
import { create } from 'zustand';

interface CharacterState {
    characterLevel: number;
    setCharacterLevel: (level: number) => void;
    skillPoints: number;
    setSkillPoints: (point: number) => void;
    updateCharacter: (data: Partial<CharacterState>) => void;
}

export const useCharacterStore = create<CharacterState>((set) => ({
    characterLevel: 15,
    setCharacterLevel: (level) => set({ characterLevel: level }),
    skillPoints: 30,
    setSkillPoints: (point) => set({ skillPoints: point }),
    updateCharacter: (data) => set((state) => ({ ...state, ...data }))
}));

// Next.js 15 - src/stores/websiteStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type SkillStyleType = 'colored' | 'old';

interface WebsiteState {
    colorTheme: string;
    setColorTheme: (colorTheme: string) => void;
    skillStyle: SkillStyleType;
    setSkillStyle: (skillStyle: SkillStyleType) => void;
}

export const useWebsiteStore = create<WebsiteState>()(
    persist(
        (set) => ({
            colorTheme: 'default',
            setColorTheme: (colorTheme) => set({ colorTheme }),
            skillStyle: 'colored',
            setSkillStyle: (state) => set({ skillStyle: state })
        }),
        { name: 'flyff-website-store' }
    )
);

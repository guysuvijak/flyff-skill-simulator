// Next.js 15 - src/stores/websiteStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type SkillStyleType = 'colored' | 'old';

interface WebsiteState {
    lang: string;
    colorTheme: string;
    skillStyle: SkillStyleType;
    setLang: (lang: string) => void;
    setColorTheme: (colorTheme: string) => void;
    setSkillStyle: (skillStyle: SkillStyleType) => void;
}

export const useWebsiteStore = create<WebsiteState>()(
    persist(
        (set) => ({
            lang: 'en',
            colorTheme: 'default',
            skillStyle: 'colored',
            setLang: (lang) => set({ lang }),
            setColorTheme: (colorTheme) => set({ colorTheme }),
            setSkillStyle: (state) => set({ skillStyle: state })
        }),
        { name: 'flyff-website-store' }
    )
);

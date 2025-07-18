// Next.js 15 - src/stores/websiteStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import pkg from '../../package.json';

type SkillStyleType = 'colored' | 'old';

interface WebsiteState {
    lang: string;
    colorTheme: string;
    skillStyle: SkillStyleType;
    latestVersion: string;
    updatedDialog: boolean;
    setLang: (lang: string) => void;
    setColorTheme: (colorTheme: string) => void;
    setSkillStyle: (skillStyle: SkillStyleType) => void;
    setLatestVersion: (latestVersion: string) => void;
    setUpdatedDialog: (updatedDialog: boolean) => void;
}

export const useWebsiteStore = create<WebsiteState>()(
    persist(
        (set) => ({
            lang: 'en',
            colorTheme: 'default',
            skillStyle: 'colored',
            latestVersion: pkg.version,
            updatedDialog: false,
            setLang: (lang) => set({ lang }),
            setColorTheme: (colorTheme) => set({ colorTheme }),
            setSkillStyle: (state) => set({ skillStyle: state }),
            setLatestVersion: (latestVersion) => set({ latestVersion }),
            setUpdatedDialog: (updatedDialog) => set({ updatedDialog })
        }),
        { name: 'flyff-website-store' }
    )
);

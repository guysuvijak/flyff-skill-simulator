// Next.js 15 - src/stores/websiteStore.ts
import { create } from 'zustand';

type SkillStyleType = 'colored' | 'old';

interface WebsiteState {
    guidePanelVisible: boolean;
    setGuidePanelVisible: (level: boolean) => void;
    skillStyle: SkillStyleType;
    setSkillStyle: (skillStyle: SkillStyleType) => void;
}

export const useWebsiteStore = create<WebsiteState>((set) => ({
    guidePanelVisible: false,
    setGuidePanelVisible: (state) => set({ guidePanelVisible: state }),
    skillStyle: 'colored',
    setSkillStyle: (state) => set({ skillStyle: state })
}));

import { create } from 'zustand';

interface WebsiteState {
    guidePanelVisible: boolean;
    setGuidePanelVisible: (level: boolean) => void;
}

export const useWebsiteStore = create<WebsiteState>((set) => ({
    guidePanelVisible: false,
    setGuidePanelVisible: (state) => set({ guidePanelVisible: state })
}));
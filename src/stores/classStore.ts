import { create } from 'zustand';

interface ClassStore {
    selectedClass: any;
    setSelectedClass: (classData: any) => void;
}

export const useClassStore = create<ClassStore>((set) => ({
    selectedClass: {id: 9686},
    setSelectedClass: (classData) => set({ selectedClass: classData }),
}));
import { create } from 'zustand';
import { ClassData, ClassStore } from '@/types/class';

const selectClassInitial: ClassData = {
    "id": 2246,
        "name": {
            "en": "Blade",
            "ar": "سفاح",
            "br": "Blade",
            "cns": "刀锋战士",
            "de": "Blade",
            "fi": "Blade",
            "fil": "Blade",
            "fr": "Assassin",
            "id": "Blade",
            "it": "Blade",
            "jp": "ブレード",
            "kr": "블레이드",
            "nl": "Blade",
            "pl": "Tancerz Ostrza",
            "ru": "Фехтовальщик",
            "sp": "Blade",
            "sw": "Blade",
            "th": "Blade",
            "tw": "暗殺者",
            "vi": "Blade"
        },
        "type": "professional",
        "tree": "Blade.png",
        "parent": 764,
        "icon": "blade.png",
        "minLevel": 60,
        "maxLevel": 165,
        "hp": 1.5,
        "maxHP": "150+level*30+sta*level*0.3",
        "fp": 1.2,
        "maxFP": "level*2.4+sta*8.400001",
        "mp": 0.6,
        "maxMP": "22+level*1.2+int*5.4",
        "attackSpeed": 87,
        "block": 1.2,
        "critical": 1,
        "autoAttackFactors": {
            "sword": 4.7,
            "axe": 5.7,
            "staff": 0.8,
            "stick": 4,
            "knuckle": 5,
            "yoyo": 4.2,
            "bow": 2.8,
            "wand": 5.5
        }
};

export const useClassStore = create<ClassStore>((set) => ({
    selectedClass: selectClassInitial,
    setSelectedClass: (classData) => set({ selectedClass: classData }),
}));
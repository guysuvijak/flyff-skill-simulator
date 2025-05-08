export interface LanguageNames {
    en: string;
    ar: string;
    br: string;
    cns: string;
    de: string;
    fi: string;
    fil: string;
    fr: string;
    id: string;
    it: string;
    jp: string;
    kr: string;
    nl: string;
    pl: string;
    ru: string;
    sp: string;
    sw: string;
    th: string;
    tw: string;
    vi: string;
}

export interface AutoAttackFactors {
    sword?: number;
    axe?: number;
    staff?: number;
    stick?: number;
    knuckle?: number;
    yoyo?: number;
    bow?: number;
    wand?: number;
}

export interface ClassData {
    id: number;
    name: LanguageNames;
    type: 'professional' | 'basic';
    tree: string;
    parent: number;
    icon: string;
    minLevel: number;
    maxLevel: number;
    hp: number;
    maxHP: string;
    fp: number;
    maxFP: string;
    mp: number;
    maxMP: string;
    attackSpeed: number;
    block: number;
    critical: number;
    autoAttackFactors: AutoAttackFactors;
}

export interface ClassStore {
    selectedClass: ClassData;
    setSelectedClass: (classData: ClassData) => void;
}

import { useSkillStore } from '@/stores/skillStore';

type JobBonus = {
    [key: string]: number;
};

type LevelRange = {
    start: number;
    end: number;
    pointsPerLevel: number;
};

const levelRanges: LevelRange[] = [
    { start: 1, end: 20, pointsPerLevel: 2 },
    { start: 21, end: 40, pointsPerLevel: 3 },
    { start: 41, end: 60, pointsPerLevel: 4 },
    { start: 61, end: 80, pointsPerLevel: 5 },
    { start: 81, end: 100, pointsPerLevel: 6 },
    { start: 101, end: 120, pointsPerLevel: 7 },
    { start: 121, end: 140, pointsPerLevel: 8 },
    { start: 141, end: 150, pointsPerLevel: 1 },
    { start: 151, end: 165, pointsPerLevel: 2 }
];

const jobBonuses: JobBonus = {
    9686: 0, //Vagrant
    9098: 50, //Acrobat
    8962: 60, //Assist
    9581: 90, //Magician
    764: 40, //Mercenary
    3545: 100, //Jester
    9295: 100, //Ranger
    7424: 120, //Billposter
    9389: 100, //Ringmaster
    9150: 300, //Elementor
    5709: 90, //Psykeeper
    2246: 80, //Blade
    5330: 80 //Knight
};

export function calculateSkillPoints(
    level: number,
    job: number,
    parent: number
): number {
    let pointsFromLevel = -2;

    for (const range of levelRanges) {
        if (level >= range.start) {
            const levelsInRange = Math.min(level, range.end) - range.start + 1;
            pointsFromLevel += levelsInRange * range.pointsPerLevel;
        }
    }

    let totalBonus = 0;
    if (level >= 60) {
        totalBonus = (jobBonuses[job] || 0) + (jobBonuses[parent] || 0);
    } else {
        totalBonus = jobBonuses[parent] || 0;
    }
    return pointsFromLevel + totalBonus;
}

export function calculateTotalPointsUsed() {
    const { skillLevels } = useSkillStore.getState();
    let totalPointUsed = 0;

    Object.entries(skillLevels).forEach(([skillId, skillData]) => {
        const pointsUsedForSkill = skillData.level * skillData.points;
        totalPointUsed += pointsUsedForSkill;
    });

    return totalPointUsed;
}

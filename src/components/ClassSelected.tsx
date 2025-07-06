// Next.js 15 - src/components/ClassSelected.tsx
'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useClassStore } from '@/stores/classStore';
import { useCharacterStore } from '@/stores/characterStore';
import { useSkillStore } from '@/stores/skillStore';
import { useClassName } from '@/hooks/useClassName';
import { calculateSkillPoints } from '@/utils/calculateSkillPoints';
import { getCachedClassIconUrl } from '@/utils/imageUtils';
import { ClassData } from '@/types/class';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

// Static class data - will be loaded via fetch

export const ClassSelected = () => {
    const { t } = useTranslation();
    const [class2Data, setClass2Data] = useState<ClassData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { selectedClass, setSelectedClass } = useClassStore();
    const { characterLevel, setSkillPoints } = useCharacterStore();
    const { resetSkillLevels } = useSkillStore();
    const { getClassName } = useClassName();

    useEffect(() => {
        const loadClassData = async () => {
            try {
                setIsLoading(true);

                // Fetch static class data from public folder
                const response = await fetch('/data/classall.json');
                if (!response.ok) {
                    throw new Error('Failed to load class data');
                }

                const allClassData: ClassData[] = await response.json();

                // Filter only professional classes from static data
                const professionalClasses = allClassData.filter(
                    (classItem: ClassData) => classItem.type === 'professional'
                );

                setClass2Data(professionalClasses);

                const bonusPoint = calculateSkillPoints(
                    characterLevel,
                    selectedClass.id,
                    selectedClass.parent
                );
                setSkillPoints(bonusPoint);
                resetSkillLevels();
                setIsLoading(false);
            } catch (error) {
                console.error('Error loading class data:', error);
                setIsLoading(false);
                alert('Error loading class data. Please refresh the page.');
            }
        };

        loadClassData();
    }, [
        characterLevel,
        selectedClass.id,
        selectedClass.parent,
        setSkillPoints,
        resetSkillLevels
    ]);

    const handleClassSelect = (classData: ClassData) => {
        setSelectedClass(classData);
    };

    return (
        <div className='w-full'>
            <Select
                value={selectedClass.id.toString()}
                onValueChange={(value) => {
                    const selectedClassData = class2Data.find(
                        (cls) => cls.id.toString() === value
                    );
                    if (selectedClassData) {
                        handleClassSelect(selectedClassData);
                    }
                }}
            >
                <SelectTrigger className='gap-2'>
                    <Image
                        src={getCachedClassIconUrl(selectedClass.icon)}
                        alt={getClassName(selectedClass.name) + '-class-icon'}
                        width={36}
                        height={36}
                        className='w-6 h-6'
                        quality={100}
                        style={{ objectFit: 'contain' }}
                        priority
                        draggable={false}
                    />
                    <SelectValue
                        placeholder={
                            isLoading
                                ? t('class-selected.loading')
                                : t('class-selected.select-class')
                        }
                    >
                        {getClassName(selectedClass.name)}
                    </SelectValue>
                </SelectTrigger>
                <SelectContent>
                    {isLoading ? (
                        <SelectItem value='loading' disabled>
                            <div className='flex items-center gap-2 text-muted-foreground'>
                                <Loader2 className='w-4 h-4 animate-spin' />
                                {t('class-selected.loading-classes')}
                            </div>
                        </SelectItem>
                    ) : (
                        class2Data.map((classData: ClassData) => (
                            <SelectItem
                                key={classData.id}
                                value={classData.id.toString()}
                            >
                                <div className='flex items-center gap-2'>
                                    <Image
                                        src={getCachedClassIconUrl(
                                            classData.icon
                                        )}
                                        alt={getClassName(classData.name)}
                                        width={40}
                                        height={40}
                                        className='w-6 h-6'
                                        priority
                                        draggable={false}
                                    />
                                    <span>{getClassName(classData.name)}</span>
                                </div>
                            </SelectItem>
                        ))
                    )}
                </SelectContent>
            </Select>
        </div>
    );
};

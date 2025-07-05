// Next.js 15 - src/components/ClassSelected.tsx
'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import axios from 'axios';
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

export const ClassSelected = () => {
    const [class2Data, setClass2Data] = useState<ClassData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { selectedClass, setSelectedClass } = useClassStore();
    const { characterLevel, setSkillPoints } = useCharacterStore();
    const { resetSkillLevels } = useSkillStore();
    const { getClassName } = useClassName();

    useEffect(() => {
        const getData = async () => {
            try {
                setIsLoading(true);
                const classApiResponse = await axios.get('/api/flyff/class');
                console.log('classApi', classApiResponse.data);
                
                if (classApiResponse.data.success) {
                    const allClassData = classApiResponse.data.data;1
                    
                    // Filter only professional classes
                    const professionalClasses = allClassData.filter((classItem: ClassData) => 
                        classItem.type === 'professional'
                    );
                    
                    setClass2Data(professionalClasses);
                } else {
                    throw new Error('Failed to fetch class data from API');
                }
                
                const bonusPoint = calculateSkillPoints(
                    characterLevel,
                    selectedClass.id,
                    selectedClass.parent
                );
                setSkillPoints(bonusPoint);
                resetSkillLevels();
                setIsLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                setIsLoading(false);
                alert('Error fetching class data. Please try again later.');
            }
        };

        getData();
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
        <div className="w-full">
            <Select value={selectedClass.id.toString()} onValueChange={(value) => {
                const selectedClassData = class2Data.find(cls => cls.id.toString() === value);
                if (selectedClassData) {
                    handleClassSelect(selectedClassData);
                }
            }}>
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
                    />
                    <SelectValue placeholder={isLoading ? 'Loading...' : 'Select a class'}>
                        {getClassName(selectedClass.name)}
                    </SelectValue>
                </SelectTrigger>
                <SelectContent>
                    {isLoading ? (
                        <SelectItem value="loading" disabled>
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <Loader2 className='w-4 h-4 animate-spin' />
                                Loading classes...
                            </div>
                        </SelectItem>
                    ) : (
                        class2Data.map((classData: ClassData) => (
                            <SelectItem key={classData.id} value={classData.id.toString()}>
                                <div className="flex items-center gap-2">
                                    <Image
                                        src={getCachedClassIconUrl(classData.icon)}
                                        alt={getClassName(classData.name)}
                                        width={40}
                                        height={40}
                                        className='w-6 h-6'
                                        priority
                                    />
                                    <span className="font-medium">{getClassName(classData.name)}</span>
                                </div>
                            </SelectItem>
                        ))
                    )}
                </SelectContent>
            </Select>
        </div>
    );
};

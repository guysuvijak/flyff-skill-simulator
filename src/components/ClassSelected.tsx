// Next.js 15 - src/components/ClassSelected.tsx
'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import axios from 'axios';
import { useClassStore } from '@/stores/classStore';
import { useCharacterStore } from '@/stores/characterStore';
import { useSkillStore } from '@/stores/skillStore';
import { calculateSkillPoints } from '@/utils/calculateSkillPoints';
import { ClassData } from '@/types/class';
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem
} from '@/components/ui/dropdown-menu';
import { ChevronDown } from 'lucide-react';

const ClassSelected = () => {
    const [class2Data, setClass2Data] = useState<ClassData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { selectedClass, setSelectedClass } = useClassStore();
    const { characterLevel, setSkillPoints } = useCharacterStore();
    const { resetSkillLevels } = useSkillStore();

    useEffect(() => {
        const getData = async () => {
            try {
                setIsLoading(true);
                const classDataResponse = await axios.get(
                    '/data/classall.json'
                );
                const classData = classDataResponse.data;

                const class2: ClassData[] = [];

                classData.forEach((classItem: ClassData) => {
                    if (classItem.type === 'professional') {
                        class2.push(classItem);
                    }
                });

                setClass2Data(class2);
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
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className='flex items-center w-full max-w-sm px-3 py-1 text-sm font-medium text-foreground border border-border rounded-md shadow-sm focus:ring-ring focus:border-ring hover:bg-accent'>
                    <Image
                        src={`https://api.flyff.com/image/class/messenger/${selectedClass.icon}`}
                        alt={selectedClass.name.en + '-class-icon'}
                        width={36}
                        height={36}
                        className='w-6 h-6 mr-2'
                        quality={100}
                        style={{ objectFit: 'contain' }}
                        priority
                    />
                    <span className='flex gap-1 items-center'>
                        {selectedClass?.name?.en ||
                            (isLoading ? 'Loading...' : 'Select a class')}
                        <ChevronDown size={16} />
                    </span>
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className='w-80 sm:w-full max-h-60 overflow-y-auto bg-background border-border'>
                {isLoading ? (
                    <DropdownMenuItem
                        disabled
                        className='text-muted-foreground px-2 py-1'
                    >
                        Loading...
                    </DropdownMenuItem>
                ) : (
                    class2Data.map((classData: ClassData) => (
                        <DropdownMenuItem
                            key={classData.id}
                            onClick={() => handleClassSelect(classData)}
                            className={`flex items-center px-2 py-1 cursor-pointer ${selectedClass.id === classData.id ? 'bg-accent' : ''}`}
                        >
                            <Image
                                src={`https://api.flyff.com/image/class/messenger/${classData.icon}`}
                                alt={classData.name.en}
                                width={40}
                                height={40}
                                className='w-6 h-6 mr-2'
                                priority
                            />
                            <span>{classData.name.en}</span>
                        </DropdownMenuItem>
                    ))
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default ClassSelected;

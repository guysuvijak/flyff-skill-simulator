'use client'
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import axios from 'axios';
import { useClassStore } from '@/stores/classStore';
import { useCharacterStore } from '@/stores/characterStore';
import { useSkillStore } from '@/stores/skillStore';
import { calculateSkillPoints } from '@/utils/calculateSkillPoints';

const ClassSelected = () => {
    const [class2Data, setClass2Data] = useState<any>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { selectedClass, setSelectedClass } = useClassStore();
    const { characterLevel, setSkillPoints } = useCharacterStore();
    const { resetSkillLevels } = useSkillStore();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    useEffect(() => {
        const getData = async () => {
        try {
            setIsLoading(true);
            const classDataResponse = await axios.get('/data/classall.json');
            const classData = classDataResponse.data;
            
            const class2: any = [];

            classData.forEach((classItem: any) => {
            if (classItem.type === 'professional') { // Class 2
                class2.push(classItem);
            }
            });
            
            setClass2Data(class2);
            const bonusPoint = calculateSkillPoints(characterLevel, selectedClass.id, selectedClass.parent);
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
    }, []);

    const handleClassSelect = (classData: any) => {
        setSelectedClass(classData);
        setIsDropdownOpen(false);
    };

    return (
        <div className="relative w-full max-w-sm px-4 sm:px-2">
            <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center block w-full px-4 py-2 font-medium text-sm text-left text-white border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            >
                <Image
                    src={`https://api.flyff.com/image/class/messenger/${selectedClass.icon}`}
                    alt={selectedClass.name.en}
                    width={40}
                    height={40}
                    className="w-6 h-6 mr-2"
                    priority
                />
                <span>{selectedClass?.name?.en || (isLoading ? 'Loading...' : 'Select a class')}</span>
            </button>

            {isDropdownOpen && (
                <div className="absolute z-10 w-80 sm:w-full mt-2 bg-white border border-gray-300 rounded-md shadow-lg">
                    {isLoading ? (
                        <div className="px-4 py-2 text-sm text-gray-500">Loading...</div>
                    ) : (
                        <ul className="max-h-60 overflow-y-auto">
                            {class2Data.map((classData: any) => (
                                <li
                                    key={classData.id}
                                    className={`flex items-center px-4 py-2 cursor-pointer text-black hover:bg-gray-100 ${selectedClass.id === classData.id ? 'bg-slate-200' : ''}`}
                                    onClick={() => handleClassSelect(classData)}
                                >
                                    <Image
                                        src={`https://api.flyff.com/image/class/messenger/${classData.icon}`}
                                        alt={classData.name.en}
                                        width={40}
                                        height={40}
                                        className="w-6 h-6 mr-2"
                                        priority
                                    />
                                    <span>{classData.name.en}</span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}
        </div>
    );
};

export default ClassSelected;
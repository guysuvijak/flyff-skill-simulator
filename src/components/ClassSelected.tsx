'use client'
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import axios from 'axios';
import { useClassStore } from '@/stores/classStore';

const ClassSelected = () => {
  const [class1Data, setClass1Data] = useState<any>([]);
  const [class2Data, setClass2Data] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { selectedClass, setSelectedClass } = useClassStore();

  useEffect(() => {
    const getData = async () => {
      try {
        setIsLoading(true);
        const classDataResponse = await axios.get('/data/classall.json');
        const classData = classDataResponse.data;

        const class1: any = [];
        const class2: any = [];

        classData.forEach((classItem: any) => {
          if (classItem.type === 'expert') { // Class 1
            class1.push(classItem);
          } else if (classItem.type === 'professional') { // Class 2
            class2.push(classItem);
          }
        });

        setClass1Data(class1);
        setClass2Data(class2);
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
  };

  return (
    <div className="flex space-x-4">
        {class2Data.map((classData: any) => (
            <button
                key={classData.id}
                className={`flex px-4 py-2 rounded hover:bg-gray-700 items-center justify-center ${
                selectedClass?.id === classData.id ? 'bg-gray-700' : ''
                }`}
                onClick={() => handleClassSelect(classData)}
            >
                <Image src={`https://api.flyff.com/image/class/messenger/${classData.icon}`} alt={`${classData.name}`} width={20} height={20} className='mr-1' />
                <span>{classData.name.en}</span>
            </button>
        ))}
    </div>
  );
};

export default ClassSelected;
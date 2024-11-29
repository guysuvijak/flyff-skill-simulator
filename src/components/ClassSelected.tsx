'use client'
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ClassSelected = () => {
  const [class1Data, setClass1Data] = useState<any>([]);
  const [class2Data, setClass2Data] = useState<any>([]);
  const [selectedClass, setSelectedClass] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getData = async () => {
      try {
        setIsLoading(true);
        const classDataResponse = await axios.get('/data/classall.json');
        const classData = classDataResponse.data;

        const class1 = [];
        const class2 = [];

        classData.forEach((classItem) => {
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
    <div>
      <nav className="bg-gray-800 text-white py-4 fixed w-full top-0 z-10">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">Flyff Class Selector</h1>
          <div className="flex space-x-4">
            {class1Data.map((classData, index) => (
              <button
                key={classData.id}
                className={`hover:bg-gray-700 px-4 py-2 rounded ${
                  selectedClass?.id === classData.id ? 'bg-gray-700' : ''
                }`}
                onClick={() => handleClassSelect(classData)}
              >
                {classData.name.en}
              </button>
            ))}
            {class2Data.map((classData, index) => (
              <button
                key={classData.id}
                className={`hover:bg-gray-700 px-4 py-2 rounded ${
                  selectedClass?.id === classData.id ? 'bg-gray-700' : ''
                }`}
                onClick={() => handleClassSelect(classData)}
              >
                {classData.name.en}
              </button>
            ))}
          </div>
        </div>
      </nav>
    </div>
  );
};

export default ClassSelected;
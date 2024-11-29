'use client';
import React from 'react';
import ClassSelected from '@/components/ClassSelected';

const Navbar = () => {
  return (
    <nav className="bg-gray-800 text-white py-4 fixed w-full top-0 z-10">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold">Flyff Class Selector</h1>
        <ClassSelected />
      </div>
    </nav>
  );
};

export default Navbar;
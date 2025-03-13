import React from 'react'
import { FaBars } from "react-icons/fa"; // Hamburger icon

export default function TopAppBar() {
    return (

        <div className="fixed bg-emerald-700 text-white top-0 left-0 right-0 w-ful shadow-xs flex items-center justify-between px-4 py-4 z-10">
            <div className='flex items-center'>
                <FaBars size={24} />
                <span className="text-2xl font-bold not-first:px-2">GoCeylon</span>
            </div>
            <div className="w-8" />
        </div>

    );
}


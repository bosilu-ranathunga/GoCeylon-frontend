import React from 'react';
import { FaBars, FaCamera, FaHome } from "react-icons/fa"; // Icons for menu, camera, and home
import { HiDotsVertical } from "react-icons/hi";

export default function TopAppBar() {
    return (
        <div className="flex bg-emerald-700 justify-between shadow-xs text-white w-full fixed items-center left-0 px-4 py-4 right-0 top-0 z-10">
            {/* Left Side: Menu Icon & Title */}
            <div className='flex gap-3 items-center'>
                <span className="text-2xl font-bold">GoCeylon</span>
            </div>

            {/* Right Side: Camera Icon & Home Icon */}
            <div className='flex gap-4 items-center'>
                <FaCamera size={24} />
                <HiDotsVertical size={24} />
            </div>
        </div>
    );
}

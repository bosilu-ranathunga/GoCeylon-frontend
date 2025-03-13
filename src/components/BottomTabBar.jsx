import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaHome, FaSearch, FaBell, FaUser } from "react-icons/fa";

const tabs = [
    { name: "Home", icon: FaHome, path: "/user/" },
    { name: "Search", icon: FaSearch, path: "/user/guide" },
    { name: "Notifications", icon: FaBell, path: "/user/booking" },
    { name: "Profile", icon: FaUser, path: "/user/profile" },
];

export default function BottomTabBar() {
    const location = useLocation();

    return (
        <div className="fixed bottom-0 left-0 w-full bg-white shadow-2xl flex justify-around py-2 ">
            {tabs.map((tab) => (
                <Link
                    key={tab.name}
                    to={tab.path}
                    className={`flex flex-col items-center p-2 transition-all duration-200 ease-in-out ${location.pathname === tab.path
                        ? "text-emerald-700"
                        : "text-gray-500 hover:text-emerald-700"
                        }`}
                >
                    <tab.icon size={24} />
                    <span className="text-xs">{tab.name}</span>
                </Link>
            ))}
        </div>
    );
}

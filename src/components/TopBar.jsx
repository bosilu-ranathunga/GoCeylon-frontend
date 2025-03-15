import React from 'react';

const TopBar = () => {
    return (
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-semibold">Dashboard Overview</h2>
            <div className="flex items-center space-x-4">
                <button className="bg-blue-500 text-white px-4 py-2 rounded-md">Logout</button>
            </div>
        </div>
    );
}

export default TopBar;
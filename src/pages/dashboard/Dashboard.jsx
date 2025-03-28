import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import TopBar from '../../components/TopBar';

export default function Dashboard() {
    const [report, setReport] = useState(null);

    useEffect(() => {
        fetch("http://localhost:3000/location/report")
            .then(res => res.json())
            .then(data => setReport(data))
            .catch(err => console.error("Error fetching report:", err));
    }, []);

    return (
        <div className="flex h-screen">
            {/* Sidebar */}
            <Sidebar />

            {/* Main content area */}
            <div className="flex-1 p-6 overflow-y-auto">
                <h1 className="text-2xl font-bold text-center">Dashboard</h1>

                {report ? (
                    <div className="mt-4 p-6 bg-white shadow rounded-lg max-w-3xl mx-auto">
                        <h2 className="text-xl font-semibold">Attraction Report</h2>
                        <p>Total Attractions: {report.totalAttractions}</p>
                        <h3 className="mt-2 font-semibold">Attractions by Tag:</h3>
                        <ul>
                            {report.attractionsByTag.map(tag => (
                                <li key={tag._id}>{tag._id}: {tag.count}</li>
                            ))}
                        </ul>
                    </div>
                ) : (
                    <p>Loading report...</p>
                )}
            </div>
        </div>
    );
}

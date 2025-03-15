import React from 'react'
import Sidebar from '../../components/Sidebar';
import TopBar from '../../components/TopBar';


export default function Dashboard() {
    return (
        <div className="flex h-screen">
            <Sidebar />
            <div className="flex-1 p-6">
            </div>
        </div>
    )
}

import React from 'react'
import Sidebar from '../../components/Sidebar';

export default function Location() {
    return (
        <div className="flex h-screen">
            <Sidebar />
            <div className="flex-1 p-6">
                <h1>Location</h1>
            </div>
        </div>
    )
}

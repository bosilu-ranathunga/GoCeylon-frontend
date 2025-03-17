import React from 'react'
import Sidebar from '../../components/Sidebar';

export default function NewRFID() {
    return (
        <div className="flex h-screen">
            <Sidebar />
            <div className="flex-1 p-6">
                <h1>Add Rfid</h1>
            </div>
        </div>
    )
}

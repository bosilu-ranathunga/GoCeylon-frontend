import React from 'react';
import TopAppBar from '../../components/TopAppBar';
import BottomTabBar from '../../components/BottomTabBar';
import { Scanner } from '@yudiel/react-qr-scanner';

export default function ScannerScreen() {
    return (
        <div className="flex flex-col h-screen w-full bg-gray-100">
            <TopAppBar />
            <div className="flex-1 flex items-center justify-center p-4">
                <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-4">
                    <Scanner
                        onScan={(result) => console.log(result)}
                        className="w-full h-64 border rounded-lg"
                    />
                </div>
            </div>
        </div>
    );
}

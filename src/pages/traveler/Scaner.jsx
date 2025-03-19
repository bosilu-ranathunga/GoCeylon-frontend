import React from 'react';
import TopAppBar from '../../components/TopAppBar';
import BottomTabBar from '../../components/BottomTabBar';
import { Scanner } from '@yudiel/react-qr-scanner';

export default function Scaner() {
    return (
        <>
            <TopAppBar />
            <Scanner onScan={(result) => console.log(result)} />
            <BottomTabBar />
        </>
    )
}

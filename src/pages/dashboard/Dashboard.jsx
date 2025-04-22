import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import TopBar from "../../components/TopBar";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import API_BASE_URL from "../../config/config";
import axios from 'axios';

export default function Dashboard() {
    const [report, setReport] = useState(null);

    const token = localStorage.getItem("authToken");

    return (
        <div className="flex h-screen">
            {/* Sidebar */}
            <Sidebar />

            {/* Main content area */}
            <div className="flex-1 p-6 overflow-y-auto">

            </div>

        </div>
    );
}
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

    useEffect(() => {
        fetch(`${API_BASE_URL}/location/report`)
            .then((res) => res.json())
            .then((data) => setReport(data))
            .catch((err) => console.error("Error fetching report:", err));
    }, []);

    const generatePDF = () => {
        if (!report) return;

        const doc = new jsPDF();
        doc.text("Tourist Attractions Report", 14, 10);

        // Total Attractions
        doc.text(`Total Attractions: ${report.totalAttractions}`, 14, 20);

        // Attractions by Tag
        doc.text("Attractions by Category:", 14, 30);
        const tagData = report.attractionsByTag.map((tag, index) => [index + 1, tag._id, tag.count]);

        autoTable(doc, { // Correct way to use autoTable
            startY: 35,
            head: [["#", "Category", "Count"]],
            body: tagData,
        });

        doc.save("Attractions_Report.pdf");
    };


    const handleScanerRecodeDownload = async () => {
        try {
            // Make the request to the backend to download the Excel file
            const response = await axios.get(`${API_BASE_URL}/api/scaner/export`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                },
                responseType: 'blob', // This ensures the response is treated as a file
            });

            // Create a link element to trigger the download
            const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = 'RFID_Records.xlsx'; // Specify the filename
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error('Error downloading file', error);
            alert('Error downloading file');
        }
    };



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
                            {report.attractionsByTag.map((tag) => (
                                <li key={tag._id}>{tag._id}: {tag.count}</li>
                            ))}
                        </ul>

                        {/* Download PDF Button */}
                        <div className="flex justify-end">
                            <button
                                onClick={generatePDF}
                                className="mt-4 px-4 py-2 bg-green-600 text-white rounded shadow hover:bg-green-700"
                            >
                                Download PDF
                            </button>
                        </div>
                    </div>
                ) : (
                    <p>Loading report...</p>
                )}
            </div>
            <button onClick={handleScanerRecodeDownload}>Download RFID Records</button>
        </div>
    );
}
import React, { useEffect, useState } from "react";
import io from "socket.io-client";

const RfidList = () => {
    const [rfidRecords, setRfidRecords] = useState([]);

    useEffect(() => {
        // Connect to the Socket.io server
        const socket = io("http://localhost:3000"); // Make sure this URL matches your backend

        socket.on("connect", () => {
            console.log("Connected to server via Socket.io");
        });

        socket.on("newRFID", (newRecord) => {
            console.log("Received newRFID:", newRecord);
            setRfidRecords((prevRecords) => [newRecord, ...prevRecords]); // Add the new record
        });

        // Fetch all existing RFID records initially and every 2 seconds after
        const fetchData = () => {
            fetch("http://localhost:3000/api/scaner/rfid")
                .then((response) => response.json())
                .then((data) => {
                    setRfidRecords(data); // Update state with fetched data
                })
                .catch((error) => {
                    console.error("Error fetching RFID records:", error);
                });
        };

        // Fetch data initially
        fetchData();

        // Set interval to fetch data every 2 seconds
        const intervalId = setInterval(fetchData, 1000); // 2000ms = 2 seconds

        // Clean up on component unmount
        return () => {
            socket.off("newRFID"); // Remove event listener when the component unmounts
            socket.disconnect();    // Disconnect from the socket when the component unmounts
            clearInterval(intervalId); // Clear the interval when the component unmounts
        };
    }, []); // Empty dependency array ensures this effect runs only once on mount

    return (
        <div>
            <h1>RFID Records</h1>
            <ul>
                {rfidRecords.length > 0 ? (
                    rfidRecords.map((record) => (
                        <li key={record._id}>{record.uid}</li> // Display RFID UID
                    ))
                ) : (
                    <li>No records available</li> // Message when no records are present
                )}
            </ul>
        </div>
    );
};

export default RfidList;

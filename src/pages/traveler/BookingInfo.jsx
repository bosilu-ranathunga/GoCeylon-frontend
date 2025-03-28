import React from "react";
import { useLocation } from "react-router-dom";

const BookingInfo = () => {
    const { state } = useLocation();
    const booking = state?.booking; 

    console.log("Booking Data:", booking); 

    if (!booking) {
        return (
            <div className="text-center text-red-600 font-semibold">
                No booking details available.
            </div>
        );
    }

    return (
        <div className="bg-white min-h-screen p-6 flex flex-col gap-6 max-w-2xl mx-auto border border-gray-300 rounded-xl shadow-lg">
            <h2 className="text-3xl font-bold text-green-700 text-center">
                Booking Confirmation
            </h2>
            <div className="p-5 bg-green-50 border border-green-300 rounded-xl shadow-md">
                <p className="text-lg font-semibold text-green-800">
                    Guide ID: {booking.b_guide || "N/A"}
                </p>
                <p className="text-sm text-green-700">Date: {booking.b_date || "N/A"}</p>
                <p className="text-sm text-green-700">Time: {booking.b_time || "N/A"}</p>
                <p className="text-sm text-green-700">Location: {booking.b_location || "N/A"}</p>
                <p className="text-sm text-green-700 font-bold">Price: ${booking.price || "N/A"}</p>
                <p className={`text-sm font-semibold ${booking.status === 'pending' ? 'text-yellow-600' : 'text-green-700'}`}>
                    Status: {booking.status || "N/A"}
                </p>
            </div>
        </div>
    );
};

export default BookingInfo;

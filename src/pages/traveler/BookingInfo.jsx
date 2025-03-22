import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
//import axios from "../../services/axios";

export default function BookingInfo() {
    const { id } = useParams();
    const [booking, setBooking] = useState(null);

   /* useEffect(() => {
        axios.get(`/bookings/${id}`)
            .then(response => setBooking(response.data))
            .catch(error => console.error("Error fetching booking info:", error));
    }, [id]);*/

    if (!booking) return <p>Loading booking details...</p>;

    return (
        <div className="bg-white min-h-screen p-6 flex flex-col gap-6 max-w-lg mx-auto border border-gray-300 rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900">Booking Confirmed!</h2>
            <p className="text-lg">Guide: {booking.guideName}</p>
            <p>Booking ID: {booking.id}</p>
        </div>
    );
}

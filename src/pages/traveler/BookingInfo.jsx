import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import TopNameBar from "../../components/TopNameBar";
import API_BASE_URL from "../../config/config";

export default function BookingInfo() {
    const { id } = useParams(); // Get bookingId from URL
    const navigate = useNavigate();
    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Fetch the booking data using the booking ID from the URL
        axios.get(`${API_BASE_URL}/booking/${id}`)
            .then(response => {
                console.log("API Response:", response.data); // Log the response to check the data
                setBooking(response.data.booking); // Access the "booking" key in the response
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching booking:', error);
                setError(error);
                setLoading(false);
            });
    }, [id]);

    const handleDownloadReceipt = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/booking/receipt/${id}`, { responseType: 'blob' });
            const blob = new Blob([response.data], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `receipt_${id}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error('Error downloading receipt:', error);
        }
    };

    // error state
    if (error) return <div className='text-red-500 font-semibold'>Error: {error.message}</div>;

    return (
        <div className='container mx-auto p-6 mt-[4rem] bg-gray-50 min-h-screen'>
            <TopNameBar title="Booking Info" />

            {booking ? (
                <div className='flex flex-col p-5 bg-green-50 border border-green-300 rounded-xl shadow-md mb-4'>
                    <h3 className='text-xl font-semibold text-green-800'>
                        {booking.b_guide?.g_name || "Unknown Guide"}
                    </h3>
                    <p className='text-sm text-green-700'>Date: {booking.b_date}</p>
                    <p className='text-sm text-green-700'>Duration (hours): {booking.b_time}</p>
                    <p className='text-sm text-green-700'>Location: {booking.b_location}</p>
                    <p className='text-sm text-green-700'>Price: ${booking.price}</p>
                    <p className={`text-sm font-semibold ${booking.status === 'confirmed' ? 'text-green-700' : booking.status === 'canceled' ? 'text-red-600' : 'text-yellow-600'}`}>
                        Status: {booking.status}
                    </p>

                    <button
                        className='mt-4 bg-green-600 text-white py-2 px-4 rounded-lg'
                        onClick={handleDownloadReceipt}
                    >
                        Download Receipt
                    </button>
                </div>
            ) : (
                <p className='text-green-600 font-semibold'>No booking found...</p>
            )}

        </div>
    );
}

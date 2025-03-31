import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import TopNameBar from "../../components/TopNameBar";
import API_BASE_URL from "../../config/config";
import { useModal } from '../../context/ModalContext';

export default function Booking() {

    const location = useLocation();
    const navigate = useNavigate();
    const { guide } = location.state || {};

    const [bookingDate, setBookingDate] = useState('');
    const [bookingTime, setBookingTime] = useState('');
    const [bookingLocation, setBookingLocation] = useState('');
    const [status, setStatus] = useState('pending');
    const [loading, setLoading] = useState(false);

    const { showModal, closeModal } = useModal();

    if (!guide) {
        return <div className='text-center text-red-600 font-semibold'>No guide selected.</div>;
    }

    /*---------this is who we get loged user id-------------*/
    const token = localStorage.getItem('authToken');
    const decoded = JSON.parse(atob(token.split('.')[1]));
    const userId = decoded.id;
    console.log(userId);
    /*------------------------------------------------------*/

    const handleBooking = async () => {

        if (!bookingDate || !bookingTime || !bookingLocation || !status) {
            alert('Please fill in all fields.');
            return;
        }

        const bookingData = {
            b_date: bookingDate,
            b_time: bookingTime,
            b_location: bookingLocation,
            b_user: '67dc5f1a395ce4427f1411d6', // Example user ID
            b_guide: guide._id, // Guide ID
            price: guide.price * bookingTime,
            status: status
        };

        try {
            setLoading(true);
            const response = await axios.post(`${API_BASE_URL}/booking`, bookingData, {
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
            });
            setLoading(false);
            if (response.status === 201 && response.data) {
                showModal({
                    type: 'success',
                    title: 'Success!',
                    content: 'Guide booked successfully!',
                    buttons: [
                        {
                            label: 'Ok',
                            onClick: closeModal,
                            className: 'w-full px-4 py-2 text-white bg-[#007a55] rounded'
                        }
                    ]
                });
                navigate('/user/bookinghistory', { state: { booking: response.data } });
            }
        } catch (error) {
            console.error('Booking Error:', error.response?.data || error.message);
            setLoading(false);
            alert(`Failed to book the guide: ${error.response?.data?.message || 'Unknown error'}`);
        }

    };

    return (
        <div className='container mx-auto p-6 mt-[4rem] bg-gray-50 min-h-screen'>

            <TopNameBar title="Book a Guide" />

            {/* Guide Info Card */}
            <div className='mt-1 p-6 bg-white border border-gray-200 rounded-lg shadow-md'>
                <h3 className='text-xl font-semibold text-green-800'>{guide.g_name}</h3>
                <p className='text-sm text-green-700'>Language: {guide.language}</p>
                <p className='text-sm text-green-700'>Price: ${guide.price} / hr</p>
                <p className='text-sm text-green-700'>Location: {guide.location.join(', ')}</p>
                <p className='text-sm text-green-700'>Contact: {guide.contact_number}</p>
                <p className={`text-sm font-semibold ${guide.availability ? 'text-green-700' : 'text-red-600'}`}>
                    {guide.availability ? 'Available' : 'Not Available'}
                </p>
            </div>

            {/* Booking Form Directly Below Guide Info */}
            <div className="mt-4 p-6 bg-white border border-gray-200 rounded-lg shadow-md">
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Booking Date:</label>
                <input
                    type="date"
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                />

                <label className="block text-sm font-medium text-gray-700 mt-3 mb-2">Select Duration (Hours):</label>
                <input
                    type="number"
                    value={bookingTime}
                    onChange={(e) => setBookingTime(e.target.value)}
                    min="1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                />

                <label className="block text-sm font-medium text-gray-700 mt-3 mb-2">Enter Location:</label>
                <input
                    type="text"
                    placeholder="Enter location"
                    value={bookingLocation}
                    onChange={(e) => setBookingLocation(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                />

                <label className="block text-sm font-medium text-gray-700 mt-3 mb-2">Select Status:</label>
                <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="cancelled">Cancelled</option>
                </select>

                <p className="text-lg font-bold text-green-800 mt-3">Total Price: ${guide.price * bookingTime}</p>

                <div className="flex justify-end gap-3 mt-4">
                    <button
                        onClick={handleBooking}
                        className="bg-[#007a55] text-white px-4 py-2 rounded-lg"
                        disabled={loading}
                    >
                        {loading ? 'Booking...' : 'Confirm Booking'}
                    </button>
                </div>
            </div>

        </div>
    );
}

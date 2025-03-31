import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Booking() {
    const location = useLocation();
    const navigate = useNavigate();
    const { guide } = location.state || {}; 

    const [showModal, setShowModal] = useState(false);
    const [bookingDate, setBookingDate] = useState('');
    const [bookingTime, setBookingTime] = useState('');  // Kept b_time as the name but for hours
    const [bookingLocation, setBookingLocation] = useState('');
    const [status, setStatus] = useState('pending'); // Added status state
    const [loading, setLoading] = useState(false);
    
    if (!guide) {
        return <div className='text-center text-red-600 font-semibold'>No guide selected.</div>;
    }

    const handleBooking = async () => {
        if (!bookingDate || !bookingTime || !bookingLocation || !status) {
            alert('Please fill in all fields.');
            return;
        }
    
        const bookingData = {
            b_date: bookingDate,
            b_time: bookingTime,  // Still using b_time but representing hours
            b_location: bookingLocation,
            b_user: '67dc5f1a395ce4427f1411d6', // Example user ID
            b_guide: guide._id, // Guide ID
            price: guide.price * bookingTime, // Guide price * number of hours
            status: status // Added status field
        };
    
        try {
            setLoading(true);
            const response = await axios.post('http://localhost:3000/booking', bookingData);
            setLoading(false);
    
            if (response.status === 201 && response.data) {
                alert('Guide booked successfully!');
                setShowModal(false);
    
                console.log(" Navigating to BookingInfo with:", response.data);
                navigate('/user/booking/info', { state: { booking: response.data } }); 
            }
        } catch (error) {
            console.error(' Booking Error:', error.response?.data || error.message);
            setLoading(false);
            alert(`Failed to book the guide: ${error.response?.data?.message || 'Unknown error'}`);
        }
    };

    return (
        <div className='bg-white min-h-screen p-6 flex flex-col gap-6 max-w-2xl mx-auto border border-gray-300 rounded-xl shadow-lg'>
            <h2 className='text-3xl font-bold text-green-700 text-center'>Book a Guide</h2>
            <div className='p-5 bg-green-50 border border-green-300 rounded-xl shadow-md'>
                <h3 className='text-xl font-semibold text-green-800'>{guide.g_name}</h3>
                <p className='text-sm text-green-700'>Language: {guide.language}</p>
                <p className='text-sm text-green-700'>Price: ${guide.price} / hr</p>
                <p className='text-sm text-green-700'>Location: {guide.location.join(', ')}</p>
                <p className='text-sm text-green-700'>Contact: {guide.contact_number}</p>
                <p className={`text-sm font-semibold ${guide.availability ? 'text-green-700' : 'text-red-600'}`}>
                    {guide.availability ? 'Available' : 'Not Available'}
                </p>
            </div>
            <button 
                onClick={() => setShowModal(true)} 
                className='bg-green-600 text-white text-lg font-semibold py-2 rounded-lg hover:bg-green-700 transition duration-200'
            >
                Book Guide
            </button>

            {/* Popup Modal */}
            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                        <h2 className="text-xl font-bold text-green-700 mb-4">Confirm Booking</h2>
                        <p className="text-sm text-gray-700 mb-3">Guide: <strong>{guide.g_name}</strong></p>

                        <label className="block text-sm font-medium text-gray-700 mb-2">Select Booking Date:</label>
                        <input 
                            type="date" 
                            value={bookingDate} 
                            onChange={(e) => setBookingDate(e.target.value)} 
                            min={new Date().toISOString().split('T')[0]} // Restrict past dates
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                        />

                        <label className="block text-sm font-medium text-gray-700 mt-3 mb-2">Select Duration (Hours):</label>
                        <input 
                            type="number" 
                            value={bookingTime}  // still using bookingTime
                            onChange={(e) => setBookingTime(e.target.value)} 
                            min="1" // Ensure the number of hours is at least 1
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
                                onClick={() => setShowModal(false)} 
                                className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handleBooking} 
                                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                                disabled={loading}
                            >
                                {loading ? 'Booking...' : 'Confirm'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

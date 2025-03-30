import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Booking() {
    const location = useLocation();
    const navigate = useNavigate();
    const { guide } = location.state || {}; 

    const [showModal, setShowModal] = useState(false);
    const [bookingDate, setBookingDate] = useState('');
    const [bookingTime, setBookingTime] = useState('');
    const [bookingLocation, setBookingLocation] = useState('');
    const [loading, setLoading] = useState(false);

    if (!guide) {
        return <div className='text-center text-red-600 font-semibold'>No guide selected.</div>;
    }

    const handleBooking = async () => {
        if (!bookingDate || !bookingTime || !bookingLocation) {
            alert('Please fill in all fields.');
            return;
        }
    
        const bookingData = {
            b_date: bookingDate,
            b_time: bookingTime,
            b_location: bookingLocation,
            b_user: '67dc5f1a395ce4427f1411d6', // Example user ID
            b_guide: guide._id, // Guide ID
            price: guide.price, // Guide price
            status: 'pending'
        };
    
        try {
            setLoading(true);
            const response = await axios.post('http://localhost:3000/booking', bookingData);
            setLoading(false);
    
            if (response.status === 201) {
                alert('Guide booked successfully!');
                setShowModal(false);
                console.log(response.data);
                navigate('/user/booking/info', { state: { booking: response.data } }); // ✅ Navigate with booking details
            }
        } catch (error) {
            console.error('Error booking guide:', error.response?.data || error.message);
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
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                        />

                        <label className="block text-sm font-medium text-gray-700 mt-3 mb-2">Select Time:</label>
                        <input 
                            type="time" 
                            value={bookingTime} 
                            onChange={(e) => setBookingTime(e.target.value)} 
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

                        <p className="text-lg font-bold text-green-800 mt-3">Price: ${guide.price}</p>

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












import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

export default function BookingHistory() {
    const navigate = useNavigate();
    const userId = '67dc5f1a395ce4427f1411d6';  // Hardcoded user ID
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
      // Fetch bookings for the specific user with hardcoded userId
      axios.get(`http://localhost:3000/booking/user/${userId}`)
          .then(response => {
              // Sort bookings by b_date in descending order (latest first)
              const sortedBookings = response.data.bookings.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
              setBookings(sortedBookings);
              setLoading(false);
          })
          .catch(error => {
              console.error('Error fetching bookings:', error);
              setError(error);
              setLoading(false);
          });
  }, []);

    if (loading) return <div className='text-center text-green-600 font-semibold'>Loading...</div>;
    if (error) return <div className='text-red-500 font-semibold'>Error: {error.message}</div>;

    return (
        <div className='bg-white min-h-screen p-6 flex flex-col gap-6 max-w-3xl mx-auto border border-gray-300 rounded-xl shadow-lg'>
            <div className='flex items-center justify-between mb-4'>
                <button onClick={() => navigate(-1)} className='text-green-700 text-2xl'>
                    <FaArrowLeft />
                </button>
                <h2 className='text-3xl font-bold text-green-700 text-center flex-1'>Booking History</h2>
            </div>

            {bookings.length > 0 ? (
                bookings.map(booking => (
                    <div 
                        key={booking._id} 
                        className='flex flex-col p-5 bg-green-50 border border-green-300 rounded-xl shadow-md mb-4 hover:bg-green-100 transition duration-200'
                    >
                        <h3 className='text-xl font-semibold text-green-800'>{booking.b_guide.g_name}</h3>
                        <p className='text-sm text-green-700'>Date: {booking.b_date}</p>
                        <p className='text-sm text-green-700'>Time: {booking.b_time}</p>
                        <p className='text-sm text-green-700'>Location: {booking.b_location}</p>
                        <p className='text-sm text-green-700'>Price: ${booking.price}</p>
                        <p className={`text-sm font-semibold ${booking.status === 'confirmed' ? 'text-green-700' : booking.status === 'canceled' ? 'text-red-600' : 'text-yellow-600'}`}>
                            Status: {booking.status}
                        </p>
                    </div>
                ))
            ) : (
                <p className='text-green-600 font-semibold'>No bookings found...</p>
            )}
        </div>
    );
}

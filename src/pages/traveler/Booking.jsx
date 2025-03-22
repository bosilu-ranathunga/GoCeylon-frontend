import React, { useState } from 'react'; 
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaArrowLeft } from 'react-icons/fa';

export default function Booking() {
    const navigate = useNavigate();
    const { state } = useLocation();
    const guide = state?.guide;

    const [b_date, setBDate] = useState('');
    const [b_time, setBTime] = useState('');
    const [b_location, setBLocation] = useState('');
    const [price, setPrice] = useState(guide?.price || 0);
    const [status, setStatus] = useState('pending');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!b_date || !b_time || !b_location) {
            setError('All fields are required');
            return;
        }

        try {
            const bookingData = {
                b_date,
                b_time,
                b_location,
                b_user: 'user-id-placeholder',  // Replace with actual user ID
                b_guide: guide._id,
                price,
                status,
            };

            const response = await axios.post('http://localhost:3000/booking', bookingData);

            if (response.status === 201) {
                setSuccess(true);
                setError(null);
                setBDate('');
                setBTime('');
                setBLocation('');
            }
        } catch (error) {
            setError('Error creating booking. Please try again.');
            setSuccess(false);
        }
    };

    return (
        <div className='bg-white min-h-screen p-6 flex flex-col gap-6 max-w-3xl mx-auto border border-gray-300 rounded-xl shadow-lg'>
            <div className='flex items-center justify-between mb-4'>
                <button onClick={() => navigate(-1)} className='text-green-700 text-2xl'>
                    <FaArrowLeft />
                </button>
                <h2 className='text-3xl font-bold text-green-700 text-center flex-1'>Book a Guide</h2>
            </div>

            {guide && (
                <div className='p-5 bg-green-50 border border-green-300 rounded-xl shadow-md mb-4'>
                    <h3 className='text-xl font-semibold text-green-800'>{guide.g_name}</h3>
                    <p className='text-sm text-green-700'>Language: {guide.language}</p>
                    <p className='text-sm text-green-700'>Price: ${guide.price} / hr</p>
                    <p className='text-sm text-green-700'>Location: {guide.location.join(', ')}</p>
                    <p className={`text-sm font-semibold ${guide.availability ? 'text-green-700' : 'text-red-600'}`}>
                        {guide.availability ? 'Available' : 'Not Available'}
                    </p>
                </div>
            )}

            <form onSubmit={handleSubmit} className='space-y-4'>
                {error && <div className='text-red-500 font-semibold'>{error}</div>}
                {success && <div className='text-green-600 font-semibold'>Booking created successfully!</div>}

                <div className='flex flex-col'>
                    <label className='text-sm text-green-700' htmlFor='b_date'>
                        Date
                    </label>
                    <input
                        type='date'
                        id='b_date'
                        className='p-3 border border-gray-300 rounded-lg'
                        value={b_date}
                        onChange={(e) => setBDate(e.target.value)}
                        required
                    />
                </div>

                <div className='flex flex-col'>
                    <label className='text-sm text-green-700' htmlFor='b_time'>
                        Time
                    </label>
                    <input
                        type='time'
                        id='b_time'
                        className='p-3 border border-gray-300 rounded-lg'
                        value={b_time}
                        onChange={(e) => setBTime(e.target.value)}
                        required
                    />
                </div>

                <div className='flex flex-col'>
                    <label className='text-sm text-green-700' htmlFor='b_location'>
                        Location
                    </label>
                    <input
                        type='text'
                        id='b_location'
                        className='p-3 border border-gray-300 rounded-lg'
                        value={b_location}
                        onChange={(e) => setBLocation(e.target.value)}
                        required
                    />
                </div>

                <div className='flex justify-end'>
                    <button
                        type='submit'
                        className='bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition duration-200'
                    >
                        Book Now
                    </button>
                </div>
            </form>
        </div>
    );
}

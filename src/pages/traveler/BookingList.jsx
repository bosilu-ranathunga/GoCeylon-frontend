// BookingList.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaArrowLeft, FaPhoneAlt } from 'react-icons/fa';

export default function BookingList() {
    const navigate = useNavigate();
    const [guides, setGuides] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios.get('http://localhost:3000/guides')
            .then(response => {
                const guideList = Array.isArray(response.data) ? response.data : response.data.guides;
                setGuides(guideList);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching guides:', error);
                setError(error);
                setLoading(false);
            });
    }, []);

    if (loading) return <div className='text-center text-green-600 font-semibold'>Loading...</div>;
    if (error) return <div className='text-red-500 font-semibold'>Error: {error.message}</div>;
     
    const handleGuideClick = (guide) => {
        navigate('/user/booking', { state: { guide } });
    };
    
   

    return (
        <div className='bg-white min-h-screen p-6 flex flex-col gap-6 max-w-3xl mx-auto border border-gray-300 rounded-xl shadow-lg'>
            <div className='flex items-center justify-between mb-4'>
                <button onClick={() => navigate(-1)} className='text-green-700 text-2xl'>
                    <FaArrowLeft />
                </button>
                <h2 className='text-3xl font-bold text-green-700 text-center flex-1'> Guides</h2>
            </div>

            {guides.length > 0 ? (
                guides.map(guide => (
                    <div 
                    key={guide._id} 
                    className='flex items-center p-5 bg-green-50 border border-green-300 rounded-xl shadow-md mb-4 hover:bg-green-100 transition duration-200'
                    onClick={()=>handleGuideClick(guide)}
                    >
                        <div className='ml-5 flex-1'>
                            <h3 className='text-xl font-semibold text-green-800'>{guide.g_name}</h3>
                          {/*}  <p className='text-sm text-green-700'>Language: {guide.language}</p>
                            <p className='text-sm text-green-700'>Price: ${guide.price} / hr</p>
                            <p className='text-sm text-green-700'>Location: {guide.location.join(', ')}</p>
                            <p className='text-sm text-green-700 flex items-center'><FaPhoneAlt className='mr-2' />{guide.contact_number}</p>*/}
                            <p className={`text-sm font-semibold ${guide.availability ? 'text-green-700' : 'text-red-600'}`}>
                            {guide.availability ? 'Available' : 'Not Available'}
                            </p>


                        </div>
                    </div>
                ))
            ) : (
                <p className='text-green-600 font-semibold'>No guides available...</p>
            )}
        </div>
    );
}

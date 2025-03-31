import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import TopNameBar from "../../components/TopNameBar";
import API_BASE_URL from "../../config/config";

export default function BookingList() {

    const navigate = useNavigate();
    const [guides, setGuides] = useState([]);
    const [filteredGuides, setFilteredGuides] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const token = localStorage.getItem("authToken");

    useEffect(() => {
        axios.get(`${API_BASE_URL}/guides`, {
            headers: {
                "Authorization": `Bearer ${token}`, // Include token in the request header
            }
        }).then(response => {
            const guideList = Array.isArray(response.data) ? response.data : response.data.guides;
            setGuides(guideList);
            setFilteredGuides(guideList);// Set filtered guides initially to all guides
            setLoading(false);
        }).catch(error => {
            console.error('Error fetching guides:', error);
            setError(error);
            setLoading(false);
        });
    }, []);

    const handleSearchChange = (e) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);
        // Filter guides based on the search query
        const filtered = guides.filter(guide =>
            guide.g_name.toLowerCase().includes(query) || // Match by guide name
            guide.language.toLowerCase().includes(query) || // Match by language
            guide.location.join(', ').toLowerCase().includes(query) // Match by location
        );
        setFilteredGuides(filtered);
    };

    const handleGuideClick = (guide) => {
        navigate('/user/booking', { state: { guide } });
    };

    if (error) return <div className='text-red-500 font-semibold'>Error: {error.message}</div>;

    return (
        <div className='container mx-auto p-6 mt-[4rem] bg-gray-50 min-h-screen'>

            <TopNameBar title="Guides" />

            {/* Search Input */}
            <div className="mb-6">
                <input
                    type="text"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    placeholder="Search guides by name or location..."
                    className="w-full p-4 border-2 border-green-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-lg"
                />
            </div>

            {/* Display Guides */}
            {filteredGuides.length > 0 ? (
                filteredGuides.map(guide => (
                    <div
                        key={guide._id}
                        className='flex items-center p-6 bg-green-50 border border-green-200 rounded-xl shadow-md mb-6 hover:bg-green-0 transition duration-300 cursor-pointer'
                        onClick={() => handleGuideClick(guide)}
                    >
                        <div className='ml-6 flex-1'>
                            <h3 className='text-xl font-semibold text-green-800'>{guide.g_name}</h3>
                            {  /*     <p className='text-sm text-green-600 mt-2'>{guide.language}</p>*/}
                            <p className='text-sm text-green-600 mt-1'>{guide.location.join(', ')}</p>
                            <p className={`text-sm font-semibold ${guide.availability ? 'text-green-700' : 'text-red-600'}`}>
                                {guide.availability ? 'Available' : 'Not Available'}
                            </p>
                        </div>
                    </div>
                ))
            ) : (
                <p className='text-green-600 font-semibold'>No guides found...</p>
            )}

        </div>
    );
}

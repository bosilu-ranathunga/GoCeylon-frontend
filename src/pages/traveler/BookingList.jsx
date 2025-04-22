import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import TopNameBar from "../../components/TopNameBar";
import { useParams } from 'react-router-dom';
import API_BASE_URL from "../../config/config";

export default function BookingList() {

    const navigate = useNavigate();
    const [guides, setGuides] = useState([]);
    const [filteredGuides, setFilteredGuides] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const token = localStorage.getItem("authToken");

    const { id } = useParams();

    useEffect(() => {
        axios.get(`${API_BASE_URL}/guides/location/${id}`, {
            headers: {
                "Authorization": `Bearer ${token}`,
            }
        }).then(response => {
            const guideList = Array.isArray(response.data) ? response.data : response.data.guides;
            setGuides(guideList);
            setFilteredGuides(guideList);
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

        const filtered = guides.filter(guide => {
            const nameMatch = guide.g_name?.toLowerCase().includes(query);
            const languageMatch = Array.isArray(guide.language)
                ? guide.language.join(', ').toLowerCase().includes(query)
                : (guide.language?.toLowerCase().includes(query));
            const locationMatch = Array.isArray(guide.location)
                ? guide.location.join(', ').toLowerCase().includes(query)
                : (guide.location?.toLowerCase().includes(query));
            return nameMatch || languageMatch || locationMatch;
        });

        setFilteredGuides(filtered);
    };

    const handleGuideClick = (guide) => {
        navigate('/user/booking', { state: { guide } });
    };

    if (error) return <div className='text-red-500 font-semibold'>Error: {error.message}</div>;

    return (
        <div className="max-w-md mx-auto px-4 pt-[4rem] pb-8 bg-white min-h-screen">
            <TopNameBar title="Guides" />

            {/* Search Input */}
            <div className="mb-6 mt-4">
                <input
                    type="text"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    placeholder="Search by name, language, or location..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 text-base"
                />
            </div>

            {/* Display Guides */}
            {filteredGuides.length > 0 ? (
                filteredGuides.map((guide) => (
                    <div
                        key={guide._id}
                        className="flex items-center gap-4 p-4 bg-gray-50 border border-gray-200 rounded-xl shadow-sm mb-4 hover:bg-gray-100 transition duration-200 cursor-pointer"
                        onClick={() => handleGuideClick(guide)}
                    >
                        {/* Guide Image */}
                        <div className="flex-shrink-0 w-16 h-16 rounded-full overflow-hidden border-2 border-indigo-300">
                            <img
                                src={guide.image ? `${API_BASE_URL}/${guide.image}` : '/default-profile.png'}
                                alt={guide.g_name}
                                className="w-full h-full object-cover"
                            />
                        </div>

                        {/* Guide Info */}
                        <div className="flex-grow">
                            <h3 className="text-lg font-semibold text-gray-800">{guide.g_name}</h3>
                            <p className="text-sm text-gray-600">
                                <span className="font-medium">Languages:</span>{' '}
                                {Array.isArray(guide.language) ? guide.language.join(', ') : guide.language}
                            </p>
                            <p className="text-sm text-gray-600">
                                <span className="font-medium">Location:</span>{' '}
                                {Array.isArray(guide.location) ? guide.location.join(', ') : guide.location}
                            </p>
                            <p className={`text-sm font-semibold ${guide.availability ? 'text-green-600' : 'text-red-500'}`}>
                                {guide.availability ? 'Available' : 'Not Available'}
                            </p>
                        </div>
                    </div>
                ))
            ) : (
                <p className="text-center text-gray-500 mt-10">No guides found...</p>
            )}
        </div>
    );

}

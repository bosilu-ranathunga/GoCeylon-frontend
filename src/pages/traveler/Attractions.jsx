import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AttractionsPage = () => {
    const [locations, setLocations] = useState([]);
    const [tags, setTags] = useState([]);
    const [selectedTag, setSelectedTag] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    // Fetch all locations when the component mounts
    useEffect(() => {
        const fetchLocations = async () => {
            try {
                const response = await axios.get('http://localhost:3000/location/');
                const data = response.data;
                setLocations(data.locations);
    
                // Extract unique tags from the fetched data
                const allTags = data.locations.flatMap(location => location.tags);
                setTags([...new Set(allTags)]);
            } catch (error) {
                console.error('Error fetching locations:', error);
            }
        };
        fetchLocations();
    }, []);

    // Filter locations based on search query and selected tag
    const filteredLocations = locations.filter(location => {
        const matchesTag = selectedTag ? location.tags.includes(selectedTag) : true;
        const matchesSearchQuery =
            location.name.toLowerCase().includes(searchQuery) || location.description.toLowerCase().includes(searchQuery);
        return matchesTag && matchesSearchQuery;
    });

    const handleTagChange = (event) => {
        setSelectedTag(event.target.value);
    };

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value.toLowerCase());
    };

    return (
        <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
            <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-8">Explore Attractions</h1>

            {/* Search Bar */}
            <div className="mb-6 max-w-3xl mx-auto">
                <input
                    type="text"
                    placeholder="Search for attractions..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="w-full px-6 py-3 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-gray-400 text-gray-700 text-lg"
                />
            </div>

            {/* Tag Filter */}
            <div className="mb-8 max-w-3xl mx-auto">
                <select
                    onChange={handleTagChange}
                    value={selectedTag}
                    className="w-full px-6 py-3 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-700 text-lg"
                >
                    <option value="">All Tags</option>
                    {tags.map(tag => (
                        <option key={tag} value={tag}>
                            {tag}
                        </option>
                    ))}
                </select>
            </div>

            {/* Display filtered locations */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {filteredLocations.length > 0 ? (
                    filteredLocations.map(location => (
                        <div key={location._id} className="border rounded-xl overflow-hidden shadow-xl transform hover:scale-105 transition-transform duration-300 ease-in-out">
                            <div className="relative w-full h-56 sm:h-64 md:h-72 lg:h-80">
                                <img
                                    src={location.image_url[0]}
                                    alt={location.name}
                                    className="absolute inset-0 w-full h-full object-cover rounded-t-xl"
                                />
                            </div>
                            <div className="p-6 bg-white">
                                <h3 className="text-2xl font-semibold text-gray-800 mb-4">{location.name}</h3>
                                <p className="text-gray-600 text-base">{location.description}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-center text-gray-500 col-span-full">No attractions found matching the criteria.</p>
                )}
            </div>
        </div>
    );
};

export default AttractionsPage;

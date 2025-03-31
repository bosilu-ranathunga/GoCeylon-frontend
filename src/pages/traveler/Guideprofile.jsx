import React, { useEffect, useState } from 'react';
import axios from 'axios';

const GuideProfile = () => {
    const [guide, setGuide] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({});

    const defaultId = "67dd18e1506af658ccabc157";

    useEffect(() => {
        const fetchGuideDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/guides/${defaultId}`);
                setGuide(response.data);
                setFormData(response.data);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching guide details:", err);
                setError('Error fetching guide details');
                setLoading(false);
            }
        };

        fetchGuideDetails();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put(
                `http://localhost:3000/guides/update/${defaultId}`,
                formData
            );
            setGuide(response.data);
            setIsEditing(false);
        } catch (err) {
            console.error("Error updating guide details:", err);
            setError('Error updating guide details');
        }
    };

    if (loading) {
        return <div className="text-center text-xl">Loading...</div>;
    }

    if (error) {
        return <div className="text-center text-xl text-red-500">{error}</div>;
    }

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">Guide Profile</h2>

            {isEditing ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-700">Name:</label>
                        <input
                            type="text"
                            name="g_name"
                            value={formData.g_name}
                            disabled // Making name uneditable
                            className="mt-1 p-2 w-full border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700">Email:</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="mt-1 p-2 w-full border border-gray-300 rounded-lg"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700">Language:</label>
                        <input
                            type="text"
                            name="language"
                            value={formData.language}
                            onChange={handleInputChange}
                            className="mt-1 p-2 w-full border border-gray-300 rounded-lg"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700">Gender:</label>
                        <input
                            type="text"
                            name="gender"
                            value={formData.gender}
                            onChange={handleInputChange}
                            className="mt-1 p-2 w-full border border-gray-300 rounded-lg"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700">Price:</label>
                        <input
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleInputChange}
                            className="mt-1 p-2 w-full border border-gray-300 rounded-lg"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700">Availability:</label>
                        <input
                            type="checkbox"
                            name="availability"
                            checked={formData.availability}
                            onChange={() => setFormData(prevData => ({
                                ...prevData,
                                availability: !prevData.availability
                            }))}
                            className="mr-2"
                        />
                        <span className="text-gray-600">Available</span>
                    </div>
                    <div className="flex justify-between mt-6">
                        <button
                            type="submit"
                            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                        >
                            Update Guide
                        </button>
                        <button
                            type="button"
                            onClick={() => setIsEditing(false)}
                            className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            ) : (
                <div className="space-y-4">
                    <div className="flex justify-between">
                        <h3 className="text-xl font-semibold">{guide.g_name}</h3>
                        <button
                            onClick={() => setIsEditing(true)}
                            className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
                        >
                            Edit Guide
                        </button>
                    </div>
                    <div className="space-y-2">
                        <p><strong>Email:</strong> {guide.email}</p>
                        <p><strong>Languages:</strong> {guide.language}</p>
                        <p><strong>Gender:</strong> {guide.gender}</p>
                        <p><strong>Price:</strong> ${guide.price}</p>
                        <p><strong>Availability:</strong> {guide.availability ? 'Available' : 'Not Available'}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GuideProfile;

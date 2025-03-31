import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Profile = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({});

    const defaultId = "67e91f409ef87b906999dd75";  // Replace with the actual default ID (you can get this from the logged-in user)

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/users/${defaultId}`);
                setUser(response.data);
                setFormData(response.data);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching user details:", err);
                setError('Error fetching user details');
                setLoading(false);
            }
        };

        fetchUserDetails();
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
                `http://localhost:3000/users/update/${defaultId}`,
                formData
            );
            setUser(response.data);
            setIsEditing(false);
        } catch (err) {
            console.error("Error updating user details:", err);
            setError('Error updating user details');
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
            <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">User Profile</h2>

            {isEditing ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-700">Name:</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
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
                        <label className="block text-gray-700">Destination:</label>
                        <select
                            name="destination"
                            value={formData.destination}
                            onChange={handleInputChange}
                            className="mt-1 p-2 w-full border border-gray-300 rounded-lg"
                        >
                            <option value="Beach">Beach</option>
                            <option value="Mountains">Mountains</option>
                            <option value="City">City</option>
                            <option value="Countryside">Countryside</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-gray-700">Traveling With:</label>
                        <select
                            name="traveling_with"
                            value={formData.traveling_with}
                            onChange={handleInputChange}
                            className="mt-1 p-2 w-full border border-gray-300 rounded-lg"
                        >
                            <option value="Solo">Solo</option>
                            <option value="Family">Family</option>
                            <option value="Partner">Partner</option>
                            <option value="Friends">Friends</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-gray-700">Accommodations:</label>
                        <input
                            type="checkbox"
                            name="accommodations"
                            checked={formData.accommodations}
                            onChange={() => setFormData(prevData => ({
                                ...prevData,
                                accommodations: !prevData.accommodations
                            }))}
                            className="mr-2"
                        />
                        <span className="text-gray-600">Need Accommodation</span>
                    </div>
                    <div>
                        <label className="block text-gray-700">Tour Guide:</label>
                        <input
                            type="checkbox"
                            name="tour_guide"
                            checked={formData.tour_guide}
                            onChange={() => setFormData(prevData => ({
                                ...prevData,
                                tour_guide: !prevData.tour_guide
                            }))}
                            className="mr-2"
                        />
                        <span className="text-gray-600">Require a Guide</span>
                    </div>
                    <div className="flex justify-between mt-6">
                        <button
                            type="submit"
                            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                        >
                            Update Profile
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
                        <h3 className="text-xl font-semibold">{user.name}</h3>
                        <button
                            onClick={() => setIsEditing(true)}
                            className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
                        >
                            Edit Profile
                        </button>
                    </div>
                    <div className="space-y-2">
                        <p><strong>Email:</strong> {user.email}</p>
                        <p><strong>Destination:</strong> {user.destination}</p>
                        <p><strong>Traveling With:</strong> {user.traveling_with}</p>
                        <p><strong>Accommodations:</strong> {user.accommodations ? 'Required' : 'Not Required'}</p>
                        <p><strong>Tour Guide:</strong> {user.tour_guide ? 'Required' : 'Not Required'}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profile;

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';  // Import Link to handle routing
import Sidebar from '../../components/Sidebar';
import axios from 'axios';

export default function Location() {
    const [locations, setLocations] = useState([]);
    const [showModal, setShowModal] = useState(false); // State to toggle modal
    const [locationToDelete, setLocationToDelete] = useState(null); // Store the location to be deleted

    // Fetch locations from the backend
    useEffect(() => {
        axios.get('http://localhost:3000/location/')
            .then(response => {
                setLocations(response.data.locations);
            })
            .catch(error => {
                console.error('Error fetching locations:', error);
            });
    }, []);

    // Function to handle location deletion
    const deleteLocation = async (locationId) => {
        try {
            // Send DELETE request to backend to delete the location
            await axios.delete(`http://localhost:3000/location/${locationId}`);

            // Remove the deleted location from the state
            setLocations(locations.filter(location => location._id !== locationId));

            // Close the modal after deletion
            setShowModal(false);
        } catch (error) {
            console.error('Error deleting location:', error);
        }
    };

    // Function to handle opening the confirmation modal
    const handleDeleteClick = (locationId) => {
        setLocationToDelete(locationId);
        setShowModal(true); // Show the modal when the delete button is clicked
    };

    // Function to close the modal
    const handleCloseModal = () => {
        setShowModal(false);
    };

    return (
        <div className="flex min-h-screen bg-gray-100">
            <Sidebar />
            <div className="flex-1 p-8 ml-64 overflow-y-auto bg-white shadow-lg">
                <h1 className="text-4xl font-bold mb-8 text-gray-900">Locations</h1>
                <div className="bg-white p-6 shadow-md rounded-lg border border-gray-200">
                    <table className="w-full border-collapse border border-gray-300 text-left">
                        <thead>
                            <tr className="bg-gray-300 text-gray-800">
                                <th className="py-4 px-6 border">Name</th>
                                <th className="py-4 px-6 border w-1/3">Description</th>
                                <th className="py-4 px-6 border">Tags</th>
                                <th className="py-4 px-6 border w-1/4">Points</th>
                                <th className="py-4 px-6 border text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {locations.map((location) => (
                                <tr key={location._id} className="border hover:bg-gray-50">
                                    <td className="py-4 px-6 border text-gray-900 font-medium">{location.name}</td>
                                    <td className="py-4 px-6 border text-gray-700 truncate max-w-xs">{location.description}</td>
                                    <td className="py-4 px-6 border text-gray-700">{location.tags.join(', ')}</td>
                                    <td className="py-4 px-6 border text-gray-700">
                                        <ul className="list-disc pl-5">
                                            {location.points.map((point) => (
                                                <li key={point._id} className="text-gray-800">{point.point}: {point.text}</li>
                                            ))}
                                        </ul>
                                    </td>
                                    <td className="py-4 px-6 border flex justify-center space-x-4">
                                        <Link to={`/update-location/${location._id}`} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg shadow-md">Edit</Link>
                                        <button
                                            onClick={() => handleDeleteClick(location._id)} // Show modal on delete button click
                                            className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg shadow-md"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal for confirmation */}
            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
                        <h2 className="text-xl font-bold mb-4">Are you sure?</h2>
                        <p className="mb-4">Are you sure you want to delete this location? This action cannot be undone.</p>
                        <div className="flex justify-end space-x-4">
                            <button
                                onClick={handleCloseModal} // Close modal
                                className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-lg"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => deleteLocation(locationToDelete)} // Proceed with delete
                                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

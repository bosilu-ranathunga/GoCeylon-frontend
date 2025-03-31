import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaEdit, FaTrash } from 'react-icons/fa';

function BusinessList() {
    const [businesses, setBusinesses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editBusiness, setEditBusiness] = useState(null);
    const [newOwnerPhoto, setNewOwnerPhoto] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fetchBusinesses = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/business');
                setBusinesses(response.data.data);
                setLoading(false);
            } catch (err) {
                setError("Failed to fetch businesses");
                setLoading(false);
            }
        };

        fetchBusinesses();
    }, []);

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:3000/api/business/${id}`);
            setBusinesses(businesses.filter(business => business._id !== id));
        } catch (err) {
            setError("Failed to delete business");
        }
    };

    const handleEdit = (business) => {
        setEditBusiness(business);
    };

    const handleSaveEdit = async () => {
        const formData = new FormData();
        formData.append('businessName', editBusiness.businessName);
        formData.append('category', editBusiness.category);
        formData.append('location', editBusiness.location);
        formData.append('openingHours', editBusiness.openingHours);
        if (newOwnerPhoto) {
            formData.append('ownerPhoto', newOwnerPhoto);
        }

        try {
            await axios.put(`http://localhost:3000/api/business/${editBusiness._id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setBusinesses(businesses.map(b => b._id === editBusiness._id ? { ...editBusiness, ownerPhoto: newOwnerPhoto ? URL.createObjectURL(newOwnerPhoto) : editBusiness.ownerPhoto } : b));
            setEditBusiness(null);
        } catch (err) {
            setError("Failed to update business");
        }
    };

    const filteredBusinesses = businesses.filter(business => 
        business.businessName.toLowerCase().includes(searchTerm.toLowerCase()) || 
        business.category.toLowerCase().includes(searchTerm.toLowerCase()) || 
        business.location.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <p className="text-green-500 text-center">Loading businesses...</p>;
    if (error) return <p className="text-red-500 text-center">{error}</p>;

    return (
        <div className="bg-white min-h-screen p-6">
            <h2 className="text-2xl font-bold text-green-600 text-center mb-4">Business List</h2>
            <input 
                type="text" 
                placeholder="Search businesses..." 
                className="w-full p-2 border rounded mb-4" 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            {filteredBusinesses.length === 0 ? (
                <p className="text-center text-green-500">No businesses found.</p>
            ) : (
                <ul className="space-y-4">
                    {filteredBusinesses.map((business) => (
                        <li key={business._id} className="p-4 border rounded-lg shadow-md bg-green-50 flex justify-between items-center">
                            <div>
                                <h3 className="text-lg font-semibold text-green-700">{business.businessName}</h3>
                                <p className="text-green-600"><strong>Category:</strong> {business.category}</p>
                                <p className="text-green-600"><strong>Location:</strong> {business.location}</p>
                                <p className="text-green-600"><strong>Opening Hours:</strong> {business.openingHours}</p>
                                {business.ownerPhoto && (
                                    <img 
                                        src={`http://localhost:3000/${business.ownerPhoto}`} 
                                        alt="Owner" 
                                        className="mt-2 w-24 h-24 rounded-full border border-green-500"
                                    />
                                )}
                            </div>
                            <div className="flex space-x-2">
                                <button className="text-blue-500 hover:text-blue-700" onClick={() => handleEdit(business)}>
                                    <FaEdit size={20} />
                                </button>
                                <button className="text-red-500 hover:text-red-700" onClick={() => handleDelete(business._id)}>
                                    <FaTrash size={20} />
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}

            {editBusiness && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                        <h3 className="text-lg font-semibold text-green-700 mb-4">Edit Business</h3>
                        <label className="block font-medium">Business Name</label>
                        <input type="text" className="w-full p-2 border rounded mb-2" placeholder="Enter business name" value={editBusiness.businessName} onChange={(e) => setEditBusiness({ ...editBusiness, businessName: e.target.value })} />
                        <label className="block font-medium">Category</label>
                        <input type="text" className="w-full p-2 border rounded mb-2" placeholder="Enter category" value={editBusiness.category} onChange={(e) => setEditBusiness({ ...editBusiness, category: e.target.value })} />
                        <label className="block font-medium">Location</label>
                        <input type="text" className="w-full p-2 border rounded mb-2" placeholder="Enter location" value={editBusiness.location} onChange={(e) => setEditBusiness({ ...editBusiness, location: e.target.value })} />
                        <label className="block font-medium">Opening Hours</label>
                        <input type="text" className="w-full p-2 border rounded mb-2" placeholder="Enter opening hours" value={editBusiness.openingHours} onChange={(e) => setEditBusiness({ ...editBusiness, openingHours: e.target.value })} />
                        <label className="block font-medium">Owner Photo</label>
                        <input type="file" className="w-full p-2 border rounded mb-2" onChange={(e) => setNewOwnerPhoto(e.target.files[0])} />
                        <div className="flex justify-end space-x-2">
                            <button className="text-red-500" onClick={() => setEditBusiness(null)}>Cancel</button>
                            <button className="text-green-500" onClick={handleSaveEdit}>Save</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default BusinessList;

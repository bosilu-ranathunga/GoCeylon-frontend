import React, { useState } from 'react';
import axios from 'axios';

export default function AddBusiness() {
    const [formData, setFormData] = useState({
        businessName: '',
        category: '',
        location: '',
        description: '',
        ownerPhoto: null,
        images: [],
        openingHours: '9 AM - 5 PM',
    });

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (files) {
            setFormData((prevData) => ({
                ...prevData,
                [name]: files
            }));
        } else {
            setFormData((prevData) => ({
                ...prevData,
                [name]: value
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = new FormData();
        data.append('businessName', formData.businessName);
        data.append('category', formData.category);
        data.append('location', formData.location);
        data.append('description', formData.description);
        data.append('openingHours', formData.openingHours);

        // Append the files
        if (formData.ownerPhoto) {
            data.append('ownerPhoto', formData.ownerPhoto[0]);
        }
        if (formData.images.length > 0) {
            for (let i = 0; i < formData.images.length; i++) {
                data.append('images', formData.images[i]);
            }
        }

        try {
            const response = await axios.post('http://localhost:3000/api/business/create', data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            // Handle successful response
            console.log('Business created:', response.data);
        } catch (error) {
            // Handle error
            console.error('Error creating business:', error);
        }
    };

    return (
        <div className="flex justify-center items-center h-screen w-screen bg-green-900">
            <div className="bg-white p-6 shadow-2xl rounded-2xl w-full max-w-3xl">
                <h1 className="text-4xl font-extrabold text-center mb-8 text-green-700">Add Your Business</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input 
                        type="text" 
                        name="businessName" 
                        placeholder="Business Name" 
                        className="input-field w-full p-2 border border-green-300 rounded-md text-black"
                        onChange={handleChange}
                    />
                    <input 
                        type="text" 
                        name="category" 
                        placeholder="Category" 
                        className="input-field w-full p-2 border border-green-300 rounded-md text-black"
                        onChange={handleChange}
                    />
                    <input 
                        type="text" 
                        name="location" 
                        placeholder="Location" 
                        className="input-field w-full p-2 border border-green-300 rounded-md text-black"
                        onChange={handleChange}
                    />
                    <textarea 
                        name="description" 
                        placeholder="Description" 
                        className="input-field w-full p-2 border border-green-300 rounded-md text-black"
                        onChange={handleChange}
                    />
                    <label className="text-black">Owner's Photo</label>
                    <div className="border-2 border-dashed border-green-400 bg-green-200 rounded-md p-4 mb-4">
                        <input 
                            type="file" 
                            name="ownerPhoto" 
                            className="file-upload w-full text-black"
                            onChange={handleChange}
                        />
                    </div>
                    <label className="text-black">Add Images</label>
                    <div className="border-2 border-dashed border-green-400 bg-green-200 rounded-md p-4 mb-4">
                        <input 
                            type="file" 
                            name="images" 
                            className="file-upload w-full text-black" 
                            multiple
                            onChange={handleChange}
                        />
                    </div>
                    <label className="text-black">Opening Hours</label>
                    <select 
                        name="openingHours" 
                        className="dropdown w-full p-2 border border-green-300 rounded-md bg-green-100 text-black"
                        onChange={handleChange}
                    >
                        <option value="9 AM - 5 PM">9 AM - 5 PM</option>
                        <option value="10 AM - 6 PM">10 AM - 6 PM</option>
                        <option value="24 Hours">24 Hours</option>
                    </select>
                    <button 
                        type="submit" 
                        className="submit-btn w-full bg-green-700 text-white py-2 rounded-md hover:bg-green-800 transition-all mt-4"
                    >
                        Add Business
                    </button>
                </form>
            </div>
        </div>
    );
}

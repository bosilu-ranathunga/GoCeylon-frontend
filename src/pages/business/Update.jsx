import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import TopNameBar from '../../components/TopNameBar';
import API_BASE_URL from "../../config/config";
import axios from 'axios';

export default function Update() {
    const { businessId } = useParams();  // Assuming the business ID is passed in the route
    console.log(businessId); // Verify if it's correct
    const [formData, setFormData] = useState({
        business_name: "",
        business_category: "",
        contact_number: "",
        address: "",
        description: "",
        ownerPhoto: null,
        images: [],
        openingHours: ""
    });
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        if (!businessId) {
            setErrorMessage("Business ID is missing.");
            return;
        }

        // Fetch the business data if businessId is valid
        const fetchBusinessData = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/api/business/${businessId}`);
                const result = response.data;
                setFormData({
                    business_name: result.business_name,
                    business_category: result.business_category,
                    contact_number: result.contact_number,
                    address: result.address,
                    description: result.description,
                    ownerPhoto: result.ownerPhoto,
                    images: result.images || [],
                    openingHours: result.openingHours,
                });
            } catch (error) {
                setErrorMessage("Failed to fetch business data.");
            }
        };

        fetchBusinessData();
    }, [businessId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        if (name === "ownerPhoto") {
            setFormData({ ...formData, ownerPhoto: files[0] });
        } else if (name === "images") {
            setFormData({ ...formData, images: Array.from(files) });
        }
    };

    const validateForm = () => {
        // Basic validation for required fields
        const { business_name, business_category, contact_number, address, openingHours } = formData;
        if (!business_name || !business_category || !contact_number || !address || !openingHours) {
            setErrorMessage("Please fill in all required fields.");
            return false;
        }
        setErrorMessage("");
        return true;
    };

    const resetForm = () => {
        setFormData({
            business_name: "",
            business_category: "",
            contact_number: "",
            address: "",
            description: "",
            ownerPhoto: null,
            images: [],
            openingHours: ""
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);
        const formDataToSend = new FormData();

        // Get logged in user id from token
        const token = localStorage.getItem('authToken');
        const decoded = JSON.parse(atob(token.split('.')[1]));
        const user_id = decoded.id;
        if (!user_id) {
            setErrorMessage("User ID not found. Please log in.");
            setLoading(false);
            return;
        }
        formDataToSend.append("user_id", user_id);
        formDataToSend.append("businessId", businessId);

        Object.keys(formData).forEach((key) => {
            if (key === "images") {
                formData[key].forEach((image) => {
                    formDataToSend.append("images", image);
                });
            } else {
                formDataToSend.append(key, formData[key]);
            }
        });

        try {
            const response = await axios.put(`${API_BASE_URL}/api/business/${businessId}`, formDataToSend, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            if (response.status === 200) {
                setSuccessMessage("Business updated successfully!");
                resetForm();
                navigate(`/business/info/${businessId}`);
            } else {
                setErrorMessage(response.data.error || "Failed to update business.");
            }
        } catch (error) {
            setErrorMessage("An error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <TopNameBar title="Update Business" />
            <div className="container mx-auto p-6 mt-[4rem] bg-gray-100 min-h-screen">
                <div className="max-w-lg mx-auto bg-white p-6 rounded-xl shadow-md mt-1">
                    {errorMessage && (
                        <div className="mb-4 text-red-600 text-center">
                            {errorMessage}
                        </div>
                    )}
                    {successMessage && (
                        <div className="mb-4 text-green-600 text-center">
                            {successMessage}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="flex flex-col">
                            <label className="mb-1 font-medium">Business Name *</label>
                            <input
                                type="text"
                                name="business_name"
                                placeholder="Business Name"
                                onChange={handleChange}
                                value={formData.business_name}
                                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#007a55]"
                                required
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="mb-1 font-medium">Category *</label>
                            <input
                                type="text"
                                name="business_category"
                                placeholder="Category"
                                onChange={handleChange}
                                value={formData.business_category}
                                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#007a55]"
                                required
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="mb-1 font-medium">Contact Number *</label>
                            <input
                                type="text"
                                name="contact_number"
                                placeholder="Contact Number"
                                onChange={handleChange}
                                value={formData.contact_number}
                                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#007a55]"
                                required
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="mb-1 font-medium">Address *</label>
                            <input
                                type="text"
                                name="address"
                                placeholder="Address"
                                onChange={handleChange}
                                value={formData.address}
                                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#007a55]"
                                required
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="mb-1 font-medium">Description</label>
                            <textarea
                                name="description"
                                placeholder="Description"
                                onChange={handleChange}
                                value={formData.description}
                                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#007a55]"
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="mb-1 font-medium">Owner Photo</label>
                            <input
                                type="file"
                                name="ownerPhoto"
                                onChange={handleFileChange}
                                className="w-full p-2 border rounded"
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="mb-1 font-medium">Business Images</label>
                            <input
                                type="file"
                                name="images"
                                onChange={handleFileChange}
                                multiple
                                className="w-full p-2 border rounded"
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="mb-1 font-medium">Opening Hours *</label>
                            <input
                                type="text"
                                name="openingHours"
                                placeholder="Opening Hours"
                                onChange={handleChange}
                                value={formData.openingHours}
                                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#007a55]"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className={`w-full mt-6 bg-[#007a55] text-white font-bold py-2 px-4 rounded-lg ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                            disabled={loading}
                        >
                            {loading ? "Updating..." : "Update"}
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
}

import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Select from "react-select";
import Sidebar from "../../components/Sidebar";
import axios from "axios";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import API_BASE_URL from "../../config/config";

const UpdateAttractionForm = () => {

    const token = localStorage.getItem("authToken");

    const { id } = useParams();
    const [attractionData, setAttractionData] = useState({
        name: "",
        description: "",
        google_map_url: "",
        tags: [],
        images: [],
        existingImages: [],
        points: [{ point: "", text: "" }]
    });

    const [imagePreviews, setImagePreviews] = useState([]);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        const fetchAttraction = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/location/${id}`);
                const data = response.data;
                console.log("Fetched attraction data:", data);
                setAttractionData({
                    name: data.name,
                    description: data.description,
                    google_map_url: data.google_map_url,
                    tags: data.tags || [],
                    images: [], // Will hold new images
                    existingImages: data.image_url || [], // Existing images from the backend
                    points: data.points || [{ point: "", text: "" }] // Existing points or empty point
                });
            } catch (error) {
                console.error("Error fetching attraction:", error);
            }
        };
        fetchAttraction();
    }, [id]);

    const tagOptions = [
        { value: "beach", label: "Beach" },
        { value: "mountain", label: "Mountain" },
        { value: "historical", label: "Historical" },
        { value: "cultural", label: "Cultural" },
        { value: "adventure", label: "Adventure" },
        { value: "wildlife", label: "Wildlife" }
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setAttractionData(prevData => ({ ...prevData, [name]: value }));
    };

    const handleTagChange = (selectedOptions) => {
        const selectedTags = selectedOptions ? selectedOptions.map(option => option.value) : [];
        setAttractionData(prevData => ({ ...prevData, tags: selectedTags }));
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        console.log("Selected files:", files);
        setAttractionData(prevData => ({
            ...prevData,
            images: [...prevData.images, ...files] // New images to be added
        }));
        const newPreviews = files.map(file => URL.createObjectURL(file));
        setImagePreviews(prevPreviews => [...prevPreviews, ...newPreviews]);
        console.log("Updated images state:", [...attractionData.images, ...files]);
    };

    const removeExistingImage = (index) => {
        console.log("Removing existing image at index:", index);
        setAttractionData(prevData => ({
            ...prevData,
            existingImages: prevData.existingImages.filter((_, i) => i !== index)
        }));
    };

    const removeNewImage = (index) => {
        console.log("Removing new image at index:", index);
        setImagePreviews(prevPreviews => prevPreviews.filter((_, i) => i !== index));
        setAttractionData(prevData => ({
            ...prevData,
            images: prevData.images.filter((_, i) => i !== index)
        }));
    };

    const handlePointChange = (index, field, value) => {
        const updatedPoints = [...attractionData.points];
        updatedPoints[index][field] = value;
        setAttractionData(prevData => ({ ...prevData, points: updatedPoints }));
    };

    const addPoint = () => {
        setAttractionData(prevData => ({
            ...prevData,
            points: [...prevData.points, { point: "", text: "" }]
        }));
    };

    const removePoint = (index) => {
        setAttractionData(prevData => ({
            ...prevData,
            points: prevData.points.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        let validationErrors = {};
        if (!attractionData.name.trim()) validationErrors.name = "Name is required";
        if (!attractionData.description.trim()) validationErrors.description = "Description is required";
        const googleMapUrlRegex = /^https:\/\/maps\.app\.goo\.gl\/[a-zA-Z0-9_-]+/;
        if (!googleMapUrlRegex.test(attractionData.google_map_url)) {
            validationErrors.google_map_url = "Invalid Google Map URL format. It should be from the Google Maps mobile app.";
        }

        setErrors(validationErrors);
        if (Object.keys(validationErrors).length > 0) return;
        try {
            const formData = new FormData();
            formData.append("name", attractionData.name);
            formData.append("description", attractionData.description);
            formData.append("google_map_url", attractionData.google_map_url);
            formData.append("tags", JSON.stringify(attractionData.tags));
            formData.append("points", JSON.stringify(attractionData.points));
            formData.append("existingImages", JSON.stringify(attractionData.existingImages));
            attractionData.images.forEach((image, index) => {
                console.log(`Appending image ${index}:`, image);
                formData.append("images", image);
            });
            console.log("FormData content:", [...formData.entries()]);
            const response = await axios.put(`${API_BASE_URL}/location/${id}`, formData, {
                headers: { "Authorization": `Bearer ${token}`, "Content-Type": "multipart/form-data" }
            });
            if (response.status >= 200 && response.status < 300) {
                alert("Attraction updated successfully!");
            } else {
                throw new Error("Failed to update attraction.");
            }
        } catch (error) {
            console.error("Error updating attraction:", error);
            alert("Failed to update attraction.");
        }
    };

    // Function to generate the QR code URL using the provided API
    const generateQRCode = (attractionId, pointId) => {
        return `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(JSON.stringify({ attractionId, pointId }))}`;
    };

    return (
        <div className="flex h-screen bg-gray-100">
            <Sidebar />
            <div className="flex-1 ml-64 overflow-y-auto h-screen p-8">
                <form onSubmit={handleSubmit} className="p-6 space-y-4 bg-white rounded-lg shadow-md">
                    {/* Attraction Name */}
                    <div>
                        <label htmlFor="name" className="block text-xl font-semibold text-gray-700 mb-2">
                            Attraction Name
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={attractionData.name}
                            onChange={handleChange}
                            placeholder="Enter attraction name"
                            className="border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-green-400"
                        />
                        {errors.name && <p className="text-red-500">{errors.name}</p>}
                    </div>

                    {/* Description */}
                    <div>
                        <label htmlFor="description" className="block text-xl font-semibold text-gray-700 mb-2">
                            Description
                        </label>
                        <ReactQuill
                            id="description"
                            theme="snow"
                            value={attractionData.description}
                            onChange={(value) => setAttractionData(prev => ({ ...prev, description: value }))}
                            className="bg-white rounded-lg"
                        />
                    </div>

                    {/* Google Map URL */}
                    <div>
                        <label htmlFor="google_map_url" className="block text-xl font-semibold text-gray-700 mb-2">
                            Google Map URL
                        </label>
                        <input
                            type="text"
                            name="google_map_url"
                            value={attractionData.google_map_url}
                            onChange={handleChange}
                            placeholder="Enter Google Map URL"
                            className="border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-green-400"
                        />
                        {errors.google_map_url && <p className="text-red-500">{errors.google_map_url}</p>}
                    </div>

                    {/* Tags */}
                    <div>
                        <label htmlFor="tags" className="block text-xl font-semibold text-gray-700 mb-2">
                            Tags
                        </label>
                        <Select
                            isMulti
                            options={tagOptions}
                            value={tagOptions.filter(option => attractionData.tags.includes(option.value))}
                            onChange={handleTagChange}
                            className="react-select-container"
                            classNamePrefix="react-select"
                        />
                        {errors.tags && <p className="text-red-500">{errors.tags}</p>}
                    </div>

                    {/* Images */}
                    <div>
                        <label htmlFor="images" className="block text-xl font-semibold text-gray-700 mb-2">
                            Images
                        </label>
                        <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleImageChange}
                            className="border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-green-400"
                        />
                        {errors.images && <p className="text-red-500">{errors.images}</p>}
                    </div>

                    {/* Image Previews */}
                    <div className="flex flex-wrap gap-4">
                        {attractionData.existingImages.map((src, index) => (
                            <div key={index} className="relative">
                                <img src={src} className="w-24 h-24 object-cover rounded-lg shadow-md" alt="Existing" />
                                <button
                                    type="button"
                                    className="absolute top-0 right-0 bg-red-500 text-white px-2 py-1 rounded-full"
                                    onClick={() => removeExistingImage(index)}
                                >
                                    X
                                </button>
                            </div>
                        ))}
                        {imagePreviews.map((src, index) => (
                            <div key={index} className="relative">
                                <img src={src} className="w-24 h-24 object-cover rounded-lg shadow-md" alt="Preview" />
                                <button
                                    type="button"
                                    className="absolute top-0 right-0 bg-red-500 text-white px-2 py-1 rounded-full"
                                    onClick={() => removeNewImage(index)}
                                >
                                    X
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* Points Section */}
                    <div>
                        <h3 className="text-xl font-semibold text-gray-700 mb-4">Points of Interest</h3>
                        {attractionData.points.map((point, index) => (
                            <div key={index} className="flex flex-col md:flex-row gap-4 mb-4 items-center">
                                <input
                                    type="text"
                                    value={point.point}
                                    onChange={(e) => handlePointChange(index, 'point', e.target.value)}
                                    placeholder={`Point ${index + 1} ID`}
                                    className="border border-gray-300 rounded-lg p-3 w-full md:w-1/3 focus:outline-none focus:ring-2 focus:ring-green-400"
                                />
                                {errors[`point${index}`] && <p className="text-red-500">{errors[`point${index}`]}</p>}
                                <input
                                    type="text"
                                    value={point.text}
                                    onChange={(e) => handlePointChange(index, 'text', e.target.value)}
                                    placeholder={`Point ${index + 1} Description`}
                                    className="border border-gray-300 rounded-lg p-3 w-full md:w-1/3 focus:outline-none focus:ring-2 focus:ring-green-400"
                                />
                                {errors[`text${index}`] && <p className="text-red-500">{errors[`text${index}`]}</p>}
                                <button
                                    type="button"
                                    onClick={() => removePoint(index)}
                                    className="bg-red-500 text-white px-4 py-2 rounded-lg"
                                >
                                    Remove
                                </button>
                                {/* Inline QR Code for each point using the provided API */}
                                <img
                                    src={generateQRCode(id, point.point)}
                                    alt={`QR Code for Point ${index + 1}`}
                                    className="w-24 h-24 rounded-lg shadow-md mt-2 md:mt-0"
                                />
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={addPoint}
                            className="bg-gray-500 text-white px-6 py-3 rounded-lg w-full transition duration-300 "
                        >
                            Add New Point
                        </button>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="bg-emerald-700 text-white px-6 py-3 rounded-lg w-full transition duration-300"
                    >
                        Update Attraction
                    </button>
                </form>
            </div>
        </div>
    );
};

export default UpdateAttractionForm;

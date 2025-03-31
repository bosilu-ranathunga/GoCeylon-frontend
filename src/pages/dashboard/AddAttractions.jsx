import React, { useState } from "react";
import Sidebar from '../../components/Sidebar';
import Select from "react-select";
import axios from "axios";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import API_BASE_URL from "../../config/config";

const AddAttractionForm = () => {

    const [attractionData, setAttractionData] = useState({
        name: "",
        description: "",
        google_map_url: "",
        tags: [],
        images: [], // Store multiple images as an array
        points: [{ point: "", text: "" }]
    });

    const [errors, setErrors] = useState({});
    const [imagePreviews, setImagePreviews] = useState([]); // Store image preview URLs

    const handleChange = (e) => {
        const { name, value } = e.target;
        console.log(`Field changed: ${name} = ${value}`); // Debugging log
        setAttractionData({ ...attractionData, [name]: value });
    };

    const tagOptions = [
        { value: "beach", label: "Beach" },
        { value: "mountain", label: "Mountain" },
        { value: "historical", label: "Historical" },
        { value: "cultural", label: "Cultural" },
        { value: "adventure", label: "Adventure" },
        { value: "wildlife", label: "Wildlife" }
    ];

    const handleTagChange = (selectedOptions) => {
        const selectedTags = selectedOptions ? selectedOptions.map(option => option.value) : [];
        console.log("Selected tags: ", selectedTags); // Debugging log
        setAttractionData({ ...attractionData, tags: selectedTags });
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        console.log("Selected images: ", files); // Debugging log

        // Append new images instead of replacing old ones
        setAttractionData(prevData => ({
            ...prevData,
            images: [...prevData.images, ...files]
        }));

        // Generate and append previews
        const newPreviews = files.map(file => URL.createObjectURL(file));
        setImagePreviews(prevPreviews => [...prevPreviews, ...newPreviews]);
    };

    const removeImage = (index) => {
        console.log(`Removing image at index: ${index}`); // Debugging log
        // Remove from both the previews and the files list
        setImagePreviews(prevPreviews => prevPreviews.filter((_, i) => i !== index));
        setAttractionData(prevData => ({
            ...prevData,
            images: prevData.images.filter((_, i) => i !== index)
        }));
    };

    const handlePointChange = (index, field, value) => {
        console.log(`Point changed at index ${index}: ${field} = ${value}`); // Debugging log
        const updatedPoints = [...attractionData.points];
        updatedPoints[index][field] = value;
        setAttractionData({ ...attractionData, points: updatedPoints });
    };

    const addPoint = () => {
        console.log("Adding new point..."); // Debugging log
        setAttractionData(prevData => ({
            ...prevData,
            points: [...prevData.points, { point: "", text: "" }]
        }));
    };

    const removePoint = (index) => {
        console.log(`Removing point at index: ${index}`); // Debugging log
        setAttractionData(prevData => ({
            ...prevData,
            points: prevData.points.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Form submission triggered."); // Debugging log

        let validationErrors = {};
        if (!attractionData.name.trim()) validationErrors.name = "Name is required";
        if (!attractionData.description.trim()) validationErrors.description = "Description is required";
        if (!attractionData.google_map_url.trim()) validationErrors.google_map_url = "Google Map URL is required";
        if (attractionData.tags.length === 0) validationErrors.tags = "At least one tag is required";
        if (attractionData.images.length === 0) validationErrors.images = "At least one image is required";

        attractionData.points.forEach((poi, index) => {
            if (!poi.point.trim()) validationErrors[`point${index}`] = `Point ${index + 1} is missing a Point ID`;
            if (!poi.text.trim()) validationErrors[`text${index}`] = `Point ${index + 1} is missing a Description`;
        });

        setErrors(validationErrors);
        if (Object.keys(validationErrors).length > 0) {
            console.log("Validation errors: ", validationErrors); // Debugging log
            return;
        }

        try {
            const formData = new FormData();
            formData.append("name", attractionData.name);
            formData.append("description", attractionData.description);
            formData.append("google_map_url", attractionData.google_map_url);
            formData.append("tags", JSON.stringify(attractionData.tags));
            formData.append("points", JSON.stringify(attractionData.points));

            // Append multiple images correctly
            attractionData.images.forEach((image) => {
                formData.append("images", image);
            });

            // Debugging the formData (since console.log can't print FormData directly)
            console.log("Form data before submission:", attractionData);

            const token = localStorage.getItem("authToken");

            const response = await axios.post(`${API_BASE_URL}/location/`, formData, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            });

            console.log("Response from server:", response); // Debugging log

            // Updated condition to handle all successful status codes
            if (response.status >= 200 && response.status < 300) {
                alert("Attraction added successfully!");
                setAttractionData({
                    name: "",
                    description: "",
                    google_map_url: "",
                    tags: [],
                    images: [],
                    points: [{ point: "", text: "" }]
                });
                setImagePreviews([]);
            } else {
                throw new Error("Failed to add attraction.");
            }

        } catch (error) {
            console.error("Error submitting attraction:", error); // Debugging log
            alert("Failed to add attraction. Check the console for details.");
        }
    };

    return (
        <div className="flex h-screen bg-[#eee]">
            <Sidebar />
            <div className="flex-1 ml-64 overflow-y-auto h-screen p-8">

                <form onSubmit={handleSubmit} className="p-6 space-y-4 bg-white rounded-lg shadow-md">

                    <div>
                        <label htmlFor="name" className="block text-lg font-semibold text-gray-700 mb-1">Attraction Name</label>
                        <input
                            id="name"
                            type="text"
                            name="name"
                            placeholder="Attraction Name"
                            value={attractionData.name}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 outline-none"
                        />
                        {errors.name && <p className="text-red-500">{errors.name}</p>}
                    </div>

                    <div>
                        <label htmlFor="description" className="block text-lg font-semibold text-gray-700 mb-1">Description</label>
                        <ReactQuill
                            id="description"
                            theme="snow"
                            value={attractionData.description}
                            onChange={(value) => setAttractionData(prev => ({ ...prev, description: value }))}
                            className="text-black"
                        />

                        {/*
                    <textarea
                        name="description"
                        placeholder="Description"
                        value={attractionData.description}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 outline-none"
                    />
                    {errors.description && <p className="text-red-500">{errors.description}</p>}
                    */}
                    </div>

                    <div>
                        <label htmlFor="google_map_url" className="block text-lg font-semibold text-gray-700 mb-1">Google Map URL</label>
                        <input
                            id="google_map_url"
                            type="text"
                            name="google_map_url"
                            placeholder="Google Map URL"
                            value={attractionData.google_map_url}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 outline-none"
                        />
                        {errors.google_map_url && <p className="text-red-500">{errors.google_map_url}</p>}
                    </div>

                    <div>
                        <label htmlFor="tags" className="block text-lg font-semibold text-gray-700 mb-1">Tags</label>
                        <Select
                            id="tags"
                            isMulti
                            options={tagOptions}
                            value={tagOptions.filter(option => attractionData.tags.includes(option.value))}
                            onChange={handleTagChange}
                            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 outline-none"
                        />
                        {errors.tags && <p className="text-red-500">{errors.tags}</p>}
                    </div>

                    <div>
                        <label htmlFor="images" className="block text-lg font-semibold text-gray-700 mb-1">Images</label>
                        <input
                            id="images"
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleImageChange}
                            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 outline-none"
                        />
                        {errors.images && <p className="text-red-500">{errors.images}</p>}
                        {imagePreviews.length > 0 && (
                            <div className="flex space-x-2">
                                {imagePreviews.map((src, index) => (
                                    <div key={index} className="relative">
                                        <img src={src} className="w-20 h-20 rounded" alt="Preview" />
                                        <button
                                            type="button"
                                            className="absolute top-0 right-0 bg-red-500 text-white px-2 rounded-full"
                                            onClick={() => removeImage(index)}
                                        >
                                            X
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div>
                        {/* Rendering Points Input Fields */}
                        {attractionData.points.map((point, index) => (
                            <div key={index} className="space-y-2">
                                <input
                                    type="text"
                                    placeholder={`Point ${index + 1} ID`}
                                    value={point.point}
                                    onChange={(e) => handlePointChange(index, 'point', e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 outline-none"
                                />
                                {errors[`point${index}`] && <p className="text-red-500">{errors[`point${index}`]}</p>}

                                <textarea
                                    placeholder={`Point ${index + 1} Description`}
                                    value={point.text}
                                    onChange={(e) => handlePointChange(index, 'text', e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 outline-none"
                                />
                                {errors[`text${index}`] && <p className="text-red-500">{errors[`text${index}`]}</p>}

                                <button
                                    type="button"
                                    onClick={() => removePoint(index)}
                                    className="text-red-500"
                                >
                                    Remove Point {index + 1}
                                </button>
                            </div>
                        ))}

                        <button
                            type="button"
                            onClick={addPoint}
                            className="bg-blue-500 text-white px-4 py-2"
                        >
                            Add Point
                        </button>

                    </div>

                    <button type="submit" className="bg-emerald-700 text-white px-4 py-2 w-full">Add Attraction</button>

                </form>
            </div>
        </div>
    );
};

export default AddAttractionForm;

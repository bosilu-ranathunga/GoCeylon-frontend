import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Select from "react-select";
import Sidebar from "../../components/Sidebar";
import API_BASE_URL from "../../config/config";
import axios from "axios";

const UpdateAttractionForm = () => {
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

    const token = localStorage.getItem("authToken");

    useEffect(() => {
        const fetchAttraction = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/location/${id}`,);
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
            points: [...prevData.points, { point: "", text: "" }] // Add new empty point
        }));
    };

    const removePoint = (index) => {
        setAttractionData(prevData => ({
            ...prevData,
            points: prevData.points.filter((_, i) => i !== index) // Remove point by index
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        let validationErrors = {};
        if (!attractionData.name.trim()) validationErrors.name = "Name is required";
        if (!attractionData.description.trim()) validationErrors.description = "Description is required";
        if (!attractionData.google_map_url.trim()) validationErrors.google_map_url = "Google Map URL is required";
        if (attractionData.tags.length === 0) validationErrors.tags = "At least one tag is required";

        attractionData.points.forEach((poi, index) => {
            if (!poi.point.trim()) validationErrors[`point${index}`] = `Point ${index + 1} is missing a Point ID`;
            if (!poi.text.trim()) validationErrors[`text${index}`] = `Point ${index + 1} is missing a Description`;
        });

        setErrors(validationErrors);
        if (Object.keys(validationErrors).length > 0) return;

        try {
            const formData = new FormData();
            formData.append("name", attractionData.name);
            formData.append("description", attractionData.description);
            formData.append("google_map_url", attractionData.google_map_url);
            formData.append("tags", JSON.stringify(attractionData.tags)); // Send tags as a stringified array
            formData.append("points", JSON.stringify(attractionData.points)); // Send points as a stringified array
            formData.append("existingImages", JSON.stringify(attractionData.existingImages)); // Send existing images as a stringified array

            // Append new images
            attractionData.images.forEach((image, index) => {
                console.log(`Appending image ${index}:`, image);
                formData.append("images", image);
            });

            console.log("FormData content:", [...formData.entries()]);

            const response = await axios.put(`${API_BASE_URL}/location/${id}`, formData, {
                headers: { "Content-Type": "multipart/form-data", "Authorization": `Bearer ${token}` }
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

    return (

        <div className="flex h-screen bg-[#eee]">
            <Sidebar />
            <div className="flex-1 ml-64 overflow-y-auto h-screen p-8">
                <form onSubmit={handleSubmit} className="p-6 space-y-4 bg-white rounded-lg shadow-md">
                    <input type="text" name="name" value={attractionData.name} onChange={handleChange} placeholder="Attraction Name" className="border p-2 w-full" />
                    <textarea name="description" value={attractionData.description} onChange={handleChange} placeholder="Description" className="border p-2 w-full" />
                    <input type="text" name="google_map_url" value={attractionData.google_map_url} onChange={handleChange} placeholder="Google Map URL" className="border p-2 w-full" />

                    <Select isMulti options={tagOptions} value={tagOptions.filter(option => attractionData.tags.includes(option.value))} onChange={handleTagChange} className="border p-2 w-full" />

                    <input type="file" multiple accept="image/*" onChange={handleImageChange} className="border p-2 w-full" />

                    <div className="flex flex-wrap gap-2">
                        {attractionData.existingImages.map((src, index) => (
                            <div key={index} className="relative">
                                <img src={src} className="w-20 h-20 rounded" alt="Existing" />
                                <button type="button" className="absolute top-0 right-0 bg-red-500 text-white px-2 rounded-full" onClick={() => removeExistingImage(index)}>X</button>
                            </div>
                        ))}
                        {imagePreviews.map((src, index) => (
                            <div key={index} className="relative">
                                <img src={src} className="w-20 h-20 rounded" alt="Preview" />
                                <button type="button" className="absolute top-0 right-0 bg-red-500 text-white px-2 rounded-full" onClick={() => removeNewImage(index)}>X</button>
                            </div>
                        ))}
                    </div>

                    {/* Points Section */}
                    <div>
                        <h3>Points of Interest</h3>
                        {attractionData.points.map((point, index) => (
                            <div key={index} className="flex gap-4 mb-2">
                                <input
                                    type="text"
                                    value={point.point}
                                    onChange={(e) => handlePointChange(index, 'point', e.target.value)}
                                    placeholder={`Point ${index + 1} ID`}
                                    className="border p-2 w-full"
                                />
                                <input
                                    type="text"
                                    value={point.text}
                                    onChange={(e) => handlePointChange(index, 'text', e.target.value)}
                                    placeholder={`Point ${index + 1} Description`}
                                    className="border p-2 w-full"
                                />
                                <button type="button" onClick={() => removePoint(index)} className="bg-red-500 text-white px-2 py-1 rounded">Remove</button>
                            </div>
                        ))}
                        <button type="button" onClick={addPoint} className="bg-blue-500 text-white px-4 py-2 w-full">Add New Point</button>
                    </div>

                    <button type="submit" className="bg-green-500 text-white px-4 py-2 w-full">Update Attraction</button>
                </form>
            </div>
        </div>
    );
};

export default UpdateAttractionForm;

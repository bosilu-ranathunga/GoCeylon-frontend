import React, { useState } from 'react';
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Import Quill styles
import Sidebar from '../../components/Sidebar';
import TopBar from '../../components/TopBar';


export default function AddAttractions() {
    const [attractionData, setAttractionData] = useState({
        name: '',
        description: '',
        googleLocation: '',
        overcrowded: false,
        hiddenGem: false,
        tags: [],
        images: [],
        pointsOfInterest: [{ id: '', description: '' }]
    });

    const handleChange = (e) => {
        const { name, value, type, checked, files } = e.target;

        if (type === 'checkbox') {
            setAttractionData((prevState) => ({
                ...prevState,
                [name]: checked
            }));
        } else if (type === 'file') {
            setAttractionData((prevState) => ({
                ...prevState,
                images: [...prevState.images, ...Array.from(files)]
            }));
        } else if (type === 'select-multiple') {
            const selectedTags = Array.from(e.target.selectedOptions, option => option.value);
            setAttractionData((prevState) => ({
                ...prevState,
                tags: selectedTags
            }));
        } else {
            setAttractionData((prevState) => ({
                ...prevState,
                [name]: value
            }));
        }
    };

    // Remove an image from preview
    const removeImage = (index) => {
        setAttractionData((prevState) => ({
            ...prevState,
            images: prevState.images.filter((_, i) => i !== index)
        }));
    };

    // Handle changes in Points of Interest
    const handlePointChange = (index, e) => {
        const { name, value } = e.target;
        const updatedPoints = [...attractionData.pointsOfInterest];
        updatedPoints[index][name] = value;
        setAttractionData((prevState) => ({
            ...prevState,
            pointsOfInterest: updatedPoints
        }));
    };

    // Add new Point of Interest
    const addPoint = () => {
        setAttractionData((prevState) => ({
            ...prevState,
            pointsOfInterest: [...prevState.pointsOfInterest, { id: '', description: '' }]
        }));
    };

    // Remove a Point of Interest
    const removePoint = (index) => {
        const updatedPoints = [...attractionData.pointsOfInterest];
        updatedPoints.splice(index, 1);
        setAttractionData((prevState) => ({
            ...prevState,
            pointsOfInterest: updatedPoints
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Attraction Data Submitted:', attractionData);
    };

    return (

        <div className="flex h-screen">
            <Sidebar />
            <div className="flex-1 ml-64 overflow-y-auto h-screen">
                <div className="bg-white w-full p-12">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Name Field */}
                        <div>
                            <label className="block text-lg font-semibold text-gray-700">Attraction Name</label>
                            <input
                                type="text"
                                name="name"
                                value={attractionData.name}
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                                required
                            />
                        </div>

                        {/* Description Field */}
                        <div>
                            <label className="block text-lg font-semibold text-gray-700">Description</label>
                            <ReactQuill theme="snow" />

                        </div>

                        {/* Google Location */}
                        <div>
                            <label className="block text-lg font-semibold text-gray-700">Google Location</label>
                            <input
                                type="text"
                                name="googleLocation"
                                value={attractionData.googleLocation}
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                                required
                            />
                        </div>

                        {/* Overcrowded & Hidden Gem */}
                        <div className="flex gap-6">
                            <label className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    name="overcrowded"
                                    checked={attractionData.overcrowded}
                                    onChange={handleChange}
                                    className="h-5 w-5 text-green-600"
                                />
                                <span className="text-lg text-gray-700">Overcrowded</span>
                            </label>
                            <label className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    name="hiddenGem"
                                    checked={attractionData.hiddenGem}
                                    onChange={handleChange}
                                    className="h-5 w-5 text-green-600"
                                />
                                <span className="text-lg text-gray-700">Hidden Gem</span>
                            </label>
                        </div>

                        {/* Tags Selection */}
                        <div>
                            <label className="block text-lg font-semibold text-gray-700">Tags</label>
                            <select
                                name="tags"
                                multiple
                                value={attractionData.tags}
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                            >
                                <option value="beachside">Beachside Venue</option>
                                <option value="forest">Forest</option>
                                <option value="historical">Historical Place</option>
                                <option value="hiking">Hiking Place</option>
                            </select>
                        </div>

                        {/* Image Upload */}
                        <div>
                            <label className="block text-lg font-semibold text-gray-700">Upload Images</label>
                            <input type="file" name="images" accept="image/*" multiple onChange={handleChange} className="hidden" id="imageUpload" />
                            <label htmlFor="imageUpload" className="block w-full text-center bg-green-600 text-white py-2 rounded-md cursor-pointer hover:bg-green-700 transition">
                                {attractionData.images.length === 0 ? "Choose Images" : "Choose More Images"}
                            </label>

                            {/* Image Preview with Remove Button */}
                            <div className="mt-2 flex flex-wrap">
                                {attractionData.images.map((file, index) => (
                                    <div key={index} className="relative w-16 h-16">
                                        <img src={URL.createObjectURL(file)} alt="Preview" className="w-full h-full object-cover rounded-md" />
                                        <button
                                            type="button"
                                            onClick={() => removeImage(index)}
                                            className="absolute -top-2 -right-2 bg-red-500 text-white w-5 h-5 flex items-center justify-center rounded-full text-xs"
                                        >
                                            ✖
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Points of Interest */}
                        <div>
                            <label className="block text-lg font-semibold text-gray-700">Points of Interest</label>
                            {attractionData.pointsOfInterest.map((point, index) => (
                                <div key={index} className="flex gap-2 items-center mb-2">
                                    <input
                                        type="text"
                                        name="id"
                                        value={point.id}
                                        onChange={(e) => handlePointChange(index, e)}
                                        placeholder="ID"
                                        className="w-1/3 p-2 border border-gray-300 rounded-md"
                                    />
                                    <input
                                        type="text"
                                        name="description"
                                        value={point.description}
                                        onChange={(e) => handlePointChange(index, e)}
                                        placeholder="Description"
                                        className="w-2/3 p-2 border border-gray-300 rounded-md"
                                    />
                                    <button type="button" onClick={() => removePoint(index)} className="text-red-600">✖</button>
                                </div>
                            ))}
                            <button type="button" onClick={addPoint} className="text-green-600">+ Add Point</button>
                        </div>

                        {/* Submit Button */}
                        <button type="submit" className="w-full bg-green-600 text-white text-lg font-semibold py-3 rounded-md hover:bg-green-700 transition">
                            Submit Attraction
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

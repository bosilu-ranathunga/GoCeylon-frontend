import React, { useState } from 'react';
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Select from 'react-select';
import Sidebar from '../../components/Sidebar';
import TopBar from '../../components/TopBar';

const tagOptions = [
    { value: 'beachside', label: 'Beachside Venue' },
    { value: 'forest', label: 'Forest' },
    { value: 'historical', label: 'Historical Place' },
    { value: 'hiking', label: 'Hiking Place' },
    { value: 'overcrowded', label: 'Overcrowded' },
    { value: 'hiddenGem', label: 'Hidden Gem' }
];

export default function AddAttractions() {
    const [attractionData, setAttractionData] = useState({
        name: '',
        description: '',
        googleLocation: '',
        tags: [],
        images: [],
        pointsOfInterest: [{ id: '', description: '' }]
    });

    const [imagePreviews, setImagePreviews] = useState([]);
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;
        if (type === 'file') {
            const selectedFiles = Array.from(files);
            const validImages = selectedFiles.filter(file =>
                file.type.startsWith('image/') // Validate file type is image
            );

            if (validImages.length === selectedFiles.length) {
                // Generate preview URLs for valid image files
                const newPreviews = validImages.map(file => URL.createObjectURL(file));

                setAttractionData((prevState) => ({
                    ...prevState,
                    images: [...prevState.images, ...validImages]
                }));

                setImagePreviews((prevPreviews) => [...prevPreviews, ...newPreviews]);
            } else {
                alert('Only image files are allowed');
            }
        } else {
            setAttractionData((prevState) => ({
                ...prevState,
                [name]: value
            }));
        }
    };

    const handleTagChange = (selectedOptions) => {
        setAttractionData((prevState) => ({
            ...prevState,
            tags: selectedOptions
        }));
    };

    const handlePOIChange = (index, e) => {
        const { name, value } = e.target;
        const updatedPOIs = [...attractionData.pointsOfInterest];
        updatedPOIs[index] = { ...updatedPOIs[index], [name]: value };
        setAttractionData((prevState) => ({
            ...prevState,
            pointsOfInterest: updatedPOIs
        }));
    };

    const handleAddPOI = () => {
        setAttractionData((prevState) => ({
            ...prevState,
            pointsOfInterest: [...prevState.pointsOfInterest, { id: '', description: '' }]
        }));
    };

    const handleRemovePOI = (index) => {
        const updatedPOIs = [...attractionData.pointsOfInterest];
        updatedPOIs.splice(index, 1);
        setAttractionData((prevState) => ({
            ...prevState,
            pointsOfInterest: updatedPOIs
        }));
    };

    const handleRemoveImage = (index) => {
        const updatedImages = [...attractionData.images];
        updatedImages.splice(index, 1);
        const updatedPreviews = [...imagePreviews];
        updatedPreviews.splice(index, 1);

        setAttractionData((prevState) => ({
            ...prevState,
            images: updatedImages
        }));
        setImagePreviews(updatedPreviews);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        let validationErrors = {};

        // Validate Attraction Name
        if (!attractionData.name.trim()) {
            validationErrors.name = "Attraction Name is required";
        }

        // Validate Description
        if (!attractionData.description.trim()) {
            validationErrors.description = "Description is required";
        }

        // Validate Google Location (Coordinates Format: Latitude, Longitude)
        const locationPattern = /^-?\d{1,2}\.\d+,\s*-?\d{1,3}\.\d+$/;
        if (!attractionData.googleLocation.trim()) {
            validationErrors.googleLocation = "Google Location is required";
        } else if (!locationPattern.test(attractionData.googleLocation.trim())) {
            validationErrors.googleLocation = "Enter a valid location (Latitude, Longitude)";
        }

        // Validate Tags
        if (attractionData.tags.length === 0) {
            validationErrors.tags = "At least one tag must be selected";
        }

        // Validate Points of Interest
        attractionData.pointsOfInterest.forEach((poi, index) => {
            if (!poi.id.trim()) {
                validationErrors[`poiId${index}`] = `Point of Interest ID is required for POI ${index + 1}`;
            }
            if (!poi.description.trim()) {
                validationErrors[`poiDescription${index}`] = `Description is required for POI ${index + 1}`;
            }
        });

        // Validate Images
        if (attractionData.images.length === 0) {
            validationErrors.images = "At least one image must be uploaded";
        }

        setErrors(validationErrors);

        if (Object.keys(validationErrors).length === 0) {
            console.log('Attraction Data Submitted:', attractionData);
        }
    };

    return (
        <div className="flex h-screen">
            <Sidebar />
            <div className="flex-1 ml-64 overflow-y-auto h-screen">
                <div className="bg-white w-full p-12">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-lg font-semibold text-gray-700">Attraction Name:</label>
                            <input
                                type="text"
                                name="name"
                                value={attractionData.name}
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-300 rounded-md"
                            />
                            {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                        </div>

                        <div>
                            <label className="block text-lg font-semibold text-gray-700">Description</label>
                            <ReactQuill theme="snow" value={attractionData.description} onChange={(value) => setAttractionData(prev => ({ ...prev, description: value }))} />
                            {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
                        </div>

                        <div>
                            <label className="block text-lg font-semibold text-gray-700">Google Location</label>
                            <input
                                type="text"
                                name="googleLocation"
                                value={attractionData.googleLocation}
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-300 rounded-md"
                            />
                            {errors.googleLocation && <p className="text-red-500 text-sm">{errors.googleLocation}</p>}
                        </div>

                        <div>
                            <label className="block text-lg font-semibold text-gray-700">Tags</label>
                            <Select
                                isMulti
                                options={tagOptions}
                                value={attractionData.tags}
                                onChange={handleTagChange}
                                className="w-full"
                            />
                            {errors.tags && <p className="text-red-500 text-sm">{errors.tags}</p>}
                        </div>

                        {attractionData.pointsOfInterest.map((poi, index) => (
                            <div key={index} className="space-y-2">
                                <div>
                                    <label className="block text-lg font-semibold text-gray-700">Point of Interest ID {index + 1}:</label>
                                    <input
                                        type="text"
                                        name="id"
                                        value={poi.id}
                                        onChange={(e) => handlePOIChange(index, e)}
                                        className="w-full p-3 border border-gray-300 rounded-md"
                                    />
                                    {errors[`poiId${index}`] && <p className="text-red-500 text-sm">{errors[`poiId${index}`]}</p>}
                                </div>

                                <div>
                                    <label className="block text-lg font-semibold text-gray-700">Point of Interest Description {index + 1}:</label>
                                    <input
                                        type="text"
                                        name="description"
                                        value={poi.description}
                                        onChange={(e) => handlePOIChange(index, e)}
                                        className="w-full p-3 border border-gray-300 rounded-md"
                                    />
                                    {errors[`poiDescription${index}`] && <p className="text-red-500 text-sm">{errors[`poiDescription${index}`]}</p>}
                                </div>

                                <button type="button" onClick={() => handleRemovePOI(index)} className="text-red-500 border border-red-500 py-1 px-4 rounded-md hover:bg-red-500 hover:text-white transition duration-300">
                                    Remove POI
                                </button>
                            </div>
                        ))}

                        <button type="button" onClick={handleAddPOI} className="text-blue-500">Add Another POI</button>

                        <div>
                            <label className="block text-lg font-semibold text-gray-700">Upload Images</label>
                            <input
                                type="file"
                                name="images"
                                multiple
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-300 rounded-md"
                            />
                            {errors.images && <p className="text-red-500 text-sm">{errors.images}</p>}
                        </div>

                        {imagePreviews.length > 0 && (
                            <div className="grid grid-cols-3 gap-4 mt-4">
                                {imagePreviews.map((preview, index) => (
                                    <div key={index} className="relative">
                                        <img src={preview} alt={`Preview ${index}`} className="w-full h-32 object-cover rounded-md" />
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveImage(index)}
                                            className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full"
                                        >
                                            X
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        <button type="submit" className="w-full bg-green-600 text-white text-lg font-semibold py-3 rounded-md">Submit Attraction</button>
                    </form>
                </div>
            </div>
        </div>
    );
}

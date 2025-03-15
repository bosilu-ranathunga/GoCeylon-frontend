import React, { useState } from 'react';

export default function AddAttractions() {
    const [attractionData, setAttractionData] = useState({
        name: '',
        description: '',
        googleLocation: '',
        overcrowded: false,
        hiddenGem: false,
        tags: [],
        images: []
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (type === 'checkbox') {
            setAttractionData((prevState) => ({
                ...prevState,
                [name]: checked
            }));
        } else if (type === 'file') {
            setAttractionData((prevState) => ({
                ...prevState,
                images: [...prevState.images, ...e.target.files]
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

    const handleSubmit = (e) => {
        e.preventDefault();
        // You can replace this with a backend API call later
        console.log('Attraction Data Submitted:', attractionData);
    };

    return (
        <div className="p-4 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-center mb-6">Add New Attraction</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name Field */}
                <div>
                    <label className="block text-lg font-semibold">Attraction Name</label>
                    <input
                        type="text"
                        name="name"
                        value={attractionData.name}
                        onChange={handleChange}
                        className="w-full p-2 rounded-lg border"
                        required
                    />
                </div>

                {/* Description Field */}
                <div>
                    <label className="block text-lg font-semibold">Description</label>
                    <textarea
                        name="description"
                        value={attractionData.description}
                        onChange={handleChange}
                        className="w-full p-2 rounded-lg border"
                        rows="4"
                        required
                    />
                </div>

                {/* Google Location Coordinates */}
                <div>
                    <label className="block text-lg font-semibold">Google Location Coordinates</label>
                    <input
                        type="text"
                        name="googleLocation"
                        value={attractionData.googleLocation}
                        onChange={handleChange}
                        className="w-full p-2 rounded-lg border"
                        placeholder="Latitude, Longitude"
                        required
                    />
                </div>

                {/* Overcrowded Checkbox */}
                <div className="flex items-center">
                    <input
                        type="checkbox"
                        name="overcrowded"
                        checked={attractionData.overcrowded}
                        onChange={handleChange}
                        className="mr-2"
                    />
                    <label className="text-lg">Overcrowded</label>
                </div>

                {/* Hidden Gem Checkbox */}
                <div className="flex items-center">
                    <input
                        type="checkbox"
                        name="hiddenGem"
                        checked={attractionData.hiddenGem}
                        onChange={handleChange}
                        className="mr-2"
                    />
                    <label className="text-lg">Hidden Gem</label>
                </div>

                {/* Tags Selection */}
                <div>
                    <label className="block text-lg font-semibold">Tags</label>
                    <select
                        name="tags"
                        multiple
                        value={attractionData.tags}
                        onChange={handleChange}
                        className="w-full p-2 rounded-lg border"
                    >
                        <option value="beachside">Beachside Venue</option>
                        <option value="forest">Forest</option>
                        <option value="historical">Historical Place</option>
                        <option value="hiking">Hiking Place</option>
                    </select>
                </div>

                {/* Image Upload Field */}
                <div>
                    <label className="block text-lg font-semibold">Upload Images</label>
                    <input
                        type="file"
                        name="images"
                        accept="image/*"
                        multiple
                        onChange={handleChange}
                        className="w-full p-2 rounded-lg border"
                    />
                </div>

                {/* Submit Button */}
                <div className="text-center">
                    <button
                        type="submit"
                        className="bg-blue-600 text-white py-2 px-6 rounded-lg shadow-md mt-4"
                    >
                        Submit Attraction
                    </button>
                </div>
            </form>
        </div>
    );
}

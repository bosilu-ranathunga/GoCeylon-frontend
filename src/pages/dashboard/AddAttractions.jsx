import React, { useState } from "react";
import Select from "react-select"; // Import react-select

const AddAttractionForm = () => {
    const [attractionData, setAttractionData] = useState({
        name: "",
        description: "",
        google_map_url: "",
        tags: [], // Now using react-select
        images: [],
        points: [{ point: "", text: "" }]
    });

    const [errors, setErrors] = useState({});
    const [imagePreviews, setImagePreviews] = useState([]);

    const handleChange = (e) => {
        const { name, value } = e.target;
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
        setAttractionData({ ...attractionData, tags: selectedTags });
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setAttractionData({ ...attractionData, images: files });
        setImagePreviews(files.map(file => URL.createObjectURL(file)));
    };

    const handlePointChange = (index, field, value) => {
        const updatedPoints = [...attractionData.points];
        updatedPoints[index][field] = value;
        setAttractionData({ ...attractionData, points: updatedPoints });
    };

    const addPoint = () => {
        setAttractionData({
            ...attractionData,
            points: [...attractionData.points, { point: "", text: "" }]
        });
    };

    const removePoint = (index) => {
        const updatedPoints = attractionData.points.filter((_, i) => i !== index);
        setAttractionData({ ...attractionData, points: updatedPoints });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

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
        if (Object.keys(validationErrors).length > 0) return;

        try {
            const formData = new FormData();
            formData.append("name", attractionData.name);
            formData.append("description", attractionData.description);
            formData.append("google_map_url", attractionData.google_map_url);
            formData.append("tags", JSON.stringify(attractionData.tags));
            formData.append("points", JSON.stringify(attractionData.points));

            attractionData.images.forEach((image) => {
                formData.append("images", image);
            });

            const response = await fetch("http://localhost:3000/location", {
                method: "POST",
                body: formData
            });

            if (response.ok) {
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
                const errorData = await response.json();
                alert(`Error: ${errorData.message}`);
            }
        } catch (error) {
            console.error("Error submitting attraction:", error);
            alert("Failed to add attraction");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="p-6 space-y-4 bg-white rounded-lg shadow-md">
            <input type="text" name="name" placeholder="Attraction Name" value={attractionData.name} onChange={handleChange} className="border p-2 w-full" />
            {errors.name && <p className="text-red-500">{errors.name}</p>}

            <textarea name="description" placeholder="Description" value={attractionData.description} onChange={handleChange} className="border p-2 w-full"></textarea>
            {errors.description && <p className="text-red-500">{errors.description}</p>}

            <input type="text" name="google_map_url" placeholder="Google Map URL" value={attractionData.google_map_url} onChange={handleChange} className="border p-2 w-full" />
            {errors.google_map_url && <p className="text-red-500">{errors.google_map_url}</p>}

            {/* Updated Tag Selection with react-select */}
            <Select
                isMulti
                options={tagOptions}
                value={tagOptions.filter(option => attractionData.tags.includes(option.value))}
                onChange={handleTagChange}
                className="border p-2 w-full"
            />
            {errors.tags && <p className="text-red-500">{errors.tags}</p>}

            <input type="file" multiple accept="image/*" onChange={handleImageChange} className="border p-2 w-full" />
            {errors.images && <p className="text-red-500">{errors.images}</p>}

            {imagePreviews.length > 0 && (
                <div className="flex space-x-2">
                    {imagePreviews.map((src, index) => (
                        <img key={index} src={src} className="w-20 h-20 rounded" alt="Preview" />
                    ))}
                </div>
            )}

            <div className="space-y-2">
                <h3 className="font-semibold text-lg">Points of Interest</h3>
                {attractionData.points.map((poi, index) => (
                    <div key={index} className="flex space-x-2">
                        <input
                            type="text"
                            placeholder="Point ID"
                            value={poi.point}
                            onChange={(e) => handlePointChange(index, "point", e.target.value)}
                            className="border p-2 w-1/3"
                        />
                        <input
                            type="text"
                            placeholder="Description"
                            value={poi.text}
                            onChange={(e) => handlePointChange(index, "text", e.target.value)}
                            className="border p-2 w-2/3"
                        />
                        <button type="button" onClick={() => removePoint(index)} className="bg-red-500 text-white px-3 py-1">
                            X
                        </button>
                    </div>
                ))}

                <button type="button" onClick={addPoint} className="bg-blue-500 text-white px-4 py-2">
                    Add Point
                </button>
            </div>

            <button type="submit" className="bg-green-500 text-white px-4 py-2 w-full">Add Attraction</button>
        </form>
    );
};

export default AddAttractionForm;

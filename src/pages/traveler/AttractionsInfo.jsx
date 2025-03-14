import React from "react";
import { useNavigate } from "react-router-dom";

const AttractionDetails = () => {
    const navigate = useNavigate(); // Hook to navigate back

    // Fake data for one attraction
    const attraction = {
        id: 1,
        name: "Sigiriya Rock Fortress",
        mainImage: "https://cdn.pixabay.com/photo/2017/09/04/06/56/sigiriya-2714105_1280.jpg",
        description: "Sigiriya, also known as Lion Rock, is an ancient rock fortress in Sri Lanka. Built by King Kasyapa, it features beautiful frescoes, a mirror wall, and breathtaking views from the summit.",
        moreImages: [
            "https://cdn.pixabay.com/photo/2023/06/08/14/42/landscape-8049357_1280.jpg",
            "https://cdn.pixabay.com/photo/2016/11/29/06/17/sigiriya-1866952_1280.jpg",
            "https://cdn.pixabay.com/photo/2017/01/07/17/28/sri-lanka-1965287_1280.jpg"
        ]
    };

    return (
        <div className="p-4 pt-20 max-w-4xl mx-auto relative">
            {/* Back Button */}
            <button 
                onClick={() => navigate(-1)} 
                className="absolute top-4 left-4 bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-3 rounded-full shadow-md flex items-center"
            >
                ←
            </button>

            {/* Attraction Name */}
            <h1 className="text-3xl font-bold text-center mb-4">{attraction.name}</h1>

            {/* Main Image */}
            <img src={attraction.mainImage} alt={attraction.name} className="w-full h-56 object-cover rounded-lg shadow-md" />

            {/* Guide Options */}
            <div className="flex flex-col gap-4 mt-6">
                <h2 className="text-xl font-semibold text-center">Choose a Guide</h2>
                <div className="flex flex-col gap-2">
                    <button className="bg-gray-700 text-white py-2 rounded-lg shadow-md">Local Guide</button>
                    <button className="bg-gray-700 text-white py-2 rounded-lg shadow-md">AI Guide</button>
                </div>

                {/* Show Directions */}
                <button className="bg-green-600 text-white py-3 rounded-lg shadow-md font-semibold text-lg">
                    Show Directions
                </button>
            </div>

            {/* Description */}
            <p className="text-gray-700 text-lg mt-6 leading-relaxed">
                {attraction.description}
            </p>

            {/* More Images */}
            <h2 className="text-2xl font-bold mt-8 mb-4 text-center">More Images</h2>
            <div className="grid grid-cols-2 gap-4">
                {attraction.moreImages.map((img, index) => (
                    <img key={index} src={img} alt={`Attraction ${index}`} className="w-full h-32 object-cover rounded-lg shadow-md" />
                ))}
            </div>
        </div>
    );
};

export default AttractionDetails;

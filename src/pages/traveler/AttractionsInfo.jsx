import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const AttractionDetails = () => {
  const { id } = useParams(); // Retrieve the ID from the URL
  const navigate = useNavigate(); // Hook to navigate back
  const [attraction, setAttraction] = useState(null); // State to store attraction data

  // Fetch attraction data based on the ID from the URL
  useEffect(() => {
    const fetchAttractionDetails = async () => {
      console.log(`Fetching data for attraction ID: ${id}`);

      try {
        // Make API call to fetch the attraction details based on ID
        const response = await axios.get(`http://localhost:3000/location/${id}`);
        
        console.log("API Response:", response); // Log full response
        console.log("Location Data:", response.data.location); // Log extracted data

        setAttraction(response.data); // Update the state with the fetched data
      } catch (error) {
        console.error("Error fetching attraction details:", error);
        
        if (error.response) {
          // Log specific API error details
          console.error("Response Data:", error.response.data);
          console.error("Status Code:", error.response.status);
          console.error("Headers:", error.response.headers);
        } else if (error.request) {
          // Request was made but no response received
          console.error("No Response Received:", error.request);
        } else {
          // Other errors
          console.error("Error Message:", error.message);
        }
      }
    };

    fetchAttractionDetails();
  }, [id]); // Re-run this effect if the ID changes

  // Loading state
  if (!attraction) {
    console.log("Attraction data is still loading...");
    return <div>Loading...</div>;
  }

  console.log("Rendering attraction details:", attraction);

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
      <img
        src={attraction.image_url?.[0]} // Prevent crash if image_url is undefined
        alt={attraction.name}
        className="w-full h-56 object-cover rounded-lg shadow-md"
      />

      {/* Guide Options */}
      <div className="flex flex-col gap-4 mt-6">
        <h2 className="text-xl font-semibold text-center">Choose a Guide</h2>
        <div className="flex flex-col gap-2">
          <button className="bg-green-800 text-white py-2 rounded-lg shadow-md">
            Local Guide
          </button>
          <button className="bg-green-800 text-white py-2 rounded-lg shadow-md">
            AI Guide
          </button>
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
        {attraction.image_url?.slice(1).map((img, index) => ( // Prevent crash if image_url is undefined
          <img
            key={index}
            src={img}
            alt={`Attraction Image ${index}`}
            className="w-full h-32 object-cover rounded-lg shadow-md"
          />
        ))}
      </div>
    </div>
  );
};

export default AttractionDetails;

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import TopNameBar from "../../components/TopNameBar";
import API_BASE_URL from "../../config/config";

const AttractionDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [attraction, setAttraction] = useState({});

  useEffect(() => {
    const fetchAttractionDetails = async () => {
      console.log(`Fetching data for attraction ID: ${id}`);
      try {
        const response = await axios.get(`${API_BASE_URL}/location/${id}`);
        setAttraction(response.data || {}); // Ensure fallback to empty object
      } catch (error) {
        console.error("Error fetching attraction details:", error);
      }
    };
    fetchAttractionDetails();
  }, [id]);

  return (
    <div className="container mx-auto p-6 mt-[4rem] bg-gray-50 min-h-screen">

      <TopNameBar title="Location" />

      <h1 className="text-3xl font-bold text-center mb-4">{attraction.name || "Unknown Location"}</h1>

      <img
        src={attraction.image_url?.[0] || "default-image.jpg"}
        alt={attraction.name || "Unknown Location"}
        className="w-full h-56 object-cover rounded-lg shadow-md"
      />

      <div className="flex flex-col gap-4 mt-6">
        <h2 className="text-xl font-semibold text-center">Choose a Guide</h2>
        <div className="flex flex-col gap-2">
          <button className="bg-green-800 text-white py-2 rounded-lg shadow-md" onClick={() => navigate('/user/booking/list')} >
            Local Guide
          </button>
          <button className="bg-green-800 text-white py-2 rounded-lg shadow-md">
            AI Guide
          </button>
        </div>
        <button className="bg-green-600 text-white py-3 rounded-lg shadow-md font-semibold text-lg">
          Show Directions
        </button>
      </div>

      <p className="text-gray-700 text-lg mt-6 leading-relaxed">
        {attraction.description || "No description available"}
      </p>

      <h2 className="text-2xl font-bold mt-8 mb-4 text-center">More Images</h2>
      <div className="grid grid-cols-2 gap-4">
        {attraction.image_url?.slice(1).map((img, index) => (
          <img key={index} src={img} alt={`Attraction Image ${index}`} className="w-full h-32 object-cover rounded-lg shadow-md" />
        ))}
      </div>

    </div>
  );
};

export default AttractionDetails;



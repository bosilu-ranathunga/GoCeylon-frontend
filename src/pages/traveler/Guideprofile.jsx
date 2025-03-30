import { useEffect, useState } from "react";
import axios from "axios";

const GuideProfile = ({ guideId }) => {
  const [guide, setGuide] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGuide = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/guides/${guideId}`);
        setGuide(response.data);
      } catch (err) {
        setError("Failed to fetch guide profile");
      } finally {
        setLoading(false);
      }
    };
    fetchGuide();
  }, [guideId]);

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (!guide) return <p className="text-center text-gray-500">Guide not found</p>;

  return (
    <div className="max-w-lg mx-auto bg-white shadow-md rounded-lg p-6 mt-6 border border-gray-200">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">{guide.g_name}</h2>
      <p className="text-gray-600">Language: <span className="font-medium">{guide.language}</span></p>
      <p className="text-gray-600">Gender: <span className="font-medium">{guide.gender}</span></p>
      <p className="text-gray-600">Price per hour: <span className="font-medium">${guide.price}</span></p>
      <p className="text-gray-600">Location: <span className="font-medium">{guide.location.join(", ")}</span></p>
      <p className="text-gray-600">Availability: <span className="font-medium">{guide.availability ? "Available" : "Not Available"}</span></p>
      <p className="text-gray-600">Contact: <span className="font-medium">{guide.contact_number}</span></p>
    </div>
  );
};

export default GuideProfile;

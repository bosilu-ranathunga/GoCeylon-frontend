import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_BASE_URL from "../../config/config";
import TopNameBar from "../../components/TopNameBar";

const BusinessInfo = () => {
    const { id } = useParams();
    const navigate = useNavigate();  // To navigate to other pages
    const [business, setBusiness] = useState(null);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        const fetchBusinessDetails = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/api/business/${id}`);
                setBusiness(response.data);
            } catch (error) {
                setErrorMessage("Failed to fetch business details");
            } finally {
                setLoading(false);
            }
        };
        fetchBusinessDetails();
    }, [id]);

    // Delete business handler
    const handleDelete = async () => {
        try {
            await axios.delete(`${API_BASE_URL}/api/business/${id}`);
            // After deletion, navigate back to the business list
            navigate("/business");
        } catch (error) {
            setErrorMessage("Failed to delete business");
        }
    };

    // Redirect to update page
    const handleUpdate = () => {
        navigate(`/business/update/${id}`);
    };

    if (errorMessage) {
        return <div>{errorMessage}</div>;
    }

    return (
        <div>
            <TopNameBar title="Business Info" />
            <div className='container mx-auto p-6 mt-[4rem] bg-gray-50 min-h-screen'>

                {/* Business owner photo */}
                {business?.ownerPhoto && (
                    <img
                        src={`${API_BASE_URL}/${business.ownerPhoto}`}
                        alt={business?.business_name}
                        className="rounded-lg h-40 w-full object-cover mb-4"
                    />
                )}

                {/* Render business details */}
                <h2 className="text-3xl font-semibold mb-4">{business?.business_name}</h2>
                <p className="text-lg text-gray-700 mb-4"><strong>Category:</strong> {business?.business_category}</p>
                <p className="text-lg text-gray-700 mb-4"><strong>Contact:</strong> {business?.contact_number}</p>
                <p className="text-lg text-gray-700 mb-4"><strong>Address:</strong> {business?.address}</p>
                <p className="text-lg text-gray-700 mb-4"><strong>Hours:</strong> {business?.openingHours}</p>
                <p className="text-lg text-gray-700 mb-4"><strong>Description:</strong> {business?.description}</p>

                {/* Buttons for update and delete */}
                <button onClick={handleUpdate}
                    className="w-full mt-6 bg-[#007a55] text-white font-bold py-2 px-4 rounded-lg"
                >
                    Update Business
                </button>

                <button onClick={handleDelete}
                    className='w-full mt-6 bg-red-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-700'>
                    Delete Business
                </button>
            </div>
        </div>
    );
};

export default BusinessInfo;

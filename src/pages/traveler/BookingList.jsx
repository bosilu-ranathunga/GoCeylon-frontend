import React from 'react';
import { useNavigate } from 'react-router-dom';
import one from '../../assets/images/one.avif'; // Image 1
import second from '../../assets/images/second.jpg'; // Image 2
import third from '../../assets/images/third.avif'; // Image 3
import { FaArrowLeft, FaStar } from 'react-icons/fa'; // For icons

export default function BookingList() {
    const navigate = useNavigate();

    // Sample data for guides with ratings
    const guides = [
        { id: 1, name: "John Doe", image: one, available: true, rating: 4.5, guided: 231 },
        { id: 2, name: "Jane Smith", image: second, available: false, rating: 4.0, guided: 190 },
        { id: 3, name: "Robert Brown", image: third, available: true, rating: 4.8, guided: 145 }
    ];

    return (
        <div className="bg-white min-h-screen p-6 flex flex-col gap-6 max-w-lg mx-auto border border-gray-300 rounded-xl shadow-lg">
            <div className="flex items-center justify-between">
                <button 
                    onClick={() => navigate(-1)} 
                    className="text-2xl font-bold text-gray-800 hover:text-gray-600 transition duration-200"
                >
                    <FaArrowLeft />
                </button>
                <h2 className="text-2xl font-bold text-gray-900 text-center flex-1">Available Guides</h2>
            </div>
            <button className="text-sm font-semibold text-blue-500 self-end mt-4 hover:text-blue-700 transition duration-200">
                See All
            </button>
            
            {guides.map((guide) => (
                <div 
                    key={guide.id} 
                    className={`flex items-center p-5 bg-white rounded-xl shadow-md mb-4 ${guide.available ? 'border-l-4 border-green-500' : 'border-l-4 border-red-500'}`}
                >
                    <div className="w-20 h-20 overflow-hidden rounded-full border-2 border-gray-300">
                        <img 
                            src={guide.image} 
                            alt={guide.name} 
                            className="w-full h-full object-cover"
                        />
                    </div>
                    
                    <div className="ml-5 flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">{guide.name}</h3>
                        <p className="text-sm text-gray-600">Guided: {guide.guided} people</p>
                        <p className={`text-sm font-semibold mt-2 ${guide.available ? 'text-green-500' : 'text-red-500'}`}>
                            {guide.available ? "Available" : "Not Available"}
                        </p>
                        <div className="flex items-center mt-2">
                            <FaStar className="text-yellow-500" />
                            <span className="ml-2 text-sm text-gray-600">{guide.rating}</span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

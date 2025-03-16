import React, { useState } from 'react';
import TopAppBar from '../../components/TopAppBar';
import BottomTabBar from '../../components/BottomTabBar';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import guideImage from '../../assets/images/one.avif';
import sigiriya from '../../assets/images/sigiriya.avif';
import gallefort from '../../assets/images/gallefort.avif';
import yala from '../../assets/images/yala.avif';

export default function Booking() {
    const [startDate, setStartDate] = useState(new Date());
    const selectedGuide = {
        name: "John Doe",
        image: guideImage,
        available: true,
        languages: ["English", "French", "Spanish"],
        attractions: [
            { name: "Sigiriya", image: sigiriya },
            { name: "Galle Fort", image: gallefort },
            { name: "Yala National Park", image: yala }
        ],
        pricing: ["$50 per hour", "$200 per day"],
        reviews: [
            { name: "Alice", comment: "Great guide, very informative!", rating: 5 },
            { name: "Bob", comment: "Friendly and professional.", rating: 4.5 },
            { name: "Charlie", comment: "Had a wonderful experience, would highly recommend!", rating: 5 },
            { name: "David", comment: "Very knowledgeable and accommodating. Made our trip unforgettable.", rating: 4.8 },
            { name: "Eva", comment: "The best guide we’ve had! Very passionate and friendly.", rating: 5 },
            { name: "Sophia", comment: "A bit slow but very informative. Enjoyed the tour overall.", rating: 4 },
            { name: "James", comment: "Fantastic experience, well worth the price.", rating: 4.7 }
        ]
    };

    return (
        <>
            <TopAppBar /><div><br></br></div>
            <div className="p-6 bg-gradient-to-r from-white to-gray-100 min-h-screen flex flex-col gap-6 max-w-4xl mx-auto border border-gray-300 shadow-xl rounded-xl overflow-hidden">

                {/* Guide Image, Name, Description, and Book Button */}
                <div className="flex flex-col md:flex-row items-center gap-6 w-full">
                    {/* Left Side: Guide's Image */}
                    <div className="flex-shrink-10 w-48 h-48">
                        <img 
                            src={selectedGuide.image} 
                            alt={selectedGuide.name} 
                            className="w-full h-full object-cover border-4 border-indigo-500 rounded-full shadow-lg"
                        />
                    </div>

                    {/* Right Side: Guide's Name, Available Status, and Book Button */}
                    <div className="flex-1 text-center md:text-left">
                        <h2 className="text-3xl font-bold text-indigo-800">{selectedGuide.name}</h2>
                        <p className={`text-lg font-semibold mt-2 ${selectedGuide.available ? 'text-green-600' : 'text-red-600'}`}>
                            {selectedGuide.available ? "Available" : "Not Available"}
                        </p>
                        <button className="w-full bg-gradient-to-r from-green-400 to-green-600 text-white text-lg font-semibold py-3 mt-4 rounded-lg shadow-lg hover:bg-gradient-to-l transition-all">
                            Book Now
                        </button>
                    </div>
                </div>

                {/* Scrollable Content Section */}
                <div className="overflow-y-auto max-h-[calc(100vh-350px)]">

                    {/* Attractions - Horizontal Scroll Layout */}
                    <div className="mb-6">
                        <h3 className="text-xl font-semibold text-indigo-800 mb-3">Attractions Covered:</h3>
                        <div className="overflow-x-auto max-h-60">  {/* Horizontal scroll area */}
                            <div className="flex gap-6">
                                {selectedGuide.attractions.map((attraction, index) => (
                                    <div key={index} className="border rounded-xl shadow-lg overflow-hidden bg-white hover:scale-105 transition-transform">
                                        <img 
                                            src={attraction.image} 
                                            alt={attraction.name} 
                                            className="w-48 h-32 object-cover"
                                        />
                                        <p className="text-center text-black font-medium py-2 bg-indigo-200">{attraction.name}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Pricing Section */}
                    <div className="mb-6">
                        <h3 className="text-xl font-semibold text-indigo-800 mb-2">Pricing:</h3>
                        <div className="flex flex-col gap-4">
                            {selectedGuide.pricing.map((price, index) => (
                                <div key={index} className="p-4 bg-gradient-to-r from-green-100 to-green-300 text-green-800 font-medium rounded-lg shadow-lg hover:scale-105 transition-transform">
                                    {price}
                                </div>
                            ))}
                        </div>
                    </div>


                     {/* Booking Date Picker Section */}
                     <div className="mb-6">
                        <h3 className="text-xl font-semibold text-indigo-800 mb-3">Select Booking Date:</h3>
                        <DatePicker
                            selected={startDate}
                            onChange={(date) => setStartDate(date)}
                            minDate={new Date()}
                            dateFormat="MMMM d, yyyy"
                            className="w-full p-3 border rounded-md focus:ring-2 focus:ring-green-500 bg-white"
                        />
                    </div>

                    {/* Reviews Section - Modern Styling */}
                    <div className="overflow-y-auto max-h-52 p-3 bg-white rounded-lg shadow-lg mb-6">
                        <h3 className="text-xl font-semibold text-indigo-800 mb-3">Customer Reviews:</h3>
                        {selectedGuide.reviews.map((review, index) => (
                            <div 
                                key={index} 
                                className={`p-4 rounded-lg shadow-sm mb-4 ${index % 2 === 0 ? "bg-blue-50 text-blue-800" : "bg-yellow-50 text-yellow-800"}`}
                            >
                                <p className="font-semibold">{review.name}</p>
                                <p className="italic text-gray-600">"{review.comment}"</p>
                                <p className="text-yellow-500 font-bold">⭐ {review.rating} / 5</p>
                            </div>
                        ))}
                    </div>

                    {/* Languages Section */}
                    <div className="p-4 bg-gradient-to-r from-gray-100 to-gray-300 rounded-lg shadow-lg mb-6">
                        <h3 className="text-xl font-semibold text-indigo-800">Languages:</h3>
                        <p className="text-gray-700">{selectedGuide.languages.join(", ")}</p><br></br>
                    </div>

                   

                </div>
            </div>
            <BottomTabBar />
        </>
    );
}

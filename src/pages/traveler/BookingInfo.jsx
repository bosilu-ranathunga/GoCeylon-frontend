import React, { useState } from 'react';
import { FaStar } from 'react-icons/fa';

export default function BookingInfo({ guide }) {
  const [review, setReview] = useState('');
  const [rating, setRating] = useState(0);

  const handleRating = (value) => setRating(value);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 py-10">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
          Booking Information
        </h2>

        {/* Guide Details */}
        <div className="mb-6 flex items-center space-x-4">
          <img
            src={guide?.image}
            alt={guide?.name}
            className="w-20 h-20 rounded-full border-4 border-green-500 shadow-lg object-cover"
          />
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{guide?.name}</h3>
            <p className="text-gray-500">{guide?.location}</p>
          </div>
        </div>

        {/* Pricing */}
        <div className="mb-6">
          <p className="text-gray-700 font-semibold">Price:</p>
          <p className="text-green-600 font-bold text-2xl">${guide?.price}</p>
        </div>

        {/* Add Review Textarea */}
        <div className="mb-6">
          <label htmlFor="review" className="text-gray-700 font-semibold mb-2 block">
            Add Review:
          </label>
          <textarea
            id="review"
            className="w-full p-3 border rounded-md focus:ring-2 focus:ring-green-500 transition duration-200"
            rows="4"
            value={review}
            onChange={(e) => setReview(e.target.value)}
            placeholder="Write your review..."
          ></textarea>
        </div>

        {/* Star Rating System */}
        <div className="mb-6">
          <p className="text-gray-700 font-semibold mb-2">Rate Guide:</p>
          <div className="flex justify-start space-x-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <FaStar
                key={star}
                className={`cursor-pointer text-2xl transition duration-200 ${
                  star <= rating ? 'text-yellow-500' : 'text-gray-300'
                }`}
                onClick={() => handleRating(star)}
              />
            ))}
          </div>
        </div>

        {/* End Booking Button */}
        <button className="w-full bg-green-600 text-white py-3 rounded-md hover:bg-green-700 transition duration-200">
          End Booking
        </button>
      </div>
    </div>
  );
}

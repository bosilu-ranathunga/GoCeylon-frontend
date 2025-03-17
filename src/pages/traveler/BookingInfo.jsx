import React, { useState } from 'react';
import { FaStar } from 'react-icons/fa';

export default function BookingInfo({ guide, bookingDetails }) {
  const [review, setReview] = useState('');
  const [rating, setRating] = useState(0);

  const handleRating = (value) => setRating(value);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 py-6 px-4">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-sm">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 text-center">
          Booking Information
        </h2>

        {/* Guide Details */}
        <div className="mb-4 text-center">
          <h3 className="text-lg font-semibold text-gray-900">Guide {guide?.name}</h3>
          <p className="text-green-600 font-medium">{guide?.type}</p> {/* Type Name Section */}
          <p className="text-gray-500">{guide?.location}</p>
        </div>

        {/* Booking Details */}
        <div className="mb-4">
          <p className="text-gray-700 font-semibold">Date:</p>
          <p className="text-gray-900">{bookingDetails?.date}</p>
        </div>
        <div className="mb-4">
          <p className="text-gray-700 font-semibold">Hours:</p>
          <p className="text-gray-900">{bookingDetails?.hours} hour(s)</p>
        </div>

        {/* Pricing */}
        <div className="mb-4">
          <p className="text-gray-700 font-semibold">Total Price:</p>
          <p className="text-green-600 font-bold text-lg">${bookingDetails?.totalPrice}</p>
        </div>

        {/* Add Review Textarea */}
        <div className="mb-4">
          <label htmlFor="review" className="text-gray-700 font-semibold mb-2 block">
            Add Review:
          </label>
          <textarea
            id="review"
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-green-500 transition duration-200"
            rows="3"
            value={review}
            onChange={(e) => setReview(e.target.value)}
            placeholder="Write your review..."
          ></textarea>
        </div>

        {/* Star Rating System */}
        <div className="mb-4">
          <p className="text-gray-700 font-semibold mb-2">Rate Guide:</p>
          <div className="flex justify-center space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <FaStar
                key={star}
                className={`cursor-pointer text-xl transition duration-200 ${
                  star <= rating ? 'text-yellow-500' : 'text-gray-300'
                }`}
                onClick={() => handleRating(star)}
              />
            ))}
          </div>
        </div>

        {/* End Booking Button */}
        <button className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition duration-200">
          End Booking
        </button>
      </div>
    </div>
  );
}

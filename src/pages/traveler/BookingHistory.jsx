import React from 'react';
import TopAppBar from '../../components/TopAppBar';
import BottomTabBar from '../../components/BottomTabBar';

export default function BookingHistory({ bookings = [] }) {
  return (
    <>
      <TopAppBar />
      <div className="min-h-screen bg-gray-50 p-6">
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">Booking History</h2>

        {bookings.length === 0 ? (
          <p className="text-center text-gray-500 text-lg">No previous bookings found.</p>
        ) : (
          <div className="space-y-6">
            {bookings.map((booking, index) => (
              <div
                key={index}
                className="bg-white shadow-lg rounded-2xl p-5 flex flex-col space-y-3 transition hover:shadow-xl"
              >
                {/* Guide Info */}
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">{booking?.guide?.name || 'Unknown Guide'}</h3>
                  <span className="text-sm bg-green-100 text-green-700 px-3 py-1 rounded-full">
                    {booking?.guide?.type || 'N/A'}
                  </span>
                </div>
                <p className="text-sm text-gray-500">{booking?.guide?.location || 'Location Unknown'}</p>

                {/* Booking Details */}
                <div className="grid grid-cols-2 gap-4 text-gray-700">
                  <div>
                    <p className="font-medium">Date</p>
                    <p className="text-gray-900">{booking?.date || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="font-medium">Duration</p>
                    <p className="text-gray-900">{booking?.hours ? `${booking.hours} hour(s)` : 'N/A'}</p>
                  </div>
                </div>

                {/* Price */}
                <div className="text-right">
                  <p className="text-gray-700 font-medium">Total Price</p>
                  <p className="text-green-600 font-bold text-xl">
                    {booking?.totalPrice ? `$${booking.totalPrice}` : 'N/A'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <BottomTabBar />
    </>
  );
}

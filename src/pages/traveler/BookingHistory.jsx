import React, { useEffect, useState } from 'react';
import axios from 'axios';
import API_BASE_URL from '../../config/config';

export default function BookingHistory() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem('authToken');
  const decoded = JSON.parse(atob(token.split('.')[1]));
  const userId = decoded.id;

  // Function to fetch the booking history for the logged-in user
  const fetchHistory = async () => {
    try {
      // Make the API call to fetch bookings for the logged-in user
      const res = await axios.get(`${API_BASE_URL}/booking/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBookings(res.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Call the fetchHistory function when the component is mounted
    fetchHistory();
  }, [userId]);

  const handleDownload = async (bookingId) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/booking/receipt/${bookingId}`,
        { responseType: 'blob', headers: { Authorization: `Bearer ${token}` } }
      );
      const url = URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `receipt_${bookingId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      alert('Could not download receipt.');
    }
  };

  // Display loading, error, or empty state if no bookings are found
  if (loading) return <p>Loading booking history…</p>;
  if (error) return <p className="text-red-600">Error: {error.message}</p>;
  if (!bookings.length) return <p>No bookings found.</p>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Your Booking History</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {bookings.map((b) => (
          <div key={b._id} className="p-4 border rounded shadow">
            <h3 className="text-xl font-semibold">{b.guideId.g_name}</h3>
            <p>Location: {b.locationId.locationName}</p>
            <p>Start: {new Date(b.startAt).toLocaleString()}</p>
            <p>End: {new Date(b.endAt).toLocaleString()}</p>
            <p>Members: {b.numberOfMembers}</p>
            <p>Price: ${b.price}</p>
            <p>Status: {b.bookingStatus}</p>
            <button
              onClick={() => handleDownload(b._id)}
              className="mt-2 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Download Receipt
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

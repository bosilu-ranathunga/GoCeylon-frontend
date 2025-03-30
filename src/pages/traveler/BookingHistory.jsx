import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaArrowLeft, FaEdit, FaTrashAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

export default function BookingHistory() {
  const navigate = useNavigate();
  const userId = '67dc5f1a395ce4427f1411d6'; // Hardcoded user ID
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('createdAt'); // Default sorting by Created Date
  const [editBooking, setEditBooking] = useState(null);
  const [initialEditBooking, setInitialEditBooking] = useState(null); // Store original booking info
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    axios.get(`http://localhost:3000/booking/user/${userId}`)
      .then(response => {
        setBookings(response.data.bookings);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching bookings:', error);
        setError(error);
        setLoading(false);
      });
  }, [userId]);

  const currentDate = new Date().toISOString().split('T')[0]; // Get today's date

  const filteredBookings = bookings.filter(booking =>
    booking.b_guide.g_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    booking.b_location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    booking.b_date.includes(searchQuery)
  );

  let upcomingBookings = filteredBookings.filter(booking => booking.b_date >= currentDate);
  let pastBookings = filteredBookings.filter(booking => booking.b_date < currentDate);

  const sortBookings = (bookings, option, isUpcoming) => {
    return [...bookings].sort((a, b) => {
      if (option === 'createdAt') {
        return new Date(b.createdAt) - new Date(a.createdAt);
      } else {
        return isUpcoming
          ? new Date(a.b_date) - new Date(b.b_date)
          : new Date(b.b_date) - new Date(a.b_date);
      }
    });
  };

  upcomingBookings = sortBookings(upcomingBookings, sortOption, true);
  pastBookings = sortBookings(pastBookings, sortOption, false);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this booking?')) {
      try {
        await axios.delete(`http://localhost:3000/booking/delete/${id}`);
        setBookings(bookings.filter(booking => booking._id !== id));
      } catch (error) {
        console.error('Error deleting booking:', error);
      }
    }
  };

  const handleEdit = (booking) => {
    setEditBooking({ ...booking }); // Working copy to edit
    setInitialEditBooking({ ...booking }); // Save the original booking data
    setShowEditModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditBooking({ ...editBooking, [name]: value });
  };

  const handleEditSave = async () => {
    try {
      // Calculate new price using the formula:
      // newPrice = (previous price / previous time) * updated time
      const prevTime = parseFloat(initialEditBooking.b_time);
      const prevPrice = parseFloat(initialEditBooking.price);
      const updatedTime = parseFloat(editBooking.b_time);

      // If previous time is valid, calculate new price
      let newPrice = prevPrice;
      if (!isNaN(prevTime) && prevTime > 0 && !isNaN(updatedTime)) {
        newPrice = (prevPrice / prevTime) * updatedTime;
      }

      const updatedBooking = {
        ...editBooking,
        price: newPrice,
      };

      await axios.put(`http://localhost:3000/booking/update/${updatedBooking._id}`, updatedBooking);
      setBookings(bookings.map(booking => booking._id === updatedBooking._id ? updatedBooking : booking));
      setShowEditModal(false);
    } catch (error) {
      console.error('Error updating booking:', error);
    }
  };

  if (loading) return <div className='text-center text-green-600 font-semibold'>Loading...</div>;
  if (error) return <div className='text-red-500 font-semibold'>Error: {error.message}</div>;

  return (
    <div className='bg-white min-h-screen p-6 flex flex-col gap-6 max-w-3xl mx-auto border border-gray-300 rounded-xl shadow-lg'>
      <div className='flex items-center justify-between mb-4'>
        <button onClick={() => navigate(-1)} className='text-green-700 text-2xl'>
          <FaArrowLeft />
        </button>
        <h2 className='text-3xl font-bold text-green-700 text-center flex-1'>Booking History</h2>
      </div>

      <div className="flex flex-col gap-4">
        {/* Search Bar */}
        <input 
          type='text' 
          placeholder='Search by Guide Name, Location, or Date' 
          value={searchQuery} 
          onChange={(e) => setSearchQuery(e.target.value)} 
          className='flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500'
        />

        {/* Sort Options in a New Line */}
        <select 
          value={sortOption} 
          onChange={(e) => setSortOption(e.target.value)} 
          className='px-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500'
        >
          <option value="createdAt">Sort by Created Date</option>
          <option value="b_date">Sort by Booking Date</option>
        </select>
      </div>

      {upcomingBookings.length > 0 && <h3 className='text-xl font-bold text-green-700'>Upcoming Bookings</h3>}
      {upcomingBookings.map(booking => (
        <div key={booking._id} className='flex flex-col p-5 bg-green-50 border border-green-300 rounded-xl shadow-md mb-4 hover:bg-green-100 transition duration-200'>
          <h3 className='text-xl font-semibold text-green-800'>{booking.b_guide.g_name}</h3>
          <p className='text-sm text-green-700'>Date: {booking.b_date}</p>
          <p className='text-sm text-green-700'>Duratiopn(hours): {booking.b_time} hours</p>
          <p className='text-sm text-green-700'>Location: {booking.b_location}</p>
          <p className='text-sm text-green-700 font-bold'>Price: ${booking.price}</p>
          <div className="flex gap-4 mt-2">
            <FaEdit className='text-yellow-500 cursor-pointer' onClick={() => handleEdit(booking)} />
            <FaTrashAlt className='text-red-500 cursor-pointer' onClick={() => handleDelete(booking._id)} />
          </div>
        </div>
      ))}

      {pastBookings.length > 0 && <h3 className='text-xl font-bold text-red-700'>Past Bookings</h3>}
      {pastBookings.map(booking => (
        <div key={booking._id} className='flex flex-col p-5 bg-green-50 border border-green-300 rounded-xl shadow-md mb-4 hover:bg-green-100 transition duration-200'>
          <h3 className='text-xl font-semibold text-green-800'>{booking.b_guide.g_name}</h3>
          <p className='text-sm text-green-700'>Date: {booking.b_date}</p>
          <p className='text-sm text-green-700'>Duration(hours): {booking.b_time} hours</p>
          <p className='text-sm text-green-700'>Location: {booking.b_location}</p>
          <p className='text-sm text-green-700 font-bold'>Price: ${booking.price}</p>
        </div>
      ))}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h3 className="text-xl font-bold text-green-700">Edit Booking</h3>
            <div className="mb-4">
              <label className="block text-sm text-gray-600" htmlFor="b_date">Date</label>
              <input 
                type="date" 
                name="b_date" 
                value={editBooking.b_date} 
                onChange={handleInputChange} 
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                min={currentDate} 
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm text-gray-600" htmlFor="b_time">Duration (Hours)</label>
              <input 
                type="text" 
                name="b_time" 
                value={editBooking.b_time} 
                onChange={handleInputChange} 
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm text-gray-600" htmlFor="b_location">Location</label>
              <input 
                type="text" 
                name="b_location" 
                value={editBooking.b_location} 
                onChange={handleInputChange} 
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm text-gray-600" htmlFor="b_price">Price</label>
              <p className="text-sm text-gray-600">{`$${editBooking.price}`}</p>
            </div>
            <div className="flex justify-between">
              <button 
                onClick={handleEditSave} 
                className="bg-green-600 text-white px-4 py-2 rounded-lg"
              >
                Save
              </button>
              <button 
                onClick={() => setShowEditModal(false)} 
                className="bg-gray-600 text-white px-4 py-2 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

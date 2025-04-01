import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import { useNavigate, Link } from 'react-router-dom';
import { FaEye } from "react-icons/fa";
import { IoMdSearch } from "react-icons/io";
import TopAppBar from '../../components/TopAppBar';
import BottomTabBar from '../../components/BottomTabBar';
import API_BASE_URL from "../../config/config";
import { useModal } from '../../context/ModalContext';


export default function BookingHistory() {
  const navigate = useNavigate();

  /*---------this is who we get loged user id-------------*/
  const token = localStorage.getItem('authToken');
  const decoded = JSON.parse(atob(token.split('.')[1]));
  const userId = decoded.id;
  console.log(userId);
  /*------------------------------------------------------*/

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('createdAt'); // Default sorting by Created Date
  const [editBooking, setEditBooking] = useState(null);
  const [initialEditBooking, setInitialEditBooking] = useState(null); // Store original booking info
  const [showEditModal, setShowEditModal] = useState(false);

  const { showModal, closeModal } = useModal();

  useEffect(() => {
    axios.get(`${API_BASE_URL}/booking/user/${userId}`)
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
    showModal({
      type: 'delete',
      title: 'Are you sure you want to delete it?',
      content: 'Once you are delete this item you can\'t undo this process',
      buttons: [
        {
          label: 'Confirm',
          onClick: async () => {
            try {
              await axios.delete(`${API_BASE_URL}/booking/delete/${id}`);
              setBookings(bookings.filter(booking => booking._id !== id));
            } catch (error) {
              console.error('Error deleting booking:', error);
            }
            closeModal();
          },
          className: 'w-full px-4 py-2 text-white bg-red-600 rounded hover:bg-red-700'
        }, {
          label: 'Cancel',
          onClick: closeModal,
          className: 'w-full px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded hover:bg-gray-100'
        }
      ]
    });
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

      await axios.put(`${API_BASE_URL}/booking/update/${updatedBooking._id}`, updatedBooking);
      setBookings(bookings.map(booking => booking._id === updatedBooking._id ? updatedBooking : booking));
      setShowEditModal(false);
    } catch (error) {
      console.error('Error updating booking:', error);
    }
  };

  if (error) return <div className='text-red-500 font-semibold'>Error: {error.message}</div>;

  return (
    <>

      <div className='container mx-auto p-6 mt-[4rem] bg-gray-100 min-h-screen'>
        <TopAppBar />

        <div className="mb-[4rem]">

          <div className="flex flex-col gap-3 p-4 bg-white rounded-lg shadow-md">
            {/* Search Bar */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search by Guide Name, Location, or Date"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 shadow-sm"
              />
              <span className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 pointer-events-none">
                <IoMdSearch className="w-5 h-5" />
              </span>
            </div>
            {/* Sort Options */}
            <div className="flex items-center gap-2">
              <label className="text-gray-600 text-sm">Sort by:</label>
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 shadow-sm"
              >
                <option value="createdAt">Created Date</option>
                <option value="b_date">Booking Date</option>
              </select>
            </div>
          </div>

          {upcomingBookings.length > 0 && <h3 className='text-xl mt-5 mb-2 font-bold text-gray-600'>Upcoming Bookings</h3>}
          {upcomingBookings.map(booking => (
            <div className='flex flex-col p-5 bg-white border border-gray-100 rounded-xl shadow-md mb-4 hover:bg-green-100 transition duration-200'>
              <h3 className='text-xl font-semibold text-green-800'>{booking.b_guide.g_name}</h3>
              <p className='text-sm text-green-700'>Date: {booking.b_date}</p>
              <p className='text-sm text-green-700'>Duratiopn(hours): {booking.b_time} hours</p>
              <p className='text-sm text-green-700'>Location: {booking.b_location}</p>
              <p className='text-sm text-green-700 font-bold'>Price: ${booking.price}</p>
              <div className="flex gap-4 mt-2">
                <FaEdit className='text-yellow-500 cursor-pointer' onClick={() => handleEdit(booking)} />
                <FaTrashAlt className='text-red-500 cursor-pointer' onClick={() => handleDelete(booking._id)} />
                <FaEye className='text-yellow-500 cursor-pointer' onClick={() => navigate(`/user/booking/info/${booking._id}`)} />

              </div>
            </div>
          ))}

          {pastBookings.length > 0 && <h3 className='text-xl mt-5 mb-2 font-bold text-gray-600'>Past Bookings</h3>}
          {pastBookings.map(booking => (
            <Link to={`/user/booking/info/${booking._id}`} key={booking._id}>
              <div className='flex flex-col p-5 bg-white border border-gray-100 rounded-xl shadow-md mb-4 hover:bg-green-100 transition duration-200'>
                <h3 className='text-xl font-semibold text-green-800'>{booking.b_guide.g_name}</h3>
                <p className='text-sm text-green-700'>Date: {booking.b_date}</p>
                <p className='text-sm text-green-700'>Duration(hours): {booking.b_time} hours</p>
                <p className='text-sm text-green-700'>Location: {booking.b_location}</p>
                <p className='text-sm text-green-700 font-bold'>Price: ${booking.price}</p>
              </div>
            </Link>
          ))}

        </div>

        <BottomTabBar />
      </div>


      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-[#0000009e] bg-opacity-50 flex justify-center items-center z-[100]">
          <div className="bg-white m-5 p-6 rounded-lg shadow-lg max-w-sm w-full">
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
              <p className="text-sm text-gray-700">Price will be auto-calculated based on the new duration.</p>
            </div>
            <div className="flex justify-between">
              <button onClick={() => setShowEditModal(false)} className="px-4 py-2 bg-red-500 text-white rounded-lg">Cancel</button>
              <button onClick={handleEditSave} className="px-4 py-2 bg-green-500 text-white rounded-lg">Save</button>
            </div>
          </div>
        </div>
      )}

    </>

  );
}

//booking.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BookingForm = ({ bookingId }) => {
    const [formData, setFormData] = useState({
        b_id: '',
        b_date: '',
        b_time: '',
        b_location: '',
        b_user: '',
        b_guide: '',
        price: '',
        status: 'pending'
    });

    useEffect(() => {
        if (bookingId) {
            // Fetch existing booking to edit
            const fetchBooking = async () => {
                try {
                    const response = await axios.get(`http://localhost:3000/booking/${bookingId}`);
                    setFormData(response.data.booking);
                } catch (error) {
                    console.error('Error fetching booking:', error);
                }
            };
            fetchBooking();
        }
    }, [bookingId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (bookingId) {
                // Update booking
                await axios.put(`http://localhost:3000/booking/${bookingId}`, formData);
                alert('Booking updated successfully');
            } else {
                // Create new booking
                await axios.post('http://localhost:3000/booking', formData);
                alert('Booking created successfully');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('An error occurred while saving the booking');
        }
    };

    return (
        <div>
            <h2>{bookingId ? 'Update Booking' : 'Create Booking'}</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="b_id"
                    value={formData.b_id}
                    onChange={handleChange}
                    placeholder="Booking ID"
                    required
                />
                <input
                    type="text"
                    name="b_date"
                    value={formData.b_date}
                    onChange={handleChange}
                    placeholder="Date"
                    required
                />
                <input
                    type="text"
                    name="b_time"
                    value={formData.b_time}
                    onChange={handleChange}
                    placeholder="Time"
                    required
                />
                <input
                    type="text"
                    name="b_location"
                    value={formData.b_location}
                    onChange={handleChange}
                    placeholder="Location"
                    required
                />
                <input
                    type="text"
                    name="b_user"
                    value={formData.b_user}
                    onChange={handleChange}
                    placeholder="User ID"
                    required
                />
                <input
                    type="text"
                    name="b_guide"
                    value={formData.b_guide}
                    onChange={handleChange}
                    placeholder="Guide ID"
                    required
                />
                <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="Price"
                    required
                />
                <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    required
                >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="canceled">Canceled</option>
                </select>
                <button type="submit">Submit</button>
            </form>
        </div>
    );
};


export default BookingForm;

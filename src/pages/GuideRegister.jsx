import React, { useState } from 'react';
import axios from 'axios'; // Import axios for API calls

const GuideRegister = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    g_name: '',
    email: '',
    password: '',
    g_dob: '',
    language: '',
    gender: '',
    price: '',
    location: '',
    availability: '',
    contact_number: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare data to send to backend
    try {
      const response = await axios.post('http://localhost:3000/guides/create', formData);
      alert('Guide Registered Successfully!');
    } catch (error) {
      alert('Error registering guide: ' + error.message);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
        <h2 className="text-2xl font-semibold text-center mb-6">Guide Registration</h2>
        
        {step === 1 && (
          <div>
            <input 
              type="text" 
              name="g_name" 
              placeholder="Name" 
              value={formData.g_name} 
              onChange={handleChange} 
              className="w-full px-3 py-2 border rounded-lg mb-2" 
              required
            />
            <input 
              type="email" 
              name="email" 
              placeholder="Email" 
              value={formData.email} 
              onChange={handleChange} 
              className="w-full px-3 py-2 border rounded-lg mb-2" 
              required
            />
            <input 
              type="password" 
              name="password" 
              placeholder="Password" 
              value={formData.password} 
              onChange={handleChange} 
              className="w-full px-3 py-2 border rounded-lg mb-2" 
              required
            />
            <button 
              onClick={nextStep} 
              className="w-full bg-green-600 text-white py-2 rounded-lg"
            >
              Next
            </button>
          </div>
        )}

        {step === 2 && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input 
              type="date" 
              name="g_dob" 
              value={formData.g_dob} 
              onChange={handleChange} 
              required 
              className="w-full px-3 py-2 border rounded-lg mb-2" 
            />
            <input 
              type="text" 
              name="language" 
              value={formData.language} 
              onChange={handleChange} 
              required 
              placeholder="Languages" 
              className="w-full px-3 py-2 border rounded-lg mb-2" 
            />
            <select 
              name="gender" 
              value={formData.gender} 
              onChange={handleChange} 
              required 
              className="w-full px-3 py-2 border rounded-lg mb-2"
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            <input 
              type="number" 
              name="price" 
              value={formData.price} 
              onChange={handleChange} 
              required 
              placeholder="Price per day" 
              className="w-full px-3 py-2 border rounded-lg mb-2" 
            />
            <input 
              type="text" 
              name="location" 
              value={formData.location} 
              onChange={handleChange} 
              required 
              placeholder="Location" 
              className="w-full px-3 py-2 border rounded-lg mb-2" 
            />
            <select 
              name="availability" 
              value={formData.availability} 
              onChange={handleChange} 
              required 
              className="w-full px-3 py-2 border rounded-lg mb-2"
            >
              <option value="">Select Availability</option>
              <option value="true">Available</option>
              <option value="false">Not Available</option>
            </select>
            <input 
              type="tel" 
              name="contact_number" 
              value={formData.contact_number} 
              onChange={handleChange} 
              required 
              placeholder="Contact Number" 
              className="w-full px-3 py-2 border rounded-lg mb-2" 
            />
            <div className="flex justify-between">
              <button 
                onClick={prevStep} 
                className="px-4 py-2 bg-gray-500 text-white rounded"
              >
                Back
              </button>
              <button 
                type="submit" 
                className="px-4 py-2 bg-green-600 text-white rounded"
              >
                Submit
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default GuideRegister;

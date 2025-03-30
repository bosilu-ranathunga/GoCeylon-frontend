import React, { useState } from 'react';
import axios from 'axios';

const BusinessmanRegister = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    business_name: '',  // Match backend field name
    business_category: '',  // Match backend field name
    dob: '',
    contact_number: '',  // Match backend field name
    address: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Send JSON data instead of FormData
    try {
      const response = await axios.post('http://localhost:3000/businessuser/create', formData, {
        headers: { 'Content-Type': 'application/json' }
      });

      setSuccess('Business Registered Successfully!');
      console.log('Success:', response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
      console.error('Error:', err);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
        <h2 className="text-2xl font-semibold text-center mb-6">Business Registration</h2>

        {error && <p className="text-red-500">{error}</p>}
        {success && <p className="text-green-500">{success}</p>}

        {step === 1 && (
          <div>
            <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg mb-2" required />
            <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg mb-2" required />
            <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg mb-2" required />
            <button onClick={nextStep} className="w-full bg-green-600 text-white py-2 rounded-lg">Next</button>
          </div>
        )}

        {step === 2 && (
          <div>
            <input type="text" name="business_name" placeholder="Business Name" value={formData.business_name} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg mb-2" required />
            <select name="business_category" value={formData.business_category} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg mb-2" required>
              <option value="">Select Category</option>
              <option value="Hotel">Hotel</option>
              <option value="Restaurant">Restaurant</option>
              <option value="Transport">Transport</option>
            </select>
            <input type="date" name="dob" value={formData.dob} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg mb-2" required />
            <input type="text" name="contact_number" placeholder="Contact Number" value={formData.contact_number} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg mb-2" required />
            <input type="text" name="address" placeholder="Address" value={formData.address} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg mb-2" required />
            <div className="flex justify-between">
              <button onClick={prevStep} className="px-4 py-2 bg-gray-500 text-white rounded">Back</button>
              <button onClick={nextStep} className="px-4 py-2 bg-green-600 text-white rounded">Next</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <div className="flex justify-between">
              <button onClick={prevStep} className="px-4 py-2 bg-gray-500 text-white rounded">Back</button>
              <button onClick={handleSubmit} className="px-4 py-2 bg-green-600 text-white rounded">Submit</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BusinessmanRegister;

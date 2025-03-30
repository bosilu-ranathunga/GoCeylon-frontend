import React, { useState } from 'react';

const GuideRegister = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    dob: '',
    language: '',
    gender: '',
    price: '',
    location: '',
    availability: '',
    contactNumber: '',
    validationReport: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, validationReport: e.target.files[0] });
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Guide Registered Successfully!');
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
        <h2 className="text-2xl font-semibold text-center mb-6">Guide Registration</h2>
        
        {step === 1 && (
          <div>
            <input 
              type="text" 
              name="name" 
              placeholder="Name" 
              value={formData.name} 
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
            <input type="date" name="dob" value={formData.dob} onChange={handleChange} required className="w-full px-3 py-2 border rounded-lg mb-2" />
            <input type="text" name="language" value={formData.language} onChange={handleChange} required placeholder="Languages" className="w-full px-3 py-2 border rounded-lg mb-2" />
            <select name="gender" value={formData.gender} onChange={handleChange} required className="w-full px-3 py-2 border rounded-lg mb-2">
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            <input type="number" name="price" value={formData.price} onChange={handleChange} required placeholder="Price per day" className="w-full px-3 py-2 border rounded-lg mb-2" />
            <input type="text" name="location" value={formData.location} onChange={handleChange} required placeholder="Location" className="w-full px-3 py-2 border rounded-lg mb-2" />
            <select name="availability" value={formData.availability} onChange={handleChange} required className="w-full px-3 py-2 border rounded-lg mb-2">
              <option value="">Select Availability</option>
              <option value="Available">Available</option>
              <option value="Not Available">Not Available</option>
            </select>
            <input type="tel" name="contactNumber" value={formData.contactNumber} onChange={handleChange} required placeholder="Contact Number" className="w-full px-3 py-2 border rounded-lg mb-2" />
            <input type="file" accept=".pdf,.doc,.docx,.jpg,.png" onChange={handleFileChange} required className="w-full px-3 py-2 border rounded-lg mb-2" />
            <div className="flex justify-between">
              <button onClick={prevStep} className="px-4 py-2 bg-gray-500 text-white rounded">Back</button>
              <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded">Submit</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default GuideRegister;

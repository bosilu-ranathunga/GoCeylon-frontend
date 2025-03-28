import React from 'react';
import { useState } from "react";



export default function Register() {
  const [step, setStep] = useState(1); // Track current step of the form
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    preferences: {
      destinations: [],
      companions: [],
      accommodations: "",
      tourGuide: "",
      savePreferences: ""
    }
  });

  // Handle input field changes for email and passwords
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle checkbox selections for multi-choice questions
  const handleCheckboxChange = (e, category) => {
    const { value, checked } = e.target;
    setFormData((prev) => {
      const selected = checked
        ? [...prev.preferences[category], value]
        : prev.preferences[category].filter((item) => item !== value);
      return { ...prev, preferences: { ...prev.preferences, [category]: selected } };
    });
  };

  // Handle radio button selections
  const handleRadioChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, preferences: { ...prev.preferences, [name]: value } }));
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-80">
        {/* Step 1: User Registration */}
        {step === 1 && (
          <div>
            <h2 className="text-xl font-bold mb-4">Register</h2>
            <input className="w-full p-2 border rounded mb-2" type="email" name="email" placeholder="E-mail" onChange={handleChange} />
            <input className="w-full p-2 border rounded mb-2" type="password" name="password" placeholder="Password" onChange={handleChange} />
            <input className="w-full p-2 border rounded mb-2" type="password" name="confirmPassword" placeholder="Confirm password" onChange={handleChange} />
            <button className="w-full bg-green-500 text-white p-2 rounded" onClick={() => setStep(2)}>Next</button>
          </div>
        )}

        {/* Step 2: Preference Selection */}
        {step === 2 && (
          <div>
            <h2 className="text-xl font-bold mb-4">Select your Preferences</h2>
            
            {/* Where do you want to go? (Multi-select checkboxes) */}
            <p className="text-sm font-medium">Want to visit?</p>
            {["Beach", "Mountains", "City", "Countryside"].map((place) => (
              <label className="block" key={place}>
                <input type="checkbox" value={place} onChange={(e) => handleCheckboxChange(e, "destinations")} /> {place}
              </label>
            ))}
            
            {/* Who are you traveling with? (Multi-select checkboxes) */}
            <p className="text-sm font-medium">Traveling with</p>
            {["Solo", "Family", "Partner", "Friends"].map((group) => (
              <label className="block" key={group}>
                <input type="checkbox" value={group} onChange={(e) => handleCheckboxChange(e, "companions")} /> {group}
              </label>
            ))}

            {/* Accommodations (Radio buttons) */}
            <p className="text-sm font-medium">Accommodations</p>
            {["Yes", "No"].map((option) => (
              <label className="mr-2" key={option}>
                <input type="radio" name="accommodations" value={option} onChange={handleRadioChange} /> {option}
              </label>
            ))}

            {/* Tour guide (Radio buttons) */}
            <p className="text-sm font-medium">Tour guide</p>
            {["Yes", "No"].map((option) => (
              <label className="mr-2" key={option}>
                <input type="radio" name="tourGuide" value={option} onChange={handleRadioChange} /> {option}
              </label>
            ))}

            <button className="w-full bg-green-500 text-white p-2 rounded" onClick={() => setStep(3)}>Next</button>
          </div>
        )}

        {/* Step 3: Feedback Section */}
        {step === 3 && (
          <div>
            <h2 className="text-xl font-bold mb-4">Feedback</h2>
            
            {/* Want to save your preferences? (Radio buttons) */}
            <p className="text-sm font-medium">Want to save your preferences?</p>
            {["Yes", "No"].map((option) => (
              <label className="mr-2" key={option}>
                <input type="radio" name="savePreferences" value={option} onChange={handleRadioChange} /> {option}
              </label>
            ))}
            
            <button className="w-full bg-green-500 text-white p-2 rounded" onClick={() => alert("Preferences Saved!")}>Submit</button>
          </div>
        )}
      </div>
    </div>
  );
}

import React, { useState } from "react";
import axios from "axios";

export default function Register() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    destination: "",
    traveling_with: "",
    accommodations: "",
    tour_guide: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRadioChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const response = await axios.post("http://localhost:3000/users", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        destination: formData.destination,
        traveling_with: formData.traveling_with,
        accommodations: formData.accommodations === "Yes",
        tour_guide: formData.tour_guide === "Yes"
      });
      alert("User registered successfully!");
      console.log(response.data);
    } catch (error) {
      alert("Error registering user");
      console.error(error);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-80">
        {step === 1 && (
          <div>
            <h2 className="text-xl font-bold mb-4">Register</h2>
            <input className="w-full p-2 border rounded mb-2" type="text" name="name" placeholder="Name" onChange={handleChange} />
            <input className="w-full p-2 border rounded mb-2" type="email" name="email" placeholder="E-mail" onChange={handleChange} />
            <input className="w-full p-2 border rounded mb-2" type="password" name="password" placeholder="Password" onChange={handleChange} />
            <input className="w-full p-2 border rounded mb-2" type="password" name="confirmPassword" placeholder="Confirm password" onChange={handleChange} />
            <button className="w-full bg-green-500 text-white p-2 rounded" onClick={() => setStep(2)}>Next</button>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 className="text-xl font-bold mb-4">Preferences</h2>
            <p className="text-sm font-medium">Destination</p>
            {["Beach", "Mountains", "City", "Countryside"].map((place) => (
              <label className="block" key={place}>
                <input type="radio" name="destination" value={place} onChange={handleRadioChange} /> {place}
              </label>
            ))}
            <p className="text-sm font-medium">Traveling with</p>
            {["Solo", "Family", "Partner", "Friends"].map((group) => (
              <label className="block" key={group}>
                <input type="radio" name="traveling_with" value={group} onChange={handleRadioChange} /> {group}
              </label>
            ))}
            <button className="w-full bg-green-500 text-white p-2 rounded" onClick={() => setStep(3)}>Next</button>
          </div>
        )}

        {step === 3 && (
          <div>
            <h2 className="text-xl font-bold mb-4">Preferences</h2>
            <p className="text-sm font-medium">Accommodations</p>
            {["Yes", "No"].map((option) => (
              <label className="mr-2" key={option}>
                <input type="radio" name="accommodations" value={option} onChange={handleRadioChange} /> {option}
              </label>
            ))}
            <p className="text-sm font-medium">Tour guide</p>
            {["Yes", "No"].map((option) => (
              <label className="mr-2" key={option}>
                <input type="radio" name="tour_guide" value={option} onChange={handleRadioChange} /> {option}
              </label>
            ))}
            <button className="w-full bg-green-500 text-white p-2 rounded" onClick={handleSubmit}>Submit</button>
          </div>
        )}
      </div>
    </div>
  );
}

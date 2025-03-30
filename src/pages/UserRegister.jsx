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

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRadioChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateStep1 = () => {
    let formErrors = {};
    if (!formData.name) formErrors.name = "Name is required.";
    if (!formData.email) formErrors.email = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) formErrors.email = "Email is invalid.";
    if (!formData.password) formErrors.password = "Password is required.";
    if (!formData.confirmPassword) formErrors.confirmPassword = "Please confirm your password.";
    if (formData.password !== formData.confirmPassword) formErrors.confirmPassword = "Passwords do not match.";

    return formErrors;
  };

  const validateStep2 = () => {
    let formErrors = {};
    if (!formData.destination) formErrors.destination = "Destination is required.";
    if (!formData.traveling_with) formErrors.traveling_with = "Traveling with field is required.";

    return formErrors;
  };

  const validateStep3 = () => {
    let formErrors = {};
    if (formData.accommodations === "") formErrors.accommodations = "Please select an option for accommodations.";
    if (formData.tour_guide === "") formErrors.tour_guide = "Please select an option for tour guide.";

    return formErrors;
  };

  const handleSubmit = async () => {
    const formErrors = { ...validateStep1(), ...validateStep2(), ...validateStep3() };
    setErrors(formErrors);

    if (Object.keys(formErrors).length > 0) return;  // If errors exist, prevent form submission

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

  const goToNextStep = () => {
    let formErrors = {};
    if (step === 1) formErrors = validateStep1();
    else if (step === 2) formErrors = validateStep2();
    else if (step === 3) formErrors = validateStep3();

    setErrors(formErrors);

    if (Object.keys(formErrors).length === 0) {
      setStep(step + 1);
    }
  };

  const goToPreviousStep = () => {
    setStep(step - 1);
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="bg-white bg-opacity-80 p-10 max-w-md w-full z-10 relative">
        {step === 1 && (
          <div>
            <h2 className="text-3xl font-semibold text-gray-800 mb-4">Register</h2>

            {/* Name Field */}
            <div className="mb-4">
              <label htmlFor="name" className="block text-sm font-medium">Name</label>
              <input
                className="appearance-none block w-full bg-gray-100 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-1 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                type="text"
                id="name"
                name="name"
                placeholder="Enter your name"
                value={formData.name}
                onChange={handleChange}
              />
              {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
            </div>

            {/* Email Field */}
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium">Email</label>
              <input
                className="appearance-none block w-full bg-gray-100 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-1 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                type="email"
                id="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
            </div>

            {/* Password Field */}
            <div className="mb-4">
              <label htmlFor="password" className="block text-sm font-medium">Password</label>
              <input
                className="appearance-none block w-full bg-gray-100 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-1 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                type="password"
                id="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
              />
              {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
            </div>

            {/* Confirm Password Field */}
            <div className="mb-4">
              <label htmlFor="confirmPassword" className="block text-sm font-medium">Confirm Password</label>
              <input
                className="appearance-none block w-full bg-gray-100 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-1 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
              {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword}</p>}
            </div>

            <button
              className="w-full bg-[#007a55] text-white p-2 rounded mt-4"
              onClick={goToNextStep}
            >
              Next
            </button>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 className="text-3xl font-semibold text-gray-800 mb-4">Preferences</h2>
            <div className="mb-3">
              <p className="text-sm font-medium">Destination</p>
              {["Beach", "Mountains", "City", "Countryside"].map((place) => (
                <label className="block" key={place}>
                  <input
                    type="radio"
                    name="destination"
                    value={place}
                    onChange={handleRadioChange}
                    checked={formData.destination === place}
                  /> {place}
                </label>
              ))}
              {errors.destination && <p className="text-red-500 text-sm">{errors.destination}</p>}
            </div>
            <div className="mb-3">
              <p className="text-sm font-medium">Traveling with</p>
              {["Solo", "Family", "Partner", "Friends"].map((group) => (
                <label className="block" key={group}>
                  <input
                    type="radio"
                    name="traveling_with"
                    value={group}
                    onChange={handleRadioChange}
                    checked={formData.traveling_with === group}
                  /> {group}
                </label>
              ))}
              {errors.traveling_with && <p className="text-red-500 text-sm">{errors.traveling_with}</p>}
            </div>
            <div className="flex justify-between">
              <button
                className="w-32 bg-gray-500 text-white p-2 rounded mt-4"
                onClick={goToPreviousStep}
              >
                Back
              </button>
              <button
                className="w-32 bg-[#007a55] text-white p-2 rounded mt-4"
                onClick={goToNextStep}
              >
                Next
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h2 className="text-3xl font-semibold text-gray-800 mb-4">Preferences</h2>
            <p className="text-sm font-medium">Accommodations</p>
            {["Yes", "No"].map((option) => (
              <label className="mr-2" key={option}>
                <input
                  type="radio"
                  name="accommodations"
                  value={option}
                  onChange={handleRadioChange}
                  checked={formData.accommodations === option}
                /> {option}
              </label>
            ))}
            {errors.accommodations && <p className="text-red-500 text-sm">{errors.accommodations}</p>}
            <p className="text-sm font-medium">Tour guide</p>
            {["Yes", "No"].map((option) => (
              <label className="mr-2" key={option}>
                <input
                  type="radio"
                  name="tour_guide"
                  value={option}
                  onChange={handleRadioChange}
                  checked={formData.tour_guide === option}
                /> {option}
              </label>
            ))}
            {errors.tour_guide && <p className="text-red-500 text-sm">{errors.tour_guide}</p>}
            <div className="flex justify-between">
              <button
                className="w-32 bg-gray-500 text-white p-2 rounded mt-4"
                onClick={goToPreviousStep}
              >
                Back
              </button>
              <button
                className="w-32 bg-[#007a55] text-white p-2 rounded mt-4"
                onClick={handleSubmit}
              >
                Submit
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

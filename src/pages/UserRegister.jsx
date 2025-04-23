import React, { useState, useEffect } from "react";
import axios from "axios";
import API_BASE_URL from "../config/config";

export default function Register() {

  useEffect(() => {
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", "#007a55");
  }, []);

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    destination: []
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    setFormData((prev) => {
      const updated = checked
        ? [...prev.destination, value]
        : prev.destination.filter((item) => item !== value);
      return { ...prev, destination: updated };
    });
  };

  const validateStep1 = () => {
    let formErrors = {};
    if (!formData.name) formErrors.name = "Name is required.";
    if (!formData.email) formErrors.email = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) formErrors.email = "Invalid email.";
    if (!formData.phone) formErrors.phone = "Phone number is required.";
    else if (!/^\d{10}$/.test(formData.phone)) formErrors.phone = "Phone must be 10 digits.";
    if (!formData.password) formErrors.password = "Password is required.";
    if (!formData.confirmPassword) formErrors.confirmPassword = "Please confirm password.";
    if (formData.password !== formData.confirmPassword)
      formErrors.confirmPassword = "Passwords do not match.";
    return formErrors;
  };

  const validateStep2 = () => {
    let formErrors = {};
    if (formData.destination.length === 0) formErrors.destination = "Select at least one destination.";
    return formErrors;
  };

  const handleSubmit = async () => {
    const formErrors = { ...validateStep1(), ...validateStep2() };
    setErrors(formErrors);
    if (Object.keys(formErrors).length > 0) return;

    try {
      const response = await axios.post(`${API_BASE_URL}/users`, {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        destination: formData.destination
      });
      alert("User registered successfully!");
      console.log(response.data);
    } catch (error) {
      alert("Error registering user");
      console.error(error);
    }
  };

  const goToNextStep = () => {
    const formErrors = step === 1 ? validateStep1() : validateStep2();
    setErrors(formErrors);
    if (Object.keys(formErrors).length === 0) setStep(step + 1);
  };

  const goToPreviousStep = () => setStep(step - 1);

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="bg-white bg-opacity-80 p-10 max-w-md w-full z-10 relative">
        {step === 1 && (
          <div>
            <h2 className="text-3xl font-semibold text-gray-800 mb-4">Register</h2>

            {["name", "email", "phone", "password", "confirmPassword"].map((field) => (
              <div className="mb-4" key={field}>
                <label htmlFor={field} className="block text-sm font-medium capitalize">
                  {field === "confirmPassword" ? "Confirm Password" : field.charAt(0).toUpperCase() + field.slice(1)}
                </label>
                <input
                  className="appearance-none block w-full bg-gray-100 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-1 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  type={field.includes("password") ? "password" : field === "email" ? "email" : "text"}
                  id={field}
                  name={field}
                  placeholder={`Enter your ${field === "confirmPassword" ? "password again" : field}`}
                  value={formData[field]}
                  onChange={handleChange}
                />
                {errors[field] && <p className="text-red-500 text-sm">{errors[field]}</p>}
              </div>
            ))}

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
            <h2 className="text-3xl font-semibold text-gray-800 mb-4">Travel Preferences</h2>
            <div className="mb-3">
              <p className="text-sm font-medium">Destination (Select one or more)</p>
              {["Beach", "Mountains", "City", "Countryside"].map((place) => (
                <label className="block" key={place}>
                  <input
                    type="checkbox"
                    name="destination"
                    value={place}
                    checked={formData.destination.includes(place)}
                    onChange={handleCheckboxChange}
                  />{" "}
                  {place}
                </label>
              ))}
              {errors.destination && <p className="text-red-500 text-sm">{errors.destination}</p>}
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

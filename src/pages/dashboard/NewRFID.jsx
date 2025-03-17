import React, { useState } from "react";
import Select from "react-select";
import Sidebar from "../../components/Sidebar";

// List of countries
const countries = [
    { value: "US", label: "United States" },
    { value: "UK", label: "United Kingdom" },
    { value: "CA", label: "Canada" },
    { value: "AU", label: "Australia" },
    { value: "IN", label: "India" },
    { value: "LK", label: "Sri Lanka" },
    { value: "FR", label: "France" },
    { value: "DE", label: "Germany" },
];

// Reusable Input Field Component
const InputField = ({ label, name, type, value, onChange }) => (
    <div className="w-full">
        <label className="block text-lg font-semibold text-gray-700 mb-1">{label}</label>
        <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 outline-none"
            required
        />
    </div>
);

export default function NewRFID() {
    const [traveler, setTraveler] = useState({
        fullName: "",
        email: "",
        phone: "",
        nationality: "",
        passportNumber: "",
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setTraveler((prev) => ({ ...prev, [name]: value }));
    };

    const handleCountryChange = (selectedOption) => {
        setTraveler((prev) => ({ ...prev, nationality: selectedOption?.value || "" }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);

        setTimeout(() => {
            console.log("Traveler Data:", traveler);
            alert("Traveler Added Successfully!");
            setTraveler({
                fullName: "",
                email: "",
                phone: "",
                nationality: "",
                passportNumber: "",
            });
            setLoading(false);
        }, 1000);
    };

    // Custom Styles for react-select
    const customStyles = {
        control: (provided, state) => ({
            ...provided,
            padding: "6px",
            border: "1px solid #D1D5DB",
            borderRadius: "6px",
            boxShadow: state.isFocused ? "0 0 0 2px #10B981" : "none",
            outline: "none",
            "&:hover": { borderColor: "#10B981" },
        }),
        dropdownIndicator: (provided) => ({
            ...provided,
            color: "#4B5563",
        }),
        menu: (provided) => ({
            ...provided,
            borderRadius: "6px",
            zIndex: 10,
        }),
        option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isSelected ? "#10B981" : state.isFocused ? "#ECFDF5" : "white",
            color: state.isSelected ? "white" : "#374151",
        }),
    };

    return (
        <div className="flex h-screen">
            <Sidebar />
            <div className="flex-1 ml-64 overflow-y-auto h-screen">
                <div className="bg-white w-full p-12">
                    <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
                        {/* Reusable Input Fields */}
                        <InputField label="Full Name" name="fullName" type="text" value={traveler.fullName} onChange={handleChange} />
                        <InputField label="Email" name="email" type="email" value={traveler.email} onChange={handleChange} />
                        <InputField label="Phone Number" name="phone" type="tel" value={traveler.phone} onChange={handleChange} />

                        {/* Styled Searchable Country Select */}
                        <div className="w-full">
                            <label className="block text-lg font-semibold text-gray-700 mb-1">Nationality</label>
                            <Select
                                options={countries}
                                onChange={handleCountryChange}
                                value={countries.find(c => c.value === traveler.nationality) || null}
                                isClearable
                                placeholder="Select a country..."
                                styles={customStyles}
                            />
                        </div>

                        <InputField label="Passport Number" name="passportNumber" type="text" value={traveler.passportNumber} onChange={handleChange} />

                        {/* Submit Button */}
                        <div className="col-span-2 flex justify-end">
                            <button
                                type="submit"
                                disabled={loading}
                                className={`bg-green-600 text-white text-lg font-semibold py-3 px-6 rounded-md 
                                    transition ${loading ? "opacity-50 cursor-not-allowed" : "hover:bg-green-700"}`}
                            >
                                {loading ? "Adding..." : "Add Traveler"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

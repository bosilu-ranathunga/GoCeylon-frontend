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
const InputField = ({ label, name, type, value, onChange, error }) => (
    <div className="w-full">
        <label className="block text-lg font-semibold text-gray-700 mb-1">{label}</label>
        <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            className={`w-full p-3 border ${error ? "border-red-500" : "border-gray-300"} rounded-md focus:ring-2 focus:ring-green-500 outline-none`}
            required
        />
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
);

export default function NewRFID() {
    const [traveler, setTraveler] = useState({
        fullName: "",
        email: "",
        phone: "",
        nationality: "",
        passportNumber: "",
        rfidTag: "",
        walletAmount: "",
        birthday: "",
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setTraveler((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: "" })); // Clear error on change
    };

    const handleCountryChange = (selectedOption) => {
        setTraveler((prev) => ({ ...prev, nationality: selectedOption?.value || "" }));
        setErrors((prev) => ({ ...prev, nationality: "" })); // Clear error on change
    };

    const validateForm = () => {
        let newErrors = {};
        if (!traveler.fullName.trim()) newErrors.fullName = "Full Name is required.";
        if (!traveler.email.trim()) newErrors.email = "Email is required.";
        else if (!/^\S+@\S+\.\S+$/.test(traveler.email)) newErrors.email = "Invalid email format.";
        if (!traveler.phone.trim()) newErrors.phone = "Phone Number is required.";
        else if (!/^\d+$/.test(traveler.phone)) newErrors.phone = "Phone number must contain only digits.";
        if (!traveler.rfidTag.trim()) newErrors.rfidTag = "RFID Tag Code is required.";
        if (!traveler.nationality) newErrors.nationality = "Nationality is required.";
        if (!traveler.passportNumber.trim()) newErrors.passportNumber = "Passport Number is required.";
        if (!traveler.walletAmount) newErrors.walletAmount = "Wallet Amount is required.";
        else if (Number(traveler.walletAmount) < 0) newErrors.walletAmount = "Wallet amount cannot be negative.";
        if (!traveler.birthday) newErrors.birthday = "Birthday is required.";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateForm()) return;

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
                rfidTag: "",
                walletAmount: "",
                birthday: "",
            });
            setErrors({});
            setLoading(false);
        }, 1000);
    };

    // Custom Styles for react-select
    const customStyles = {
        control: (provided, state) => ({
            ...provided,
            padding: "6px",
            border: errors.nationality ? "1px solid #EF4444" : "1px solid #D1D5DB",
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
        <div className="flex h-screen bg-[#eee]">
            <Sidebar />
            <div class="flex-1 ml-64 overflow-y-auto h-screen p-8">
                <div class="bg-white w-full p-10 rounded-lg shadow-xl relative">
                    <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
                        <InputField label="Full Name" name="fullName" type="text" value={traveler.fullName} onChange={handleChange} error={errors.fullName} />
                        <InputField label="Email" name="email" type="email" value={traveler.email} onChange={handleChange} error={errors.email} />
                        <InputField label="Phone Number" name="phone" type="tel" value={traveler.phone} onChange={handleChange} error={errors.phone} />
                        <InputField label="RFID Tag Code" name="rfidTag" type="text" value={traveler.rfidTag} onChange={handleChange} error={errors.rfidTag} />

                        {/* Styled Searchable Country Select */}
                        <div className="w-full">
                            <label className="block text-lg font-semibold text-gray-700 mb-1">Nationality</label>
                            <Select
                                options={countries}
                                onChange={handleCountryChange}
                                value={countries.find((c) => c.value === traveler.nationality) || null}
                                isClearable
                                placeholder="Select a country..."
                                styles={customStyles}
                            />
                            {errors.nationality && <p className="text-red-500 text-sm mt-1">{errors.nationality}</p>}
                        </div>

                        <InputField label="Passport Number" name="passportNumber" type="text" value={traveler.passportNumber} onChange={handleChange} error={errors.passportNumber} />
                        <InputField label="Wallet Amount" name="walletAmount" type="number" value={traveler.walletAmount} onChange={handleChange} error={errors.walletAmount} />
                        <InputField label="Birthday" name="birthday" type="date" value={traveler.birthday} onChange={handleChange} error={errors.birthday} />

                        {/* Submit Button */}
                        <div className="col-span-2 flex justify-end">
                            <button
                                type="submit"
                                disabled={loading}
                                className={`bg-green-600 text-white text-lg font-semibold py-3 px-6 rounded-md transition ${loading ? "opacity-50 cursor-not-allowed" : "hover:bg-green-700"
                                    }`}
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

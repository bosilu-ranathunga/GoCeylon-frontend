import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Select from "react-select";
import axios from "axios";
import Sidebar from "../../components/Sidebar";
import { useModal } from '../../context/ModalContext';

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

const InputField = ({ label, name, type, value, onChange, error, disabled }) => (
    <div className="w-full">
        <label className="block text-lg font-semibold text-gray-700 mb-1">{label}</label>
        <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            disabled={disabled}
            className={`w-full p-3 border ${error ? "border-red-500" : "border-gray-300"} rounded-md focus:ring-2 focus:ring-green-500 outline-none ${disabled ? "bg-gray-100 cursor-not-allowed" : ""
                }`}
        />
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
);

export default function UpdateRFID() {
    const { id } = useParams();
    const { showModal, closeModal } = useModal();
    const [traveler, setTraveler] = useState({
        fullName: "",
        email: "",
        phoneNumber: "",
        nationality: "",
        passportNumber: "",
        rfidTagCode: "",
        walletAmount: "",
        birthday: ""
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        const fetchTraveler = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/rfid/${id}`);
                const apiData = response.data.data;

                console.log(apiData);

                // Map API response to state fields
                setTraveler({
                    fullName: apiData.fullName || "",
                    email: apiData.email || "",
                    phoneNumber: apiData.phoneNumber || "",
                    nationality: apiData.nationality || "",
                    passportNumber: apiData.passportNumber || "",
                    rfidTagCode: apiData.rfidTagCode || "",
                    walletAmount: apiData.walletAmount || "",
                    birthday: apiData.birthday ? apiData.birthday.split('T')[0] : ""
                });

                setLoading(false);
            } catch (error) {
                console.error("Error fetching traveler:", error);
                showModal({
                    title: 'Error',
                    content: <p>Failed to load traveler data. Please try again later.</p>,
                    buttons: [
                        {
                            label: 'OK',
                            onClick: closeModal,
                            className: 'bg-blue-500 text-white hover:bg-blue-600'
                        }
                    ]
                });
                setLoading(false);
            }
        };

        fetchTraveler();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setTraveler((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: "" }));
    };

    const handleCountryChange = (selectedOption) => {
        setTraveler((prev) => ({ ...prev, nationality: selectedOption?.value || "" }));
        setErrors((prev) => ({ ...prev, nationality: "" }));
    };

    const validateForm = () => {
        let newErrors = {};
        if (!traveler.fullName.trim()) newErrors.fullName = "Full Name is required.";
        if (!traveler.email.trim()) newErrors.email = "Email is required.";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(traveler.email)) newErrors.email = "Invalid email format.";
        if (!traveler.phoneNumber.trim()) newErrors.phoneNumber = "Phone Number is required.";
        else if (!/^\d+$/.test(traveler.phoneNumber)) newErrors.phoneNumber = "Phone number must contain only digits.";
        if (!traveler.nationality) newErrors.nationality = "Nationality is required.";
        if (!traveler.passportNumber.trim()) newErrors.passportNumber = "Passport Number is required.";
        if (!traveler.walletAmount) newErrors.walletAmount = "Wallet Amount is required.";
        else if (Number(traveler.walletAmount) < 0) newErrors.walletAmount = "Wallet amount cannot be negative.";
        if (!traveler.birthday) newErrors.birthday = "Birthday is required.";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setUpdating(true);
        try {
            const response = await axios.put(`http://localhost:3000/rfid/${id}`, traveler, {
                headers: { "Content-Type": "application/json" },
            });
            console.log("Traveler Updated:", response.data);
            showModal({
                title: 'Update Successful!',
                content: <p>Traveler information has been updated successfully.</p>,
                buttons: [
                    {
                        label: 'OK',
                        onClick: closeModal,
                        className: 'bg-blue-500 text-white hover:bg-blue-600'
                    }
                ]
            });
        } catch (error) {
            console.error("Error updating traveler:", error);
            showModal({
                title: 'Update Failed!',
                content: <p>{error.response?.data?.message || "Failed to update traveler information."}</p>,
                buttons: [
                    {
                        label: 'OK',
                        onClick: closeModal,
                        className: 'bg-blue-500 text-white hover:bg-blue-600'
                    }
                ]
            });
        } finally {
            setUpdating(false);
        }
    };

    if (loading) {
        return (
            <div className="flex h-screen bg-[#eee]">
                <Sidebar />
                <div className="flex-1 ml-64 overflow-y-auto h-screen p-8">
                    <div className="bg-white w-full p-10 rounded-lg shadow-xl text-center">
                        <p className="text-lg font-semibold">Loading traveler data...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-[#eee]">
            <Sidebar />
            <div className="flex-1 ml-64 overflow-y-auto h-screen p-8">
                <div className="bg-white w-full p-10 rounded-lg shadow-xl relative">
                    <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
                        <InputField
                            label="Full Name"
                            name="fullName"
                            type="text"
                            value={traveler.fullName}
                            onChange={handleChange}
                            error={errors.fullName}
                        />
                        <InputField
                            label="Email"
                            name="email"
                            type="email"
                            value={traveler.email}
                            onChange={handleChange}
                            error={errors.email}
                        />
                        <InputField
                            label="Phone Number"
                            name="phoneNumber"
                            type="tel"
                            value={traveler.phoneNumber}
                            onChange={handleChange}
                            error={errors.phoneNumber}
                        />
                        <InputField
                            label="RFID Tag Code"
                            name="rfidTagCode"
                            type="text"
                            value={traveler.rfidTagCode}
                            onChange={handleChange}
                            error={errors.rfidTagCode}
                            disabled
                        />
                        <div className="w-full">
                            <label className="block text-lg font-semibold text-gray-700 mb-1">Nationality</label>
                            <Select
                                options={countries}
                                onChange={handleCountryChange}
                                value={countries.find(c => c.value === traveler.nationality)}
                                isClearable
                                placeholder="Select a country..."
                            />
                            {errors.nationality && <p className="text-red-500 text-sm mt-1">{errors.nationality}</p>}
                        </div>
                        <InputField
                            label="Passport Number"
                            name="passportNumber"
                            type="text"
                            value={traveler.passportNumber}
                            onChange={handleChange}
                            error={errors.passportNumber}
                        />
                        <InputField
                            label="Wallet Amount"
                            name="walletAmount"
                            type="number"
                            value={traveler.walletAmount}
                            onChange={handleChange}
                            error={errors.walletAmount}
                        />
                        <InputField
                            label="Birthday"
                            name="birthday"
                            type="date"
                            value={traveler.birthday}
                            onChange={handleChange}
                            error={errors.birthday}
                        />
                        <div className="col-span-2 flex justify-end">
                            <button
                                type="submit"
                                disabled={updating}
                                className={`bg-green-600 text-white text-lg font-semibold py-3 px-6 rounded-md transition ${updating ? "opacity-50 cursor-not-allowed" : "hover:bg-green-700"
                                    }`}
                            >
                                {updating ? "Updating..." : "Update Traveler"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
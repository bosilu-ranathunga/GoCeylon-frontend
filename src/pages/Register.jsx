"use client"
import React, { useState, useEffect } from "react";
import { Check, ChevronLeft, ChevronRight, User, Mail, Phone, Lock, Loader2, Briefcase, MapPin } from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"
import axios from "axios";
import API_BASE_URL from "../config/config";

const destinations = [
    {
        id: "Beach",
        label: "Beach Getaways",
        description: "Relax on sandy shores and enjoy the ocean",
    },
    {
        id: "Mountains",
        label: "Mountain Retreats",
        description: "Experience breathtaking heights and fresh air",
    },
    {
        id: "City",
        label: "City Exploration",
        description: "Discover urban culture and architecture",
    },
    {
        id: "Countryside",
        label: "Countryside Escapes",
        description: "Enjoy peaceful rural landscapes",
    },
]

const languages = ["English", "Spanish", "French", "German", "Italian", "Mandarin", "Japanese", "Arabic"]

const businessTypes = [
    "Hotel/Resort",
    "Tour Operator",
    "Transportation",
    "Restaurant",
    "Activity Provider",
    "Travel Agency",
    "Other",
]

export default function RegistrationForm() {

    useEffect(() => {
        document.querySelector('meta[name="theme-color"]')?.setAttribute("content", "#007a55");
    }, []);

    const [step, setStep] = useState(1)
    const [formData, setFormData] = useState({
        userType: "",
        // Common fields
        name: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
        // Traveller specific
        destination: [],
        // Guide specific
        languages: [],
        experience: "",
        // Business specific
        companyName: "",
        businessType: "",
        employeeCount: "",
    })
    const [errors, setErrors] = useState({})
    const [isSubmitted, setIsSubmitted] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const totalSteps = () => {
        return 3 // User type + Personal info + Type-specific info
    }

    const validateUserTypeStep = () => {
        const newErrors = {}

        if (!formData.userType) {
            newErrors.userType = "Please select a user type"
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const validatePersonalInfoStep = () => {
        const newErrors = {}

        if (!formData.name.trim()) {
            newErrors.name = "Name is required"
        }

        if (!formData.email.trim()) {
            newErrors.email = "Email is required"
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Email is invalid"
        }

        if (!formData.phone.trim()) {
            newErrors.phone = "Phone number is required"
        } else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ""))) {
            newErrors.phone = "Phone number should be 10 digits"
        }

        if (!formData.password) {
            newErrors.password = "Password is required"
        } else if (formData.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters"
        }

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match"
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const validateFinalStep = () => {
        const newErrors = {}

        if (formData.userType === "Traveller") {
            if (formData.destination.length === 0) {
                newErrors.destination = "Please select at least one destination"
            }
        } else if (formData.userType === "Guide") {
            if (formData.languages.length === 0) {
                newErrors.languages = "Please select at least one language"
            }
            if (!formData.experience) {
                newErrors.experience = "Please select your experience level"
            }
        } else if (formData.userType === "Business") {
            if (!formData.companyName.trim()) {
                newErrors.companyName = "Company name is required"
            }
            if (!formData.businessType) {
                newErrors.businessType = "Please select your business type"
            }
            if (!formData.employeeCount) {
                newErrors.employeeCount = "Please select employee count"
            }
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData({
            ...formData,
            [name]: value,
        })

        // Clear error when user types
        if (errors[name]) {
            setErrors({
                ...errors,
                [name]: undefined,
            })
        }
    }

    const handleUserTypeSelect = (type) => {
        setFormData({
            ...formData,
            userType: type,
        })

        // Clear error when user selects a type
        if (errors.userType) {
            setErrors({
                ...errors,
                userType: undefined,
            })
        }
    }

    const toggleDestination = (destinationId) => {
        const isSelected = formData.destination.includes(destinationId)

        if (isSelected) {
            setFormData({
                ...formData,
                destination: formData.destination.filter((item) => item !== destinationId),
            })
        } else {
            setFormData({
                ...formData,
                destination: [...formData.destination, destinationId],
            })
        }

        // Clear error when user selects an option
        if (errors.destination) {
            setErrors({
                ...errors,
                destination: undefined,
            })
        }
    }

    const toggleLanguage = (language) => {
        const isSelected = formData.languages.includes(language)

        if (isSelected) {
            setFormData({
                ...formData,
                languages: formData.languages.filter((item) => item !== language),
            })
        } else {
            setFormData({
                ...formData,
                languages: [...formData.languages, language],
            })
        }

        // Clear error when user selects an option
        if (errors.languages) {
            setErrors({
                ...errors,
                languages: undefined,
            })
        }
    }

    const goToNextStep = () => {
        if (step === 1) {
            if (validateUserTypeStep()) {
                setIsLoading(true)
                setTimeout(() => {
                    setStep(2)
                    setIsLoading(false)
                }, 400)
            }
        } else if (step === 2) {
            if (validatePersonalInfoStep()) {
                setIsLoading(true)
                setTimeout(() => {
                    setStep(3)
                    setIsLoading(false)
                }, 400)
            }
        }
    }

    const goToPreviousStep = () => {
        if (step > 1) {
            setStep(step - 1)
        }
    }

    const resetForm = () => {
        setIsSubmitted(false)
        setStep(1)
        setFormData({
            userType: "",
            name: "",
            email: "",
            phone: "",
            password: "",
            confirmPassword: "",
            destination: [],
            languages: [],
            experience: "",
            companyName: "",
            businessType: "",
            employeeCount: "",
        })
    }

    // Get icon for input field
    const getInputIcon = (field) => {
        switch (field) {
            case "name":
                return <User className="h-5 w-5 text-gray-400" />
            case "email":
                return <Mail className="h-5 w-5 text-gray-400" />
            case "phone":
                return <Phone className="h-5 w-5 text-gray-400" />
            case "password":
            case "confirmPassword":
                return <Lock className="h-5 w-5 text-gray-400" />
            case "companyName":
                return <Briefcase className="h-5 w-5 text-gray-400" />
            default:
                return null
        }
    }

    // Get step title
    const getStepTitle = () => {
        if (isSubmitted) return "Registration Complete"

        switch (step) {
            case 1:
                return "Select Account Type"
            case 2:
                return "Personal Information"
            case 3:
                switch (formData.userType) {
                    case "Traveller":
                        return "Travel Preferences"
                    case "Guide":
                        return "Guide Information"
                    case "Business":
                        return "Business Details"
                    default:
                        return "Additional Information"
                }
            default:
                return "Registration"
        }
    }

    const handleTravelerSubmit = async () => {
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

    const handleSubmit = () => {
        if (validateFinalStep()) {
            setIsLoading(true)
            // Simulate form submission
            setTimeout(() => {
                console.log("Form submitted:", formData)
                setIsSubmitted(true)
                setIsLoading(false)
            }, 1000)

            if (formData.userType === "Traveller") {
                // Handle traveller-specific submission logic here
                handleTravelerSubmit();
            } else if (formData.userType === "Guide") {
                // Handle guide-specific submission logic here 
            } else if (formData.userType === "Business") {
                // Handle business-specific submission logic here
            }

        }
    }

    return (
        <div className="flex flex-col min-h-screen overflow-hidden fixed w-full bg-gray-50">
            {/* App-like header */}
            <header className="bg-[#007a55] text-white py-4 px-5 flex items-center shadow-sm">
                {step > 1 && !isSubmitted && (
                    <button
                        onClick={goToPreviousStep}
                        className="mr-2 -ml-1 p-1.5 rounded-full hover:bg-[#006045] transition-colors"
                        disabled={isLoading}
                    >
                        <ChevronLeft size={22} />
                    </button>
                )}
                <h1 className="text-xl font-semibold">{getStepTitle()}</h1>
            </header>

            {/* Progress indicator */}
            <div className="flex justify-center py-4">
                <div className="flex space-x-3">
                    {Array.from({ length: totalSteps() }).map((_, index) => (
                        <div
                            key={index}
                            className={`w-2.5 h-2.5 rounded-full transition-colors duration-300 ${step > index ? "bg-[#007a55]" : "bg-gray-300"
                                }`}
                        ></div>
                    ))}
                </div>
            </div>

            {/* Form content */}
            <div className="flex-1 overflow-y-auto h-[calc(100vh_-_188px)] overflow-scroll max-h-[calc(100vh_-_188px)]">
                <AnimatePresence mode="wait">
                    {isSubmitted ? (
                        <motion.div
                            key="success"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                            className="flex flex-col items-center justify-center h-full text-center px-6 py-12"
                        >
                            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6 shadow-sm">
                                <Check className="h-10 w-10 text-green-600" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-3">Registration Successful!</h2>
                            <p className="text-gray-600 mb-8 max-w-xs">
                                Thank you for registering as a <span className="font-medium">{formData.userType}</span>. We'll be in
                                touch soon!
                            </p>
                            <div className="w-full max-w-xs">
                                <button
                                    className="w-full bg-[#007a55] text-white py-3.5 rounded-lg font-medium shadow-sm hover:bg-[#006045] transition-colors"
                                    onClick={resetForm}
                                >
                                    Register Another Account
                                </button>
                            </div>
                        </motion.div>
                    ) : (
                        <>
                            {step === 1 && (
                                <motion.div
                                    key="step1"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    transition={{ duration: 0.3 }}
                                    className="px-5 py-6 space-y-5 max-w-md mx-auto"
                                >
                                    <div className="mb-2">
                                        <h2 className="text-xl font-bold text-gray-800 mb-1">Choose Account Type</h2>
                                        <p className="text-gray-500 text-sm">Select the type of account you want to create</p>
                                    </div>

                                    <div className="space-y-3">
                                        {["Traveller", "Guide", "Business"].map((type) => (
                                            <motion.div
                                                key={type}
                                                whileTap={{ scale: 0.98 }}
                                                className={`p-5 border rounded-lg ${formData.userType === type ? "border-[#007a55] bg-[#e6f5f0]" : "border-gray-200 bg-white"
                                                    } transition-colors duration-200 shadow-sm cursor-pointer`}
                                                onClick={() => handleUserTypeSelect(type)}
                                            >
                                                <div className="flex items-center">
                                                    <div
                                                        className={`w-5 h-5 flex-shrink-0 rounded-full border ${formData.userType === type ? "border-[#007a55] bg-[#007a55]" : "border-gray-300"
                                                            } flex items-center justify-center mr-3 transition-colors duration-200`}
                                                    >
                                                        {formData.userType === type && <Check className="h-3 w-3 text-white" />}
                                                    </div>
                                                    <div className="flex-1">
                                                        <h3 className="font-medium text-gray-800">{type}</h3>
                                                        <p className="text-xs text-gray-500 mt-0.5">
                                                            {type === "Traveller"
                                                                ? "Find and book amazing travel experiences"
                                                                : type === "Guide"
                                                                    ? "Offer your expertise and guide travelers"
                                                                    : "List your travel business and services"}
                                                        </p>
                                                    </div>
                                                    <div className="ml-3 bg-gray-100 p-2 rounded-full">
                                                        {type === "Traveller" ? (
                                                            <User className="h-5 w-5 text-gray-500" />
                                                        ) : type === "Guide" ? (
                                                            <MapPin className="h-5 w-5 text-gray-500" />
                                                        ) : (
                                                            <Briefcase className="h-5 w-5 text-gray-500" />
                                                        )}
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>

                                    {errors.userType && (
                                        <motion.p
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="text-red-500 text-sm mt-1"
                                        >
                                            {errors.userType}
                                        </motion.p>
                                    )}
                                </motion.div>
                            )}

                            {step === 2 && (
                                <motion.div
                                    key="step2"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.3 }}
                                    className="px-5 py-6 space-y-5 max-w-md mx-auto"
                                >
                                    <div className="mb-2">
                                        <h2 className="text-xl font-bold text-gray-800 mb-1">Personal Information</h2>
                                        <p className="text-gray-500 text-sm">Please enter your details to create an account</p>
                                    </div>

                                    {["name", "email", "phone", "password", "confirmPassword"].map((field) => (
                                        <div key={field}>
                                            <label htmlFor={field} className="block text-sm font-medium text-gray-700 mb-1.5 capitalize">
                                                {field === "confirmPassword"
                                                    ? "Confirm Password"
                                                    : field.charAt(0).toUpperCase() + field.slice(1)}
                                            </label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                                    {getInputIcon(field)}
                                                </div>
                                                <input
                                                    className={`appearance-none block w-full bg-white text-gray-700 border ${errors[field] ? "border-red-500" : "border-gray-300"
                                                        } rounded-lg py-3.5 pl-11 pr-4 leading-tight focus:outline-none focus:ring-2 focus:ring-[#007a55] focus:border-transparent transition-colors`}
                                                    type={field.includes("password") ? "password" : field === "email" ? "email" : "text"}
                                                    id={field}
                                                    name={field}
                                                    placeholder={`Enter your ${field === "confirmPassword" ? "password again" : field}`}
                                                    value={formData[field]}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                            {errors[field] && (
                                                <motion.p
                                                    initial={{ opacity: 0, y: -10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    className="text-red-500 text-sm mt-1"
                                                >
                                                    {errors[field]}
                                                </motion.p>
                                            )}
                                        </div>
                                    ))}
                                </motion.div>
                            )}

                            {step === 3 && formData.userType === "Traveller" && (
                                <motion.div
                                    key="step3-traveller"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.3 }}
                                    className="px-5 py-6 max-w-md mx-auto"
                                >
                                    <div className="mb-5">
                                        <h2 className="text-xl font-bold text-gray-800 mb-1">Travel Preferences</h2>
                                        <p className="text-gray-500 text-sm">Select destinations you're interested in visiting</p>
                                    </div>

                                    <div className="space-y-3 mb-6">
                                        {destinations.map((destination) => (
                                            <motion.div
                                                key={destination.id}
                                                whileTap={{ scale: 0.98 }}
                                                className={`p-4 border rounded-lg ${formData.destination.includes(destination.id)
                                                    ? "border-[#007a55] bg-[#e6f5f0]"
                                                    : "border-gray-200 bg-white"
                                                    } transition-colors duration-200 shadow-sm cursor-pointer`}
                                                onClick={() => toggleDestination(destination.id)}
                                            >
                                                <div className="flex items-center">
                                                    <div
                                                        className={`w-5 h-5 flex-shrink-0 rounded-full border ${formData.destination.includes(destination.id)
                                                            ? "border-[#007a55] bg-[#007a55]"
                                                            : "border-gray-300"
                                                            } flex items-center justify-center mr-3 transition-colors duration-200`}
                                                    >
                                                        {formData.destination.includes(destination.id) && <Check className="h-3 w-3 text-white" />}
                                                    </div>
                                                    <div>
                                                        <h3 className="font-medium text-gray-800">{destination.label}</h3>
                                                        <p className="text-xs text-gray-500 mt-0.5">{destination.description}</p>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>

                                    {errors.destination && (
                                        <motion.p
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="text-red-500 text-sm mt-2 mb-4"
                                        >
                                            {errors.destination}
                                        </motion.p>
                                    )}
                                </motion.div>
                            )}

                            {step === 3 && formData.userType === "Guide" && (
                                <motion.div
                                    key="step3-guide"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.3 }}
                                    className="px-5 py-6 max-w-md mx-auto"
                                >
                                    <div className="mb-5">
                                        <h2 className="text-xl font-bold text-gray-800 mb-1">Guide Information</h2>
                                        <p className="text-gray-500 text-sm">Tell us about your guiding expertise</p>
                                    </div>

                                    <div className="mb-6">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Languages You Speak</label>
                                        <div className="grid grid-cols-2 gap-2">
                                            {languages.map((language) => (
                                                <motion.div
                                                    key={language}
                                                    whileTap={{ scale: 0.98 }}
                                                    className={`p-3 border rounded-lg ${formData.languages.includes(language)
                                                        ? "border-[#007a55] bg-[#e6f5f0]"
                                                        : "border-gray-200 bg-white"
                                                        } transition-colors duration-200 shadow-sm cursor-pointer flex items-center`}
                                                    onClick={() => toggleLanguage(language)}
                                                >
                                                    <div
                                                        className={`w-4 h-4 flex-shrink-0 rounded-full border ${formData.languages.includes(language)
                                                            ? "border-[#007a55] bg-[#007a55]"
                                                            : "border-gray-300"
                                                            } flex items-center justify-center mr-2 transition-colors duration-200`}
                                                    >
                                                        {formData.languages.includes(language) && <Check className="h-2 w-2 text-white" />}
                                                    </div>
                                                    <span className="text-sm">{language}</span>
                                                </motion.div>
                                            ))}
                                        </div>
                                        {errors.languages && (
                                            <motion.p
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="text-red-500 text-sm mt-2"
                                            >
                                                {errors.languages}
                                            </motion.p>
                                        )}
                                    </div>

                                    <div className="mb-6">
                                        <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-1.5">
                                            Years of Experience
                                        </label>
                                        <select
                                            id="experience"
                                            name="experience"
                                            value={formData.experience}
                                            onChange={handleChange}
                                            className={`appearance-none block w-full bg-white text-gray-700 border ${errors.experience ? "border-red-500" : "border-gray-300"
                                                } rounded-lg py-3.5 px-4 leading-tight focus:outline-none focus:ring-2 focus:ring-[#007a55] focus:border-transparent transition-colors`}
                                        >
                                            <option value="">Select experience</option>
                                            <option value="0-1">Less than 1 year</option>
                                            <option value="1-3">1-3 years</option>
                                            <option value="3-5">3-5 years</option>
                                            <option value="5-10">5-10 years</option>
                                            <option value="10+">More than 10 years</option>
                                        </select>
                                        {errors.experience && (
                                            <motion.p
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="text-red-500 text-sm mt-1"
                                            >
                                                {errors.experience}
                                            </motion.p>
                                        )}
                                    </div>
                                </motion.div>
                            )}

                            {step === 3 && formData.userType === "Business" && (
                                <motion.div
                                    key="step3-business"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.3 }}
                                    className="px-5 py-6 max-w-md mx-auto"
                                >
                                    <div className="mb-5">
                                        <h2 className="text-xl font-bold text-gray-800 mb-1">Business Details</h2>
                                        <p className="text-gray-500 text-sm">Tell us about your travel business</p>
                                    </div>

                                    <div className="space-y-5">
                                        <div>
                                            <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-1.5">
                                                Company Name
                                            </label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                                    {getInputIcon("companyName")}
                                                </div>
                                                <input
                                                    className={`appearance-none block w-full bg-white text-gray-700 border ${errors.companyName ? "border-red-500" : "border-gray-300"
                                                        } rounded-lg py-3.5 pl-11 pr-4 leading-tight focus:outline-none focus:ring-2 focus:ring-[#007a55] focus:border-transparent transition-colors`}
                                                    type="text"
                                                    id="companyName"
                                                    name="companyName"
                                                    placeholder="Enter your company name"
                                                    value={formData.companyName}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                            {errors.companyName && (
                                                <motion.p
                                                    initial={{ opacity: 0, y: -10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    className="text-red-500 text-sm mt-1"
                                                >
                                                    {errors.companyName}
                                                </motion.p>
                                            )}
                                        </div>

                                        <div>
                                            <label htmlFor="businessType" className="block text-sm font-medium text-gray-700 mb-1.5">
                                                Business Type
                                            </label>
                                            <select
                                                id="businessType"
                                                name="businessType"
                                                value={formData.businessType}
                                                onChange={handleChange}
                                                className={`appearance-none block w-full bg-white text-gray-700 border ${errors.businessType ? "border-red-500" : "border-gray-300"
                                                    } rounded-lg py-3.5 px-4 leading-tight focus:outline-none focus:ring-2 focus:ring-[#007a55] focus:border-transparent transition-colors`}
                                            >
                                                <option value="">Select business type</option>
                                                {businessTypes.map((type) => (
                                                    <option key={type} value={type}>
                                                        {type}
                                                    </option>
                                                ))}
                                            </select>
                                            {errors.businessType && (
                                                <motion.p
                                                    initial={{ opacity: 0, y: -10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    className="text-red-500 text-sm mt-1"
                                                >
                                                    {errors.businessType}
                                                </motion.p>
                                            )}
                                        </div>

                                        <div>
                                            <label htmlFor="employeeCount" className="block text-sm font-medium text-gray-700 mb-1.5">
                                                Number of Employees
                                            </label>
                                            <select
                                                id="employeeCount"
                                                name="employeeCount"
                                                value={formData.employeeCount}
                                                onChange={handleChange}
                                                className={`appearance-none block w-full bg-white text-gray-700 border ${errors.employeeCount ? "border-red-500" : "border-gray-300"
                                                    } rounded-lg py-3.5 px-4 leading-tight focus:outline-none focus:ring-2 focus:ring-[#007a55] focus:border-transparent transition-colors`}
                                            >
                                                <option value="">Select employee count</option>
                                                <option value="1-10">1-10 employees</option>
                                                <option value="11-50">11-50 employees</option>
                                                <option value="51-200">51-200 employees</option>
                                                <option value="201-500">201-500 employees</option>
                                                <option value="500+">500+ employees</option>
                                            </select>
                                            {errors.employeeCount && (
                                                <motion.p
                                                    initial={{ opacity: 0, y: -10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    className="text-red-500 text-sm mt-1"
                                                >
                                                    {errors.employeeCount}
                                                </motion.p>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </>
                    )}
                </AnimatePresence>
            </div>

            {/* Fixed bottom buttons */}
            {!isSubmitted && (
                <div className="px-5 py-4 border-t absolute w-full bottom-0 border-gray-200 bg-white shadow-md">
                    {step < 3 && (
                        <button
                            className="w-full bg-[#007a55] text-white py-3.5 rounded-lg font-medium flex items-center justify-center shadow-sm hover:bg-[#006045] transition-colors disabled:opacity-70"
                            onClick={goToNextStep}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <Loader2 className="h-5 w-5 animate-spin mr-2" />
                            ) : (
                                <>
                                    <span>Continue</span>
                                    <ChevronRight size={20} className="ml-1" />
                                </>
                            )}
                        </button>
                    )}

                    {step === 3 && (
                        <button
                            className="w-full bg-[#007a55] text-white py-3.5 rounded-lg font-medium shadow-sm hover:bg-[#006045] transition-colors flex items-center justify-center disabled:opacity-70"
                            onClick={handleSubmit}
                            disabled={isLoading}
                        >
                            {isLoading ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : <span>Complete Registration</span>}
                        </button>
                    )}
                </div>
            )}
        </div>
    )
}

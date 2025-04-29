import React from 'react';

import { useState, useEffect } from "react"
import { ArrowLeft, Camera, MapPin, Phone, Store, FileText, Tag, Map } from "lucide-react"
import { useNavigate } from "react-router-dom"
import API_BASE_URL from "../../config/config"

const CATEGORY_OPTIONS = [
    "Restaurant",
    "Hotel",
    "Shop",
    "Adventure",
    "Transportation",
    "Handicrafts",
    "Bakery",
    "Cafe",
    "Tour Operator",
    "Other",
]

export default function AddBusiness() {
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        business_name: "",
        business_category: "",
        contact_number: "",
        address: "",
        description: "",
        images: [],
        related_locations: [],
    })
    const [locations, setLocations] = useState([])
    const [errorMessage, setErrorMessage] = useState("")
    const [successMessage, setSuccessMessage] = useState("")
    const [loading, setLoading] = useState(false)
    const [imagePreview, setImagePreview] = useState(null)
    const [activeStep, setActiveStep] = useState(1)
    const [formProgress, setFormProgress] = useState(0)

    useEffect(() => {
        // Calculate form progress
        const requiredFields = ["business_name", "business_category", "contact_number", "address"]
        const filledFields = requiredFields.filter((field) => formData[field]).length
        setFormProgress((filledFields / requiredFields.length) * 100)

        // Fetch locations for related_locations dropdown
        const fetchLocations = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/location`)
                const data = await res.json()
                setLocations(data.locations || [])
            } catch (err) {
                setLocations([])
            }
        }
        fetchLocations()
    }, [formData])

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData({ ...formData, [name]: value })
    }

    const handleFileChange = (e) => {
        const { name, files } = e.target
        if (name === "images" && files.length > 0) {
            setFormData({ ...formData, images: Array.from(files) })

            // Create preview for the first image
            const reader = new FileReader()
            reader.onload = (e) => {
                setImagePreview(e.target.result)
            }
            reader.readAsDataURL(files[0])
        }
    }

    const handleLocationsChange = (e) => {
        const selected = Array.from(e.target.selectedOptions).map((opt) => opt.value)
        setFormData({ ...formData, related_locations: selected })
    }

    const validateForm = () => {
        const { business_name, business_category, contact_number, address } = formData
        if (!business_name || !business_category || !contact_number || !address) {
            setErrorMessage("Please fill in all required fields.")
            return false
        }
        setErrorMessage("")
        return true
    }

    const resetForm = () => {
        setFormData({
            business_name: "",
            business_category: "",
            contact_number: "",
            address: "",
            description: "",
            images: [],
            related_locations: [],
        })
        setImagePreview(null)
        setActiveStep(1)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!validateForm()) return
        setLoading(true)
        const formDataToSend = new FormData()

        // Get logged in user id from token
        const token = localStorage.getItem("authToken")
        const decoded = JSON.parse(atob(token.split(".")[1]))
        const business_user = decoded.id

        if (!business_user) {
            setErrorMessage("User ID not found. Please log in.")
            setLoading(false)
            return
        }

        formDataToSend.append("business_user", business_user)
        formDataToSend.append("business_name", formData.business_name)
        formDataToSend.append("business_category", formData.business_category)
        formDataToSend.append("contact_number", formData.contact_number)
        formDataToSend.append("address", formData.address)
        formDataToSend.append("description", formData.description)

        formData.related_locations.forEach((id) => formDataToSend.append("related_locations", id))
        formData.images.forEach((image) => {
            formDataToSend.append("images", image)
        })

        try {
            const response = await fetch(`${API_BASE_URL}/api/business/create`, {
                method: "POST",
                body: formDataToSend,
            })

            const result = await response.json()

            if (response.ok) {
                setSuccessMessage("Business created successfully!")
                resetForm()

                // Show success message then navigate after delay
                setTimeout(() => {
                    navigate("/business")
                }, 2000)
            } else {
                setErrorMessage(result.error || "Failed to create business.")
            }
        } catch (error) {
            setErrorMessage("An error occurred. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    const handleBack = () => {
        navigate(-1)
    }

    const nextStep = () => {
        if (activeStep < 3) setActiveStep(activeStep + 1)
    }

    const prevStep = () => {
        if (activeStep > 1) setActiveStep(activeStep - 1)
    }

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 bg-white z-10 shadow-sm">
                <div className="flex items-center h-16 px-4">
                    <button onClick={handleBack} className="p-2 rounded-full hover:bg-gray-100">
                        <ArrowLeft className="w-5 h-5 text-gray-700" />
                    </button>
                    <h1 className="text-lg font-semibold text-gray-800 ml-4">Add Business</h1>
                </div>

                {/* Progress bar */}
                <div className="h-1 bg-gray-100">
                    <div className="h-full bg-[#007a55] transition-all duration-300" style={{ width: `${formProgress}%` }}></div>
                </div>

                {/* Step indicators */}
                <div className="flex justify-center py-2 bg-white border-b border-gray-200">
                    <div className="flex space-x-4">
                        <div
                            className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${activeStep === 1 ? "bg-[#007a55] text-white" : "bg-gray-100 text-gray-600"
                                }`}
                        >
                            1
                        </div>
                        <div
                            className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${activeStep === 2 ? "bg-[#007a55] text-white" : "bg-gray-100 text-gray-600"
                                }`}
                        >
                            2
                        </div>
                        <div
                            className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${activeStep === 3 ? "bg-[#007a55] text-white" : "bg-gray-100 text-gray-600"
                                }`}
                        >
                            3
                        </div>
                    </div>
                </div>
            </header>

            {/* Main content */}
            <div className="flex-1 pt-28 pb-24 px-4">
                {errorMessage && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-center">
                        {errorMessage}
                    </div>
                )}

                {successMessage && (
                    <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-center">
                        {successMessage}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Step 1: Basic Information */}
                    {activeStep === 1 && (
                        <div className="space-y-5">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">Basic Information</h2>

                            <div className="bg-white rounded-xl shadow-sm p-4">
                                <div className="flex items-center mb-2">
                                    <Store className="w-5 h-5 text-[#007a55] mr-2" />
                                    <label className="font-medium text-gray-700">Business Name *</label>
                                </div>
                                <input
                                    type="text"
                                    name="business_name"
                                    placeholder="Enter business name"
                                    onChange={handleChange}
                                    value={formData.business_name}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007a55] focus:border-transparent"
                                    required
                                />
                            </div>

                            <div className="bg-white rounded-xl shadow-sm p-4">
                                <div className="flex items-center mb-2">
                                    <Tag className="w-5 h-5 text-[#007a55] mr-2" />
                                    <label className="font-medium text-gray-700">Category *</label>
                                </div>
                                <select
                                    name="business_category"
                                    value={formData.business_category}
                                    onChange={handleChange}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007a55] focus:border-transparent appearance-none bg-white"
                                    required
                                >
                                    <option value="">Select Category</option>
                                    {CATEGORY_OPTIONS.map((cat) => (
                                        <option key={cat} value={cat}>
                                            {cat}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="bg-white rounded-xl shadow-sm p-4">
                                <div className="flex items-center mb-2">
                                    <Phone className="w-5 h-5 text-[#007a55] mr-2" />
                                    <label className="font-medium text-gray-700">Contact Number *</label>
                                </div>
                                <input
                                    type="text"
                                    name="contact_number"
                                    placeholder="Enter contact number"
                                    onChange={handleChange}
                                    value={formData.contact_number}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007a55] focus:border-transparent"
                                    required
                                />
                            </div>
                        </div>
                    )}

                    {/* Step 2: Location & Description */}
                    {activeStep === 2 && (
                        <div className="space-y-5">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">Location & Description</h2>

                            <div className="bg-white rounded-xl shadow-sm p-4">
                                <div className="flex items-center mb-2">
                                    <MapPin className="w-5 h-5 text-[#007a55] mr-2" />
                                    <label className="font-medium text-gray-700">Address *</label>
                                </div>
                                <input
                                    type="text"
                                    name="address"
                                    placeholder="Enter business address"
                                    onChange={handleChange}
                                    value={formData.address}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007a55] focus:border-transparent"
                                    required
                                />
                            </div>

                            <div className="bg-white rounded-xl shadow-sm p-4">
                                <div className="flex items-center mb-2">
                                    <FileText className="w-5 h-5 text-[#007a55] mr-2" />
                                    <label className="font-medium text-gray-700">Description</label>
                                </div>
                                <textarea
                                    name="description"
                                    placeholder="Describe your business"
                                    onChange={handleChange}
                                    value={formData.description}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007a55] focus:border-transparent min-h-[120px]"
                                />
                            </div>

                            <div className="bg-white rounded-xl shadow-sm p-4">
                                <div className="flex items-center mb-2">
                                    <Map className="w-5 h-5 text-[#007a55] mr-2" />
                                    <label className="font-medium text-gray-700">Related Locations</label>
                                </div>
                                <select
                                    name="related_locations"
                                    multiple
                                    value={formData.related_locations}
                                    onChange={handleLocationsChange}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007a55] focus:border-transparent min-h-[120px]"
                                >
                                    {locations.map((loc) => (
                                        <option key={loc._id} value={loc._id}>
                                            {loc.name}
                                        </option>
                                    ))}
                                </select>
                                <p className="text-xs text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple locations</p>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Images & Submit */}
                    {activeStep === 3 && (
                        <div className="space-y-5">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">Business Images</h2>

                            <div className="bg-white rounded-xl shadow-sm p-4">
                                <div className="flex items-center mb-3">
                                    <Camera className="w-5 h-5 text-[#007a55] mr-2" />
                                    <label className="font-medium text-gray-700">Upload Images</label>
                                </div>

                                {/* Image preview */}
                                {imagePreview ? (
                                    <div className="mb-4">
                                        <div className="relative w-full h-48 rounded-lg overflow-hidden mb-2">
                                            <img
                                                src={imagePreview || "/placeholder.svg"}
                                                alt="Business preview"
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <p className="text-sm text-gray-500">
                                            {formData.images.length} {formData.images.length === 1 ? "image" : "images"} selected
                                        </p>
                                    </div>
                                ) : (
                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center mb-4">
                                        <Camera className="w-10 h-10 text-gray-400 mb-2" />
                                        <p className="text-gray-500 text-center">Tap to upload business images</p>
                                    </div>
                                )}

                                <div className="relative">
                                    <input
                                        type="file"
                                        name="images"
                                        onChange={handleFileChange}
                                        multiple
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    />
                                    <button
                                        type="button"
                                        className="w-full py-3 border border-[#007a55] text-[#007a55] rounded-lg font-medium flex items-center justify-center"
                                    >
                                        <Camera className="w-4 h-4 mr-2" />
                                        {imagePreview ? "Change Images" : "Select Images"}
                                    </button>
                                </div>
                            </div>

                            <div className="bg-white rounded-xl shadow-sm p-4">
                                <h3 className="font-medium text-gray-700 mb-3">Review Information</h3>

                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Business Name:</span>
                                        <span className="font-medium">{formData.business_name}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Category:</span>
                                        <span className="font-medium">{formData.business_category}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Contact:</span>
                                        <span className="font-medium">{formData.contact_number}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Images:</span>
                                        <span className="font-medium">{formData.images.length} selected</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </form>
            </div>

            {/* Fixed bottom buttons */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 flex gap-3">
                {activeStep > 1 && (
                    <button
                        type="button"
                        onClick={prevStep}
                        className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg font-medium"
                    >
                        Back
                    </button>
                )}

                {activeStep < 3 ? (
                    <button
                        type="button"
                        onClick={nextStep}
                        className="flex-1 bg-[#007a55] text-white py-3 rounded-lg font-medium"
                    >
                        Continue
                    </button>
                ) : (
                    <button
                        type="button"
                        onClick={handleSubmit}
                        className="flex-1 bg-[#007a55] text-white py-3 rounded-lg font-medium flex items-center justify-center"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                Creating...
                            </>
                        ) : (
                            "Create Business"
                        )}
                    </button>
                )}
            </div>
        </div>
    )
}

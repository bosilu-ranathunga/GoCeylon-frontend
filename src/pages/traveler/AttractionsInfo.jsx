

import React, { useState, useEffect, useCallback, useRef } from "react"
import { useParams, useNavigate } from "react-router-dom"
import axios from "axios"
import API_BASE_URL from "../../config/config"
import {
  ArrowLeft,
  MapPin,
  User,
  ChevronLeft,
  ChevronRight,
  X,
  Maximize,
  Minimize,
  Cloud,
  CloudRain,
  Sun,
  CloudSnow,
  CloudLightning,
  Thermometer,
  Wind,
  Droplets,
  Clock,
  Share2,
  Heart,
  Calendar,
  Info,
  ImageIcon,
  Bookmark,
} from "lucide-react"

const AttractionDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [attraction, setAttraction] = useState({})
  const [selectedImage, setSelectedImage] = useState(null)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [weather, setWeather] = useState(null)
  const [showLightbox, setShowLightbox] = useState(false)
  const [loading, setLoading] = useState(true)
  const [weatherLoading, setWeatherLoading] = useState(false)
  const [error, setError] = useState(null)
  const [isZoomed, setIsZoomed] = useState(false)
  const [touchStart, setTouchStart] = useState({ x: 0, y: 0 })
  const [touchEnd, setTouchEnd] = useState({ x: 0, y: 0 })
  const [lastTap, setLastTap] = useState(0)
  const [scrollPosition, setScrollPosition] = useState(0)
  const [isFavorite, setIsFavorite] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [activeTab, setActiveTab] = useState("about")
  const imageRef = useRef(null)
  const headerRef = useRef(null)
  const contentRef = useRef(null)

  // WeatherAPI.com API key
  const WEATHER_API_KEY = "1ceadd56b96742dc9cf193920252804"

  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY
      setScrollPosition(scrollPos)

      // Dynamic header opacity based on scroll
      if (headerRef.current && contentRef.current) {
        const headerHeight = headerRef.current.offsetHeight
        const contentTop = contentRef.current.offsetTop - headerHeight

        if (scrollPos > contentTop / 2) {
          headerRef.current.classList.add("bg-white/95", "shadow-md")
          headerRef.current.classList.remove("bg-transparent")
        } else {
          headerRef.current.classList.remove("bg-white/95", "shadow-md")
          headerRef.current.classList.add("bg-transparent")
        }
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    const fetchAttractionDetails = async () => {
      setLoading(true)
      try {
        const response = await axios.get(`${API_BASE_URL}/location/${id}`)
        setAttraction(response.data || {})

        // Fetch weather data if we have location information
        if (response.data && response.data.name) {
          fetchWeatherData(response.data.name)
        }

        // Check if this attraction is in favorites/bookmarks
        // This would typically come from your user preferences API
        // For demo purposes, we'll just set random values
        setIsFavorite(Math.random() > 0.5)
        setIsBookmarked(Math.random() > 0.5)
      } catch (error) {
        console.error("Error fetching attraction details:", error)
        setError("Failed to load attraction details. Please try again.")
      } finally {
        setLoading(false)
      }
    }
    fetchAttractionDetails()
  }, [id])

  const fetchWeatherData = async (locationName) => {
    setWeatherLoading(true)

    try {
      const encodedLocation = encodeURIComponent(locationName)
      const response = await axios.get(
        `https://api.weatherapi.com/v1/current.json?key=${WEATHER_API_KEY}&q=${encodedLocation}&aqi=no`,
      )

      setWeather(response.data)
    } catch (error) {
      console.error("Error fetching weather data:", error)
      // We don't set the main error state here to avoid disrupting the whole UI
    } finally {
      setWeatherLoading(false)
    }
  }

  const handleShowDirections = () => {
    if (attraction.google_map_url) {
      window.open(attraction.google_map_url, "_blank")
    } else {
      alert("Google Maps URL not available for this attraction.")
    }
  }

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite)
    // Here you would typically call an API to update the user's favorites
  }

  const toggleBookmark = () => {
    setIsBookmarked(!isBookmarked)
    // Here you would typically call an API to update the user's bookmarks
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: attraction.name,
          text: `Check out ${attraction.name}!`,
          url: window.location.href,
        })
        .catch((err) => console.error("Error sharing:", err))
    } else {
      // Fallback for browsers that don't support the Web Share API
      alert(`Share this link: ${window.location.href}`)
    }
  }

  const images = attraction.image_url?.slice(1) || []
  const mainImage = attraction.image_url?.[0] || "/placeholder.svg?height=600&width=800"

  const getWeatherIcon = (conditionCode) => {
    // Map WeatherAPI.com condition codes to icons
    if (conditionCode >= 1000 && conditionCode <= 1003) return <Sun className="w-8 h-8 text-yellow-500" />
    if (conditionCode >= 1006 && conditionCode <= 1030) return <Cloud className="w-8 h-8 text-gray-500" />
    if (conditionCode >= 1063 && conditionCode <= 1201) return <CloudRain className="w-8 h-8 text-blue-500" />
    if (conditionCode >= 1204 && conditionCode <= 1237) return <CloudSnow className="w-8 h-8 text-blue-300" />
    if (conditionCode >= 1240 && conditionCode <= 1264) return <CloudRain className="w-8 h-8 text-blue-500" />
    if (conditionCode >= 1273 && conditionCode <= 1282) return <CloudLightning className="w-8 h-8 text-purple-500" />
    return <Cloud className="w-8 h-8 text-gray-500" />
  }

  const openLightbox = (img, index) => {
    setSelectedImage(img)
    setSelectedImageIndex(index)
    setShowLightbox(true)
    document.body.style.overflow = "hidden" // Prevent background scrolling
  }

  const closeLightbox = () => {
    setShowLightbox(false)
    setIsZoomed(false)
    document.body.style.overflow = "" // Restore scrolling
  }

  const handlePrevImage = (e) => {
    e.stopPropagation()
    const newIndex = (selectedImageIndex - 1 + images.length) % images.length
    setSelectedImageIndex(newIndex)
    setSelectedImage(images[newIndex])
  }

  const handleNextImage = (e) => {
    e.stopPropagation()
    const newIndex = (selectedImageIndex + 1) % images.length
    setSelectedImageIndex(newIndex)
    setSelectedImage(images[newIndex])
  }

  const handleKeyPress = useCallback(
    (e) => {
      if (!showLightbox) return

      switch (e.key) {
        case "ArrowLeft":
          handlePrevImage(e)
          break
        case "ArrowRight":
          handleNextImage(e)
          break
        case "Escape":
          closeLightbox()
          break
        default:
          break
      }
    },
    [showLightbox, selectedImageIndex, images.length],
  )

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress)
    return () => {
      window.removeEventListener("keydown", handleKeyPress)
    }
  }, [handleKeyPress])

  const handleTouchStart = (e) => {
    const touch = e.touches[0]
    setTouchStart({ x: touch.clientX, y: touch.clientY })
    setTouchEnd({ x: touch.clientX, y: touch.clientY })
  }

  const handleTouchMove = (e) => {
    const touch = e.touches[0]
    setTouchEnd({ x: touch.clientX, y: touch.clientY })
  }

  const handleTouchEnd = () => {
    const diffX = touchStart.x - touchEnd.x
    const diffY = touchStart.y - touchEnd.y

    // If horizontal swipe is greater than vertical swipe and meets minimum threshold
    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
      if (diffX > 0) {
        handleNextImage({ stopPropagation: () => { } })
      } else {
        handlePrevImage({ stopPropagation: () => { } })
      }
    }
  }

  const handleDoubleTap = (e) => {
    const now = Date.now()
    const DOUBLE_TAP_DELAY = 300

    if (now - lastTap < DOUBLE_TAP_DELAY) {
      // Double tap detected
      setIsZoomed(!isZoomed)
      e.stopPropagation()
    }
    setLastTap(now)
  }

  const toggleZoom = (e) => {
    e.stopPropagation()
    setIsZoomed(!isZoomed)
  }

  if (loading) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-white">
        <div className="w-16 h-16 border-4 border-t-emerald-600 border-emerald-200 rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-600 font-medium">Loading attraction details...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-white p-6">
        <div className="bg-red-50 rounded-xl p-6 w-full max-w-md shadow-lg">
          <h3 className="text-xl font-semibold text-red-700 mb-2">Error</h3>
          <p className="text-gray-700 mb-4">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="w-full bg-red-600 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Transparent Header that becomes solid on scroll */}
      <header
        ref={headerRef}
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-transparent backdrop-blur-sm flex items-center justify-between px-4 py-3"
      >
        <button
          className="p-2 rounded-full bg-white/20 backdrop-blur-sm shadow-sm text-gray-800 hover:bg-white/40 transition-colors"
          onClick={() => navigate(-1)}
          aria-label="Back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-2">
          <button
            className={`p-2 rounded-full ${isBookmarked ? "bg-emerald-100 text-emerald-600" : "bg-white/20 backdrop-blur-sm text-gray-800"} shadow-sm hover:bg-white/40 transition-colors`}
            onClick={toggleBookmark}
            aria-label={isBookmarked ? "Remove from bookmarks" : "Add to bookmarks"}
          >
            <Bookmark className={`w-5 h-5 ${isBookmarked ? "fill-emerald-600" : ""}`} />
          </button>

          <button
            className={`p-2 rounded-full ${isFavorite ? "bg-red-100 text-red-600" : "bg-white/20 backdrop-blur-sm text-gray-800"} shadow-sm hover:bg-white/40 transition-colors`}
            onClick={toggleFavorite}
            aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          >
            <Heart className={`w-5 h-5 ${isFavorite ? "fill-red-600" : ""}`} />
          </button>

          <button
            className="p-2 rounded-full bg-white/20 backdrop-blur-sm shadow-sm text-gray-800 hover:bg-white/40 transition-colors"
            onClick={handleShare}
            aria-label="Share"
          >
            <Share2 className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Hero Image Section */}
      <div className="relative h-[65vh] w-full">
        <img
          src={mainImage || "/placeholder.svg"}
          alt={attraction.name || "Attraction"}
          className="w-full h-full object-cover"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10"></div>

        {/* Attraction Name and Tags */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="flex flex-wrap gap-2 mb-2">
            {attraction.tags?.map((tag, index) => (
              <span key={index} className="bg-white/20 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full">
                {tag}
              </span>
            ))}
          </div>
          <h1 className="text-3xl font-bold text-white drop-shadow-sm">{attraction.name || "Unknown Location"}</h1>
          <div className="flex items-center mt-2">
            <MapPin className="w-4 h-4 text-white/80 mr-1" />
            <p className="text-white/80 text-sm">{attraction.location || "Location information unavailable"}</p>
          </div>
        </div>
      </div>

      {/* Content Container */}
      <div ref={contentRef} className="relative z-10 -mt-8 rounded-t-3xl bg-white shadow-lg">
        {/* Tab Navigation */}
        <div className="flex border-b">
          <button
            className={`flex-1 py-4 px-4 text-center font-medium transition-colors ${activeTab === "about"
              ? "text-emerald-600 border-b-2 border-emerald-600"
              : "text-gray-500 hover:text-gray-700"
              }`}
            onClick={() => setActiveTab("about")}
          >
            <div className="flex flex-col items-center">
              <Info className={`w-5 h-5 mb-1 ${activeTab === "about" ? "text-emerald-600" : "text-gray-400"}`} />
              About
            </div>
          </button>

          <button
            className={`flex-1 py-4 px-4 text-center font-medium transition-colors ${activeTab === "photos"
              ? "text-emerald-600 border-b-2 border-emerald-600"
              : "text-gray-500 hover:text-gray-700"
              }`}
            onClick={() => setActiveTab("photos")}
          >
            <div className="flex flex-col items-center">
              <ImageIcon className={`w-5 h-5 mb-1 ${activeTab === "photos" ? "text-emerald-600" : "text-gray-400"}`} />
              Photos
            </div>
          </button>

          <button
            className={`flex-1 py-4 px-4 text-center font-medium transition-colors ${activeTab === "weather"
              ? "text-emerald-600 border-b-2 border-emerald-600"
              : "text-gray-500 hover:text-gray-700"
              }`}
            onClick={() => setActiveTab("weather")}
          >
            <div className="flex flex-col items-center">
              <Cloud className={`w-5 h-5 mb-1 ${activeTab === "weather" ? "text-emerald-600" : "text-gray-400"}`} />
              Weather
            </div>
          </button>
        </div>

        <div className="p-5">
          {/* About Tab Content */}
          {activeTab === "about" && (
            <div className="space-y-6">
              {/* Description */}
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-3">Description</h2>
                <div
                  className="text-gray-700 text-base leading-relaxed prose max-w-none"
                  dangerouslySetInnerHTML={{ __html: attraction.description || "No description available." }}
                ></div>
              </div>

              {/* Quick Facts */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Quick Facts</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-start">
                    <Calendar className="w-5 h-5 text-emerald-600 mt-0.5 mr-2" />
                    <div>
                      <p className="text-sm text-gray-500">Best Time to Visit</p>
                      <p className="font-medium">Year-round</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Clock className="w-5 h-5 text-emerald-600 mt-0.5 mr-2" />
                    <div>
                      <p className="text-sm text-gray-500">Suggested Duration</p>
                      <p className="font-medium">2-3 hours</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Photos Tab Content */}
          {activeTab === "photos" && (
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-4">Photo Gallery</h2>
              {images.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[mainImage, ...images].map((img, index) => (
                    <div
                      key={index}
                      className="relative aspect-square rounded-xl overflow-hidden shadow-sm group"
                      onClick={() =>
                        openLightbox(index === 0 ? mainImage : images[index - 1], index === 0 ? 0 : index - 1)
                      }
                    >
                      <img
                        src={img || "/placeholder.svg?height=200&width=200"}
                        alt={`${attraction.name} - Image ${index + 1}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200"></div>
                      {index === 0 && (
                        <div className="absolute top-2 left-2 bg-emerald-600 text-white text-xs px-2 py-1 rounded-md">
                          Main
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-gray-50 rounded-xl p-8 text-center">
                  <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500">No additional images available</p>
                </div>
              )}
            </div>
          )}

          {/* Weather Tab Content */}
          {activeTab === "weather" && (
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-4">Current Weather</h2>

              {weatherLoading ? (
                <div className="flex justify-center items-center py-12 bg-gray-50 rounded-xl">
                  <div className="w-10 h-10 border-3 border-t-emerald-600 border-emerald-200 rounded-full animate-spin"></div>
                </div>
              ) : weather ? (
                <div className="bg-gradient-to-br from-emerald-50 to-blue-50 rounded-xl p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center">
                      {getWeatherIcon(weather.current.condition.code)}
                      <div className="ml-3">
                        <span className="text-3xl font-bold">{weather.current.temp_c}°C</span>
                        <p className="text-sm text-gray-600 capitalize">{weather.current.condition.text}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">{weather.location.name}</p>
                      <p className="text-xs text-gray-500">{weather.location.country}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/70 backdrop-blur-sm rounded-lg p-3 flex items-center">
                      <Thermometer className="w-8 h-8 text-orange-500 mr-3" />
                      <div>
                        <p className="text-xs text-gray-500">Feels Like</p>
                        <p className="font-semibold">{weather.current.feelslike_c}°C</p>
                      </div>
                    </div>

                    <div className="bg-white/70 backdrop-blur-sm rounded-lg p-3 flex items-center">
                      <Droplets className="w-8 h-8 text-blue-500 mr-3" />
                      <div>
                        <p className="text-xs text-gray-500">Humidity</p>
                        <p className="font-semibold">{weather.current.humidity}%</p>
                      </div>
                    </div>

                    <div className="bg-white/70 backdrop-blur-sm rounded-lg p-3 flex items-center">
                      <Wind className="w-8 h-8 text-gray-500 mr-3" />
                      <div>
                        <p className="text-xs text-gray-500">Wind Speed</p>
                        <p className="font-semibold">{weather.current.wind_kph} km/h</p>
                      </div>
                    </div>

                    <div className="bg-white/70 backdrop-blur-sm rounded-lg p-3 flex items-center">
                      <Clock className="w-8 h-8 text-emerald-500 mr-3" />
                      <div>
                        <p className="text-xs text-gray-500">Last Updated</p>
                        <p className="font-semibold">
                          {new Date(weather.current.last_updated).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-50 rounded-xl p-8 text-center">
                  <Cloud className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500">Weather data unavailable</p>
                </div>
              )}

              <div className="mt-6 bg-blue-50 rounded-xl p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Weather Forecast</h3>
                <p className="text-gray-600 text-sm">
                  Weather forecasts help you plan your visit. Check back closer to your trip date for the most accurate
                  forecast.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Fixed Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 flex gap-3 z-40">
        <button
          className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 text-white rounded-xl py-3.5 shadow-md hover:bg-emerald-700 transition-colors"
          onClick={() => navigate(`/user/booking/list/${id}`)}
        >
          <User className="w-5 h-5" />
          <span className="font-medium">Book Guide</span>
        </button>
        <button
          className="flex-1 flex items-center justify-center gap-2 bg-gray-800 text-white rounded-xl py-3.5 shadow-md hover:bg-gray-900 transition-colors"
          onClick={handleShowDirections}
        >
          <MapPin className="w-5 h-5" />
          <span className="font-medium">Directions</span>
        </button>
      </div>

      {/* Lightbox Modal */}
      {showLightbox && (
        <div className="fixed inset-0 z-50 bg-black flex items-center justify-center" onClick={closeLightbox}>
          <div className="absolute top-4 left-0 right-0 flex justify-between px-4 z-10">
            <div className="bg-black/50 backdrop-blur-sm rounded-full px-3 py-1 text-white text-sm">
              {selectedImageIndex + 1} / {images.length}
            </div>
            <button className="bg-black/50 backdrop-blur-sm rounded-full p-2 text-white" onClick={closeLightbox}>
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-4 z-10">
            <button
              className="bg-black/50 backdrop-blur-sm rounded-full p-2 text-white transform transition-transform hover:scale-110"
              onClick={handlePrevImage}
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              className="bg-black/50 backdrop-blur-sm rounded-full p-2 text-white transform transition-transform hover:scale-110"
              onClick={handleNextImage}
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          <div className="absolute bottom-4 right-4 z-10">
            <button
              className="bg-black/50 backdrop-blur-sm rounded-full p-2 text-white transform transition-transform hover:scale-110"
              onClick={toggleZoom}
            >
              {isZoomed ? <Minimize className="w-6 h-6" /> : <Maximize className="w-6 h-6" />}
            </button>
          </div>

          <div
            className="w-full h-full flex items-center justify-center"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onClick={handleDoubleTap}
          >
            <img
              ref={imageRef}
              src={selectedImage || "/placeholder.svg"}
              alt={`${attraction.name} - Image ${selectedImageIndex + 1}`}
              className={`max-h-[85vh] max-w-[90vw] object-contain transition-transform duration-300 ${isZoomed ? "scale-150" : "scale-100"
                }`}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default AttractionDetails

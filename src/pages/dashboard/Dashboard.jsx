import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import API_BASE_URL from "../../config/config";
import axios from 'axios';
import { Users, Compass, Briefcase, MapPin, ArrowUpRight, ArrowDownRight, MoreHorizontal } from "lucide-react";
import {
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
} from "recharts";

export default function Dashboard() {
    const [stats, setStats] = useState(null);
    const [locationData, setLocationData] = useState([]);
    const [genderData, setGenderData] = useState([]);
    const [topLocations, setTopLocations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const token = localStorage.getItem("authToken");

    // Fetch data from APIs
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                // Fetch overview stats
                const statsResponse = await axios.get(`${API_BASE_URL}/report/overview`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setStats(statsResponse.data.data);

                // Fetch location categories
                const locationResponse = await axios.get(`${API_BASE_URL}/report/location-categories`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setLocationData(locationResponse.data.data);

                // Fetch gender diversity
                const genderResponse = await axios.get(`${API_BASE_URL}/report/gender-diversity`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setGenderData(genderResponse.data.data);

                // Fetch top locations
                const topLocationsResponse = await axios.get(`${API_BASE_URL}/report/top-locations`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setTopLocations(topLocationsResponse.data.data);

                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        if (token) {
            fetchData();
        }
    }, [token]);

    // Sample data for recent bookings (no API provided, replace with actual API if available)
    const recentBookings = [
        {
            id: "B12345",
            traveler: "John Smith",
            guide: "Sarah Johnson",
            location: "Swiss Alps",
            date: "May 15, 2023",
            status: "confirmed",
        },
        {
            id: "B12346",
            traveler: "Emma Davis",
            guide: "Michael Chen",
            location: "Tokyo, Japan",
            date: "May 16, 2023",
            status: "pending",
        },
        {
            id: "B12347",
            traveler: "Luis Rodriguez",
            guide: "Elena Rodriguez",
            location: "Barcelona, Spain",
            date: "May 17, 2023",
            status: "confirmed",
        },
        {
            id: "B12348",
            traveler: "Sophia Kim",
            guide: "David Wilson",
            location: "Berlin, Germany",
            date: "May 18, 2023",
            status: "cancelled",
        },
    ];

    // Colors for pie chart
    const GENDER_COLORS = ["#0088FE", "#FF8042"];

    // Colors for bar chart
    const LOCATION_COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7300", "#a4de6c"];

    // Function to get status color
    const getStatusColor = (status) => {
        switch (status) {
            case "confirmed":
                return "bg-green-100 text-green-800";
            case "pending":
                return "bg-yellow-100 text-yellow-800";
            case "cancelled":
                return "bg-red-100 text-red-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    if (loading) {
        return (
            <div className="flex h-screen">
                <Sidebar />
                <div className="flex-1 ml-64 overflow-y-auto h-screen p-8 bg-gray-100">
                    <div className="text-center">Loading...</div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex h-screen">
                <Sidebar />
                <div className="flex-1 ml-64 overflow-y-auto h-screen p-8 bg-gray-100">
                    <div className="text-center text-red-600">Error: {error}</div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen">
            {/* Sidebar */}
            <Sidebar />

            {/* Main content area */}
            <div className="flex-1 ml-64 overflow-y-auto h-screen p-8 bg-gray-100">
                <div className="w-full rounded-lg relative">
                    <div className="">
                        {/* Overview Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                            {/* Travelers Card */}
                            <div className="bg-white rounded-lg shadow-sm p-6">
                                <div className="flex justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-500 mb-1">Total Travelers</p>
                                        <h3 className="text-2xl font-bold text-gray-800">{stats?.travelers.total.toLocaleString()}</h3>
                                    </div>
                                    <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                                        <Users className="h-6 w-6 text-blue-600" />
                                    </div>
                                </div>
                                <div className="mt-4 flex items-center">
                                    <span className={`text-sm font-medium ${stats?.travelers.positive ? "text-green-600" : "text-red-600"}`}>
                                        {stats?.travelers.positive ? "+" : ""}
                                        {stats?.travelers.growth}%
                                    </span>
                                    {stats?.travelers.positive ? (
                                        <ArrowUpRight className="h-4 w-4 text-green-600 ml-1" />
                                    ) : (
                                        <ArrowDownRight className="h-4 w-4 text-red-600 ml-1" />
                                    )}
                                    <span className="text-xs text-gray-500 ml-2">vs last month</span>
                                </div>
                            </div>

                            {/* Guides Card */}
                            <div className="bg-white rounded-lg shadow-sm p-6">
                                <div className="flex justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-500 mb-1">Total Guides</p>
                                        <h3 className="text-2xl font-bold text-gray-800">{stats?.guides.total.toLocaleString()}</h3>
                                    </div>
                                    <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                                        <Compass className="h-6 w-6 text-green-600" />
                                    </div>
                                </div>
                                <div className="mt-4 flex items-center">
                                    <span className={`text-sm font-medium ${stats?.guides.positive ? "text-green-600" : "text-red-600"}`}>
                                        {stats?.guides.positive ? "+" : ""}
                                        {stats?.guides.growth}%
                                    </span>
                                    {stats?.guides.positive ? (
                                        <ArrowUpRight className="h-4 w-4 text-green-600 ml-1" />
                                    ) : (
                                        <ArrowDownRight className="h-4 w-4 text-red-600 ml-1" />
                                    )}
                                    <span className="text-xs text-gray-500 ml-2">vs last month</span>
                                </div>
                            </div>

                            {/* Businesses Card */}
                            <div className="bg-white rounded-lg shadow-sm p-6">
                                <div className="flex justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-500 mb-1">Total Businesses</p>
                                        <h3 className="text-2xl font-bold text-gray-800">{stats?.businesses.total.toLocaleString()}</h3>
                                    </div>
                                    <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center">
                                        <Briefcase className="h-6 w-6 text-purple-600" />
                                    </div>
                                </div>
                                <div className="mt-4 flex items-center">
                                    <span className={`text-sm font-medium ${stats?.businesses.positive ? "text-green-600" : "text-red-600"}`}>
                                        {stats?.businesses.positive ? "+" : ""}
                                        {stats?.businesses.growth}%
                                    </span>
                                    {stats?.businesses.positive ? (
                                        <ArrowUpRight className="h-4 w-4 text-green-600 ml-1" />
                                    ) : (
                                        <ArrowDownRight className="h-4 w-4 text-red-600 ml-1" />
                                    )}
                                    <span className="text-xs text-gray-500 ml-2">vs last month</span>
                                </div>
                            </div>

                            {/* Locations Card */}
                            <div className="bg-white rounded-lg shadow-sm p-6">
                                <div className="flex justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-500 mb-1">Total Locations</p>
                                        <h3 className="text-2xl font-bold text-gray-800">{stats?.locations.total.toLocaleString()}</h3>
                                    </div>
                                    <div className="h-12 w-12 bg-orange-100 rounded-full flex items-center justify-center">
                                        <MapPin className="h-6 w-6 text-orange-600" />
                                    </div>
                                </div>
                                <div className="mt-4 flex items-center">
                                    <span className={`text-sm font-medium ${stats?.locations.positive ? "text-green-600" : "text-red-600"}`}>
                                        {stats?.locations.positive ? "+" : ""}
                                        {stats?.locations.growth}%
                                    </span>
                                    {stats?.locations.positive ? (
                                        <ArrowUpRight className="h-4 w-4 text-green-600 ml-1" />
                                    ) : (
                                        <ArrowDownRight className="h-4 w-4 text-red-600 ml-1" />
                                    )}
                                    <span className="text-xs text-gray-500 ml-2">vs last month</span>
                                </div>
                            </div>
                        </div>

                        {/* Charts Section */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                            {/* Location Categories Chart */}
                            <div className="bg-white rounded-lg shadow-sm p-6">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-lg font-semibold text-gray-800">Locations by Category</h3>
                                    <button className="text-gray-400 hover:text-gray-600">
                                        <MoreHorizontal className="h-5 w-5" />
                                    </button>
                                </div>
                                <div className="h-80">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={locationData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="name" />
                                            <YAxis />
                                            <Tooltip />
                                            <Legend />
                                            <Bar dataKey="count" name="Number of Locations">
                                                {locationData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={LOCATION_COLORS[index % LOCATION_COLORS.length]} />
                                                ))}
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            {/* Guide Gender Diversity Chart */}
                            <div className="bg-white rounded-lg shadow-sm p-6">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-lg font-semibold text-gray-800">Guide Gender Diversity</h3>
                                    <button className="text-gray-400 hover:text-gray-600">
                                        <MoreHorizontal className="h-5 w-5" />
                                    </button>
                                </div>
                                <div className="h-80 flex flex-col items-center justify-center">
                                    <ResponsiveContainer width="100%" height="80%">
                                        <PieChart>
                                            <Pie
                                                data={genderData}
                                                cx="50%"
                                                cy="50%"
                                                labelLine={false}
                                                outerRadius={80}
                                                fill="#8884d8"
                                                dataKey="value"
                                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                            >
                                                {genderData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={GENDER_COLORS[index % GENDER_COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip formatter={(value) => [`${value} guides`, "Count"]} />
                                            <Legend />
                                        </PieChart>
                                    </ResponsiveContainer>
                                    <div className="flex justify-center space-x-8 mt-2">
                                        {genderData.map((entry, index) => (
                                            <div key={entry.name} className="flex items-center">
                                                <div className={`w-3 h-3 rounded-full bg-[${GENDER_COLORS[index]}] mr-2`}></div>
                                                <span className="text-sm text-gray-600">
                                                    {entry.name}: {entry.value} (
                                                    {(
                                                        (entry.value /
                                                            genderData.reduce((sum, item) => sum + item.value, 0)) *
                                                        100
                                                    ).toFixed(1)}
                                                    %)
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Tables Section */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Recent Bookings Table */}
                            <div className="bg-white rounded-lg shadow-sm p-6">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-lg font-semibold text-gray-800">Recent Bookings</h3>
                                    <button className="text-sm text-[#007a55] font-medium">View All</button>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full">
                                        <thead>
                                            <tr className="border-b border-gray-200">
                                                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    ID
                                                </th>
                                                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Traveler
                                                </th>
                                                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Guide
                                                </th>
                                                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Date
                                                </th>
                                                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Status
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200">
                                            {recentBookings.map((booking) => (
                                                <tr key={booking.id}>
                                                    <td className="px-3 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{booking.id}</td>
                                                    <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-600">{booking.traveler}</td>
                                                    <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-600">{booking.guide}</td>
                                                    <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-600">{booking.date}</td>
                                                    <td className="px-3 py-3 whitespace-nowrap">
                                                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(booking.status)}`}>
                                                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Top Locations Table */}
                            <div className="bg-white rounded-lg shadow-sm p-6">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-lg font-semibold text-gray-800">Top Locations</h3>
                                    <button className="text-sm text-[#007a55] font-medium">View All</button>
                                </div>
                                <div className="overflow

-x-auto">
                                    <table className="min-w-full">
                                        <thead>
                                            <tr className="border-b border-gray-200">
                                                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Location
                                                </th>
                                                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Bookings
                                                </th>
                                                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Growth
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200">
                                            {topLocations.map((location, index) => (
                                                <tr key={index}>
                                                    <td className="px-3 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{location.name}</td>
                                                    <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-600">{location.bookings}</td>
                                                    <td className="px-3 py-3 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <span
                                                                className={`text-sm font-medium ${location.growth >= 0 ? "text-green-600" : "text-red-600"}`}
                                                            >
                                                                {location.growth >= 0 ? "+" : ""}
                                                                {location.growth}%
                                                            </span>
                                                            {location.growth >= 0 ? (
                                                                <ArrowUpRight className="h-4 w-4 text-green-600 ml-1" />
                                                            ) : (
                                                                <ArrowDownRight className="h-4 w-4 text-red-600 ml-1" />
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
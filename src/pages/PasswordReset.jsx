import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import API_BASE_URL from "../config/config";

const PasswordReset = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        document.querySelector('meta[name="theme-color"]')?.setAttribute("content", "#ffffff");
    }, []);

    return (
        <div className="h-screen flex items-center justify-center relative lg:bg-gray-100">
            <div className="bg-white bg-opacity-80 p-10 max-w-[400px] w-full z-10 relative lg:shadow-lg lg:rounded-lg">
                <div className="text-left mb-6">
                    <h2 className="text-3xl font-semibold text-gray-800">Reset Password</h2>
                    <p className="text-sm mt-2 text-gray-500">Discover Sri Lanka’s stunning destinations, rich culture, and unforgettable tours.</p>
                </div>

                {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

                <form className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 mt-2 border bg-gray-100 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-300"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-[#007a55] text-white py-3 rounded-lg">Sent OTP
                    </button>
                </form>

                <div className="mt-4">
                    <p className="text-center text-gray-500 text-sm">Or <Link to="/" className="text-sm text-[#007a55] hover:underline">Login</Link></p>
                </div>

            </div>
        </div>
    );
};

export default PasswordReset;

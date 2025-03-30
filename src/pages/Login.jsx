import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LuUser } from 'react-icons/lu';
import { LuBriefcaseBusiness } from 'react-icons/lu';
import { GrLocation } from 'react-icons/gr';
import { useNavigate } from 'react-router-dom';

const Login = () => {

  const [userType, setUserType] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    document.querySelector('meta[name="theme-color"]').setAttribute("content", "#fffff");
  }, []);

  const handleUserTypeChange = (type) => {
    setUserType(type);
    const routes = {
      Tourist: '/register1',
      Guide: '/register2',
      Businessman: '/register3',
    };
    navigate(routes[type]);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post('http://localhost:3000/api/auth/login', { email, password });
      const { token } = response.data;

      // Save the token in localStorage
      localStorage.setItem('authToken', token);

      // Redirect user based on userType (optional)
      const userType = response.data.user.userType;
      if (userType === 'guide') {
        navigate('/');
      } else if (userType === 'tourist') {
        navigate('/user');
      } else {
        navigate('/');
      }
    } catch (err) {
      console.error('Login Failed:', err);
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center relative">
      <div className="bg-white bg-opacity-80 p-10 max-w-md w-full z-10 relative">
        <div className="text-left mb-6">
          <h2 className="text-3xl font-semibold text-gray-800">Login To GoCeylon</h2>
          <p className="text-sm mt-2 text-gray-500">Discover Sri Lanka’s stunning destinations, rich culture, and unforgettable tours.</p>
        </div>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <form className="space-y-6" onSubmit={handleLogin}>
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

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 mt-2 border bg-gray-100 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-300"
              required
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <input type="checkbox" id="remember" className="h-4 w-4 text-[#007a55]" />
              <label htmlFor="remember" className="text-sm text-gray-600">Remember me</label>
            </div>
            <a href="#" className="text-sm text-[#007a55] hover:underline">Forgot Password?</a>
          </div>

          <button
            type="submit"
            className="w-full bg-[#007a55] text-white py-3 rounded-lg hover:bg-green-700 transition duration-300"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="mt-8">
          <p className="text-center text-gray-500 text-sm">Or Sign Up with</p>
          <div className="grid grid-cols-3 gap-4 mt-4">
            <button onClick={() => handleUserTypeChange('Tourist')} className="p-3 flex flex-col items-center justify-center border border-gray-300 rounded-lg hover:border-emerald-500 transition-all">
              <LuUser className="text-[#007a55] text-2xl" />
              <span className="text-sm mt-1 text-gray-600">Tourist</span>
            </button>
            <button onClick={() => handleUserTypeChange('Guide')} className="p-3 flex flex-col items-center justify-center border border-gray-300 rounded-lg hover:border-emerald-500 transition-all">
              <GrLocation className="text-[#007a55] text-2xl" />
              <span className="text-sm mt-1 text-gray-600">Guide</span>
            </button>
            <button onClick={() => handleUserTypeChange('Businessman')} className="p-3 flex flex-col items-center justify-center border border-gray-300 rounded-lg hover:border-emerald-500 transition-all">
              <LuBriefcaseBusiness className="text-[#007a55] text-2xl" />
              <span className="text-sm mt-1 text-gray-600">Business</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Login;

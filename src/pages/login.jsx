import React from 'react';
import backgroundImage from '../assets/images/pexels-dreamypixel-547116.jpg'; // Adjust the path based on your folder structure

const Login = () => {
  return (
    <div className="h-screen flex items-center justify-center">
      {/* Background Image */}
      <img
        src={backgroundImage} // Use the imported image here
        alt="GoCeylon Background"
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
      />

      <div className="bg-white bg-opacity-80 p-10 rounded-3xl shadow-2xl max-w-md w-full z-10 relative">
        {/* Title */}
        <div className="text-center mb-6">
          <h2 className="text-3xl font-semibold text-gray-800">Welcome to GoCeylon</h2>
          <p className="text-sm text-gray-500">Discover Sri Lanka's best destinations and tours</p>
        </div>

        {/* Login Form */}
        <form className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              className="w-full px-4 py-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-300"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              className="w-full px-4 py-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-300"
              required
            />
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <input type="checkbox" id="remember" className="h-4 w-4 text-green-600" />
              <label htmlFor="remember" className="text-sm text-gray-600">Remember me</label>
            </div>
            <a href="#" className="text-sm text-green-600 hover:underline">Forgot Password?</a>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition duration-300"
          >
            Login
          </button>
        </form>

        {/* Sign-up Link */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            New to GoCeylon? <a href="#" className="text-green-600 hover:underline">Sign up</a>
          </p>
        </div>

        {/* Footer: Tourist-related icon */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">Explore Sri Lanka with ease</p>
          <div className="flex justify-center space-x-4 mt-2">
            <a href="#" className="text-gray-600 hover:text-green-600"><i className="fas fa-map-marker-alt"></i> Destinations</a>
            <a href="#" className="text-gray-600 hover:text-green-600"><i className="fas fa-hotel"></i> Hotels</a>
            <a href="#" className="text-gray-600 hover:text-green-600"><i className="fas fa-bus"></i> Tours</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

import React from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        // Clear the token from local storage or session storage
        localStorage.removeItem('authToken');  // Replace with your storage method (localStorage, sessionStorage)

        // Optionally, you can also reset any state that tracks user authentication here, like in a context provider

        // Redirect to the login page
        navigate('/login');
    };

    return (
        <button onClick={handleLogout}>
            Logout
        </button>
    );
};

export default Logout;

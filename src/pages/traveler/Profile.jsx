import { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

export default function Profile({ userId }) {
  const navigate = useNavigate();
  // State to store user data
  const [user, setUser] = useState(null);
  // State to manage edit mode
  const [editing, setEditing] = useState(false);
  // State to store form input data
  const [formData, setFormData] = useState({});

  // Fetch user details when component mounts or userId changes
  useEffect(() => {
    axios.get(`/api/tourist/${userId}`).then((response) => {
      setUser(response.data);
      setFormData(response.data);
    });
  }, [userId]);

  // Handle input field changes and update form data
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle save button click to update user details
  const handleSave = () => {
    axios.put(`/api/tourist/${userId}`, formData).then((response) => {
      setUser(response.data);
      setEditing(false);
    });
  };

  // Handle logout button click
  const handleLogout = () => {
    // Clear user authentication data (e.g., remove token from localStorage)
    localStorage.removeItem("authToken");
    navigate("/login"); // Redirect to login page
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md p-4 shadow-lg rounded-2xl bg-white">
        <CardContent>
          {user ? (
            <div className="flex flex-col items-center">
              {editing ? (
                <>
                  {/* Input fields for editing user details */}
                  <Input name="name" value={formData.name} onChange={handleChange} className="mb-2" />
                  <Input name="email" value={formData.email} onChange={handleChange} className="mb-2" />
                  
                  {/* Save button to update details */}
                  <Button onClick={handleSave} className="w-full mt-2">Save</Button>
                </>
              ) : (
                <>
                  {/* Display user details */}
                  <h2 className="text-xl font-semibold">{user.name}</h2>
                  <p className="text-gray-500">{user.email}</p>
                  
                  {/* Edit button to enable form fields */}
                  <Button onClick={() => setEditing(true)} className="w-full mt-4">Edit Profile</Button>
                </>
              )}
              {/* Logout button */}
              <Button onClick={handleLogout} className="w-full mt-4 bg-red-500 hover:bg-red-600">Logout</Button>
            </div>
          ) : (
            <p>Loading...</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

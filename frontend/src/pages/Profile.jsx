import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import axios from "axios";
// import profileImage from "../assets/profile.png";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const id = token ? JSON.parse(atob(token.split('.')[1])).userId : null;

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }
    axios.get(`http://localhost:5000/api/users/${id}`)
      .then((response) => {
        setUser(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching user:", error);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (!user) return <p>User not found</p>;

  return (
    <div className="bg-[#f8f1ea] min-h-screen flex flex-col">
      <Navbar />
      <div className="w-full max-w-[800px] mx-auto px-4 mt-4">
        <h2 className="text-2xl font-bold text-orange-500 pb-2 border-b-2 border-black mb-4">
          ACCOUNT
        </h2>
        <div className="mb-4 text-center">
          <img src={"/assets/profile.png"} alt="Profile" className="w-20 h-20 rounded-full mx-auto mb-2" />
          
          <h2 className="text-lg font-medium">{user.fullname}</h2>
        </div>
        <hr className="border-gray-300 mb-6" />
        <div className="mb-6">
          <h3 className="font-bold text-gray-700 mb-7">Contact Information</h3>
          <div className="grid grid-cols-2 ml-6 pr-80">
            <p className="text-gray-700">Email:</p>
            <p className="text-gray-700">{user.email}</p>
            <p className="text-gray-700">Phone:</p>
            <p className="text-gray-700">{user.phone_number}</p>
            <p className="text-gray-700">Address:</p>
            <p className="text-gray-700">{user.location}</p>
          </div>
        </div>
        <div className="mb-6">
          <h3 className="font-bold text-gray-700 mb-7">Basic Information</h3>
          <div className="grid grid-cols-2 ml-6 pr-110">
            <p className="text-gray-700">Gender:</p>
            <p className="text-gray-700 ml-16">{user.gender}</p>
            <p className="text-gray-700">Birth Date:</p>
            <p className="text-gray-700 ml-16">{user.birth_date}</p>
          </div>
        </div>
        <div>
          <h3 className="font-bold text-gray-700 mb-7">About Me</h3>
          <div className="ml-6">
            <p className="text-gray-700">{user.about}</p>
          </div>
        </div>
        {/* Edit Profile Button */}
        <div className="flex justify-center mt-6">
          <button
            className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition"
            onClick={() => navigate("/ProfileEdit")}
          >
            Edit Profile
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
}
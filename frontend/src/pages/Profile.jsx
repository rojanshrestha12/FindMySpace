import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { CalendarIcon, PencilIcon } from "lucide-react";
import { Navigate, useNavigate } from "react-router-dom";

export default function Profile() {
  const [user, setUser] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const userData = {
      name: "John Doe",
      email: "user@example.com",
      phone: "+977 9812345678",
      address: "Kathmandu, Nepal",
      gender: "Male",
      birthDate: "2000-01-01",
      about: "I'm Ram, a second-year bachelor student preparing for exams and learning various technical topics. I'm particularly interested in machine learning concepts, Java programming, and database management. I've been working on projects like developing a quiz system with a Java Swing GUI and database interaction through JDBC and MySQL.",
    };
    setUser(userData);
  }, []);

  return (
    <div className="bg-[#f8f1ea] min-h-screen flex flex-col">
      <Navbar />
      <div className="w-full max-w-[800px] mx-auto px-4 mt-4">
        <h2 className="text-2xl font-bold text-orange-500 pb-2 border-b-2 border-black mb-4">
          ACCOUNT
        </h2>
        <div className="mb-4 flex justify-between items-center">
          <h3 className="text-lg font-semibold">My Profile</h3>
          <button
            onClick={() => navigate("/ProfileEdit")}
            className="px-3 py-1 bg-orange-500 text-white rounded flex items-center gap-1 hover:bg-orange-600"
          >
            <PencilIcon className="w-4 h-4" /> Edit Profile
          </button>
        </div>
        <div className="mb-4 text-center">
          <div className="w-20 h-20 bg-gray-300 rounded-full mx-auto mb-2" />
          <h2 className="text-lg font-medium">{user.name}</h2>
        </div>
        <hr className="border-gray-300 mb-6" />
        <div className="mb-6">
          <h3 className="font-bold text-gray-700 mb-7">Contact Information</h3>
          <div className="grid grid-cols-2 ml-6 pr-80">
            <p className="text-gray-700">Email:</p>
            <p className="text-gray-700">{user.email}</p>
            <p className="text-gray-700">Phone:</p>
            <p className="text-gray-700">{user.phone}</p>
            <p className="text-gray-700">Address:</p>
            <p className="text-gray-700">{user.address}</p>
          </div>
        </div>
        <div className="mb-6">
          <h3 className="font-bold text-gray-700 mb-7">Basic Information</h3>
          <div className="grid grid-cols-2 ml-6 pr-110">
            <p className="text-gray-700">Gender:</p>
            <p className="text-gray-700 ml-16">{user.gender}</p>
            <p className="text-gray-700">Birth Date:</p>
            <p className="text-gray-700 ml-16">{user.birthDate}</p>
          </div>
        </div>
        <div>
          <h3 className="font-bold text-gray-700 mb-7">About Me</h3>
          <div className="ml-6">
            <p className="text-gray-700">{user.about}</p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

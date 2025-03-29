import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function Profile() {
  return (
    <div className="bg-[#f8f1ea] min-h-screen flex flex-col">
      <Navbar />

      {/* Compact Container */}
      <div className="w-full max-w-[800px] mx-auto px-4 mt-4">
        <h2 className="text-2xl font-bold text-orange-500 pb-2 border-b-2 border-black mb-4">
          ACCOUNT
        </h2>

        {/* Profile Card */}
        <div className="w-full bg-white rounded-lg shadow-md p-6 border border-gray-300">
          {/* Profile Header */}
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">My Profile</h3>
            <button className="bg-gray-200 px-3 py-1 rounded text-sm hover:bg-gray-300">
              Edit Profile
            </button>
          </div>

          {/* Profile Image and Basic Info */}
          <div className="flex flex-col mb-6">
            <img
              src="/assets/profile.png"
              alt="Profile"
              className="w-20 h-20 rounded-full object-cover mb-2"
            />
            <h2 className="text-lg font-medium">Name</h2>
          </div>

          {/* Separator Line */}
          <hr className="border-gray-300 mb-6" />

          {/* Contact Information */}
          <div className="space-y-4 mb-6">
            <h3 className="font-medium text-gray-700">Contact Information</h3>

            {/* Email */}
            <div className="flex items-center gap-2">
              <label className="w-24 text-sm text-gray-600">Email:</label>
              <input
                type="email"
                className="flex-1 p-2 border rounded bg-gray-50 text-sm"
                value="user@example.com"
                readOnly
              />
              <span className="text-green-600 text-xs">Verified</span>
            </div>

            {/* Phone */}
            <div className="flex items-center gap-2">
              <label className="w-24 text-sm text-gray-600">Phone:</label>
              <input
                type="tel"
                className="flex-1 p-2 border rounded bg-gray-50 text-sm"
                value="+977 9812345678"
                readOnly
              />
            </div>
          </div>

          {/* Address */}
          <div className="flex items-center gap-2 mt-2">
            <label className="w-24 text-sm text-gray-600">Address:</label>
            <input
              type="text"
              className="flex-1 p-2 border rounded bg-gray-50 text-sm"
              placeholder="Enter address"
            />
          </div>

          {/* Basic Information */}
          <div className="space-y-4 mb-6 mt-4">
            <h3 className="font-medium text-gray-700">Basic Information</h3>

            {/* Gender */}
            <div className="flex items-center gap-2">
              <label className="w-24 text-sm text-gray-600">Gender:</label>
              <select className="flex-1 p-2 border rounded bg-gray-50 text-sm">
                <option>Male</option>
                <option>Female</option>
              </select>
            </div>

            {/* Birth Date */}
            <div className="flex items-center gap-2">
              <label className="w-24 text-sm text-gray-600">Birth Date:</label>
              <input
                type="date"
                className="flex-1 p-2 border rounded bg-gray-50 text-sm"
              />
            </div>
          </div>

          {/* About Me */}
          <div className="mb-6">
            <h3 className="font-medium text-gray-700">About Me</h3>
            <textarea
              className="w-full p-2 border rounded bg-gray-50 text-sm h-16 mt-2"
              placeholder="Brief description"
            />
          </div>

          {/* Password Section */}
          <div>
            <h3 className="font-medium text-gray-700">Password Settings</h3>
            <div className="grid grid-cols-2 gap-4 mb-3 mt-2">
              <div>
                <input
                  type="password"
                  className="w-full p-2 border rounded bg-[#f0e6d6] text-sm"
                  placeholder="Current Password"
                />
              </div>
              <div>
                <input
                  type="password"
                  className="w-full p-2 border rounded bg-[#f0e6d6] text-sm"
                  placeholder="New Password"
                />
              </div>
            </div>
            <button className="w-full py-2 bg-[#e48f44] text-white rounded text-sm hover:bg-[#d87f34]">
              UPDATE PASSWORD
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Profile;

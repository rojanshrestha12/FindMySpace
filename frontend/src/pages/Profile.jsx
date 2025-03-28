import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";  // Adjusted import path
import Footer from "../components/Footer";  // Import Footer component

function Profile() {
  return (
    <div className="bg-[#f8f1ea] min-h-screen flex flex-col">
      {/* Navbar */}
      <Navbar />

      {/* Main Content Wrapper */}
      <div className="max-w-6xl mx-auto px-4 mt-6">
        {/* Account Heading */}
        <h2 className="text-2xl font-bold text-orange-500 pb-2 text-left border-b-2 border-black mb-4">ACCOUNT</h2>

        <div className="flex mt-6">
          {/* Sidebar */}
          <div className="w-1/3 bg-white rounded-lg shadow-md p-4 h-fit">
            <nav className="flex flex-col space-y-4">
              <Link to="#" className="flex items-center space-x-2 text-black font-semibold">
                <img src="/assets/profile-icon.png" alt="Profile" className="w-6" />
                <span>PROFILE</span>
              </Link>
              <Link to="#" className="flex items-center space-x-2 text-black font-semibold">
                <img src="/assets/document-icon.png" alt="Documents" className="w-6" />
                <span>DOCUMENTS</span>
              </Link>
              <Link to="#" className="flex items-center space-x-2 text-black font-semibold">
                <img src="/assets/contact-icon.png" alt="Contact Info" className="w-6" />
                <span>CONTACT INFO</span>
              </Link>
              <Link to="#" className="flex items-center space-x-2 text-black font-semibold">
                <img src="/assets/password-icon.png" alt="Change Password" className="w-6" />
                <span>CHANGE PASSWORD</span>
              </Link>
            </nav>
          </div>

          {/* Content Section */}
          <div className="w-2/3 space-y-6 pl-6">
            {/* Profile Section */}
            <div className="w-full bg-white rounded-lg shadow-md p-6 border border-gray-300">
              <div className="flex justify-between">
                <h3 className="text-lg font-semibold">My Profile</h3>
                <button className="bg-gray-200 px-4 py-1 rounded">Edit Profile</button>
              </div>
              <div className="text-center mt-4">
                <img src="/assets/avatar.png" alt="Profile" className="w-24 mx-auto" />
                <h2 className="text-xl font-semibold mt-2">Adam Warlock</h2>
                <p className="text-gray-600">From Kathmandu, Nepal</p>
              </div>
            </div>

            {/* About Me & Age Section */}
            <div className="w-full bg-white rounded-lg shadow-md p-6 border border-gray-300">
              <h3 className="text-lg font-semibold">About Me & Age</h3>
              <div className="grid grid-cols-3 gap-4">
                <div><strong>Age</strong><p>23 years old</p></div>
                <div><strong>Occupation</strong><p>Student</p></div>
                <div><strong>Verification</strong><p>Email address</p></div>
              </div>
              <textarea className="w-full p-2 border rounded h-24 mt-4"></textarea>
            </div>

            {/* Contact Information Section */}
            <div className="w-full bg-white rounded-lg shadow-md p-6 border border-gray-300">
              <h3 className="text-lg font-semibold">Contact Information</h3>
              <input type="text" className="w-full p-2 border rounded bg-[#d6b899]" />
              <button className="mt-2 px-4 py-2 bg-[#e48f44] text-white rounded">Save Changes</button>
            </div>

            {/* Password Settings Section */}
            <div className="w-full bg-white rounded-lg shadow-md p-6 border border-gray-300">
              <h3 className="text-lg font-semibold">Password Setting</h3>
              <div className="flex space-x-4">
                <input
                  type="password"
                  className="w-1/2 p-2 border rounded bg-[#d6b899] mb-2"
                  placeholder="Old Password"
                />
                <input
                  type="password"
                  className="w-1/2 p-2 border rounded bg-[#d6b899] mb-2"
                  placeholder="New Password"
                />
              </div>
              <button className="mt-2 px-4 py-2 bg-[#e48f44] text-white rounded">SET NEW PASSWORD</button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />  {/* Use Footer component */}
    </div>
  );
}

export default Profile;

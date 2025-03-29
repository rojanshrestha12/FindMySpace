// Navbar.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-[#d6b899] p-4 flex justify-between items-center">
      <div className="flex items-center space-x-3">
        <div className="ml-85">
          <img src="/assets/logo.png" alt="Logo" className="w-25" />
        </div>
      </div>
      <div className="hidden md:flex space-x-8 text-lg">
        <Link to="/dashboard" className="text-black">Home</Link>
        <Link to="/PropertyForm" className="text-black">Add Property</Link>
        <Link to="/about" className="text-black">About Us</Link>
      </div>
      <div className="relative">
        <button onClick={() => setMenuOpen(!menuOpen)} className="text-black">☰</button>
        {menuOpen && (
          <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-md">
            <Link to="/profile" className="block px-4 py-2 hover:bg-gray-200">Visit Profile</Link>
            <Link to="/support" className="block px-4 py-2 hover:bg-gray-200">Contact Support</Link>
            <Link to="/settings" className="block px-4 py-2 hover:bg-gray-200">Settings</Link>
            <Link to="/login" className="block px-4 py-2 hover:bg-gray-200">Log out</Link>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;

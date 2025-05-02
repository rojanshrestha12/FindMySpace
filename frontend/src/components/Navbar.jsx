import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import axios from "axios";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token && token.split(".").length === 3) {
      try {
        const base64 = token.split(".")[1];
        const base64Fixed = base64.replace(/-/g, "+").replace(/_/g, "/");
        const json = atob(base64Fixed);
        const userData = JSON.parse(json);
        const userId = userData.userId;

        axios.get(`http://localhost:5000/api/users/${userId}`)
          .then((res) => setUser(res.data))
          .catch((err) => {
            console.error("Error fetching user:", err);
            localStorage.removeItem("token");
            setUser(null);
          });
      } catch (err) {
        console.error("Invalid token:", err);
        localStorage.removeItem("token");
        setUser(null);
      }
    } else {
      localStorage.removeItem("token");
      setUser(null);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };

  return (
    <nav className="bg-[#d6b899] shadow-md w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/">
              <img src="/assets/logo.png" alt="Logo" className="h-12" />
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8 text-lg">
            <Link to="/" className="text-black hover:text-gray-700">Home</Link>
            <Link to="/PropertyForm" className="text-black hover:text-gray-700">Add Property</Link>
            <Link to="/about" className="text-black hover:text-gray-700">About Us</Link>
          </div>

          {/* User Auth Area */}
          <div className="hidden md:flex items-center space-x-4">
            {!user ? (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 border border-black rounded-md text-black hover:bg-[#cba67f] transition"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 border border-black rounded-md text-black hover:bg-[#cba67f] transition"
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="flex items-center gap-2 text-black hover:text-gray-700 focus:outline-none"
                >
                  {user?.fullname || "User"}
                  <img
                    src="/assets/account.png"
                    alt="User"
                    className="w-8 h-8 rounded-full"
                  />
                </button>

                {menuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md py-2 z-50">
                    <Link
                      to="/profile"
                      onClick={() => setMenuOpen(false)}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Account
                    </Link>
                    <Link
                      to="/my_properties"
                      onClick={() => setMenuOpen(false)}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      My Properties
                    </Link>
                    <Link
                      to="/notifications"
                      onClick={() => setMenuOpen(false)}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      My Notifications
                    </Link>
                    <Link
                      to="/saved"
                      onClick={() => setMenuOpen(false)}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Saved
                    </Link>
                    <Link
                      to="/payments"
                      onClick={() => setMenuOpen(false)}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Payments
                    </Link>
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        handleLogout();
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Log Out
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Hamburger for Mobile */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-black focus:outline-none"
            >
              {menuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div className="md:hidden bg-[#d6b899]">
          <div className="flex flex-col px-2 pt-2 pb-3 space-y-1">
            <Link to="/" onClick={() => setMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-black hover:bg-[#cba67f]">
              Home
            </Link>
            <Link to="/PropertyForm" onClick={() => setMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-black hover:bg-[#cba67f]">
              Add Property
            </Link>
            <Link to="/about" onClick={() => setMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-black hover:bg-[#cba67f]">
              About Us
            </Link>

            {!user ? (
              <>
                <Link to="/login" onClick={() => setMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-black hover:bg-[#cba67f]">
                  Log In
                </Link>
                <Link to="/register" onClick={() => setMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-black hover:bg-[#cba67f]">
                  Sign Up
                </Link>
              </>
            ) : (
              <>
                <Link to="/profile" onClick={() => setMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-black hover:bg-[#cba67f]">
                  Account
                </Link>
                <Link to="/my_properties" onClick={() => setMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-black hover:bg-[#cba67f]">
                  My Properties
                </Link>
                <Link to="/notifications" onClick={() => setMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-black hover:bg-[#cba67f]">
                  Notifications
                </Link>
                <Link to="/saved" onClick={() => setMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-black hover:bg-[#cba67f]">
                  Saved
                </Link>
                <Link to="/payments" onClick={() => setMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-black hover:bg-[#cba67f]">
                  Payments
                </Link>
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    handleLogout();
                  }}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-black hover:bg-[#cba67f]"
                >
                  Log Out
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;

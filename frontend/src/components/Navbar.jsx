<<<<<<< HEAD
import React, { useState, useEffect } from 'react';
import {Link, useNavigate} from 'react-router-dom';
// import { auth } from '../auth/firebase';

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const userData = JSON.parse(atob(token.split('.')[1]));
      setUser(userData);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };


=======
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../auth/firebase';

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

>>>>>>> 7575c6bbe24f0412b22554f19831faf7083e5d6c
  return (
    <nav className="bg-[#d6b899] p-4 flex justify-between items-center">
      {/* Logo Section */}
      <div className="flex items-center space-x-3">
        <Link to="/dashboard" className="ml-85">
          <img src="/assets/logo.png" alt="Logo" className="w-25" />
        </Link>
      </div>

      {/* Desktop Navigation Links */}
      <div className="hidden md:flex space-x-8 text-lg">
<<<<<<< HEAD
        <Link to="/" className="text-black hover:text-gray-700">Home</Link>
=======
        <Link to="/dashboard" className="text-black hover:text-gray-700">Home</Link>
>>>>>>> 7575c6bbe24f0412b22554f19831faf7083e5d6c
        <Link to="/PropertyForm" className="text-black hover:text-gray-700">Add Property</Link>
        <Link to="/about" className="text-black hover:text-gray-700">About Us</Link>
      </div>

      {/* Hamburger Menu */}
      <div className="relative">
        {/* Hamburger Button */}
        <button 
          onClick={() => setMenuOpen(!menuOpen)}
          className="p-2 focus:outline-none"
        >
          <div className="w-6 flex flex-col space-y-1.5">
            <div className="h-[2px] w-full bg-black"></div>
            <div className="h-[2px] w-full bg-black"></div>
            <div className="h-[2px] w-full bg-black"></div>
          </div>
        </button>

       {/* Dropdown Menu - Exact match to your image */}
{menuOpen && (
  <div className="absolute right-0 mt-2 w-56 bg-[#f8f1ea] rounded-none shadow-none py-0 z-50 border border-gray-300">
    {/* Header */}
    <div className="flex items-center px-4 py-3 font-semibold text-gray-800 border-b border-gray-300 bg-[#f8f1ea]">
      <img src="assets/profile.png" alt="Profile" className="w-5 h-5 me-2"/>
<<<<<<< HEAD
      <h2 className="text-lg font-medium">{user.fullname}</h2>
=======
      {auth.currentUser?.displayName || 'USER'}
>>>>>>> 7575c6bbe24f0412b22554f19831faf7083e5d6c
    </div>
    
    {/* Menu Items with Emojis */}
    <Link 
      to="/profile" 
      className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-200 bg-[#f8f1ea] border-b border-gray-300"
      onClick={() => setMenuOpen(false)}
    >
      <img src="assets/account.png" alt="Account" className="w-5 h-5 me-2"/>
      Account
    </Link>
    
    <Link 
<<<<<<< HEAD
      to="/dashboard" 
=======
<<<<<<< HEAD
      to="/propertyDetail" 
=======
      to="/dashboard" 
>>>>>>> frontend_d_D
>>>>>>> 7575c6bbe24f0412b22554f19831faf7083e5d6c
      className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-200 bg-[#f8f1ea] border-b border-gray-300"
      onClick={() => setMenuOpen(false)}
    >
      <img src="assets/home.png" alt="My Properties" className="w-5 h-5 me-2"/>
      My Properties
    </Link>
    
    <Link 
      to="/saved" 
      className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-200 bg-[#f8f1ea] border-b border-gray-300"
      onClick={() => setMenuOpen(false)}
    >
      <img src="assets/saved.png" alt="Saved" className="w-5 h-5 me-2"/>
<<<<<<< HEAD
      Sav ed
=======
      Saved
>>>>>>> 7575c6bbe24f0412b22554f19831faf7083e5d6c
    </Link>
    
    <Link 
      to="/payments" 
      className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-200 bg-[#f8f1ea] border-b border-gray-300"
      onClick={() => setMenuOpen(false)}
    >
      <img src="assets/pay.png" alt="Payment" className="w-5 h-5 me-2"/>
      Payments
    </Link>
    
    {/* Log Out - No top border, matches image exactly */}
    <button
      onClick={() => {
        setMenuOpen(false);
        handleLogout();
      }}
      className="flex items-center w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-200 bg-[#f8f1ea]"
    >
      <img src="assets/logout.png" alt="Log Out" className="w-5 h-5 me-2"/>
      Log Out
    </button>
  </div>
)}
      </div>
    </nav>
  );
}

export default Navbar;
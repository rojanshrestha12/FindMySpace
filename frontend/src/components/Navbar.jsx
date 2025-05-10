import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import { AnimatePresence } from "framer-motion";
import axios from "axios";

const navLinks = [
  { label: "Home", path: "/" },
  { label: "Add Property", path: "/PropertyForm" },
  { label: "About Us", path: "/about" },
];

const userLinks = [
  { label: "Account", path: "/profile" },
  { label: "My Properties", path: "/my_properties" },
  { label: "Notifications", path: "/notifications" },
  { label: "Saved", path: "/saved" },
  { label: "Payments", path: "/payments" },
];

const decodeToken = (token) => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")));
    return payload?.userId || null;
  } catch {
    return null;
  }
};

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
      const token = localStorage.getItem("token");
    const userId = decodeToken(token);

  useEffect(() => {


    if (userId) {
      axios.get(`http://localhost:5000/api/users/${userId}`)
        .then((res) => setUser(res.data))
        .catch(() => {
          localStorage.removeItem("token");
          setUser(null);
        });
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

  const renderLinks = (links, onClick) =>
    links.map(({ label, path }, i) => (
      <Link
        key={i}
        to={path}
        onClick={onClick}
        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
      >
        {label}
      </Link>
    ));

  return (
<nav
  className="sticky top-0 left-0 right-0 bg-[#cdb7a3] shadow-lg z-50"
> 
      <div className="max-w-7xl mx-auto px-4 flex justify-between items-center h-20">
        <Link to="/">
          <img src="/assets/logo.png" alt="Logo" className="h-14" />
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex space-x-10 text-lg font-semibold">
          {navLinks.map(({ label, path }, i) => (
            <Link key={i} to={path} className="text-black hover:text-gray-700">
              {label}
            </Link>
          ))}
        </div>

        {/* Desktop Auth Section */}
        <div className="hidden md:flex items-center space-x-4">
          {!user ? (
            <>
              <Link to="/login" className="px-4 py-2 border border-black rounded-md hover:bg-[#cba67f]">
                Log In
              </Link>
              <Link to="/register" className="px-4 py-2 border border-black rounded-md hover:bg-[#cba67f]">
                Sign Up
              </Link>
            </>
          ) : (
            <div className="relative">
              <button
                onClick={() => setMenuOpen((prev) => !prev)}
                className="flex items-center gap-2 text-black hover:text-gray-700"
              >
                {user.fullname}
                <img src="/assets/account.png" alt="User" className="w-8 h-8" />
              </button>
              <AnimatePresence>
                {menuOpen && (
                  <div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50"
                  >
                    {renderLinks(userLinks, () => setMenuOpen(false))}
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        handleLogout();
                      }}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                    >
                      Log Out
                    </button>
                  </div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Mobile Menu Icon */}
        <div className="md:hidden">
          <button onClick={() => setMenuOpen((prev) => !prev)} className="text-black">
            {menuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      <AnimatePresence>
        {menuOpen && (
          <div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden bg-[#d6b899] overflow-hidden"
          >
            <div className="flex flex-col px-4 pt-2 pb-4 space-y-1">
              {navLinks.map(({ label, path }, i) => (
                <Link
                  key={i}
                  to={path}
                  onClick={() => setMenuOpen(false)}
                  className="block px-3 py-2 text-lg text-black hover:bg-[#cba67f]"
                >
                  {label}
                </Link>
              ))}
              {!user ? (
                <>
                  <Link to="/login" onClick={() => setMenuOpen(false)} className="block px-3 py-2 hover:bg-[#cba67f]">Log In</Link>
                  <Link to="/register" onClick={() => setMenuOpen(false)} className="block px-3 py-2 hover:bg-[#cba67f]">Sign Up</Link>
                </>
              ) : (
                <>
                  {userLinks.map(({ label, path }, i) => (
                    <Link key={i} to={path} onClick={() => setMenuOpen(false)} className="block px-3 py-2 hover:bg-[#cba67f]">
                      {label}
                    </Link>
                  ))}
                  <button onClick={() => { setMenuOpen(false); handleLogout(); }} className="block w-full text-left px-3 py-2 hover:bg-[#cba67f]">
                    Log Out
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </AnimatePresence>
    </nav>
  );
}

export default Navbar;

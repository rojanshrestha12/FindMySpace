import React from "react";
import { Link } from "react-router-dom";
import { FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa";

function Footer() {
  return (
    <footer className="bg-[#f9f9f9] text-black font-body border-t border-gray-300 mt-6">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-10 grid md:grid-cols-4 sm:grid-cols-2 gap-8">
        {/* About */}
        <div>
          <h2 className="text-lg font-semibold mb-3">FindMyStay</h2>
          <p className="text-sm">
            Your trusted platform to find and rent rooms, connect with
            roommates, and manage your property needs.
          </p>
        </div>

        {/* Navigation */}
        <div>
          <h3 className="text-md font-semibold mb-3">Navigation</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/" className="hover:underline">Home</Link></li>
            <li><Link to="/services" className="hover:underline">Services</Link></li>
            <li><Link to="/contact" className="hover:underline">Contact</Link></li>
            <li><Link to="/login" className="hover:underline">Login</Link></li>
          </ul>
        </div>

        {/* Services */}
        <div>
          <h3 className="text-md font-semibold mb-3">Services</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="#" className="hover:underline">Room Listings</Link></li>
            <li><Link to="#" className="hover:underline">Roommate Matching</Link></li>
            <li><Link to="#" className="hover:underline">Chatbot Help</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-md font-semibold mb-3">Contact Us</h3>
          <p className="text-sm">Near Naxal, Herald College Kathmandu, Nepal</p>
          <p className="text-sm mt-1">Phone: <a href="tel:+9779858477538" className="hover:underline">(+977) 01-44456845, 9858477538</a></p>
          <p className="text-sm mt-1">Email: <a href="mailto:info@FindMySpace.com" className="hover:underline">info@FindMySpace.com</a></p>
        </div>
      </div>

      {/* Social Media */}
      <div className="max-w-7xl mx-auto px-6 pb-6 flex justify-center space-x-6">
        <a href="https://instagram.com" aria-label="Instagram" className="text-gray-600 hover:text-black">
          <FaInstagram size={24} />
        </a>
        <a href="https://facebook.com" aria-label="Facebook" className="text-gray-600 hover:text-black">
          <FaFacebook size={24} />
        </a>
        <a href="https://twitter.com" aria-label="Twitter" className="text-gray-600 hover:text-black">
          <FaTwitter size={24} />
        </a>
      </div>

      {/* Footer Bottom */}
      <div className="border-t border-gray-300 py-4 text-center text-sm text-gray-600">
        © {new Date().getFullYear()} FindMyStay. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;

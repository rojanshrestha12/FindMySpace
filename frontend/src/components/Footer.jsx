import React from "react";
import { Link } from "react-router-dom";
import { FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa";

function Footer() {
  return (
    <footer className="bg-[#f9f9f9] text-black font-body border-t border-gray-300 mt-10">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12 grid md:grid-cols-4 sm:grid-cols-2 gap-8">
        {/* Logo and About */}
        <div>
          {/* Logo or Title */}
                    <img src="/assets/logo.png" alt="Logo" className="h-14" />
        </div>

        {/* Navigation */}
        <div>
          <h3 className="text-md font-semibold mb-4">Navigation</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/" className="hover:underline">Home</Link></li>
            <li><Link to="/services" className="hover:underline">Services</Link></li>
            <li><Link to="/contact" className="hover:underline">Contact</Link></li>
            <li><Link to="/login" className="hover:underline">Login / Sign Up</Link></li>
          </ul>
        </div>

        {/* Services */}
        <div>
          <h3 className="text-md font-semibold mb-4">Services</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="#" className="hover:underline">Verified Lisitngs</Link></li>
            <li><Link to="#" className="hover:underline">Notification System</Link></li>
            <li><Link to="#" className="hover:underline">Payment Tracking</Link></li>
            <li><Link to="#" className="hover:underline">Chatbot Assistance</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-md font-semibold mb-4">Contact Us</h3>
          <p className="text-sm">Herald College, Kathmandu, Nepal</p>
          <p className="text-sm mt-2">Phone: <a href="tel:+9779858477538" className="hover:underline">(+977) 01-44456845, 9858477538</a></p>
          <p className="text-sm mt-2">Email: <a href="mailto:info@FindMySpace.com" className="hover:underline">info@FindMySpace.com</a></p>
        </div>
      </div>

      {/* Social Media */}
      <div className="max-w-7xl mx-auto px-6 pb-6 flex justify-center items-center gap-6">
        <a href="https://instagram.com" aria-label="Instagram" className="text-gray-600 hover:text-black transition">
          <FaInstagram size={24} />
        </a>
        <a href="https://facebook.com" aria-label="Facebook" className="text-gray-600 hover:text-black transition">
          <FaFacebook size={24} />
        </a>
        <a href="https://twitter.com" aria-label="Twitter" className="text-gray-600 hover:text-black transition">
          <FaTwitter size={24} />
        </a>
      </div>

      {/* Footer Bottom */}
      <div className="border-t border-gray-300 py-4 text-center text-sm text-gray-600">
        © {new Date().getFullYear()} <span className="font-semibold">FindMySpace</span>. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;

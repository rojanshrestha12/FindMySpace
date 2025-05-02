import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import axios from "axios";

export default function MyListings() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");
  const userId = token ? JSON.parse(atob(token.split('.')[1])).userId : null;

  useEffect(() => {
    if (!userId) {
      setError("User not authenticated.");
      setLoading(false);
      return;
    }

    axios.get(`http://localhost:5000/api/users/${userId}/saved-listings`)
      .then(res => {
        setListings(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError("Failed to fetch listings.");
        setLoading(false);
      });
  }, [userId]);

  return (
    <div className="bg-[#f8f1ea] min-h-screen flex flex-col">
      <Navbar />
      <div className="w-full max-w-[1000px] mx-auto px-4 mt-6 mb-10">
        <h2 className="text-2xl font-bold text-orange-500 pb-2 border-b-2 border-black mb-6">
          MY SAVED LISTINGS
        </h2>

        {loading && <p className="text-gray-600">Loading listings...</p>}
        {error && <p className="text-red-600">{error}</p>}
        {!loading && !error && listings.length === 0 && (
          <p className="text-gray-600">You have no saved listings.</p>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          {listings.map((listing) => (
            <div key={listing._id} className="bg-white p-4 rounded-lg shadow-md">
              <img
                src={listing.imageUrl || "/assets/placeholder.png"}
                alt={listing.title}
                className="w-full h-48 object-cover rounded mb-4"
              />
              <h3 className="text-xl font-semibold text-orange-500 mb-2">{listing.title}</h3>
              <p className="text-gray-700 mb-2">{listing.location}</p>
              <p className="text-gray-700 font-medium mb-4">₹ {listing.price}</p>
              <button className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition">
                View Details
              </button>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}

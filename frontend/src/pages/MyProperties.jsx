import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import axios from "axios";
import { Link } from "react-router-dom";

export default function MyListings() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");
  const userId = token ? JSON.parse(atob(token.split(".")[1])).userId : null;

  useEffect(() => {
    if (!userId) {
      setError("User not authenticated.");
      setLoading(false);
      return;
    }

    axios
      .get(`http://localhost:5000/api/booking/myproperties/${userId}`)
      .then((res) => {
        setListings(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to fetch listings.");
        setLoading(false);
      });
  }, [userId]);

  return (
    <div className="bg-[#f8f1ea] min-h-screen flex flex-col">
      <Navbar />

      <div className="w-full mx-auto px-4 flex-1 mt-10 mb-10 max-w-[1200px]"> 
        <h2 className="text-2xl font-bold text-[#e48f44] mb-6">My Listings</h2>

        {loading && <p className="text-gray-600">Loading listings...</p>}
        {error && <p className="text-red-600">{error}</p>}
        {!loading && !error && listings.length === 0 && (
          <p className="text-gray-600">You have no saved listings.</p>
        )}

        <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 ${listings.length < 4 ? "min-h-[400px]" : ""}`}>
          {listings.length > 0 ? (
            listings.map((property) => (
              <Link
                to={`/property/${property.property_id || property._id}`}
                key={property.property_id || property._id}
                className="bg-white rounded-lg shadow hover:shadow-lg transition transform hover:scale-105 p-4 flex flex-col"
              >
                <img
                  src={property.images ? `http://localhost:5000${JSON.parse(property.images)[0]}` : "/placeholder.jpg"}
                  alt="Property"
                  className="w-full h-48 object-cover rounded-md mb-4"
                />
                <h3 className="text-lg font-bold mb-1">{property.type || property.title}</h3>
                <p className="text-gray-600 mb-1">{property.location}</p>
                <p className="text-[#e48f44] font-bold text-lg mt-auto">Rs {property.price}</p>
              </Link>
            ))
          ) : (
            !loading && !error && (
              <p className="text-center text-gray-600 col-span-full">No properties found.</p>
            )
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}

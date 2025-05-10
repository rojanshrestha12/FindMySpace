import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const SavedProperties = () => {
  const [savedProperties, setSavedProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("token");
  const userId = token ? JSON.parse(atob(token.split(".")[1])).userId : null;

  useEffect(() => {
    if (!userId) return;

    axios
      .get(`http://localhost:5000/api/saved-properties/${userId}`)
      .then((res) => {
        setSavedProperties(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch saved properties", err);
        setError("Failed to load properties.");
        setLoading(false);
      });
  }, [userId]);

  const handleRemove = (propertyId) => {
    axios
    .delete("http://localhost:5000/api/save-property", {
      data: { userId, propertyId },
    })
      .then(() => {
        setSavedProperties((prev) =>
          prev.filter((prop) => prop.property_id !== propertyId && prop.id !== propertyId)
        );
      })
      .catch((err) => {
        console.error("Failed to remove property", err);
        alert("Failed to remove property from saved list.");
      });
  };

  return (
    <div className="bg-[#f8f1ea] min-h-screen flex flex-col">
      <Navbar />

      <div className="w-full mx-auto px-55 flex-1 mt-8 mb-70  ">
        <h2 className="text-2xl font-bold text-[#e48f44] mb-6">Saved Listings</h2>

        {loading && <p className="text-gray-600">Loading listings...</p>}
        {error && <p className="text-red-600">{error}</p>}
        {!loading && !error && savedProperties.length === 0 && (
          <p className="text-gray-600">You have no saved listings.</p>
        )}

        <div
          className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 ${
            savedProperties.length < 4 ? "min-h" : ""
          }`}
        >
          {savedProperties.map((property) => {
            const propertyId = property.property_id || property.id;

            return (
              <div
                key={propertyId}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-transform transform hover:scale-[1.02] p-4 flex flex-col overflow-hidden relative"
              >
                <Link to={`/property/${propertyId}`}>
                  <img
                    src={
                      property.images
                        ? `http://localhost:5000${JSON.parse(property.images)[0]}`
                        : "/placeholder.jpg"
                    }
                    alt="Property"
                    className="w-full h-48 object-cover rounded-xl mb-3"
                  />
                </Link>

                <div className="flex flex-col gap-1 flex-grow">
                  <h3 className="text-xl font-semibold text-gray-800 capitalize">
                    {property.type || property.title}
                  </h3>
                  <p className="text-sm text-gray-500 capitalize">{property.location}</p>
                  <p className="text-lg font-bold text-[#e48f44]">
                    Rs {property.price.toLocaleString()}
                  </p>
                </div>

                <button
                  onClick={() => handleRemove(propertyId)}
                  className="mt-3 px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition-all text-sm"
                >
                  Remove
                </button>
              </div>
            );
          })}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default SavedProperties;

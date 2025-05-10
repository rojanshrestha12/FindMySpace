import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function MyListings() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

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
      .catch(() => {
        setError("Failed to fetch listings.");
        setLoading(false);
      });
  }, [userId]);

  const handleEdit = (id) => {
    navigate(`/edit-property/${id}`);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this listing?")) {
      try {
        await axios.delete(`http://localhost:5000/api/propertyDelete/${id}`, {
          data: { property_id: id },
        });
        setListings((prev) => prev.filter((item) => (item.property_id || item._id) !== id));
      } catch (error) {
        console.error("Error deleting property:", error);
        alert("Failed to delete listing.");
      }
    }
  };

  return (
    <div className="bg-[#f8f1ea] min-h-screen flex flex-col">
      <Navbar />

      <main className="w-full max-w-[1250px] mx-auto flex-1 mt-10 mb-10">
        <h2 className="text-2xl font-bold text-[#e48f44] mb-6">My Listings</h2>

        {loading && <p className="text-gray-600">Loading listings...</p>}
        {error && <p className="text-red-600">{error}</p>}
        {!loading && !error && listings.length === 0 && (
          <p className="text-gray-600">You have no saved listings.</p>
        )}

        <div className={`grid gap-8 ${listings.length < 4 ? "min-h-[400px]" : ""} grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4`}>
          {listings.map((item) => {
            const id = item.property_id || item._id;
            let image = "/placeholder.jpg";
            try {
              const imgs = typeof item.images === "string" ? JSON.parse(item.images) : item.images;
              if (imgs?.length) {
                image = `http://localhost:5000${imgs[0]}`;
              }
            } catch {
              console.error("Error parsing images:", item.images);
            }

            return (
              <div key={id} className="bg-white rounded-lg shadow p-4 flex flex-col hover:shadow-lg transition transform hover:scale-105">
                <Link to={`/property/${id}`}>
                  <img src={image} alt="Property" className="w-full h-48 object-cover rounded-md mb-4" />
                </Link>

                <div className="flex justify-between items-center mb-1">
                  <h3 className="text-lg font-bold">{item.type || "Property"}</h3>
                  <button onClick={() => handleEdit(id)} title="Edit" className="text-blue-600 hover:text-blue-800 text-xl">
                    ✏️
                  </button>
                </div>

                <p className="text-gray-600">{item.location}</p>
                <p className="text-[#e48f44] font-bold text-lg mb-4">Rs {item.price}</p>

                <button
                  onClick={() => handleDelete(id)}
                  className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition"
                >
                  Delete
                </button>
              </div>
            );
          })}
        </div>
      </main>

      <Footer />
    </div>
  );
}

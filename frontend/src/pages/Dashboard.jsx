import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";  // Adjusted import path
import Footer from "../components/Footer";  // Import Footer component

function Dashboard() {
  const [properties, setProperties] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    axios.get(`http://localhost:3000/api/properties?page=${currentPage}`)
      .then(response => { console.log(response.data); setProperties(response.data); })
      .catch(error => console.error("Error fetching properties:", error));
  }, [currentPage]);

  return (
    <div className="bg-[#f8f1ea] min-h-screen flex flex-col justify-between">
      {/* Navbar */}
      <Navbar />

      {/* Filters */}
      <div className="max-w-6xl mx-auto mt-6 px-4 border-black pb-4 flex items-center space-x-4">
        <h2 className="text-lg font-semibold">Filter by:</h2>
        <div className="flex space-x-4 flex-1">
          <select className="p-2 border border-black rounded-md bg-[#e48f44] text-black flex-1">
            <option>Type of property</option>
          </select>
          <select className="p-2 border border-black rounded-md bg-[#e48f44] text-black flex-1">
            <option>Location</option>
          </select>
          <select className="p-2 border border-black rounded-md bg-[#e48f44] text-black flex-1">
            <option>Price Range</option>
          </select>
        </div>
      </div>

      {/* Properties */}
      <div className="max-w-6xl mx-auto px-4 mt-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {properties.map(property => (
            <div className="bg-white rounded-lg shadow-md p-4" key={property.id}>
              <img src={property.image_url} alt="Property" className="w-full h-48 object-cover rounded-md mb-4" />
              <h3 className="text-xl font-semibold">{property.title}</h3>
              <p>{property.address}</p>
              <p className="font-bold text-xl">{property.price}</p>
            </div>
          ))}
        </div>

        {/* Pagination */}
      <div className="flex justify-center space-x-2 my-6">
        <button 
          className="px-4 py-2 border border-black rounded"
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}>
          &lt;
        </button>
        {[...Array(3)].map((_, i) => (
          <button 
            key={i} 
            className={`px-4 py-2 border border-black rounded ${currentPage === i + 1 ? 'bg-[#e48f44] text-black' : ''}`}
            onClick={() => setCurrentPage(i + 1)}>
            {i + 1}
          </button>
        ))}
        <button 
          className="px-4 py-2 border border-black rounded"
          onClick={() => setCurrentPage(prev => prev + 1)}>
          &gt;
        </button>
      </div>
      </div>

      {/* Footer */}
      <Footer />  {/* Use Footer component */}
    </div>
  );
}

export default Dashboard;
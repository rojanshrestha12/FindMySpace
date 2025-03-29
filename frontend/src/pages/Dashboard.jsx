import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";  // Adjusted import path
import Footer from "../components/Footer";  // Import Footer component

function Dashboard() {
  const [properties, setProperties] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [propertyType, setPropertyType] = useState("");
  const [location, setLocation] = useState("");
  const [priceRange, setPriceRange] = useState("");

  // const propertiesPerPage = 12;

  useEffect(() => {
    axios.get(`http://localhost:3000/api/properties?page=${currentPage}`)
      .then(response => { console.log(response.data); setProperties(response.data); })
      .catch(error => console.error("Error fetching properties:", error));
  }, [currentPage]);

  const handleFilterChange = () => {
    const [minPrice, maxPrice] = priceRange.split("-").map(Number);
  
    axios.get("http://localhost:3000/api/filterProperties", {
      params: { propertyType, location, minPrice, maxPrice }
    })
    .then(response => setProperties(response.data))
    .catch(error => console.error("Error fetching filtered properties:", error));
  };
  
  return (
    <div className="bg-[#f8f1ea] min-h-screen flex flex-col justify-between">
      {/* Navbar */}
      <Navbar />

      {/* Filters & Property Grid Section */}
      <div className="max-w-6xl mx-auto mt-6 px-4 flex justify-between items-center">
        {/* Filters */}
        <div className="flex items-center space-x-4">
          <h2 className="text-lg font-semibold">Filter by:</h2>
          <select onChange={(e) => setPropertyType(e.target.value)}>
            <option value="">Type of Property</option>
            <option value="House">House</option>
            <option value="Apartment">Apartment</option>
          </select>

          <select onChange={(e) => setLocation(e.target.value)}>
            <option value="">Location</option>
            <option value="Kathmandu">Kathmandu</option>
            <option value="Pokhara">Pokhara</option>
          </select>

          <select onChange={(e) => setPriceRange(e.target.value)}>
            <option value="">Price Range</option>
            <option value="5000-10000">5,000 - 10,000</option>
            <option value="10000-25000">10,000 - 25,000</option>
          </select>

          <button onClick={handleFilterChange} className="bg-orange-500 text-white px-4 py-2 rounded">Apply Filters</button>
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
        <div className="flex justify-center mt-8">
          <button onClick={() => setCurrentPage(prev => prev > 1 ? prev - 1 : prev)} className="px-4 py-2 bg-[#e48f44] text-white rounded mr-4">
            Previous
          </button>
          <button onClick={() => setCurrentPage(prev => prev + 1)} className="px-4 py-2 bg-[#e48f44] text-white rounded">
            Next
          </button>
        </div>
      </div>

      {/* Footer */}
      <Footer />  {/* Use Footer component */}
    </div>
  );
}

export default Dashboard;

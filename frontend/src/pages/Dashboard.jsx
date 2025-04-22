import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";  
import Footer from "../components/Footer";  

axios.defaults.withCredentials = true;

function Dashboard() {
  const [allProperties, setAllProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [propertyType, setPropertyType] = useState("");
  const [location, setLocation] = useState("");
  const [priceRange, setPriceRange] = useState("");

  const itemsPerPage = 12;

  useEffect(() => {
    axios.get(`http://localhost:5000/api/properties`)
      .then(response => {
        setAllProperties(response.data);
        setFilteredProperties(response.data);
      })
      .catch(error => {
        console.error("Error fetching properties:", error);
        setAllProperties([]);
        setFilteredProperties([]);
      });
  }, []);

  const applyFilters = () => {
    let filtered = allProperties;

    if (propertyType) {
      filtered = filtered.filter(p => p.type.toLowerCase() === propertyType.toLowerCase());
    }

    if (location) {
      filtered = filtered.filter(p => p.location.toLowerCase() === location.toLowerCase());
    }

    if (priceRange && priceRange.includes("-")) {
      const [minPrice, maxPrice] = priceRange.split("-").map(Number);
      filtered = filtered.filter(p => p.price >= minPrice && p.price <= maxPrice);
    }

    setFilteredProperties(filtered);
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(filteredProperties.length / itemsPerPage);
  const paginatedData = filteredProperties.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="bg-[#f8f1ea] min-h-screen flex flex-col justify-between">
      <Navbar />

      <div className="max-w-8xl mx-auto mt-6 px-4 flex justify-between items-center">
        <div className="flex items-center space-x-5">
          <h2 className="text-lg font-semibold">Filter by:</h2>
          
          <select onChange={(e) => setPropertyType(e.target.value)}>
            <option value="">Type of Property</option>
            <option value="House">House</option>
            <option value="Apartment">Apartment</option>
            <option value="Room">Room</option>
            <option value="Flat">Flat</option>
            <option value="Shutter">Shutter</option>
          </select>

          <select onChange={(e) => setLocation(e.target.value)}>
            <option value="">Location</option>
            <option value="Kathmandu">Kathmandu</option>
            <option value="Pokhara">Pokhara</option>
            <option value="Bhaktapur">Bhaktapur</option>
            <option value="Lalitpur">Lalitpur</option>
            <option value="Biratnagar">Biratnagar</option>
            <option value="Nepalgunj">Nepalgunj</option>
            <option value="Butwal">Butwal</option>
            <option value="Dharan">Dharan</option>
          </select>

          <select onChange={(e) => setPriceRange(e.target.value)}>
            <option value="">Price Range</option>
            <option value="5000-10000">5,000 - 10,000</option>
            <option value="10000-25000">10,000 - 25,000</option>
            <option value="25000-50000">25,000 - 50,000</option>
            <option value="50000-100000">50,000 - 100,000</option>
            <option value="100000-200000">100,000 - 200,000</option>
            <option value="200000-500000">200,000 - 500,000</option>
          </select>

          <button 
            onClick={applyFilters} 
            className="px-4 py-2 bg-[#e48f44] text-white rounded"
          >
            Filter
          </button>
        </div>
      </div>

      <div className="max-w-8xl mx-auto px-4 mt-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {paginatedData.length > 0 ? (
            paginatedData.map(property => (
              <Link 
                to={`/property/${property.property_id}`} 
                key={property.property_id} 
                className="bg-white rounded-lg shadow-md p-4"
              >
                <img 
                  src={property.images ? `http://localhost:5000${JSON.parse(property.images)[0]}` : "/placeholder.jpg"} 
                  alt="Property" 
                  className="w-full h-48 object-cover rounded-md mb-4" 
                />
                <h3 className="text-xl font-semibold">{property.type}</h3>
                <p>{property.location}</p>
                <p className="font-bold text-xl">{property.price}</p>
              </Link>
            ))
          ) : (
            <p className="text-center text-gray-600">No properties found.</p>
          )}
        </div>

        <div className="flex justify-center mt-8">
          <button 
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} 
            className="px-4 py-2 bg-[#e48f44] text-white rounded mr-4"
          >
            Previous
          </button>
          <button 
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} 
            className="px-4 py-2 bg-[#e48f44] text-white rounded"
          >
            Next
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Dashboard;

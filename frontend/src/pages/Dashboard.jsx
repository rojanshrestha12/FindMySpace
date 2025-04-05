import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";  
import Footer from "../components/Footer";  

axios.defaults.withCredentials = true;

function Dashboard() {
  const [allProperties, setAllProperties] = useState([]); // Stores all properties initially
  const [filteredProperties, setFilteredProperties] = useState([]); // Stores filtered properties
  const [currentPage, setCurrentPage] = useState(1);
  const [propertyType, setPropertyType] = useState("");
  const [location, setLocation] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Fetch properties from backend (sorted by latest first)
  useEffect(() => {
    axios.get(`http://localhost:5000/api/properties?page=${currentPage}&sort=latest`)
      .then(response => { 
        console.log(response.data); 
        setAllProperties(response.data);  // Store the original properties
        setFilteredProperties(response.data); // Default: Show all properties first
      })
      .catch(error => {
        console.error("Error fetching properties:", error);
        setAllProperties([]);
        setFilteredProperties([]);
      });
  }, [currentPage]);

  // Function to apply filters when the button is clicked
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
    setIsFilterOpen(false);
  };

  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  return (
    <div className="bg-[#f8f1ea] min-h-screen flex flex-col justify-between">
      <Navbar />

      {/* Filters & Property Grid Section */}
      <div className="max-w-7xl mx-auto w-full mt-6 px-4 sm:px-6">
        {/* Mobile Filter Toggle */}
        <button 
          onClick={toggleFilter}
          className="md:hidden w-full mb-4 px-4 py-2 bg-[#e48f44] text-white rounded flex items-center justify-between"
        >
          <span>Filters</span>
          <span>{isFilterOpen ? '▲' : '▼'}</span>
        </button>
        
        {/* Filters */}
        <div className={`${isFilterOpen ? 'block' : 'hidden'} md:block md:mb-6`}>
          <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-3 md:space-y-0 bg-white p-4 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold">Filter by:</h2>
            
            {/* Property Type */}
            <select 
              onChange={(e) => setPropertyType(e.target.value)}
              className="w-full md:w-auto px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#e48f44]"
            >
              <option value="">Type of Property</option>
              <option value="House">House</option>
              <option value="Apartment">Apartment</option>
              <option value="Room">Room</option>
              <option value="Flat">Flat</option>
              <option value="Shutter">Shutter</option>
            </select>

            {/* Location */}
            <select 
              onChange={(e) => setLocation(e.target.value)}
              className="w-full md:w-auto px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#e48f44]"
            >
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

            {/* Price Range */}
            <select 
              onChange={(e) => setPriceRange(e.target.value)}
              className="w-full md:w-auto px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#e48f44]"
            >
              <option value="">Price Range</option>
              <option value="5000-10000">5,000 - 10,000</option>
              <option value="10000-25000">10,000 - 25,000</option>
              <option value="25000-50000">25,000 - 50,000</option>
              <option value="50000-100000">50,000 - 100,000</option>
              <option value="100000-200000">100,000 - 200,000</option>
              <option value="200000-500000">200,000 - 500,000</option>
            </select>

            {/* Filter Button */}
            <button 
              onClick={applyFilters} 
              className="w-full md:w-auto px-4 py-2 bg-[#e48f44] text-white rounded hover:bg-[#d17f34] transition-colors"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>

      {/* Properties */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 mt-4 md:mt-6 flex-grow">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {filteredProperties.length > 0 ? (
            filteredProperties.map(property => (
              <div className="bg-white rounded-lg shadow-md p-4 transition-transform hover:scale-[1.02]" key={property.property_id}>
                {/* Render the first image from the photos array */}
                <img 
                  src={property.images ? `http://localhost:5000${JSON.parse(property.images)[0]}` : "/placeholder.jpg"} 
                  alt="Property" 
                  className="w-full h-48 object-cover rounded-md mb-4" 
                />
                <h3 className="text-xl font-semibold">{property.type}</h3>
                <p className="text-gray-600">{property.location}</p>
                <p className="font-bold text-xl mt-2">₹{property.price}</p>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-600 col-span-1 sm:col-span-2 lg:col-span-3 py-10">No properties found.</p>
          )}
        </div>

        {/* Pagination */}
        <div className="flex justify-center mt-8 mb-6">
          <button 
            onClick={() => setCurrentPage(prev => prev > 1 ? prev - 1 : prev)} 
            className="px-4 py-2 bg-[#e48f44] text-white rounded mr-4 hover:bg-[#d17f34] transition-colors disabled:opacity-50"
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <button 
            onClick={() => setCurrentPage(prev => prev + 1)} 
            className="px-4 py-2 bg-[#e48f44] text-white rounded hover:bg-[#d17f34] transition-colors"
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
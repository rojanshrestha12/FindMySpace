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
  const [sortOption, setSortOption] = useState("");

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

    if (sortOption) {
      if (sortOption === "lowToHigh") {
        filtered = [...filtered].sort((a, b) => a.price - b.price);
      } else if (sortOption === "highToLow") {
        filtered = [...filtered].sort((a, b) => b.price - a.price);
      }
    }

    setFilteredProperties(filtered);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setPropertyType("");
    setLocation("");
    setPriceRange("");
    setSortOption("");
    setFilteredProperties(allProperties);
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(filteredProperties.length / itemsPerPage);
  const paginatedData = filteredProperties.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="bg-[#f8f1ea] min-h-screen flex flex-col">
      <Navbar />

      {/* Add space below Navbar */}
      <div className="pt-32 max-w-7xl mx-auto px-4 flex-1 -mt-20">
        
        {/* Filter Heading */}
        <h2 className="text-2xl font-bold text-[#e48f44] mb-6">Filter Properties</h2>

        {/* Filter Bar */}
        <div className="bg-white p-6 rounded-lg shadow-md flex flex-col md:flex-row md:justify-between md:items-center gap-6 mb-10">
          <div className="flex flex-wrap gap-4">
            <select
              value={propertyType}
              onChange={(e) => setPropertyType(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-[#e48f44]"
            >
              <option value="">Type of Property</option>
              <option value="House">House</option>
              <option value="Apartment">Apartment</option>
              <option value="Room">Room</option>
              <option value="Flat">Flat</option>
              <option value="Shutter">Shutter</option>
            </select>

            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-[#e48f44]"
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

            <select
              value={priceRange}
              onChange={(e) => setPriceRange(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-[#e48f44]"
            >
              <option value="">Price Range</option>
              <option value="5000-10000">5,000 - 10,000</option>
              <option value="10000-25000">10,000 - 25,000</option>
              <option value="25000-50000">25,000 - 50,000</option>
              <option value="50000-100000">50,000 - 100,000</option>
              <option value="100000-200000">100,000 - 200,000</option>
              <option value="200000-500000">200,000 - 500,000</option>
            </select>

            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-[#e48f44]"
            >
              <option value="">Sort By</option>
              <option value="lowToHigh">Price: Low to High</option>
              <option value="highToLow">Price: High to Low</option>
            </select>
          </div>

          <div className="flex gap-4">
            <button
              onClick={applyFilters}
              className="px-5 py-2 bg-[#e48f44] hover:bg-[#cc7733] text-white font-semibold rounded-lg"
            >
              Apply
            </button>
            <button
              onClick={clearFilters}
              className="px-5 py-2 bg-gray-300 hover:bg-gray-400 text-black font-semibold rounded-lg"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Properties Heading */}
        <h2 className="text-2xl font-bold text-[#e48f44] mb-6">List of Properties</h2>

        {/* Property Grid */}
        <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 ${paginatedData.length < 4 ? "min-h-[400px]" : ""}`}>
          {paginatedData.length > 0 ? (
            paginatedData.map((property) => (
              <Link
                to={`/property/${property.property_id}`}
                key={property.property_id}
                className="bg-white rounded-lg shadow hover:shadow-lg transition transform hover:scale-105 p-4 flex flex-col"
              >
                <img
                  src={property.images ? `http://localhost:5000${JSON.parse(property.images)[0]}` : "/placeholder.jpg"}
                  alt="Property"
                  className="w-full h-48 object-cover rounded-md mb-4"
                />
                <h3 className="text-lg font-bold mb-1">{property.type}</h3>
                <p className="text-gray-600 mb-1">{property.location}</p>
                <p className="text-[#e48f44] font-bold text-lg mt-auto">Rs {property.price}</p>
              </Link>
            ))
          ) : (
            <p className="text-center text-gray-600 col-span-full">No properties found.</p>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-10 gap-4">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-5 py-2 bg-[#e48f44] hover:bg-[#cc7733] text-white rounded disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-5 py-2 bg-[#e48f44] hover:bg-[#cc7733] text-white rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}

      </div>

      <Footer />
    </div>
  );
}

export default Dashboard;

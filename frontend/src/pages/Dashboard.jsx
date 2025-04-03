import { useState, useEffect } from "react";
<<<<<<< HEAD
import axios from "axios";
import Navbar from "../components/Navbar";  
import Footer from "../components/Footer";  

axios.defaults.withCredentials = true;

function Dashboard() {
  const [allProperties, setAllProperties] = useState([]); // Stores all properties initially
  const [filteredProperties, setFilteredProperties] = useState([]); // Stores filtered properties
=======
import { Link } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";  // Adjusted import path
import Footer from "../components/Footer";  // Import Footer component
import Navbar from "../components/Navbar";  // Adjusted import path
import Footer from "../components/Footer";  // Import Footer component

function Dashboard() {
  const [properties, setProperties] = useState([]);
>>>>>>> 7575c6bbe24f0412b22554f19831faf7083e5d6c
  const [currentPage, setCurrentPage] = useState(1);
  const [propertyType, setPropertyType] = useState("");
  const [location, setLocation] = useState("");
  const [priceRange, setPriceRange] = useState("");

<<<<<<< HEAD
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
=======
  // Fetching properties on page load or page change
  useEffect(() => {
    axios.get(`http://localhost:3000/api/properties?page=${currentPage}`)
      .then(response => { 
        console.log(response.data); 
        setProperties(response.data); // Set properties directly from response
      })
      .catch(error => {
        console.error("Error fetching properties:", error);
        setProperties([]);
      });
  }, [currentPage]);

  const handleFilterChange = () => {
    const [minPrice, maxPrice] = priceRange.split("-").map(Number);
  
    axios.get("http://localhost:3000/api/filterProperties", {
      params: { propertyType, location, minPrice, maxPrice }
    })
    .then(response => {
      console.log('Filter response:', response.data);
      setProperties(response.data); // Set filtered properties directly
    })
    .catch(error => {
      console.error("Error fetching filtered properties:", error);
      setProperties([]);
    });
>>>>>>> 7575c6bbe24f0412b22554f19831faf7083e5d6c
  };

  return (
    <div className="bg-[#f8f1ea] min-h-screen flex flex-col justify-between">
<<<<<<< HEAD
=======
      {/* Navbar */}
>>>>>>> 7575c6bbe24f0412b22554f19831faf7083e5d6c
      <Navbar />

      {/* Filters & Property Grid Section */}
      <div className="max-w-8xl mx-auto mt-6 px-4 flex justify-between items-center">
        {/* Filters */}
        <div className="flex items-center space-x-5">
          <h2 className="text-lg font-semibold">Filter by:</h2>
<<<<<<< HEAD
          
          {/* Property Type */}
=======
>>>>>>> 7575c6bbe24f0412b22554f19831faf7083e5d6c
          <select onChange={(e) => setPropertyType(e.target.value)}>
            <option value="">Type of Property</option>
            <option value="House">House</option>
            <option value="Apartment">Apartment</option>
<<<<<<< HEAD
=======
            <option value="House">House</option>
>>>>>>> 7575c6bbe24f0412b22554f19831faf7083e5d6c
            <option value="Room">Room</option>
            <option value="Flat">Flat</option>
            <option value="Shutter">Shutter</option>
          </select>

<<<<<<< HEAD
          {/* Location */}
=======
>>>>>>> 7575c6bbe24f0412b22554f19831faf7083e5d6c
          <select onChange={(e) => setLocation(e.target.value)}>
            <option value="">Location</option>
            <option value="Kathmandu">Kathmandu</option>
            <option value="Pokhara">Pokhara</option>
            <option value="Bhaktapur">Bhaktapur</option>
            <option value="Lalitpur">Lalitpur</option>
            <option value="Biratnagar">Biratnagar</option>
            <option value="Nepalgunj">Nepalgunj</option>
            <option value="Butwal">Butwal</option>
<<<<<<< HEAD
            <option value="Dharan">Dharan</option>
          </select>

          {/* Price Range */}
=======
            <option value="Chitwan">Dharan</option>
          </select>

>>>>>>> 7575c6bbe24f0412b22554f19831faf7083e5d6c
          <select onChange={(e) => setPriceRange(e.target.value)}>
            <option value="">Price Range</option>
            <option value="5000-10000">5,000 - 10,000</option>
            <option value="10000-25000">10,000 - 25,000</option>
            <option value="25000-50000">25,000 - 50,000</option>
            <option value="50000-100000">50,000 - 100,000</option>
            <option value="100000-200000">100,000 - 200,000</option>
            <option value="200000-500000">200,000 - 500,000</option>
          </select>

<<<<<<< HEAD
          {/* Filter Button */}
          <button 
            onClick={applyFilters} 
            className="px-4 py-2 bg-[#e48f44] text-white rounded"
          >
            Filter
          </button>
=======
          <button onClick={handleFilterChange} className="bg-orange-500 text-white px-4 py-2 rounded">Apply Filters</button>
>>>>>>> 7575c6bbe24f0412b22554f19831faf7083e5d6c
        </div>
      </div>

      {/* Properties */}
      <div className="max-w-8xl mx-auto px-4 mt-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
<<<<<<< HEAD
          {filteredProperties.length > 0 ? (
            filteredProperties.map(property => (
              <div className="bg-white rounded-lg shadow-md p-4" key={property.id}>
                {/* Render the first image from the photos array */}
                <img 
                  src={property.images ? `http://localhost:5000${JSON.parse(property.images)[0]}` : "/placeholder.jpg"} 
                  alt="Property" 
                  className="w-full h-48 object-cover rounded-md mb-4" 
                />
                <h3 className="text-xl font-semibold">{property.type}</h3>
                <p>{property.location}</p>
                <p className="font-bold text-xl">{property.price}</p>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-600">No properties found.</p>
          )}
=======
          {properties.map(property => (
            <div className="bg-white rounded-lg shadow-md p-4" key={property.id}>
              {/* Render the first image from the photos array */}
              <img 
                  src={`http://localhost:3000${JSON.parse(property.photos)[0]}`} 
                alt="Property" 
                className="w-full h-48 object-cover rounded-md mb-4" 
              />
              <h3 className="text-xl font-semibold">{property.property_type}</h3>
              <p>{property.address}</p>
              <p className="font-bold text-xl">{property.price}</p>
            </div>
          ))}
>>>>>>> 7575c6bbe24f0412b22554f19831faf7083e5d6c
        </div>

        {/* Pagination */}
        <div className="flex justify-center mt-8">
          <button 
            onClick={() => setCurrentPage(prev => prev > 1 ? prev - 1 : prev)} 
            className="px-4 py-2 bg-[#e48f44] text-white rounded mr-4"
          >
            Previous
          </button>
          <button 
            onClick={() => setCurrentPage(prev => prev + 1)} 
            className="px-4 py-2 bg-[#e48f44] text-white rounded"
          >
            Next
          </button>
        </div>
      </div>

<<<<<<< HEAD
      <Footer />
=======
      {/* Footer */}
      <Footer />  {/* Use Footer component */}
      <Footer />  {/* Use Footer component */}
>>>>>>> 7575c6bbe24f0412b22554f19831faf7083e5d6c
    </div>
  );
}

<<<<<<< HEAD
export default Dashboard;
=======
export default Dashboard;
>>>>>>> 7575c6bbe24f0412b22554f19831faf7083e5d6c

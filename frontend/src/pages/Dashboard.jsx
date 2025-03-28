import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function Dashboard() {
  const [properties, setProperties] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  // const propertiesPerPage = 12;

  useEffect(() => {
    axios.get(`http://localhost:3000/api/properties?page=${currentPage}`)
      .then(response => {console.log(response.data);setProperties(response.data)})
      .catch(error => console.error("Error fetching properties:", error));
  }, [currentPage]); 

  return (
    <div className="bg-[#f8f1ea] min-h-screen flex flex-col justify-between">
      {/* Navbar */}
      <nav className="bg-[#d6b899] p-4 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="ml-85">
            <img src="/assets/logo.png" alt="Logo" className="w-25" />
          </div>
        </div>
        <div className="hidden md:flex space-x-8 text-lg">
          <Link to="/dashboard" className="text-black">Home</Link>
          <Link to="/PropertyForm" className="text-black">Add Property</Link>
          <Link to="/about" className="text-black">About Us</Link>
        </div>
        <div className="relative">
          <button onClick={() => setMenuOpen(!menuOpen)} className="text-black">☰</button>
          {menuOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-md">
              <Link to="/login" className="block px-4 py-2 hover:bg-gray-200">Login</Link>
              <Link to="/register" className="block px-4 py-2 hover:bg-gray-200">Register</Link>
            </div>
          )}
        </div>
      </nav>

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

      {/* List of Properties */}
      <div className="max-w-6xl mx-auto mt-6 px-4">
        <h2 className="text-2xl font-bold">List of Properties</h2>
        <hr className="border-black mt-2" />
      </div>

     {/* Property Grid */}
<div className="max-w-6xl mx-auto py-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 px-4">
  {properties.length > 0 ? (
    properties.map((property, index) => {
      // Parse the photos string into an array
      const photos = JSON.parse(property.photos);
      // Get the first image path (or fallback to a default image if none)
      const imagePath = photos.length > 0 ? photos[0] : "/uploads/default.jpg";
      
      return (
        <div key={index} className="bg-white rounded-lg shadow-lg p-6 w-full">
          <div className="w-full h-56 bg-gray-300 rounded-md">
            <img
              key={index}
              src={`http://localhost:3000${imagePath}`}
              alt="Property"
              className="w-full h-48 object-cover"
            />
          </div>
          <h2 className="text-lg font-semibold mt-2">{property.address}</h2>
          <p className="text-sm text-gray-600">{property.property_type}</p>
          <p className="text-md font-bold text-[#e48f44]">{property.price}</p>
        </div>
      );
    })
  ) : (
    <p className="text-center text-gray-500 col-span-4">No properties found.</p>
  )}
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

      {/* Footer */}
      <footer className="text-center bg-white">

  <div className="relative">
    <img src="/assets/footer.png" alt="Footer Background" className="w-full object-cover" />

    
    <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4 mb-50">
      <p className="text-black  bg-opacity-40 px-3 py-1 rounded-lg">
        Near Naxal, Herald College Kathmandu, Nepal
      </p>
      <p className="text-black bg-opacity-40 px-3 py-1 rounded-lg">
        (+977) 01-44456845, 9858477538
      </p>
      <p className="text-black bg-opacity-40 px-3 py-1 rounded-lg">
        Contact Us: info@FindMySpace.com
      </p>

 
      <div className="flex justify-center space-x-4 mt-2">
        <Link to="#"><img src="/assets/instagram.png" alt="Instagram" className="w-6" /></Link>
        <Link to="#"><img src="/assets/facebook.png" alt="Facebook" className="w-6" /></Link>
        <Link to="#"><img src="/assets/twitter.png" alt="Twitter" className="w-6" /></Link>
      </div>
    </div>
  </div>

      </footer>
    </div>
  );
}

export default Dashboard;

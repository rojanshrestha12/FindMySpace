import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import axios from "axios";
axios.defaults.withCredentials = true;

function PropertyDetail() {
  const { id } = useParams(); // Get property ID from the URL
  
  const [property, setProperty] = useState(null);
  const [isVisitRequested, setIsVisitRequested] = useState(false);
  const [isRentRequested, setIsRentRequested] = useState(false);
  const [activeTab, setActiveTab] = useState("General");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch property details based on the id from URL
  useEffect(() => {
    const fetchPropertyDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/properties/${id}/details`);
        if (response.status === 200) {
          let data = response.data.property;
  
          // Parse stringified JSON fields
          const parsedImages = JSON.parse(data.images || "[]");
          const parsedAmenities = JSON.parse(data.amenities || "{}");
          console.log(parsedImages)
          setProperty({
            ...data,
            images: parsedImages,
            amenities: parsedAmenities,
            userDetails: response.data.userDetails,
          });
  
          setLoading(false);
        }
      } catch (error) {
        console.error(error);
        setError("Error fetching property details. Please try again later.");
        setLoading(false);
      }
    };
  
    fetchPropertyDetails();
  }, [id]);
  

  const handleRequestVisit = () => {
    setIsVisitRequested(true);
    alert("Visit requested successfully!");
  };

  const handleRequestRent = () => {
    setIsRentRequested(true);
    alert("Rental request submitted!");
  };

  if (loading) {
    return <div>Loading...</div>; // Consider adding a spinner or animation here
  }

  if (error) {
    return <div className="text-red-500">{error}</div>; // Display error message if any
  }

  if (!property) {
    return <div>No property data available.</div>; // Handle if no property data is found
  }

  return (
    <div className="bg-[#f8f1ea] min-h-screen flex flex-col">
      <Navbar />
      <div className="container mx-auto px-4 py-8 flex-grow flex flex-col lg:flex-row">
        {/* Left Section - Image & Buttons */}
        <div className="lg:w-2/4 w-full p-4">
          {/* Conditionally render image if available */}
          {property.images && property.images.length > 0 ? (
            <div className="bg-white border rounded-lg p-4 flex items-center justify-center h-64">
              <img
                src={`http://localhost:5000${property.images[0]}`}
                alt="Photo of Property"
                className="text-gray-500"
              />
            </div>
          ) : (
            <div className="bg-white border rounded-lg p-4 flex items-center justify-center h-64">
              <p>No image available</p> {/* Placeholder text if no image */}
            </div>
          )}
          
          <div className="mt-4 flex space-x-2">
            <button
              onClick={handleRequestVisit}
              disabled={isVisitRequested}
              className={`bg-[#e48f44] text-white py-2 px-4 rounded-md w-1/2 ${
                isVisitRequested ? "opacity-50 cursor-not-allowed" : "hover:bg-[#d87f34]"
              }`}
            >
              {isVisitRequested ? "Visit Requested" : "Book a Visit"}
            </button>
            <button
              onClick={handleRequestRent}
              disabled={isRentRequested}
              className={`bg-[#e48f44] text-white px-4 rounded-md w-1/2 ${
                isRentRequested ? "opacity-50 cursor-not-allowed" : "hover:bg-[#d87f34]"
              }`}
            >
              {isRentRequested ? "Rent Requested" : "Request to Rent"}
            </button>
          </div>
        </div>

        {/* Right Section - Property Details */}
        <div className="lg:w-2/3 w-full p-4">
          <h2 className="text-2xl font-bold text-[#e48f44]">{property.type}</h2>

          {/* Tabs */}
          <div className="flex space-x-4 mt-2 border-b">
            {['General', 'Amenities', 'Description'].map((tab) => (
              <button
                key={tab}
                className={`px-4 py-2 font-medium ${activeTab === tab ? 'border-b-2 border-[#e48f44]' : 'text-gray-500'}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {activeTab === "General" && (
            <div className="bg-gray-200 p-6 mt-4 rounded-lg">
              <p>Location: {property.location}</p>
              <p>Price: {property.price}</p>
              <p>Phone number: {property.userDetails.phone_number}</p> {/* Assuming the userDetails object includes phone_number */}
              <p>Landlord: {property.userDetails.fullname}</p> {/* Assuming the userDetails object includes fullname */}
            </div>
          )}

          {activeTab === "Amenities" && (
            <div className="bg-gray-200 p-4 mt-4 rounded-lg">
              {property.amenities && Object.entries(property.amenities).map(([key, value]) => (
                <p key={key}>{key}: {value}</p>
              ))}
            </div>
          )}

          {activeTab === "Description" && (
            <div className="bg-gray-200 p-4 mt-4 rounded-lg">
              <p>{property.description}</p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default PropertyDetail;

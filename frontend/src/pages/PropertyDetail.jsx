import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function PropertyDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isVisitRequested, setIsVisitRequested] = useState(false);
  const [isRentRequested, setIsRentRequested] = useState(false);
  const [activeTab, setActiveTab] = useState("General");

  // Mock property data
  const property = {
    id,
    name: "2-Bedroom Apartment",
    location: "Patan",
    price: "Rs. 5000/month",
    phone: "9874826345",
    landlord: "Name of landlord",
    description:
      "Cozy 2-bedroom apartment with modern amenities, ample natural light, and a prime location. Includes WiFi, parking, and a balcony. Perfect for comfortable living!",
    amenities: {
      Furnishing: "Yes",
      "Wi-Fi": "No",
      Pets: "No",
      "Storage Space": "Yes",
      Parking: "No",
      AC: "No",
      Balcony: "Yes",
    },
  };

  const handleRequestVisit = () => {
    setIsVisitRequested(true);
    alert("Visit requested successfully!");
  };

  const handleRequestRent = () => {
    setIsRentRequested(true);
    alert("Rental request submitted!");
  };

  return (
    <div className="bg-[#f8f1ea] min-h-screen flex flex-col">
      <Navbar />
      <div className="container mx-auto px-4 py-8 flex-grow flex">
        {/* Left Section - Image & Buttons */}
        <div className="w-1/3 p-4">
          <div className="bg-white border rounded-lg p-4 flex items-center justify-center h-64">
            <span className="text-gray-500">Photo of Property</span>
          </div>
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
              className={`bg-[#e48f44] text-white py-2 px-4 rounded-md w-1/2 ${
                isRentRequested ? "opacity-50 cursor-not-allowed" : "hover:bg-[#d87f34]"
              }`}
            >
              {isRentRequested ? "Rent Requested" : "Request to Rent"}
            </button>
          </div>
        </div>

        {/* Right Section - Property Details */}
        <div className="w-2/3 p-4">
          <h1 className="text-2xl font-bold text-[#e48f44]">Type of Property (name)</h1>
          
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
            <div className="bg-gray-200 p-4 mt-4 rounded-lg">
              <p><strong>Location:</strong> {property.location}</p>
              <p><strong>Price:</strong> {property.price}</p>
              <p><strong>Phone number:</strong> {property.phone}</p>
              <p><strong>Landlord:</strong> {property.landlord}</p>
            </div>
          )}

          {activeTab === "Amenities" && (
            <div className="bg-gray-200 p-4 mt-4 rounded-lg">
              {Object.entries(property.amenities).map(([key, value]) => (
                <p key={key}><strong>{key}:</strong> {value}</p>
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

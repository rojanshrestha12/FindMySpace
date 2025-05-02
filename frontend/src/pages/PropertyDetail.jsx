import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import axios from "axios";
axios.defaults.withCredentials = true;

function PropertyDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [isVisitRequested, setIsVisitRequested] = useState(false);
  const [isRentRequested, setIsRentRequested] = useState(false);
  const [activeTab, setActiveTab] = useState("General");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Extract tenant ID from token
  const token = localStorage.getItem("token");
  const tenantId = token ? JSON.parse(atob(token.split(".")[1])).userId : null;

  // Redirect if not logged in
  useEffect(() => {
    if (!tenantId) {
      navigate("/login");
    }
  }, [tenantId, navigate]);

  useEffect(() => {
    const fetchPropertyDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/properties/${id}/details`);
        if (response.status === 200) {
          const data = response.data.property;
          const parsedImages = JSON.parse(data.images || "[]");
          const parsedAmenities = JSON.parse(data.amenities || "{}");

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

  const handleBookingRequest = async (type) => {
    if (!tenantId || !property?.userDetails?.user_id) return;

    const bookingData = {
      tenant_id: tenantId,
      property_id: id,
      landlord_id: property.userDetails.user_id,
      type, // optional field if needed
    };

    try {
      await axios.post("http://localhost:5000/api/booking/request", bookingData);
      alert(`${type === "rent" ? "Rental" : "Visit"} request submitted!`);
      if (type === "visit") setIsVisitRequested(true);
      if (type === "rent") setIsRentRequested(true);
      navigate("/my_properties");
    } catch (err) {
      console.error(err);
      alert("Error submitting request.");
    }
  };

  const goToNextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % property.images.length);
  };

  const goToPreviousImage = () => {
    setCurrentImageIndex(
      (prevIndex) => (prevIndex - 1 + property.images.length) % property.images.length
    );
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!property) return <div>No property data available.</div>;

  return (
    <div className="bg-[#f8f1ea] min-h-screen flex flex-col">
      <Navbar />
      <div className="container mx-auto px-4 py-8 flex-grow flex flex-col lg:flex-row">
        <div className="lg:w-2/4 w-full p-4">
          {property.images?.length > 0 ? (
            <div className="bg-white border rounded-lg overflow-hidden relative flex items-center justify-center">
              <img
                src={`http://localhost:5000${property.images[currentImageIndex]}`}
                alt={property.type || "Property"}
                className="w-full h-100 object-cover rounded-lg"
              />
              <button
                onClick={goToPreviousImage}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black text-white p-2 rounded-full opacity-50 hover:opacity-100"
              >
                &#10094;
              </button>
              <button
                onClick={goToNextImage}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black text-white p-2 rounded-full opacity-50 hover:opacity-100"
              >
                &#10095;
              </button>
            </div>
          ) : (
            <div className="bg-white border rounded-lg p-4 flex items-center justify-center h-64">
              <p>No image available</p>
            </div>
          )}

          <div className="mt-4 flex space-x-2">
            <button
              onClick={() => handleBookingRequest("visit")}
              disabled={isVisitRequested}
              className={`bg-[#e48f44] text-white py-2 px-4 rounded-md w-1/2 ${
                isVisitRequested ? "opacity-50 cursor-not-allowed" : "hover:bg-[#d87f34]"
              }`}
            >
              {isVisitRequested ? "Visit Requested" : "Book a Visit"}
            </button>
            <button
              onClick={() => handleBookingRequest("rent")}
              disabled={isRentRequested}
              className={`bg-[#e48f44] text-white px-4 rounded-md w-1/2 ${
                isRentRequested ? "opacity-50 cursor-not-allowed" : "hover:bg-[#d87f34]"
              }`}
            >
              {isRentRequested ? "Rent Requested" : "Request to Rent"}
            </button>
          </div>
        </div>

        <div className="lg:w-2/4 w-full p-4">
          <h2 className="text-2xl font-bold text-[#e48f44]">{property.type}</h2>
          <h3 className="text-lg font-semibold mt-6 mb-2">Property Details:</h3>

          <div className="flex space-x-4 mt-2 border-b">
            {["General", "Amenities", "Description"].map((tab) => (
              <button
                key={tab}
                className={`px-4 py-2 font-medium ${
                  activeTab === tab
                    ? "text-[#e48f44] border-b-2 border-[#e48f44]"
                    : "text-gray-500"
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          {activeTab === "General" && (
            <div className="bg-gray-200 p-6 mt-4 rounded-lg space-y-2">
              <p><span className="font-semibold">Location:</span> {property.location}</p>
              <p><span className="font-semibold">Price:</span> Rs. {Number(property.price).toLocaleString()}</p>
              <p><span className="font-semibold">Phone Number:</span> {property.userDetails.phone_number}</p>
              <p><span className="font-semibold">Landlord:</span> {property.userDetails.fullname}</p>
            </div>
          )}

          {activeTab === "Amenities" && (
            <div className="bg-gray-200 p-6 mt-4 rounded-lg space-y-2">
              {property.amenities && Object.entries(property.amenities).length > 0 ? (
                Object.entries(property.amenities).map(([key, value]) => (
                  <p key={key}><span className="font-semibold">{key}:</span> {value ? "Yes" : "No"}</p>
                ))
              ) : (
                <p>No amenities listed.</p>
              )}
            </div>
          )}

          {activeTab === "Description" && (
            <div className="bg-gray-200 p-6 mt-4 rounded-lg">
              <p>{property.description || "No description provided."}</p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default PropertyDetail;

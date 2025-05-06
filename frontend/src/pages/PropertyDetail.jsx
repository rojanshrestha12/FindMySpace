import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import axios from "axios";
axios.defaults.withCredentials = true;

const convertTo12HourFormat = (time24) => {
  const [hours, minutes] = time24.split(":");
  let hours12 = parseInt(hours, 10);
  const ampm = hours12 >= 12 ? "PM" : "AM";
  hours12 = hours12 % 12;
  hours12 = hours12 ? hours12 : 12; // the hour '0' should be '12'
  return `${hours12}:${minutes} ${ampm}`;
};

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
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [rentFormVisible, setRentFormVisible] = useState(false); // Track visibility of rent form
  const [visitFormVisible, setVisitFormVisible] = useState(false); // Track visibility of visit form

  const token = localStorage.getItem("token");
  const tenantId = token ? JSON.parse(atob(token.split(".")[1])).userId : null;



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

    if (tenantId === property.userDetails.user_id) {
      alert("You cannot request your own property.");
      return;
    }

    if (!date || !time) {
      alert("Please select a date and time.");
      return;
    }

    const formattedTime = convertTo12HourFormat(time); // Convert time
    const dateTime = `${date} ${formattedTime}`; // Combine date and formatted time
    alert(dateTime); // For debugging
    const bookingData = {
      tenant_id: tenantId,
      property_id: id,
      request_type: type,
      date_time: dateTime, // Send the formatted date_time
    };

    try {
      await axios.post("http://localhost:5000/api/booking/request", bookingData);

      if (type === "rent") setIsRentRequested(true);
      if (type === "visit") setIsVisitRequested(true);

      alert(`${type === "rent" ? "Rental" : "Visit"} request submitted!`);
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

          <div className="mt-4 flex flex-col space-y-2">
            <div className="flex space-x-2">
              <button
                onClick={() => {
                  setVisitFormVisible(true); // Show the visit form
                  setRentFormVisible(false); // Hide the rent form
                }}
                disabled={isVisitRequested}
                className={`bg-[#e48f44] text-white py-2 px-4 rounded-md w-1/2 ${
                  isVisitRequested ? "opacity-50 cursor-not-allowed" : "hover:bg-[#d87f34]"
                }`}
              >
                {isVisitRequested ? "Visit Requested" : "Book a Visit"}
              </button>
              <button
                onClick={() => {
                  setRentFormVisible(true); // Show the rent form
                  setVisitFormVisible(false); // Hide the visit form
                }}
                disabled={isRentRequested}
                className={`bg-[#e48f44] text-white px-4 rounded-md w-1/2 ${
                  isRentRequested ? "opacity-50 cursor-not-allowed" : "hover:bg-[#d87f34]"
                }`}
              >
                {isRentRequested ? "Rent Requested" : "Request to Rent"}
              </button>
            </div>

            {/* Visit Request Form */}
            {visitFormVisible && !isVisitRequested && (
              <div className="mt-4 bg-white p-6 rounded-lg shadow-md">
                <h4 className="text-lg font-semibold mb-4">Select Date and Time</h4>
                <div className="flex space-x-4 mb-4">
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="border p-2 rounded-md w-1/2"
                  />
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="border p-2 rounded-md w-1/2"
                  />
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleBookingRequest("visit")}
                    className="bg-[#e48f44] text-white py-2 px-4 rounded-md w-1/2 hover:bg-[#d87f34]"
                  >
                    Book Visit
                  </button>
                </div>
              </div>
            )}

            {/* Rent Request Form */}
            {rentFormVisible && !isRentRequested && (
              <div className="mt-4 bg-white p-6 rounded-lg shadow-md">
                <h4 className="text-lg font-semibold mb-4">Fill Out Rent Request Form</h4>
                <p>Provide any necessary details about your request.</p>
                {/* You can add form fields here for rent requests */}
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleBookingRequest("rent")}
                    className="bg-[#e48f44] text-white py-2 px-4 rounded-md w-1/2 hover:bg-[#d87f34]"
                  >
                    Request Rent
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="lg:w-2/4 w-full p-4">
          <h3 className="text-3xl font-bold mb-1 text-[#e48f44]">
            {property.type.charAt(0).toUpperCase() + property.type.slice(1)}
          </h3>
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
            <div className="bg-white p-6 mt-4 rounded-lg">
              <div className="grid gap-y-2">
                <div className="grid grid-cols-3 gap-x-4 items-start">
                  <div className="font-semibold col-span-1">Location:</div>
                  <div className="col-span-2">{property.location}</div>
                </div>
                <div className="grid grid-cols-3 gap-x-4 items-start">
                  <div className="font-semibold col-span-1">Price:</div>
                  <div className="col-span-2">Rs. {Number(property.price).toLocaleString()}</div>
                </div>
                <div className="grid grid-cols-3 gap-x-4 items-start">
                  <div className="font-semibold col-span-1">Phone Number:</div>
                  <div className="col-span-2">{property.userDetails.phone_number}</div>
                </div>
                <div className="grid grid-cols-3 gap-x-4 items-start">
                  <div className="font-semibold col-span-1">Landlord:</div>
                  <div className="col-span-2">{property.userDetails.fullname}</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "Amenities" && (
            <div className="bg-white p-6 mt-4 rounded-lg">
              {property.amenities && Object.entries(property.amenities).length > 0 ? (
                <div className="grid gap-y-2">
                  {Object.entries(property.amenities).map(([key, value]) => (
                    <div key={key} className="grid grid-cols-3 gap-x-4 items-start">
                      <div className="font-semibold col-span-1">
                        {key.charAt(0).toUpperCase() + key.slice(1) + ":"}
                      </div>
                      <div className="col-span-2">
                        {value ? "Available" : "Not Available"}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p>No amenities listed.</p>
              )}
            </div>
          )}

          {activeTab === "Description" && (
            <div className="bg-white p-6 mt-4 rounded-lg">
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

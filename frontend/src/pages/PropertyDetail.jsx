import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import axios from "axios";
import RentRequestForm from "../components/RentRequestForm";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

axios.defaults.withCredentials = true;

const convertTo12HourFormat = (time24) => {
  const [hours, minutes] = time24.split(":");
  let hours12 = parseInt(hours, 10);
  const ampm = hours12 >= 12 ? "PM" : "AM";
  hours12 = hours12 % 12 || 12;
  return `${hours12}:${minutes} ${ampm}`;
};

function PropertyDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const requestId = location.state?.requestId;

  const [property, setProperty] = useState(null);
  const [isVisitRequested, setIsVisitRequested] = useState(false);
  const [isRentRequested, setIsRentRequested] = useState(false);
  const [activeTab, setActiveTab] = useState("General");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [rentFormVisible, setRentFormVisible] = useState(false);
  const [visitFormVisible, setVisitFormVisible] = useState(false);

  const token = localStorage.getItem("token");
  const tenantId = token ? JSON.parse(atob(token.split(".")[1])).userId : null;

  useEffect(() => {
    if (!tenantId) {
      navigate("/");
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
        }
      } catch (error) {
        console.error(error);
        setError("Error fetching property details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchPropertyDetails();
  }, [id]);

  const handleBookingRequest = async (type = {}, formData = {}) => {
    if (!tenantId || !property?.userDetails?.user_id) return;

    const formattedTime = time ? convertTo12HourFormat(time) : null;
    const dateTime = date && formattedTime ? `${date} ${formattedTime}` : new Date().toISOString();

    const bookingData = {
      tenant_id: tenantId,
      property_id: id,
      request_type: type,
      date_time: dateTime,
      ...(type === "rent" ? formData : {}),
    };

    try {
      const response = await axios.post("http://localhost:5000/api/booking/request", bookingData);
      const requestId = response.data.request.request_id;
      localStorage.setItem("requestId", requestId);

      toast.success(`${type === "rent" ? "Rental" : "Visit"} request submitted!`, {
        position: "top-right",
        autoClose: 3000,
      });

      if (type === "rent") {
        setIsRentRequested(true);
      } else if (type === "visit") {
        setIsVisitRequested(true);
     
      }
    } catch (err) {
      console.error(err);
      toast.error("Error submitting request. Please try again.", {
        position: "top-right",
        autoClose: 3000,
      });
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
      <ToastContainer />
      <div className="container mx-auto px-4 py-8 flex-grow flex flex-col lg:flex-row h-screen">
        <div className="lg:w-2/4 w-full p-4">
          {/* Property Image Section */}
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
                  if (tenantId === property.userDetails.user_id) {
                    toast.warning("You book your own property.");
                    return;
                  }
                  setVisitFormVisible(true);
                  setRentFormVisible(false);
                }}
                disabled={isVisitRequested}
                className={`bg-[#e48f44] text-white py-2 px-4 rounded-md w-1/2 ${
                  isVisitRequested ? "opacity-50 cursor-not-allowed" : "hover:bg-[#d87f34]"
                }`}
              >
                {isVisitRequested ? "Visit Requested" : "Book a Visit"}
              </button>

              <button
                onClick={async () => {
                  if (tenantId === property.userDetails.user_id) {
                    toast.warning("You cannot request your own property.");
                    return;
                  }

                  if (!isRentRequested) {
                    await handleBookingRequest("rent");
                    setRentFormVisible(true);
                    setVisitFormVisible(false);
                  }
                }}
                disabled={isRentRequested}
                className={`bg-[#e48f44] text-white px-4 rounded-md w-1/2 ${
                  isRentRequested ? "opacity-50 cursor-not-allowed" : "hover:bg-[#d87f34]"
                }`}
              >
                {isRentRequested ? "Rent Requested" : "Request to Rent"}
              </button>
            </div>

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

            {rentFormVisible && isRentRequested && (
              <RentRequestForm
                requestId={requestId}
                onSubmit={(formData) => handleBookingRequest("rent", formData)}
              />
            )}
          </div>
        </div>

        {/* Right Section */}
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
                  <div className="font-semibold">Location:</div>
                  <div className="col-span-2">{property.location}</div>
                </div>
                <div className="grid grid-cols-3 gap-x-4 items-start">
                  <div className="font-semibold">Price:</div>
                  <div className="col-span-2">Rs. {Number(property.price).toLocaleString()}</div>
                </div>
                <div className="grid grid-cols-3 gap-x-4 items-start">
                  <div className="font-semibold">Phone Number:</div>
                  <div className="col-span-2">{property.userDetails.phone_number}</div>
                </div>
                <div className="grid grid-cols-3 gap-x-4 items-start">
                  <div className="font-semibold">Owner Name:</div>
                  <div className="col-span-2">{property.userDetails.fullname}</div>
                </div>
                <div className="grid grid-cols-3 gap-x-4 items-start">
                  <div className="font-semibold">Owner Email:</div>
                  <div className="col-span-2">{property.userDetails.email}</div>
                </div>

              </div>
            </div>
          )}

          {activeTab === "Amenities" && (
            <div className="bg-white p-6 mt-4 rounded-lg">
              {Object.entries(property.amenities).map(([key, value]) => (
                <div key={key} className="flex justify-between py-1">
                  <span className="capitalize">{key.replace(/_/g, " ")}</span>
                  <span>{value ? "✔️" : "❌"}</span>
                </div>
              ))}
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

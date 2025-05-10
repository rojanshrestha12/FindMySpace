import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function PropertyForm() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    location: "",
    type: "",
    price: "",
    description: "",
    images: [],
    amenities: {
      petAllowed: false,
      garden: false,
      balcony: false,
      wifi: false,
      parking: false,
      waterFacility: false,
      ac: false,
      furnished: false,
      storageSpace: false,
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, images: Array.from(e.target.files) });
  };

  const handleAmenityChange = (e) => {
    const { name, checked } = e.target;
    setFormData({
      ...formData,
      amenities: { ...formData.amenities, [name]: checked },
    });
  };

const validateForm = () => {
  const newErrors = {};

  if (!formData.location.trim()) {
    newErrors.location = "Location is required";
    toast.error("Location is required");
  }

  if (!formData.type) {
    newErrors.type = "Select Property Type";
    toast.error("Property type is required");
  }

  if (!formData.price || isNaN(formData.price) || formData.price <= 0) {
    newErrors.price = "Price must be a positive number";
    toast.error("Price must be a positive number");
  }

  if (!formData.description.trim()) {
    newErrors.description = "Description is required";
    toast.error("Description is required");
  }

  if (formData.images.length === 0) {
    newErrors.images = "At least one image is required";
    toast.error("At least one image is required");
  }

  return Object.keys(newErrors).length === 0;
};


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {return; }

    setLoading(true);

    const formDataToSend = new FormData();
    formDataToSend.append("location", formData.location);
    formDataToSend.append("type", formData.type);
    formDataToSend.append("price", formData.price);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("amenities", JSON.stringify(formData.amenities));
    formData.images.forEach((file) => {
      formDataToSend.append("images", file);
    });

    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:5000/api/properties", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Property added successfully!");
      setTimeout(() => navigate("/"), 2000); // give time to show toast
    } catch (error) {
      toast.error("Failed to save property.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#f8f1ea] flex flex-col justify-between">
      <Navbar />
      <div className="flex justify-center items-center h-screen bg-[#f8f1ea]">
        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-3xl mx-4">
          <h2 className="text-center text-xl font-bold text-[#e48f44] mb-6">
            Add A New Property
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="location"
              placeholder="Enter Location"
              value={formData.location}
              onChange={handleChange}
              className="border p-2 rounded w-full col-span-2"
            />
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="border p-2 rounded w-full col-span-2"
            >
              <option value="">Select Property Type</option>
              <option value="House">House</option>
              <option value="Apartment">Apartment</option>
              <option value="Flat">Flat</option>
              <option value="Room">Room</option>
              <option value="Shutter">Shutter</option>
            </select>
            <input
              type="number"
              name="price"
              placeholder="Enter Price"
              value={formData.price}
              onChange={handleChange}
              className="border p-2 rounded w-full col-span-2 no-spinner"
            />
            <textarea
              name="description"
              placeholder="Enter Description"
              value={formData.description}
              onChange={handleChange}
              className="border p-2 rounded w-full h-24 col-span-2"
            ></textarea>

            {/* Upload Section */}
            <div className="col-span-2">
              <label className="block mb-4 font-bold">Upload Images</label>
              <label className="flex items-center justify-center border border-dashed border-gray-400 rounded-lg p-4 cursor-pointer bg-gray-50 hover:bg-gray-100">
                <span className="text-gray-500">Click or drag images here</span>
                <input
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />
              </label>
            </div>

            {/* Image Previews */}
            {formData.images.length > 0 && (
              <div className="col-span-2 grid grid-cols-6">
                {formData.images.map((file, index) => (
                  <img
                    key={index}
                    src={URL.createObjectURL(file)}
                    alt={`Preview ${index}`}
                    className="w-full h-30 object-contain rounded"
                  />
                ))}
              </div>
            )}

            {/* Amenities */}
            <div className="col-span-2">
              <label className="block mt-5 mb-3 font-bold">Amenities</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {Object.keys(formData.amenities).map((amenity) => (
                  <label key={amenity} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name={amenity}
                      checked={formData.amenities[amenity]}
                      onChange={handleAmenityChange}
                      className="form-checkbox"
                    />
                    <span>
                      {amenity
                        .replace(/([A-Z])/g, " $1")
                        .trim()
                        .replace(/^\w/, (c) => c.toUpperCase())}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div className="col-span-2">
              <button
                type="submit"
                className="w-full bg-[#e48f44] text-black p-2 rounded"
                disabled={loading}
              >
                {loading ? "Submitting..." : "Add New Property"}
              </button>
            </div>
          </form>
        </div>
      </div>
      <ToastContainer position="top-center" autoClose={3000} />
      <Footer />
    </div>
  );
}

export default PropertyForm;

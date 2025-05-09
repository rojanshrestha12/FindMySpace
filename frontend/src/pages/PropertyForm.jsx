import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";    
import Footer from "../components/Footer";

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

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Update form data
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Handle inline validation
    if (name === "price") {
      if (!value) {
        setErrors((prev) => ({ ...prev, price: "Price is required" }));
      } else if (isNaN(value) || parseFloat(value) <= 0) {
        setErrors((prev) => ({ ...prev, price: "Price must be a positive number" }));
      } else {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors.price;
          return newErrors;
        });
      }
    } else {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, images: Array.from(e.target.files) });
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors.images;
      return newErrors;
    });
  };

  const handleAmenityChange = (e) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      amenities: { ...prev.amenities, [name]: checked },
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.location.trim()) newErrors.location = "Location is required";
    if (!formData.type) newErrors.type = "Select Property Type";
    if (!formData.price) {
      newErrors.price = "Price is required";
    } else if (isNaN(formData.price) || parseFloat(formData.price) <= 0) {
      newErrors.price = "Price must be a positive number";
    }
    if (!formData.description.trim()) newErrors.description = "Description is required";
    if (formData.images.length === 0) newErrors.images = "At least one image is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
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
          "Authorization": `Bearer ${token}` 
        },      
      });
      navigate("/");
    } catch (error) {
      alert("Failed to save property.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#f8f1ea] min-h-screen flex flex-col justify-between">
      <Navbar />

      <div className="flex justify-center items-center min-h-screen bg-[#f8f1ea]">
        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl mx-4">
          <h2 className="text-center text-xl font-bold text-[#e48f44] mb-4">
            Add A New Property
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="location"
              placeholder="Enter Location"
              value={formData.location}
              onChange={handleChange}
              className="border p-2 rounded w-full"
            />
            {errors.location && <p className="text-red-500 text-sm">{errors.location}</p>}

            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="border p-2 rounded w-full"
            >
              <option value="">Select Property Type</option>
              <option value="House">House</option>
              <option value="Apartment">Apartment</option>
              <option value="Flat">Flat</option>
              <option value="Room">Room</option>
              <option value="Shutter">Shutter</option>
            </select>
            {errors.type && <p className="text-red-500 text-sm">{errors.type}</p>}

            <input
              type="number"
              name="price"
              placeholder="Enter Price"
              value={formData.price}
              onChange={handleChange}
              step="1000"
              className="border p-2 rounded w-full"
            />
            {errors.price && <p className="text-red-500 text-sm">{errors.price}</p>}

            <textarea
              name="description"
              placeholder="Enter Description"
              value={formData.description}
              onChange={handleChange}
              className="border p-2 rounded w-full h-24"
            />
            {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}

            <input
              type="file"
              multiple
              onChange={handleFileChange}
              className="border p-2 rounded w-full"
              accept="image/*"
            />
            {errors.images && <p className="text-red-500 text-sm">{errors.images}</p>}

            <div className="grid grid-cols-3 gap-2">
              {Object.keys(formData.amenities).map((amenity) => (
                <label key={amenity} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name={amenity}
                    checked={formData.amenities[amenity]}
                    onChange={handleAmenityChange}
                  />
                  <span>{amenity.replace(/([A-Z])/g, " $1").trim()}</span>
                </label>
              ))}
            </div>

            <button
              type="submit"
              className="w-full bg-[#e48f44] text-black p-2 rounded"
              disabled={loading}
            >
              {loading ? "Submitting..." : "Add New Property"}
            </button>
          </form>
        </div>
      </div>

      <Footer />
    </div>

  );
}

export default PropertyForm;

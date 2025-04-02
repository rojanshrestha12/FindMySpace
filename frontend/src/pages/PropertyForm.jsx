import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

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
    if (!formData.location.trim()) newErrors.location = "Location is required";
    if (!formData.type) newErrors.type = "Select Property Type";
    if (!formData.price || isNaN(formData.price) || formData.price <= 0)
      newErrors.price = "Price must be a positive number";
    if (!formData.description.trim())
      newErrors.description = "Description is required";
    if (formData.images.length === 0)
      newErrors.images = "At least one image is required";
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
      const token = localStorage.getItem("token"); // Retrieve token from storage
      await axios.post("http://localhost:5000/api/properties", formDataToSend, {
        headers: { 
          "Content-Type": "multipart/form-data",
          "Authorization": `Bearer ${token}` // Attach token
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
    <div className="flex justify-center items-center min-h-screen bg-[#f8f1ea]">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl mx-4">
        <h2 className="text-center text-xl font-bold text-[#e48f44] mb-4">
          Add A New Property
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" name="location" placeholder="Enter Location" value={formData.location} onChange={handleChange} className="border p-2 rounded w-full" />
          <select name="type" value={formData.type} onChange={handleChange} className="border p-2 rounded w-full">
            <option value="">Select Property Type</option>
            <option value="House">House</option>
            <option value="Apartment">Apartment</option>
            <option value="Flat">Flat</option>
            <option value="Room">Room</option>
            <option value="Shutter">Shutter</option>
          </select>
          <input type="number" name="price" placeholder="Enter Price" value={formData.price} onChange={handleChange} className="border p-2 rounded w-full" />
          <textarea name="description" placeholder="Enter Description" value={formData.description} onChange={handleChange} className="border p-2 rounded w-full h-24"></textarea>
          <input type="file" multiple onChange={handleFileChange} className="border p-2 rounded w-full" accept="image/*" />
          <div className="grid grid-cols-3 gap-2">
            {Object.keys(formData.amenities).map((amenity) => (
              <label key={amenity}>
                <input type="checkbox" name={amenity} checked={formData.amenities[amenity]} onChange={handleAmenityChange} />
                {amenity.replace(/([A-Z])/g, " $1").trim()}
              </label>
            ))}
          </div>
          <button type="submit" className="w-full bg-[#e48f44] text-black p-2 rounded" disabled={loading}>
            {loading ? "Submitting..." : "Add New Property"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default PropertyForm;

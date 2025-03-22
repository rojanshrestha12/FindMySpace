import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function PropertyForm() {
  const navigate = useNavigate();
  const [loading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    propertyType: "",
    price: "",
    description: "",
    photos: [],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData({ ...formData, photos: files });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    try {
      await axios.post("http://localhost:3000/api/addProperty", {
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        address: formData.address,
        propertyType: formData.propertyType,
        price: formData.price,
        description: formData.description,  
        photos: formData.photos
        // Add other user information as needed
      });
      navigate("/dashboard");
    } catch (error) {
      alert("Failed to save user information.");
      return(error.response?.data?.message || "Error adding new property");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl">
        <h2 className="text-center text-xl font-bold text-orange-600 mb-4">
          Add A New Property
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name, Phone, and Email */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              name="name"
              placeholder="Enter Name"
              value={formData.name}
              onChange={handleChange}
              required
              className="border p-2 rounded w-full"
            />
            <input
              type="text"
              name="phone"
              placeholder="Enter Phone Number"
              value={formData.phone}
              onChange={handleChange}
              required
              className="border p-2 rounded w-full"
            />
            <input
              type="email"
              name="email"
              placeholder="Enter Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="border p-2 rounded w-full"
            />
          </div>

          {/* Address and Property Type */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              name="address"
              placeholder="Enter Address"
              value={formData.address}
              onChange={handleChange}
              required
              className="border p-2 rounded w-full"
            />
            <select
              name="propertyType"
              value={formData.propertyType}
              onChange={handleChange}
              required
              className="border p-2 rounded w-full"
            >
              <option value="">Select Property Type</option>
              <option value="House">House</option>
              <option value="Apartment">Apartment</option>
              <option value="Flat">Flat</option>
              <option value="Room">Room</option>
            </select>
          </div>

          {/* Price and Description */}
          <input
            type="number"
            name="price"
            placeholder="Enter Price"
            value={formData.price}
            onChange={handleChange}
            required
            className="border p-2 rounded w-full"
          />
          <textarea
            name="description"
            placeholder="Enter Description"
            value={formData.description}
            onChange={handleChange}
            required
            className="border p-2 rounded w-full h-24"
          ></textarea>
          
          {/* File Upload Input */}
          <div className="border-2 border-dashed p-4 text-center">
            <input
              type="file"
              multiple
              onChange={handleFileChange}
              className="hidden"
              id="fileUpload"
              accept="image/*"
            />
            <label htmlFor="fileUpload" className="cursor-pointer text-orange-600">
              Drag your images here, or <span className="font-bold">browse</span>
            </label>
            <p className="text-sm text-gray-500">Supported: JPG, JPEG, PNG</p>
            
            {/* Show selected file names */}
            {formData.photos.length > 0 && (
              <div className="mt-2 text-sm text-gray-600">
                Selected: {formData.photos.map((file) => file.name).join(", ")}
              </div>
            )}
          </div>
          <button 
              type="submit" 
              className="w-full bg-orange-600 text-white p-2 rounded font-bold" 
              disabled={loading}
            >
              {loading ? "Adding new Property...." : "Add New Property"}
            </button>
        </form>
      </div>
    </div>
  );
}

export default PropertyForm;
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function PropertyForm() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    // email: "",
    address: "",
    propertyType: "",
    price: "",
    description: "",
    photos: [],
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
    
    // Clear any existing error
    const newErrors = { ...errors };
    delete newErrors[name];
    setErrors(newErrors);

    // Update form data
    setFormData({ ...formData, [name]: value });

    // Real-time validation for specific fields
    if (name === 'name' && /\d/.test(value)) {
      setErrors({...errors, name: "Name should not contain numbers"});
    }
    if (name === 'phone' && !/^\d*$/.test(value)) {
      setErrors({...errors, phone: "Phone number should contain only numbers"});
    }
    // if (name === 'email' && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    //   setErrors({...errors, email: "Email is invalid"});
    // }
    if (name === 'price' && value && (isNaN(value) || parseFloat(value) <= 0)) {
      setErrors({...errors, price: "Price must be a positive number"});
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData({ ...formData, photos: files });
    if (errors.photos) {
      setErrors({ ...errors, photos: "" });
    }
  };

  const handleAmenityChange = (e) => {
    const { name, checked } = e.target;
    setFormData({
      ...formData,
      amenities: {
        ...formData.amenities,
        [name]: checked,
      },
    });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (/\d/.test(formData.name)) {
      newErrors.name = "Name should not contain numbers";
    }

    if (!formData.phone) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\d+$/.test(formData.phone)) {
      newErrors.phone = "Phone number should contain only numbers";
    } else if (formData.phone.length !== 10) {
      newErrors.phone = "Phone number must be 10 digits";
    }

    // if (!formData.email.trim()) {
    //   newErrors.email = "Email is required";
    // } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    //   newErrors.email = "Email is invalid";
    // }

    if (!formData.propertyType) {
      newErrors.propertyType = "Select Property Type";
    }

    if (!formData.price) {
      newErrors.price = "Price is required";
    } else if (isNaN(formData.price) || parseFloat(formData.price) <= 0) {
      newErrors.price = "Price must be a positive number";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    if (formData.photos.length === 0) {
      newErrors.photos = "At least one photo is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    if (!validateForm()) {
      setLoading(false);
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name);
    formDataToSend.append("phone", formData.phone);
    // formDataToSend.append("email", formData.email);
    formDataToSend.append("address", formData.address);
    formDataToSend.append("propertyType", formData.propertyType);
    formDataToSend.append("price", formData.price);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("amenities", JSON.stringify(formData.amenities));

    formData.photos.forEach((file) => {
      formDataToSend.append("photos", file);
    });

    try {
      await axios.post("http://localhost:3000/api/addProperty", formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      navigate("/dashboard");
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
          
          {/* Name Field */}
          <div>
            <input 
              type="text" 
              name="name" 
              placeholder="Enter Name" 
              value={formData.name} 
              onChange={handleChange}
              className={`border p-2 rounded w-full ${errors.name ? 'border-red-500' : ''}`} 
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>

          {/* Phone Field */}
          <div>
            <input 
              type="text" 
              name="phone" 
              placeholder="Enter Phone Number" 
              value={formData.phone} 
              onChange={handleChange}
              className={`border p-2 rounded w-full ${errors.phone ? 'border-red-500' : ''}`} 
            />
            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
          </div>

          {/* Email Field */}
          {/* <div>
            <input 
              type="email" 
              name="email" 
              placeholder="Enter Email" 
              value={formData.email} 
              onChange={handleChange}
              className={`border p-2 rounded w-full ${errors.email ? 'border-red-500' : ''}`} 
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div> */}

          {/* Property Type Field */}
          <div>
            <select 
              name="propertyType" 
              value={formData.propertyType} 
              onChange={handleChange}
              className={`border p-2 rounded w-full ${errors.propertyType ? 'border-red-500' : ''}`}
            >
              <option value="">Select Property Type</option>
              <option value="House">House</option>
              <option value="Apartment">Apartment</option>
              <option value="Flat">Flat</option>
              <option value="Room">Room</option>
              <option value="Shutter">Shutter</option>
            </select>
            {errors.propertyType && <p className="text-red-500 text-xs mt-1">{errors.propertyType}</p>}
          </div>

          {/* Price Field */}
          <div>
            <input 
              type="number" 
              name="price" 
              placeholder="Enter Price" 
              value={formData.price} 
              onChange={handleChange}
              className={`border p-2 rounded w-full ${errors.price ? 'border-red-500' : ''}`} 
            />
            {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
          </div>

          {/* Description Field */}
          <div>
            <textarea 
              name="description" 
              placeholder="Enter Description (max 200 words)" 
              value={formData.description} 
              onChange={handleChange}
              className={`border p-2 rounded w-full h-24 ${errors.description ? 'border-red-500' : ''}`}
            ></textarea>
            {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
          </div>

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
            
            {formData.photos.length > 0 && (
              <div className="mt-2 text-sm text-gray-600">
                Selected: {formData.photos.map((file) => file.name).join(", ")}
              </div>
            )}
            {errors.photos && <p className="text-red-500 text-xs mt-1">{errors.photos}</p>}
          </div>

          {/* Amenities */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Amenities</h3>
            <div className="grid grid-cols-3 gap-2">
              <label><input type="checkbox" name="petAllowed" checked={formData.amenities.petAllowed} onChange={handleAmenityChange} /> Pets Allowed</label>
              <label><input type="checkbox" name="garden" checked={formData.amenities.garden} onChange={handleAmenityChange} /> Garden</label>
              <label><input type="checkbox" name="balcony" checked={formData.amenities.balcony} onChange={handleAmenityChange} /> Balcony</label>
              <label><input type="checkbox" name="wifi" checked={formData.amenities.wifi} onChange={handleAmenityChange} /> Wi-Fi</label>
              <label><input type="checkbox" name="parking" checked={formData.amenities.parking} onChange={handleAmenityChange} /> Parking</label>
              <label><input type="checkbox" name="waterFacility" checked={formData.amenities.waterFacility} onChange={handleAmenityChange} /> 24/7 Water Facility</label>
              <label><input type="checkbox" name="ac" checked={formData.amenities.ac} onChange={handleAmenityChange} /> AC</label>
              <label><input type="checkbox" name="furnished" checked={formData.amenities.furnished} onChange={handleAmenityChange} /> Furnished</label>
              <label><input type="checkbox" name="storageSpace" checked={formData.amenities.storageSpace} onChange={handleAmenityChange} /> Storage Space</label>
            </div>
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
  );
}

export default PropertyForm;
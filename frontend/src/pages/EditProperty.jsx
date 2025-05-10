import {  useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function EditProperty() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    location: "",
    type: "",
    price: "",
    description: "",
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

//   useEffect(() => {
//     const fetchData = async () => {
//       const res = await axios.get(`http://localhost:5000/api/property/${id}`);
//       const data = res.data;
//       setFormData({
//         location: data.location || "",
//         type: data.type || "",
//         price: data.price || "",
//         description: data.description || "",
//         amenities: data.amenities || {},
//       });
//     };
//     fetchData();
//   }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAmenityChange = (e) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      amenities: { ...prev.amenities, [name]: checked },
    }));
  };

  const validateForm = () => {
    if (!formData.location.trim()) return toast.error("Location is required");
    if (!formData.type) return toast.error("Property type is required");
    if (!formData.price || isNaN(formData.price) || formData.price <= 0)
      return toast.error("Price must be a positive number");
    if (!formData.description.trim()) return toast.error("Description is required");
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      await axios.put(`http://localhost:5000/api/propertyEdit/${id}`, {
        ...formData,
      });
      toast.success("Property updated!");
      setTimeout(() => navigate("/my-listings"), 2000);
    } catch (error) {
        console.error("Error updating property:", error);
      toast.error("Failed to update property.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#f8f1ea] flex flex-col justify-between min-h-screen">
      <Navbar />
      <div className="flex justify-center items-center py-10 bg-[#f8f1ea]">
        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-3xl mx-4">
          <h2 className="text-center text-xl font-bold text-[#e48f44] mb-6">
            Edit Property
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Enter Location"
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
              value={formData.price}
              onChange={handleChange}
              placeholder="Enter Price"
              className="border p-2 rounded w-full col-span-2 no-spinner"
            />
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter Description"
              className="border p-2 rounded w-full h-24 col-span-2"
            ></textarea>

            {/* Amenities Section */}
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
                {loading ? "Saving..." : "Update Property"}
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

export default EditProperty;

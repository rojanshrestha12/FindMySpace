import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";

const PropertyList = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [propertyDetails, setPropertyDetails] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [propRes, userRes] = await Promise.all([
        fetch("http://localhost:5000/api/admin/getAllProperties"),
        fetch("http://localhost:5000/api/admin/getAllUsers"),
      ]);

      const [properties, users] = await Promise.all([
        propRes.json(),
        userRes.json(),
      ]);

      const userMap = {};
      users.forEach((user) => {
        userMap[user.user_id] = user.fullname;
      });

      const parsed = properties.map((property) => ({
        id: property.property_id,
        user_id: property.user_id,
        landlord: userMap[property.user_id] || "Unknown",
        amenities: Object.entries(JSON.parse(property.amenities))
          .filter(([_, value]) => value)
          .map(([key]) => key)
          .join(", "),
        type: property.type || "N/A",
        price: property.price,
        location: property.location,
        description: property.description,
        image: JSON.parse(property.images)[0],
      }));

      setPropertyDetails(parsed);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this property?")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/admin/deleteProperty/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setPropertyDetails((prev) => prev.filter((p) => p.id !== id));
      } else {
        alert("Failed to delete property.");
      }
    } catch (err) {
      console.error("Error deleting property:", err);
    }
  };

  const handleEditClick = (property) => {
    setEditData(property);
    setShowEditModal(true);
  };

  const handleEditSubmit = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/admin/modifyProperty", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          property_id: editData.id,
          price: editData.price,
          type: editData.type,
          description: editData.description,
        }),
      });
      if (res.ok) {
        setShowEditModal(false);
        fetchData();
      } else {
        alert("Failed to update property");
      }
    } catch (err) {
      console.error("Error updating property:", err);
    }
  };

  const filteredProperties = propertyDetails.filter(
    (prop) =>
      prop.landlord.toLowerCase().includes(search.toLowerCase()) ||
      prop.location.toLowerCase().includes(search.toLowerCase()) ||
      prop.type.toLowerCase().includes(search.toLowerCase()) ||
      prop.amenities.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <nav className="bg-[#d6b899] py-2 flex justify-between items-center px-4">
        <div className="flex items-center px-42">
          <img src="/assets/logo.png" alt="Logo" className="h-8 sm:h-10 md:h-12 w-auto" />
        </div>
      </nav>

      <main className="flex-grow flex flex-col items-center justify-center">
        <div className="bg-white rounded-lg shadow-md p-8 w-full max-w-6xl mt-8">
          <div className="flex justify-between items-center mb-2">
            <h1 className="text-xl font-semibold">List of Properties</h1>
          </div>
          <hr className="border-gray-300 mb-4" />

          <div className="flex justify-end mb-2">
            <span className="mr-2">Search:</span>
            <input
              type="text"
              className="border border-gray-300 rounded px-2 py-1 w-48"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border border-gray-300 text-sm">
              <thead className="bg-[#f7f5ef]">
                <tr>
                  <th className="border px-3 py-2">Property_ID</th>
                  <th className="border px-3 py-2">Landlord</th>
                  <th className="border px-3 py-2">Amenities</th>
                  <th className="border px-3 py-2">Type</th>
                  <th className="border px-3 py-2">Price</th>
                  <th className="border px-3 py-2">Location</th>
                  <th className="border px-3 py-2">Description</th>
                  <th className="border px-3 py-2">Image</th>
                  <th className="border px-3 py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredProperties.map((property) => (
                  <tr key={property.id}>
                    <td className="border px-3 py-2">{property.id}</td>
                    <td className="border px-3 py-2">{property.landlord}</td>
                    <td className="border px-3 py-2">{property.amenities}</td>
                    <td className="border px-3 py-2">{property.type}</td>
                    <td className="border px-3 py-2">{property.price.toFixed(2)}</td>
                    <td className="border px-3 py-2">{property.location}</td>
                    <td className="border px-3 py-2">{property.description}</td>
                    <td className="border px-3 py-2 text-blue-600 underline cursor-pointer">
                      <a href={property.image} target="_blank" rel="noopener noreferrer">
                        View Image
                      </a>
                    </td>
                    <td className="border px-3 py-2">
                      <div className="flex flex-col">
                        <button className="text-blue-600 border px-2 py-0.5 mb-1 rounded text-xs" onClick={() => handleEditClick(property)}>
                          Edit
                        </button>
                        <button className="text-red-600 border px-2 py-0.5 rounded text-xs" onClick={() => handleDelete(property.id)}>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Back Button */}
      <div className="w-full flex justify-center mt-4">
        <div className="w-full max-w-6xl flex justify-end">
          <button className="bg-[#e48f44] px-6 py-2 rounded font-medium" onClick={() => navigate(-1)}>
            Back
          </button>
        </div>
      </div>

      <Footer />

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-md">
            <h2 className="text-lg font-semibold mb-4">Edit Property</h2>

            <div className="space-y-3">
              <div>
                <label className="block text-sm">Type</label>
                <input
                  type="text"
                  className="w-full border rounded px-3 py-1"
                  value={editData.type}
                  onChange={(e) => setEditData({ ...editData, type: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm">Price</label>
                <input
                  type="number"
                  className="w-full border rounded px-3 py-1"
                  value={editData.price}
                  onChange={(e) => setEditData({ ...editData, price: parseFloat(e.target.value) })}
                />
              </div>
              <div>
                <label className="block text-sm">Description</label>
                <textarea
                  className="w-full border rounded px-3 py-1"
                  rows={3}
                  value={editData.description}
                  onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                />
              </div>
            </div>

            <div className="flex justify-end mt-4 space-x-2">
              <button className="px-4 py-1 bg-gray-300 rounded" onClick={() => setShowEditModal(false)}>
                Cancel
              </button>
              <button className="px-4 py-1 bg-blue-500 text-white rounded" onClick={handleEditSubmit}>
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyList;

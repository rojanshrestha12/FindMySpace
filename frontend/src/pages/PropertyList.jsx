import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";

const PropertyList = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [propertyDetails, setPropertyDetails] = useState([
    {
      id: 2,
      landlord: "Smith, john",
      amenities: "Flat",
      type: "Flat",
      price: 2500.0,
      location: "Naxal",
      description: "This is apartment with 2BHK",
      image: "Image Link",
    },
    {
      id: 1,
      landlord: "Hari",
      amenities: "Apartment",
      type: "Apartment",
      price: 2100.0,
      location: "Patan",
      description: "This is apartment with 2BHK",
      image: "Image Link",
    },
  ]);

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
      <nav className="bg-[#d6b899] py-2 flex justify-between items-center px-4 ">
        <div className="flex items-center px-42">
          <img
            src="/assets/logo.png"
            alt="Logo"
            className="h-8 sm:h-10 md:h-12 w-auto"
          />
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center justify-center">
        <div className="bg-white rounded-lg shadow-md p-8 w-full max-w-6xl mt-8">
          <div className="flex justify-between items-center mb-2">
            <h1 className="text-xl font-semibold">List of Properties</h1>
            <button
              className="bg-[#e48f44] text-black px-4 py-2 rounded font-medium shadow"
              onClick={() => navigate("/add-property")}
            >
              + New Property
            </button>
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
              <thead>
                <tr className="bg-[#f7f5ef]">
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
                      {property.image}
                    </td>
                    <td className="border px-3 py-2">
                      <div className="flex flex-col">
                        {/* <button className="text-blue-600 border px-2 py-0.5 mb-1 rounded text-xs">View</button> */}
                        <button className="text-blue-600 border px-2 py-0.5 mb-1 rounded text-xs">Edit</button>
                        <button className="text-red-600 border px-2 py-0.5 rounded text-xs">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Back Button aligned to container but outside */}
      <div className="w-full flex justify-center mt-4">
        <div className="w-full max-w-6xl flex justify-end">
          <button
            className="bg-[#e48f44] px-6 py-2 rounded font-medium"
            onClick={() => navigate(-1)}
          >
            Back
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PropertyList;

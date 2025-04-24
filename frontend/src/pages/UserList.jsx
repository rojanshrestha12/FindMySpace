import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";

const UserList = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [userDetails, setUserDetails] = useState([
    {
      user_id: 1,
      fullName: "Rojan stha",
      phone_no: "98........",
      email: "Rojan@gmail.com",
      password: "stone",
      location: "Bhaktapur",
      gender: "Male",
      birth_date: "Jan21.....",
      aboutMe: "Teacher",
    },
    {
      user_id: 3,
      fullName: "Disan",
      phone_no: "98........",
      email: "disan@gmail.com",
      password: "stone",
      location: "Patan",
      gender: "Female",
      birth_date: "Jan21.....",
      aboutMe: "Student",
    },
  ]);

  const filteredUsers = userDetails.filter(
    (user) =>
      user.fullName.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase()) ||
      user.location.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <nav className="bg-[#d6b899] py-2 flex justify-between items-center px-4">
        <div className="flex items-center px-42">
          <img
            src="/assets/logo.png"
            alt="Logo"
            className="h-8 sm:h-10 md:h-12 w-auto"
          />
        </div>
      </nav>

      {/* Main Content Wrapper */}
      <main className="flex-grow flex flex-col items-center justify-center">
        <div className="w-full max-w-6xl flex flex-col items-center">
          {/* Container */}
          <div className="bg-white rounded-lg shadow-md p-8 w-full mt-8">
            {/* Header Row */}
            <div className="flex justify-between items-center mb-2">
              <h1 className="text-xl font-semibold">List of Users</h1>
              <button
                className="bg-[#e48f44] text-black px-4 py-2 rounded font-medium shadow"
                onClick={() => navigate("/add-user")}
              >
                + New Users
              </button>
            </div>
            <hr className="border-gray-300 mb-4" />

            {/* Search Row */}
            <div className="flex justify-end mb-2 items-center">
              <span className="mr-2">Search:</span>
              <input
                type="text"
                className="border border-gray-300 rounded px-2 py-1 w-48"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full border border-gray-300 text-sm">
                <thead>
                  <tr className="bg-[#f7f5ef]">
                    <th className="border px-3 py-2">User_ID</th>
                    <th className="border px-3 py-2">Full Name</th>
                    <th className="border px-3 py-2">Phone_no</th>
                    <th className="border px-3 py-2">Email</th>
                    <th className="border px-3 py-2">Password</th>
                    <th className="border px-3 py-2">Location</th>
                    <th className="border px-3 py-2">Gender</th>
                    <th className="border px-3 py-2">Birth_date</th>
                    <th className="border px-3 py-2">About me</th>
                    <th className="border px-3 py-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.user_id}>
                      <td className="border px-3 py-2">{user.user_id}</td>
                      <td className="border px-3 py-2">{user.fullName}</td>
                      <td className="border px-3 py-2">{user.phone_no}</td>
                      <td className="border px-3 py-2">{user.email}</td>
                      <td className="border px-3 py-2">{user.password}</td>
                      <td className="border px-3 py-2">{user.location}</td>
                      <td className="border px-3 py-2">{user.gender}</td>
                      <td className="border px-3 py-2">{user.birth_date}</td>
                      <td className="border px-3 py-2">{user.aboutMe}</td>
                      <td className="border px-3 py-2">
                        <div className="flex flex-col items-center">
                          {/* <button className="text-blue-600 border border-blue-600 px-2 py-0.5 mb-1 rounded text-xs">View</button> */}
                          <button className="text-blue-600 border border-blue-600 px-2 py-0.5 mb-1 rounded text-xs">Edit</button>
                          <button className="text-red-600 border border-red-600 px-2 py-0.5 rounded text-xs">Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Back Button aligned to bottom-right */}
          <div className="w-full flex justify-end mt-4">
            <button
              className="bg-[#e48f44] px-6 py-2 rounded font-medium"
              onClick={() => navigate(-1)}
            >
              Back
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default UserList;

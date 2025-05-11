import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import Sidebar from "../components/Siderbar";

const UserList = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [userDetails, setUserDetails] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:5000/api/admin/users", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        console.log("Fetched users:", data);
        setUserDetails(data);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    };

    fetchUsers();
  }, []);

  const handleDelete = async (user_id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:5000/api/admin/user/${user_id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        setUserDetails((prev) => prev.filter((u) => u.user_id !== user_id));
      } else {
        console.error("Failed to delete user");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleCreateUser = async () => {
    const fullname = prompt("Enter full name:");
    const email = prompt("Enter email:");
    const phone_number = prompt("Enter phone number:");
    const role = prompt("Enter role (admin/user):");
    const location = prompt("Enter location:");
    const password = prompt("Enter password:");

    if (!fullname || !email || !role || !password) {
      alert("Full name, email, role, and password are required.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          fullname,
          email,
          phone_number,
          role,
          location,
          password,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setUserDetails((prev) => [...prev, result.user]);
        alert("User created successfully.");
        window.location.reload();
      } else {
        alert(result.error || "Failed to create user.");
      }
    } catch (error) {
      console.log("Error creating user:", error);
      window.location.reload();
    }
  };

  const handleEditUser = async (user_id) => {
    const user = userDetails.find((user) => user.user_id === user_id);
    if (!user) return;

    const fullname = prompt("Enter full name:", user.fullname);
    const email = prompt("Enter email:", user.email);
    const phone_number = prompt("Enter phone number:", user.phone_number);
    const role = prompt("Enter role (admin/user):", user.role);
    const location = prompt("Enter location:", user.location);
    const gender = prompt("Enter gender:", user.gender);
    const birth_date = prompt("Enter birth date:", user.birth_date);
    const about_me = prompt("Enter about me:", user.about_me);

    if (!fullname || !email || !role) {
      alert("Full name, email, and role are required.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/admin/user/", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          user_id,
          fullname,
          email,
          phone_number,
          role,
          location,
          gender,
          birth_date,
          about_me,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setUserDetails((prev) =>
          prev.map((u) => (u.user_id === user_id ? { ...u, ...result.user } : u))
        );
        alert("User updated successfully.");
        window.location.reload();
      } else {
        alert(result.error || "Failed to update user.");
      }
    } catch (error) {
      console.log("There is no error javascript tripping", error);
      window.location.reload();
    }
  };

  const filteredUsers = userDetails.filter(
    (user) =>
      user.fullname?.toLowerCase().includes(search.toLowerCase()) ||
      user.email?.toLowerCase().includes(search.toLowerCase()) ||
      user.location?.toLowerCase().includes(search.toLowerCase())
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

      {/* Sidebar + Main Content */}
      <div className="flex flex-grow">
        <Sidebar />

        <main className="flex-grow flex flex-col items-center justify-center bg-gray-50">
          <div className="w-full max-w-6xl flex flex-col items-center">
            <div className="bg-white rounded-lg shadow-md p-8 w-full mt-8">
              <div className="flex justify-between items-center mb-2">
                <h1 className="text-xl font-semibold">List of Users</h1>
                <button
                  className="bg-[#e48f44] text-black px-4 py-2 rounded font-medium shadow"
                  onClick={handleCreateUser}
                >
                  + New User
                </button>
              </div>
              <hr className="border-gray-300 mb-4" />

              <div className="flex justify-end mb-2 items-center">
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
                      <th className="border px-3 py-2">User ID</th>
                      <th className="border px-3 py-2">Full Name</th>
                      <th className="border px-3 py-2">Phone No</th>
                      <th className="border px-3 py-2">Email</th>
                      <th className="border px-3 py-2">Role</th>
                      <th className="border px-3 py-2">Location</th>
                      <th className="border px-3 py-2">Gender</th>
                      <th className="border px-3 py-2">Birth Date</th>
                      <th className="border px-3 py-2">About Me</th>
                      <th className="border px-3 py-2">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => (
                      <tr key={user.user_id}>
                        <td className="border px-3 py-2">{user.user_id}</td>
                        <td className="border px-3 py-2">
                          {user.fullname || "-"}
                        </td>
                        <td className="border px-3 py-2">
                          {user.phone_number || "-"}
                        </td>
                        <td className="border px-3 py-2">{user.email || "-"}</td>
                        <td className="border px-3 py-2">{user.role || "-"}</td>
                        <td className="border px-3 py-2">
                          {user.location || "-"}
                        </td>
                        <td className="border px-3 py-2">{user.gender || "-"}</td>
                        <td className="border px-3 py-2">
                          {user.birth_date || "-"}
                        </td>
                        <td className="border px-3 py-2">
                          {user.about_me || "-"}
                        </td>
                        <td className="border px-3 py-2">
                          <div className="flex flex-col items-center">
                            <button
                              className="text-blue-600 border border-blue-600 px-2 py-0.5 mb-1 rounded text-xs"
                              onClick={() => handleEditUser(user.user_id)}
                            >
                              Edit
                            </button>
                            <button
                              className="text-red-600 border border-red-600 px-2 py-0.5 rounded text-xs"
                              onClick={() => handleDelete(user.user_id)}
                            >
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
      </div>

      <Footer />
    </div>
  );
};

export default UserList;

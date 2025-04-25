import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalProperties, setTotalProperties] = useState(0);

  useEffect(() => {
    fetch("http://localhost:5000/api/admin/users")
      .then((res) => res.json())
      .then((data) =>setTotalUsers(data.length))
      .catch((err) => console.error("Error fetching users count:", err));

    fetch("http://localhost:5000/api/admin/properties")
      .then((res) => res.json())
      .then((data) => setTotalProperties(data.length))
      .catch((err) => console.error("Error fetching properties count:", err));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <nav className="bg-[#d6b899] py-2 flex justify-between items-center px-4">
        {/* Logo section */}
        <div className="flex items-center px-95">
          <img
            src="/assets/logo.png"
            alt="Logo"
            className="h-8 sm:h-10 md:h-12 w-auto"
          />
        </div>
        {/* Logout button */}
        <button
          onClick={handleLogout}
          className="bg-[#e48f44] text-white px-3 py-1 rounded text-sm mr-98 "
        >
          Logout
        </button>
      </nav>

      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center justify-center bg-[#ede9df]">
        <div
          className="bg-[#f6f8f3] border border-[#e3e3db] rounded-lg shadow-sm w-[700px] max-w-full min-h-[500px] flex flex-col justify-start mt-8 mb-8"
        >
          {/* Heading with thin line */}
          <div className="border-b border-[#bdbdbd] px-8 py-4">
            <h1 className="text-center text-lg font-medium">
              Welcome to Admin Dashboard!
            </h1>
          </div>

          {/* Cards */}
          <div className="flex flex-col gap-4 px-8 py-8">
            {/* Users Card */}
            <div className="bg-white rounded-md shadow-sm border border-[#e3e3db]">
              <div
                className="bg-[#d6b899] rounded-t-md flex items-center justify-between px-4 py-2"
              >
                <div>
                  <div className="text-base font-semibold">{totalUsers}</div>
                  <div className="text-sm">Total Users</div>
                </div>
                <svg
                  className="w-5 h-5 text-black/70"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5C15 14.17 10.33 13 8 13zm8 0c-.29 0-.62.02-.97.05C17.16 13.66 20 14.84 20 16.5V19h4v-2.5c0-2.33-4.67-3.5-8-3.5z"
                  />
                </svg>
              </div>
              <div className="flex justify-end p-2">
                <button
                  className="bg-white border border-[#d6b899] rounded px-4 py-1 text-sm font-medium hover:bg-gray-100 transition flex items-center"
                  onClick={() => navigate("/UserList")}
                >
                  View list{" "}
                  <span className="ml-1">
                    {">"}
                  </span>
                </button>
              </div>
            </div>

            {/* Properties Card */}
            <div className="bg-white rounded-md shadow-sm border border-[#e3e3db]">
              <div
                className="bg-[#d6b899] rounded-t-md flex items-center justify-between px-4 py-2"
              >
                <div>
                  <div className="text-base font-semibold">{totalProperties}</div>
                  <div className="text-sm">Total Properties</div>
                </div>
                <svg
                  className="w-5 h-5 text-black/70"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 18H5V8h14v13zm0-15H5V5h14v1z"
                  />
                </svg>
              </div>
              <div className="flex justify-end p-2">
                <button
                  className="bg-white border border-[#d6b899] rounded px-4 py-1 text-sm font-medium hover:bg-gray-100 transition flex items-center"
                  onClick={() => navigate("/PropertyList")}
                >
                  View list{" "}
                  <span className="ml-1">
                    {">"}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default AdminDashboard;

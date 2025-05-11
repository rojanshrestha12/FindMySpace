/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Siderbar";
import Footer from "../components/Footer";

const AdminDashboard = () => {
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalProperties, setTotalProperties] = useState(0);
  const [totalLandlords, setTotalLandlords] = useState(0);
  const [totalTenants, setTotalTenants] = useState(0);
  // const [pendingRequests, setPendingRequests] = useState(0);
  // const [activeAgreements, setActiveAgreements] = useState(0);
  const [recentUsers, setRecentUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:5000/api/admin/users")
      .then((res) => res.json())
      .then((data) => {
        setTotalUsers(data.length);
        setTotalLandlords(data.filter(u => u.role === "landlord").length);
        setTotalTenants(data.filter(u => u.role === "tenant").length);
        setRecentUsers(data.slice(-5).reverse());
      });

    fetch("http://localhost:5000/api/admin/properties")
      .then((res) => res.json())
      .then((data) => setTotalProperties(data.length));

  //   fetch("http://localhost:5000/api/admin/requests")
  //     .then((res) => res.json())
  //     .then((data) => setPendingRequests(data.filter(r => r.status === "pending").length));

  //   fetch("http://localhost:5000/api/admin/agreements")
  //     .then((res) => res.json())
  //     .then((data) => setActiveAgreements(data.filter(a => a.status === "active").length));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const infoCards = [
    { title: "Total Users", value: totalUsers },
    { title: "Total Properties", value: totalProperties },
    // { title: "Registered Landlords", value: totalLandlords },
    // { title: "Registered Tenants", value: totalTenants },
    // { title: "Pending Requests", value: pendingRequests },
    // { title: "Active Agreements", value: activeAgreements },
  ];

  return (
    <div className="h-screen flex flex-col">
      <nav className="bg-[#d6b899] py-3 px-6 flex justify-between items-center shadow">
        <div className="flex items-center px-42">
        <img src="/assets/logo.png" alt="Logo" className="h-8 sm:h-10 md:h-12 w-auto" />
        </div>
        <button
          onClick={handleLogout}
          className="bg-[#e48f44] text-white px-4 py-1.5 rounded text-sm hover:bg-[#d97c2e] transition"
        >
          Logout
        </button>
      </nav>

      <div className="flex flex-grow">
        <Sidebar />

        <main className="flex-grow bg-[#ede9df] p-6">
          <div className="max-w-6xl mx-auto bg-white shadow rounded-lg p-6">
            <h1 className="text-2xl font-bold text-center text-[#333] mb-6">
              Admin Dashboard
            </h1>
            <p className="text-center text-sm mb-8 text-gray-600">
              Overview of platform activity as of {new Date().toLocaleString()}
            </p>

            {/* Info Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-5 mb-10">
              {infoCards.map((card, idx) => (
                <div key={idx} className="bg-[#f8f8f4] border border-[#e3e3db] rounded-lg p-4 shadow">
                  <h2 className="text-lg font-semibold text-[#444] mb-1">{card.title}</h2>
                  <p className="text-2xl font-bold text-[#e48f44]">{card.value}</p>
                </div>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap justify-center gap-4 mb-10">
              <button onClick={() => navigate("/UserList")} className="bg-[#e48f44] text-white px-4 py-2 rounded hover:bg-[#d97c2e]">
                View Users
              </button>
              <button onClick={() => navigate("/propertyList")} className="bg-[#e48f44] text-white px-4 py-2 rounded hover:bg-[#d97c2e]">
                View Properties
              </button>

      
            </div>

            {/* Recent Users Table */}
            <div className="bg-[#f9f9f6] border border-[#e3e3db] rounded-lg p-4">
              <h2 className="text-lg font-semibold mb-4">Recent Registrations</h2>
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="border-b border-[#ccc]">
                    <th className="p-2">Name</th>
                    <th className="p-2">Email</th>
                    <th className="p-2">Role</th>
                    <th className="p-2">Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {recentUsers.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="p-4 text-center text-gray-500">No recent users found</td>
                    </tr>
                  ) : (
                    recentUsers.map((u, i) => (
                      <tr key={i} className="border-t border-[#ddd] hover:bg-[#f2f2ec]">
                        <td className="p-2">{u.fullname}</td>
                        <td className="p-2">{u.email}</td>
                        <td className="p-2 capitalize">{u.role}</td>
                        <td className="p-2">{new Date(u.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default AdminDashboard;

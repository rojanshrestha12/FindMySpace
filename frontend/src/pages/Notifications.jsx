import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function NotificationCard({ notification, onRespond, isLandlord }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4">
      <h3 className="text-lg font-semibold text-orange-500">{notification.title}</h3>
      <p className="text-gray-700 mt-1 mb-4">{notification.description}</p>

      {isLandlord && notification.status === "PENDING" ? (
        <div className="flex justify-end space-x-2">
          <button
            onClick={() => onRespond(notification.request_id, "ACCEPTED")}
            className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600 transition"
          >
            Accept
          </button>
          <button
            onClick={() => onRespond(notification.request_id, "REJECTED")}
            className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600 transition"
          >
            Reject
          </button>
        </div>
      ) : (
        <p className="mt-2 text-sm text-orange-500 font-medium">
          Status: {notification.status.toLowerCase()}
        </p>
      )}
    </div>
  );
}

export default function NotificationPage() {
  const [landlordNotifs, setLandlordNotifs] = useState([]);
  const [tenantNotifs, setTenantNotifs] = useState([]);

  const token = localStorage.getItem("token");
  const userId = token ? JSON.parse(atob(token.split(".")[1])).userId : null;

  useEffect(() => {
    if (userId) {
      fetchLandlordNotifications(userId);
      fetchTenantNotifications(userId);
    }
  }, [userId]);

  const fetchLandlordNotifications = async (id) => {
    try {
      const res = await axios.get(`/api/requests/incoming/${id}`);
      const notifications = res.data.map((r) => ({
        ...r,
        title: "Booking Request",
        description: `${r.tenant?.fullname || "A user"} requested to book your property (${
          r.property?.type || r.property_id
        })`,
      }));
      setLandlordNotifs(notifications);
    } catch (err) {
      console.error("Error fetching landlord notifications", err);
    }
  };

const fetchTenantNotifications = async (id) => {
  try {
    const res = await axios.get(`/api/requests/my/${id}`);
    console.log("Tenant Notifications Response:", res.data);

    if (Array.isArray(res.data)) {
      const notifications = res.data.map((r) => ({
        ...r,
        title:
          r.status === "ACCEPTED"
            ? "Request Approved"
            : r.status === "REJECTED"
            ? "Request Rejected"
            : "Request Pending",
        description:
          r.status === "PENDING"
            ? `You requested to book property (${r.property?.type || r.property_id})`
            : `Your request for property (${r.property?.type || r.property_id}) was ${r.status.toLowerCase()}`,
      }));
      setTenantNotifs(notifications);
    } else {
      console.error("Unexpected data format:", res.data);
    }
  } catch (err) {
    console.error("Error fetching tenant notifications", err);
  }
};

  const handleResponse = async (requestId, status) => {
    try {
      await axios.put(`/api/requests/${requestId}`, { status });
      fetchLandlordNotifications(userId);
    } catch (err) {
      console.error("Error updating request", err);
    }
  };

  return (
    <div className="bg-[#f8f1ea] min-h-screen flex flex-col">
      <Navbar />
      <div className="w-full max-w-[800px] mx-auto px-4 mt-4 mb-10">
        <h2 className="text-2xl font-bold text-orange-500 pb-2 border-b-2 border-black mb-6">
          NOTIFICATIONS
        </h2>

        {/* Landlord Section */}
        <section className="mb-10">
          <h3 className="font-bold text-gray-700 mb-4 text-lg">Incoming Requests</h3>
          {landlordNotifs.length > 0 ? (
            landlordNotifs.map((notif) => (
              <NotificationCard
                key={notif.request_id}
                notification={notif}
                onRespond={handleResponse}
                isLandlord={true}
              />
            ))
          ) : (
            <p className="text-gray-500 ml-2">No incoming requests.</p>
          )}
        </section>

        {/* Tenant Section */}
        <section>
          <h3 className="font-bold text-gray-700 mb-4 text-lg">My Requests</h3>
          {tenantNotifs.length > 0 ? (
            tenantNotifs.map((notif) => (
              <NotificationCard
                key={notif.request_id}
                notification={notif}
                onRespond={handleResponse}
                isLandlord={false}
              />
            ))
          ) : (
            <p className="text-gray-500 ml-2">No sent requests.</p>
          )}
        </section>
      </div>
      <Footer />
    </div>
  );
}

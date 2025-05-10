import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import axios from "axios";

const API = "http://localhost:5000/api";

function getLandlordIdFromToken() {
  const token = localStorage.getItem("token");
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.landlordId || payload.userId || null;
  } catch (err) {
    console.error("Invalid token:", err);
    return null;
  }
}

export default function PaymentsPage() {
  const [landlordId, setLandlordId] = useState("");
  const [paymentHistory, setPaymentHistory] = useState({ pastPayments: [], currentPayments: [], futurePayments: [] });
  const [newPayment, setNewPayment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [notifyStatus, setNotifyStatus] = useState("");

  useEffect(() => {
    const id = getLandlordIdFromToken();
    if (id) {
      setLandlordId(id);
      fetchHistory(id);
    }
  }, []);

  const createPayment = async () => {
    if (!landlordId) return alert("Landlord ID missing from token");
    setLoading(true);
    try {
      const { data } = await axios.post(`${API}/payments/create`, { landlordId });
      setNewPayment(data.payment);
      await fetchHistory(landlordId);
    } catch (err) {
      alert(err.response?.data?.message || "Error creating payment");
    } finally {
      setLoading(false);
    }
  };

  const fetchHistory = async (id) => {
    try {
      const { data } = await axios.get(`${API}/payments/landlord/${id}/history`);
      setPaymentHistory(data);
    } catch (err) {
      alert("Failed to load payment history");
    }
  };

  const markAsPaid = async (id) => {
    try {
      await axios.put(`${API}/payments/${id}/mark-paid`);
      await fetchHistory(landlordId);
    } catch (err) {
      alert("Error marking as paid");
    }
  };

  const notifyTenant = async (id) => {
    try {
      const { data } = await axios.post(`${API}/payments/${id}/notify`);
      setNotifyStatus(`✅ Notification sent: ${data.message}`);
    } catch (err) {
      setNotifyStatus("❌ Notification failed");
    }
  };

  return (
    <div className="bg-[#f8f1ea] min-h-screen flex flex-col">
      <Navbar />
      <div className="w-full max-w-[1000px] mx-auto px-4 mt-6 flex-grow">
        <h2 className="text-2xl font-bold text-orange-500 pb-2 border-b-2 border-black mb-6">
          PAYMENT MANAGEMENT
        </h2>

        <div className="mb-4 text-gray-700">
          <p>Landlord ID: <strong>{landlordId || "Not found in token"}</strong></p>
        </div>

        <div className="flex flex-wrap gap-4 mb-6">
          <button
            className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition"
            onClick={createPayment}
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Payment"}
          </button>
          <button
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
            onClick={() => fetchHistory(landlordId)}
          >
            Reload Payment History
          </button>
        </div>

        {newPayment && (
          <div className="bg-green-100 p-4 rounded mb-6 border">
            ✅ New Payment Created: ID {newPayment.id}, Amount ${newPayment.amount}, Status {newPayment.status}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {["pastPayments", "currentPayments", "futurePayments"].map((category) => (
            <div key={category}>
              <h3 className="text-lg font-semibold text-gray-800 mb-3 capitalize border-b border-gray-400 pb-1">
                {category.replace("Payments", " Payments")}
              </h3>
              {paymentHistory[category]?.length === 0 ? (
                <p className="text-sm text-gray-600">No {category.replace("Payments", "")} payments</p>
              ) : (
                paymentHistory[category].map((p) => (
                  <div key={p.id} className="border bg-white p-4 mb-3 rounded shadow-sm">
                    <p><strong>ID:</strong> {p.id}</p>
                    <p><strong>Date:</strong> {p.payment_date}</p>
                    <p><strong>Amount:</strong> ${p.amount}</p>
                    <p><strong>Status:</strong>{" "}
                      <span className={p.status === "PAID" ? "text-green-600" : "text-yellow-600"}>
                        {p.status}
                      </span>
                    </p>
                    <div className="flex gap-2 mt-3">
                      {p.status === "PENDING" && (
                        <button
                          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition"
                          onClick={() => markAsPaid(p.id)}
                        >
                          Mark as Paid
                        </button>
                      )}
                      <button
                        className="bg-purple-500 text-white px-3 py-1 rounded hover:bg-purple-600 transition"
                        onClick={() => notifyTenant(p.id)}
                      >
                        Notify Tenant
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          ))}
        </div>

        {notifyStatus && (
          <div className="mt-6 text-blue-700 font-medium">{notifyStatus}</div>
        )}
      </div>
      <Footer />
    </div>
  );
}

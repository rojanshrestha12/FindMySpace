import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function PaymentTracking() {
  const [payments, setPayments] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [statusFilter, setStatusFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("token");
  const userId = token ? JSON.parse(atob(token.split(".")[1])).userId : null;

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/payments/user/${userId}`);
        setPayments(response.data.payments);
        setFilteredPayments(response.data.payments);
      } catch (err) {
        console.error(err);
        setError("Failed to load payment data.");
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchPayments();
  }, [userId]);

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  const handleFilterChange = (status) => {
    setStatusFilter(status);
    if (status === "All") {
      setFilteredPayments(payments);
    } else {
      const filtered = payments.filter((payment) => payment.status === status);
      setFilteredPayments(filtered);
    }
  };

  if (loading) return <div>Loading payment data...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="bg-[#f8f1ea] min-h-screen flex flex-col">
      <Navbar />
      <div className="container mx-auto px-4 py-8 flex-grow">
        <h2 className="text-3xl font-bold mb-6 text-[#e48f44]">Payment Tracking</h2>

        {/* Filter Buttons */}
        <div className="mb-4 flex space-x-4">
          {["All", "Paid", "Unpaid"].map((status) => (
            <button
              key={status}
              onClick={() => handleFilterChange(status)}
              className={`px-4 py-2 rounded ${
                statusFilter === status
                  ? "bg-[#e48f44] text-white"
                  : "bg-white text-[#e48f44] border border-[#e48f44]"
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {filteredPayments.length === 0 ? (
          <p>No payment records found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-lg shadow-md">
              <thead>
                <tr className="bg-[#e48f44] text-white">
                  <th className="py-3 px-4 text-left">Tenant</th>
                  <th className="py-3 px-4 text-left">Property</th>
                  <th className="py-3 px-4 text-left">Amount (Rs)</th>
                  <th className="py-3 px-4 text-left">Type</th>
                  <th className="py-3 px-4 text-left">Status</th>
                  <th className="py-3 px-4 text-left">Due Date</th>
                  <th className="py-3 px-4 text-left">Paid On</th>
                  <th className="py-3 px-4 text-left">Payment Method</th>
                  <th className="py-3 px-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPayments.map((payment) => (
                  <tr key={payment.id} className="border-b">
                    <td className="py-2 px-4">{payment.tenant_name}</td>
                    <td className="py-2 px-4">{payment.property_title}</td>
                    <td className="py-2 px-4">Rs. {Number(payment.amount).toLocaleString()}</td>
                    <td className="py-2 px-4">{payment.type}</td>
                    <td
                      className={`py-2 px-4 font-semibold ${
                        payment.status === "Paid" ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {payment.status}
                    </td>
                    <td className="py-2 px-4">{formatDate(payment.due_date)}</td>
                    <td className="py-2 px-4">
                      {payment.paid_on ? formatDate(payment.paid_on) : "—"}
                    </td>
                    <td className="py-2 px-4">{payment.method || "—"}</td>
                    <td className="py-2 px-4">
                      <button
                        className="bg-[#e48f44] text-white px-3 py-1 rounded hover:bg-[#d87f34]"
                        onClick={() => alert("Download feature coming soon")}
                      >
                        Invoice
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default PaymentTracking;

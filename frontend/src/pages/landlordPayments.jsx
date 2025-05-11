import React, { useEffect, useState } from 'react';
import axios from 'axios';

const PaymentHistory = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");
  const landlordId = token ? JSON.parse(atob(token.split('.')[1])).userId : null;

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/payments/history/${landlordId}`);
        setPayments(res.data);
      } catch (err) {
        console.error('Error fetching payment history:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, [landlordId]);

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="max-w-4xl mx-auto mt-10 p-4">
      <h1 className="text-2xl font-bold mb-6">Payment History</h1>
      {payments.length === 0 ? (
        <p>No payment history available.</p>
      ) : (
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2">Payment ID</th>
              <th className="border px-4 py-2">Request ID</th>
              <th className="border px-4 py-2">Tenant ID</th>
              <th className="border px-4 py-2">Date</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((pmt) => (
              <tr key={pmt.payment_id} className="hover:bg-gray-50">
                <td className="border px-4 py-2">{pmt.payment_id}</td>
                <td className="border px-4 py-2">{pmt.request_id}</td>
                <td className="border px-4 py-2">{pmt.tenant_id}</td>
                <td className="border px-4 py-2">{new Date(pmt.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default PaymentHistory;

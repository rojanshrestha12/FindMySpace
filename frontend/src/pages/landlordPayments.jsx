import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { MdEmail } from 'react-icons/md';
import { AiOutlineCalendar } from 'react-icons/ai';
import { FaUser } from 'react-icons/fa';

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

  const updateMovingDate = async (requestId) => {
    try {
      await axios.put(`http://localhost:5000/api/payments/update-moving-date/`, { requestId });
      setPayments(prev =>
        prev.map(p =>
          p.request_id === requestId
            ? {
              ...p,
              movingDate: new Date(
                new Date(p.movingDate).getTime() + 30 * 24 * 60 * 60 * 1000
              ).toISOString(),
            }
            : p
        )
      );
    } catch (err) {
      console.error('Error updating moving date:', err);
    }
  };

  const notifyTenant = async (tenantmail) => {
    try {
      await axios.put(`http://localhost:5000/api/payments/notify-tenant`, { tenantmail });
      alert('Tenant notified successfully');
    } catch (err) {
      console.error('Error notifying tenant:', err);
    }
  };

  if (loading) return <p className="text-center mt-10 text-gray-500">Loading payment history...</p>;

  return (
    <div className="bg-[#fefdfc] flex flex-col">
      <Navbar />
      <main className="max-w-6xl ml-30 py-10 h-screen">
        <h1 className="text-4xl font-bold text-orange-600 mb-8 border-b-4 border-orange-300 pb-3">Payment History</h1>

        {payments.length === 0 ? (
          <p className="text-gray-600 text-center text-lg">No payment history available.</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {payments.map((pmt) => {
              const isFutureDate = pmt.movingDate && new Date(pmt.movingDate) > new Date();
              return (
                <div key={pmt.payment_id} className="bg-white border border-gray-200 rounded-2xl shadow-md p-6">
                  <div className="mb-4">
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">Payment #{pmt.payment_id}</h2>
                    <p className="text-sm text-gray-500">Request ID: {pmt.request_id}</p>
                  </div>

                  <div className="space-y-2 text-gray-700 text-sm">
                    <p className="flex items-center gap-2">
                      <FaUser className="h-5 w-5 text-orange-500" />
                      <span>Tenant: {pmt.tenant?.fullname || 'N/A'}</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <MdEmail className="h-5 w-5 text-blue-500" />
                      <span>Email: {pmt.tenant?.email || 'N/A'}</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <AiOutlineCalendar className="h-5 w-5 text-green-500" />
                      <span>
                        Payment Date: {pmt.movingDate ? new Date(pmt.movingDate).toLocaleDateString() : 'N/A'}
                        {pmt.movingDate ? ` | Due Date: ${new Date(new Date(pmt.movingDate).getTime() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}` : ''}
                      </span>
                    </p>
                  </div>

                  <div className="mt-6 flex gap-4">
                    <button
                      onClick={() => updateMovingDate(pmt.request_id)}
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl text-sm"
                    >
                      Mark as Paid
                    </button>

                    <div className="relative group">
                      <button
                        onClick={() => notifyTenant(pmt.tenant?.email)}
                        disabled={!isFutureDate}
                        className={`px-4 py-2 text-sm rounded-xl text-white transition ${
                          isFutureDate
                            ? 'bg-blue-600 hover:bg-blue-700'
                            : 'bg-gray-400 cursor-not-allowed'
                        }`}
                      >
                        Notify Tenant
                      </button>
                      {!isFutureDate && (
                        <div className="absolute top-full left-0 mt-1 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                          Can notify only before move-in date
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default PaymentHistory;

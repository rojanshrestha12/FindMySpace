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
  const [tab, setTab] = useState('pending');

  const token = localStorage.getItem('token');
  const landlordId = token ? JSON.parse(atob(token.split('.')[1])).userId : null;

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const endpoint =
        tab === 'paid'
          ? `http://localhost:5000/api/payments/history/paid/${landlordId}`
          : `http://localhost:5000/api/payments/history/${landlordId}`;
      const res = await axios.get(endpoint);
      setPayments(res.data);
    } catch (err) {
      console.error('Error fetching payment history:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (landlordId) fetchPayments();
  }, [landlordId, tab]);

const notifyTenant = async ({ tenantmail, tenantName, landlordName, landlordPhone, landlordmail, dueDate }) => {
  try {
    await axios.post(`http://localhost:5000/api/payments/notify-tenant`, {
      tenantmail,
      tenantName,
      landlordName,
      landlordPhone,
      landlordmail,
      dueDate
    });
    alert('Tenant notified successfully');
  } catch (err) {
    console.error('Error notifying tenant:', err);
  }
};


const handleMarkAsPaid = async (requestId, paymentId, newDate, tenant, month) => {
  const confirmMark = window.confirm(
    `Are you absolutely sure you want to mark the rent for **${month}** as **PAID** by **${tenant}**?\n\n` +
    `This action will update the payment status and cannot be undone easily.`
  );
  if (!confirmMark) return;

  try {
    await axios.put("http://localhost:5000/api/payments/update-status", { requestId, paymentId });
    await axios.post("http://localhost:5000/api/payments/update-history", { requestId, newDate });
    fetchPayments();
  } catch (err) {
    console.error("Error marking as paid:", err);
  }
};



  return (
    <div className="bg-[#fefdfc] flex flex-col h-screen">
      <Navbar />
      <main className="w-full max-w-[1250px] mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-grow h-screen-full">
        <h1 className="text-2xl font-bold text-[#e48f44] mb-6">
          Payments 
        </h1>

        <div className="flex flex-wrap gap-4 mb-10">
          <button
            onClick={() => setTab('pending')}
            className={`px-5 py-2 rounded-xl transition font-medium ${
              tab === 'pending' ? 'bg-[#e48f44] text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => setTab('paid')}
            className={`px-5 py-2 rounded-xl transition font-medium ${
              tab === 'paid' ? 'bg-[#e48f44] text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            Paid
          </button>
        </div>

        {loading ? (
          <p className="text-gray-500 text-center mt-4">Loading payment history...</p>
        ) : payments.length === 0 ? (
          <p className="text-gray-600 text-center text-lg">No {tab} payments found.</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {payments.map((pmt) => {
            const moveInDate = new Date(pmt.movingDate);
            const dueDate = new Date(moveInDate);
            dueDate.setDate(moveInDate.getDate() + 30);
            const dueMonth = dueDate.toLocaleString('default', { month: 'long' }); // e.g., "December"
              const isFutureDate = moveInDate > new Date();

              return (
                <div key={pmt.payment_id} className="bg-white border border-gray-200 rounded-2xl shadow-md p-6 md:p-8 space-y-4">
                  <p className="text-md text-black mb-4 font-bold">Month: {dueMonth}</p>

                  <div className="space-y-2 text-gray-700 text-sm">
                    <p className="flex items-center gap-2">
                      <FaUser className="text-orange-500" />
                      <span>Tenant: {pmt.tenant?.fullname || 'N/A'}</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <MdEmail className="text-blue-500" />
                      <span>Email: {pmt.tenant?.email || 'N/A'}</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <FaUser className="text-orange-500" />
                      <span>Phone Number: {pmt.tenant?.phone_number}</span>
                    </p>  
                    <p className="flex items-center gap-2">
                      <AiOutlineCalendar className="text-green-500" />
                      <span>
                        Due: {dueDate.toLocaleDateString()}
                      </span>
                    </p>
                  </div>

                  {tab === 'pending' && (
                    <div className="mt-6 flex flex-wrap gap-3">
                      <button
                        onClick={() => handleMarkAsPaid(pmt.request_id, pmt.payment_id, dueDate.toLocaleDateString(), pmt.tenant?.fullname, dueMonth)}
                        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl text-sm"
                      >
                        Mark as Paid
                      </button>
                        
                      <div className="relative group">
                        <button
                          onClick={() =>
                            notifyTenant({
                              tenantmail: pmt.tenant?.email,
                              tenantName: pmt.tenant?.fullname,
                              landlordmail: pmt.landlord?.email,
                              landlordName: pmt.landlord?.fullname,
                              landlordPhone: pmt.landlord?.phone_number,
                              dueDate: dueDate.toLocaleDateString()
                            })
                          }
                          disabled={!isFutureDate}
                          className={`px-4 py-2 text-sm rounded-xl text-white transition ${
                            isFutureDate ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'
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
                  )}
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

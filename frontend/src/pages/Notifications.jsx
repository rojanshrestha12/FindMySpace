import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { ClipLoader } from 'react-spinners';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [userId, setUserId] = useState(null);

  // Decode JWT token safely
  const decodeToken = (token) => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload?.userId || null;
    } catch {
      return null;
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userIdFromToken = token ? decodeToken(token) : null;

    if (!userIdFromToken) {
      setError('User not authenticated.');
      setLoading(false);
      return;
    }

    setUserId(userIdFromToken);

    const fetchData = async () => {
      try {
        const [requestsRes, responsesRes] = await Promise.all([
          axios.get(`http://localhost:5000/api/booking/requests/${userIdFromToken}`),
          axios.get(`http://localhost:5000/api/booking/repondMes/${userIdFromToken}`),
        ]);

        setNotifications(Array.isArray(requestsRes.data.notifications) ? requestsRes.data.notifications : []);
        setResponses(Array.isArray(responsesRes.data.notifications) ? responsesRes.data.notifications : []);
        console.log("Notification fetched");
        
      } catch (err) {
        console.error(err);
        setError('Error fetching notifications.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 10000); // Fetch every 10 seconds
    return () => clearInterval(interval);
  }, []);

  const handleResponse = async (requestId, action) => {
    try {
      const result = await axios.post('http://localhost:5000/api/booking/respond', {
        requestId,
        response: action === 'approve' ? 'approved' : 'rejected',
      });

      if (result.data?.message) {
        setNotifications((prev) =>
          prev.map((item) =>
            item.requestId === requestId ? { ...item, status: action === 'approve' ? 'ACCEPTED' : 'REJECTED' } : item
          )
        );
        toast.success(`Request ${action === 'approve' ? 'approved' : 'rejected'}!`);

        // Send additional data if the request is approved
        if (action === 'approve') {
          const response = await fetch("http://localhost:5000/api/agreement", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              requestId,
            }),
          });

          if (response.ok) {
            toast.success('Agreement successfully created!');
          } else {
            toast.error('Failed to create agreement.');
          }
        }

      } else {
        toast.error('Failed to update request.');
      }
    } catch (error) {
      toast.error('Error submitting your response.');
      console.error('Error:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#f8f1ea]">
        <ClipLoader color="#e48f44" size={50} />
      </div>
    );
  }

  return (
    <div className="bg-[#f8f1ea] h-screen flex flex-col">
      <Navbar />
      <main className="p-4 max-w-4xl mx-auto mt-10 w-full h-screen">
        <h1 className="text-3xl font-bold text-center text-[#e48f44] mb-8">Notifications</h1>

        {/* Error display */}
        {error && (
          <div className="text-center text-red-600 font-semibold mb-6">
            {error}
          </div>
        )}

        {/* Landlord Requests */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Requests Received</h2>
          {notifications.length === 0 ? (
            <p className="text-center text-gray-600">No new requests at the moment.</p>
          ) : (
            <ul className="space-y-6">
              {notifications.map((item) => (
                <li
                  key={item.requestId}
                  className="bg-white p-5 rounded-lg shadow border border-gray-200"
                >
                  <div className="flex justify-between items-left">
                    <div>
                      <p className="text-lg font-medium text-gray-800">{item.message}</p>
                      {/* <p className="text-sm text-gray-500 mt-1">{item.userId}</p> */}
                      <p className="text-bg text-black-500 mt-1">Tenant Email: {item.tenant_email}</p>
                      <p className="text-bg text-black-500 mt-1">Tenant Phone Number: {item.tenant_number}</p>
                      <p className="text-sm text-gray-500 mt-6">
                        {new Date(item.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <div >
                    <span
                      className={`px-4 py-2 rounded-full text-xs font-bold ${
                        item.status === 'ACCEPTED'
                          ? 'bg-green-100 text-green-600'
                          : item.status === 'REJECTED'
                          ? 'bg-red-100 text-red-600'
                          : 'bg-yellow-100 text-yellow-600'
                      }`}
                    >
                      {item.status || 'PENDING'}
                    </span>
                    </div>
                  </div>

                  {item.status !== 'ACCEPTED' && item.status !== 'REJECTED' && (
                    <div className="mt-4 flex justify-end gap-3">
                      <button
                        onClick={() => handleResponse(item.requestId, 'approve')}
                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded shadow"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleResponse(item.requestId, 'reject')}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded shadow"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Tenant Responses */}
        <section>
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Your Responses</h2>
          {responses.length === 0 ? (
            <p className="text-center text-gray-600">No response notifications available.</p>
          ) : (
            <ul className="space-y-4">
              {responses.map((res) => (
                <li
                  key={res.request_id}
                  className={`p-4 rounded-lg border ${res.status === 'ACCEPTED'
                    ? 'bg-green-50 border-green-300'
                    : res.status === 'REJECTED'
                    ? 'bg-red-50 border-red-300'
                    : 'bg-yellow-50 border-yellow-300'
                    }`}
                >
                  <p className="text-gray-800">{res.message}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Last updated: {new Date(res.updatedAt).toLocaleString()}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Notifications;

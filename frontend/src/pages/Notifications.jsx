import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { ClipLoader } from 'react-spinners';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const decodedToken = token ? JSON.parse(atob(token.split('.')[1])) : null;
    const userIdFromToken = decodedToken ? decodedToken.userId : null;

    setUserId(userIdFromToken);

    if (userIdFromToken) {
      const fetchNotifications = async () => {
        try {
          const response = await axios.get(`http://localhost:5000/api/booking/requests/${userIdFromToken}`);
          const data = response.data || {};
          setNotifications(Array.isArray(data.notifications) ? data.notifications : []);
        } catch (err) {
          console.error(err);
          setError('Failed to load notifications.');
        } finally {
          setLoading(false);
        }
      };

      fetchNotifications();
      const interval = setInterval(fetchNotifications, 100000);
      return () => clearInterval(interval);
    } else {
      setError('User ID is not available');
      setLoading(false);
    }
  }, []);

  const handleApproval = async (requestId, action) => {
    try {
      const response = await axios.post('http://localhost:5000/api/booking/respond', {
        requestId,
        response: action === 'approve' ? 'approved' : 'rejected',
      });

      if (response.data.message) {
        setNotifications(prev => prev.map(notification =>
          notification.requestId === requestId
            ? { ...notification, status: action === 'approve' ? 'ACCEPTED' : 'REJECTED' }
            : notification
        ));
        toast.success(`${action === 'approve' ? 'Approved' : 'Rejected'} successfully!`);
      } else {
        toast.error('Error updating status');
      }
    } catch (err) {
      toast.error('Error submitting response');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <ClipLoader color="#e48f44" size={50} />
      </div>
    );
  }

  if (error) {
    return <p className="text-center text-red-500 mt-10">{error}</p>;
  }

  return (
    <div className="bg-[#f8f1ea] min-h-screen flex flex-col">
      <Navbar />
      <div className="p-4 bg-[#f8f1ea] max-w-4xl mx-auto mt-8 w-full">
        <h2 className="text-3xl font-bold text-[#e48f44] mb-6 text-center">Notifications</h2>
        {notifications.length === 0 ? (
          <p className="text-center text-gray-600">No new notifications.</p>
        ) : (
          <ul className="space-y-6">
            {notifications.map((notification) => (
              <li key={notification.requestId} className="bg-white shadow-md p-5 rounded-lg border border-gray-200">
                <div className="flex justify-between items-center">
                  <div className="flex-1">
                    <p className="text-lg font-semibold text-gray-800">{notification.message}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      {new Date(notification.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="ml-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        notification.status === 'ACCEPTED'
                          ? 'bg-green-100 text-green-600'
                          : notification.status === 'REJECTED'
                          ? 'bg-red-100 text-red-600'
                          : 'bg-yellow-100 text-yellow-600'
                      }`}
                    >
                      {notification.status || 'PENDING'}
                    </span>
                  </div>
                </div>

                {/* Buttons appear only if not already accepted/rejected */}
                {notification.status !== 'ACCEPTED' && notification.status !== 'REJECTED' && (
                  <div className="mt-4 flex justify-end gap-3">
                    <button
                      onClick={() => handleApproval(notification.requestId, 'approve')}
                      className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded shadow"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleApproval(notification.requestId, 'reject')}
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
      </div>
      <Footer />
    </div>
  );
};

export default Notifications;

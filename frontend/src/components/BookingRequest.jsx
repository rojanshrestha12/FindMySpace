import React, { useEffect, useState } from "react";

const BookingRequests = ({ userId }) => {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:5000/api/booking/requests/${userId}`, {
      credentials: 'include',
    })
      .then((res) => res.json())
      .then((data) => setRequests(data))
      .catch((err) => console.error("Error fetching requests:", err));
  }, [userId]);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Booking Requests</h2>
      {requests.length === 0 ? (
        <p>No requests found.</p>
      ) : (
        <ul className="space-y-3">
          {requests.map((req) => (
            <li
              key={req.request_id}
              className="border rounded p-4 shadow-sm hover:shadow-md transition"
            >
              <p><strong>Tenant:</strong> {req.tenant.fullname}</p>
              <p><strong>Property:</strong> {req.property.type} in {req.property.location}</p>
              <p><strong>Status:</strong> {req.status}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default BookingRequests;

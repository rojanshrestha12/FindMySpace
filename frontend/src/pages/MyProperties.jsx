import React, { useState } from "react";

function NotificationPage({ title, description }) {
  const [response, setResponse] = useState("");

  const handleAccept = () => {
    setResponse("You accepted the request!");
  };

  const handleReject = () => {
    setResponse("You rejected the request!");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center text-[#e48f44]">
          {title}
        </h2>
        <p className="text-gray-700 mb-6 text-center">
          {description}
        </p>

        <div className="flex justify-between">
          <button
            onClick={handleAccept}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 w-1/2 mr-2"
          >
            Accept
          </button>
          <button
            onClick={handleReject}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 w-1/2 ml-2"
          >
            Reject
          </button>
        </div>

        {response && (
          <div className="mt-6 text-center text-lg text-[#e48f44] font-semibold">
            {response}
          </div>
        )}
      </div>
    </div>
  );
}

export default NotificationPage;

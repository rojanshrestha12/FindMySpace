import React, { useState } from "react";

function RentRequestForm({ onSubmit }) {
  const [form, setForm] = useState({
    movingDate: "",
    permanentAddress: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const { movingDate, permanentAddress } = form;

    if (!movingDate || !permanentAddress) {
      alert("Please fill in all fields.");
      return;
    }

    // Calculate the dueDate (30 days after movingDate)
    const movingDateObj = new Date(movingDate);
    const dueDate = new Date(movingDateObj);
    dueDate.setDate(movingDateObj.getDate() + 30); // Add 30 days

    try {
      const response = await fetch("http://localhost:5000/api/agreement", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          movingDate,
          permanentAddress,
          dueDate: dueDate.toISOString().split("T")[0], // Format dueDate as YYYY-MM-DD
        }),
      });

      if (!response.ok) throw new Error("Submission failed");

      const result = await response.json();
      setForm({ movingDate: "", permanentAddress: "" });

      if (onSubmit) onSubmit(result);
    } catch (err) {
      console.error(err);
      alert("Error submitting data.");
    }
  };

  return (
    <div className="absolute inset-0 bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
        <h2 className="text-xl font-semibold mb-4 text-center">Move-in Details</h2>
        <div className="space-y-4">
          <input
            type="date"
            name="movingDate"
            placeholder="Moving Date"
            value={form.movingDate}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
          <input
            type="text"
            name="permanentAddress"
            placeholder="Permanent Address"
            value={form.permanentAddress}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <div className="flex justify-end mt-6">
          <button
            onClick={handleSubmit}
            className="bg-[#e48f44] text-white px-4 py-2 rounded hover:bg-[#d87f34]"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}

export default RentRequestForm;

import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function RentRequestForm() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    movingDate: "",
    permanentAddress: "",
  });

  const [agreed, setAgreed] = useState(false);

  const token = localStorage.getItem("token");
  const tenantId = token ? JSON.parse(atob(token.split(".")[1])).userId : null;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const { movingDate, permanentAddress } = form;

    if (!movingDate || !permanentAddress) {
      toast.warning("Please fill in all fields.");
      return;
    }

    const selectedDate = new Date(movingDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate <= today) {
      toast.warning("Moving date must be in the future.");
      return;
    }

    if (!agreed) {
      toast.warning("You must agree to the terms and policy.");
      return;
    }

    const requestId = localStorage.getItem("requestId");

    if (!requestId) {
      toast.error("No request ID found.");
      return;
    }

    const movingDateObj = new Date(movingDate);
    const dueDate = new Date(movingDateObj);
    dueDate.setDate(movingDateObj.getDate() + 30);

    try {
      const response = await fetch("http://localhost:5000/api/agreement_save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          movingDate,
          permanentAddress,
          dueDate: dueDate.toISOString().split("T")[0],
          tenantId,
          requestId,
        }),
      });

      if (!response.ok) throw new Error("Submission failed");

      toast.success(`Submitted successfully for Request ID: ${requestId}`);
      setForm({ movingDate: "", permanentAddress: "" });
      setAgreed(false);
      navigate("/notifications");
    } catch (err) {
      console.error(err);
      toast.error("Error submitting data.");
    } finally {
      localStorage.removeItem("requestId");
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
          <div className="flex items-start gap-2">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
            />
            <label className="text-sm">
              I confirm that the information I have provided is correct, and I have read the{" "}
              <Link to="/terms" className="text-blue-600 underline">
                Terms and Policy
              </Link>
              .
            </label>
          </div>
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
      <ToastContainer autoClose={3000} />
    </div>
  );
}

export default RentRequestForm;

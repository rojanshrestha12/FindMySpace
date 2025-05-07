  import React, { useState } from "react";

  function RentRequestForm({ onSubmit }) {
    const [form, setForm] = useState({
      fullname: "",
      email: "",
      phone: "",
      moveInDate: "",
      duration: "",
      message: "",
    });

    const handleChange = (e) => {
      setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = () => {
      const { fullname, email, phone, moveInDate, duration } = form;
      if (!fullname || !email || !phone || !moveInDate || !duration) {
        alert("Please fill in all redsquired fields.");
        return;
      }

      onSubmit(form);
    };

    return (
      <div className="fixed inset-0 bg-blur bg-opacity-30 backdrop-blur-lg flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-md w-200">
          <h4 className="text-lg font-semibold mb-4 text-center">Rent Request Form</h4>

          <div className="space-y-4">
            <input
              type="text"
              name="fullname"
              placeholder="Full Name"
              value={form.fullname}
              onChange={handleChange}
              className="w-full border p-2 rounded-md"
            />

            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={form.email}
              onChange={handleChange}
              className="w-full border p-2 rounded-md"
            />

            <input
              type="tel"
              name="phone"
              placeholder="Contact Number"
              value={form.phone}
              onChange={handleChange}
              className="w-full border p-2 rounded-md"
            />

            <input
              type="date"
              name="moveInDate"
              value={form.moveInDate}
              onChange={handleChange}
              className="w-full border p-2 rounded-md"
            />

            <input
              type="text"
              name="duration"
              placeholder="Duration of Stay (e.g., 6 months)"
              value={form.duration}
              onChange={handleChange}
              className="w-full border p-2 rounded-md"
            />

            <textarea
              name="message"
              placeholder="Additional message (optional)"
              value={form.message}
              onChange={handleChange}
              className="w-full border p-2 rounded-md"
              rows={4}
            />
          </div>

          <div className="flex justify-end mt-4">
            <button
              onClick={handleSubmit}
              className="bg-[#e48f44] text-white py-2 px-4 rounded-md hover:bg-[#d87f34]"
            >
              Submit Request
            </button>
          </div>
        </div>
      </div>
    );
  }

  export default RentRequestForm;

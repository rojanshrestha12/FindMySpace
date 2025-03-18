import { useState } from "react";
import axios from "axios";

function ForgotPassword() {
  const [email, setEmail] = useState("");

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:3000/api/forgot-password", { email });
      alert("Password reset email sent!");
    } catch (error) {
      alert(error.response?.data?.message || "Error sending reset email");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#f8f1ea] px-4">
      <div className="flex flex-col items-center w-full max-w-md bg-white rounded-lg p-8">
        <h2 className="text-2xl font-bold mb-6">Forgot Password</h2>
        <form onSubmit={handleForgotPassword}>
          <label className="font-bold">Email</label>
          <input
            type="email"
            required
            className="w-full p-2 mb-4 border-2 border-gray-300 rounded-lg"
            onChange={(e) => setEmail(e.target.value)}
          />
          <button
            type="submit"
            className="w-full py-2 bg-[#e48f44] text-white text-xl rounded-lg cursor-pointer hover:bg-[#d67d3b]"
          >
            Send Reset Email
          </button>
        </form>
      </div>
    </div>
  );
}

export default ForgotPassword;
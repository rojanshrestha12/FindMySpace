import { useState } from "react";
import axios from "axios";
import { Navigate, useNavigate } from "react-router-dom";
import { toast } from 'react-toastify'; // Import toast
import 'react-toastify/dist/ReactToastify.css'; // Import toast CSS

function ForgotPassword() {
  // State to store email input from user
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    try {
      // Send the email to the backend for processing
      await axios.post("http://localhost:5000/api/auth/forgotpassword", { email });
      
      // Show success toast
      toast.success("Password reset email sent!");
      navigate("/resetPassword", { state: { email } }); // Pass email as state
    } catch (error) {
      console.error("Error sending reset email:", error);
      
      // Show error toast
      toast.error(error.response?.data?.message || "Error sending reset email");
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

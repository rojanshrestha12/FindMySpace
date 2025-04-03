import { useState } from "react";
<<<<<<< HEAD
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

function ResetPassword() {
  const location = useLocation();
  const email = location.state?.email || ""; // Get email from navigation state
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
=======
import { useNavigate } from "react-router-dom";
import axios from "axios";

function ResetPassword() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState("");
>>>>>>> 7575c6bbe24f0412b22554f19831faf7083e5d6c
  const navigate = useNavigate();

  const handleResetPassword = async (e) => {
    e.preventDefault();
<<<<<<< HEAD
    if (!email) {
      alert("No email found. Please request OTP again.");
      return;
    }
=======
>>>>>>> 7575c6bbe24f0412b22554f19831faf7083e5d6c
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
<<<<<<< HEAD
      await axios.post("http://localhost:5000/api/auth/resetpassword", {
        email, // Send the email from state
        otp,
=======
      await axios.post("http://localhost:3000/api/resetpassword", {
        token,
>>>>>>> 7575c6bbe24f0412b22554f19831faf7083e5d6c
        newPassword,
      });
      alert("Password reset successful!");
      navigate("/login");
    } catch (error) {
      alert(error.response?.data?.message || "Error resetting password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#f8f1ea] px-4">
      <div className="flex flex-col items-center w-full max-w-md bg-white rounded-lg p-8">
        <h2 className="text-2xl font-bold mb-6">Reset Password</h2>
        <form onSubmit={handleResetPassword}>
<<<<<<< HEAD
          <label className="font-bold">OTP</label>
=======
          <label className="font-bold">Token</label>
>>>>>>> 7575c6bbe24f0412b22554f19831faf7083e5d6c
          <input
            type="text"
            required
            className="w-full p-2 mb-4 border-2 border-gray-300 rounded-lg"
<<<<<<< HEAD
            onChange={(e) => setOtp(e.target.value)}
=======
            onChange={(e) => setToken(e.target.value)}
>>>>>>> 7575c6bbe24f0412b22554f19831faf7083e5d6c
          />
          <label className="font-bold">New Password</label>
          <input
            type="password"
            required
            className="w-full p-2 mb-4 border-2 border-gray-300 rounded-lg"
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <label className="font-bold">Confirm Password</label>
          <input
            type="password"
            required
            className="w-full p-2 mb-4 border-2 border-gray-300 rounded-lg"
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 bg-[#e48f44] text-white text-xl rounded-lg ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#d67d3b]'}`}
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
}

<<<<<<< HEAD
export default ResetPassword;
=======
export default ResetPassword;
>>>>>>> 7575c6bbe24f0412b22554f19831faf7083e5d6c

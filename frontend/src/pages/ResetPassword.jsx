import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function ResetPassword() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { token } = useParams();
  const navigate = useNavigate();

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      await axios.post("http://localhost:3000/api/reset-password", {
        token,
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

export default ResetPassword;
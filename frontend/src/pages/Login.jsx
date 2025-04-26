import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginWithGoogle } from "../firebase";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLoginWithGoogle = async () => {
    try {
      const googleToken = await loginWithGoogle();
      if (googleToken) {
        const response = await fetch("http://localhost:5000/api/login/google", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${googleToken}`,
          },
        });
        const data = await response.json();
        if (data.token && data.user) {
          localStorage.setItem("token", data.token);
          localStorage.setItem("role", data.user.role);
        } else {
          console.error("Google login failed: Missing token or user");
        }
      }
    } catch (err) {
      console.error("Google login error:", err);
    }
  };
  
  const handleLoginWithEmail = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    try {
      // Step 1: Login and get token
      const response = await fetch("http://localhost:5000/api/login/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log("Email login response:", data);

      if (!data.token) {
        console.error("Login failed: No token received");
        alert("Login failed. Please check your credentials.");
        return;
      }

      // Step 2: Save token
      const token = data.token;
      const isAdmin = data.isAdmin;
      localStorage.setItem("token", token);
      localStorage.setItem("isAdmin", isAdmin === "Yes very much an admin"? true : false);

      if (isAdmin === "Yes very much an admin") {
          navigate('/AdminDashboard');
      }else{
        navigate("/"); // redirect normal users here
      }
    } catch (error) {
      console.error("Error in login or admin check:", error);
      alert("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
  

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#f8f1ea] px-4">
      <div className="flex flex-col md:flex-row items-center w-full max-w-full bg-[#f8f1ea] rounded-lg p-8 md:px-8 md:pb-4">
        {/* Left Section */}
        <div className="flex-3 md:text-left pl-20 pr-40">
          <img src="/assets/logo.png" alt="Logo" className="w-40 absolute top-10" />
          <h2 className="text-4xl font-bold mt-40 mb-6 max-w-md">SIMPLIFYING ROOM RENTALS</h2>
          <img src="/assets/illustration.jpg" className="w-150" alt="Illustration" />
        </div>

        {/* Right Section */}
        <div className="flex-2 mr-15 w-full max-w-md">
          <h2 className="text-3xl mb-6">Welcome Back 👋</h2>
          <form onSubmit={handleLoginWithEmail}>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              required
              className="w-full p-2 mb-2 border-2 border-[#8d6d62] rounded-lg bg-[#d6b899] text-black text-lg"
              onChange={(e) => setEmail(e.target.value)}
            />

            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              required
              className="w-full p-2 mb-2 border-2 border-[#8d6d62] rounded-lg bg-[#d6b899] text-black text-lg"
              onChange={(e) => setPassword(e.target.value)}
            />

            <p
              className="text-md text-[#1E4AE9] cursor-pointer text-right mt-4 mb-4"
              onClick={() => navigate("/forgotpassword")}
            >
              Forgot Password?
            </p>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 bg-[#e48f44] text-black text-xl rounded-lg ${
                loading ? "opacity-50 cursor-not-allowed" : "hover:bg-[#d67d3b]"
              }`}
            >
              {loading ? "Logging in..." : "Sign in"}
            </button>
          </form>

          <div className="flex items-center w-full gap-3 mt-4 mb-4">
            <div className="flex-grow h-[2px] bg-[#cfdfe2]"></div>
            <span className="whitespace-nowrap">OR</span>
            <div className="flex-grow h-[2px] bg-[#cfdfe2]"></div>
          </div>

          <button
            className="w-full flex items-center justify-center py-2 bg-white border-2 border-[#d6b899] text-black text-lg rounded-lg shadow-md hover:bg-gray-100"
            onClick={handleLoginWithGoogle}
          >
            <img src="/assets/google_logo.png" alt="Google" className="w-6 mr-2" />
            Sign in with Google
          </button>

          <p className="text-md text-black mb-2 mt-4 text-center">
            Don't have an account?{" "}
            <Link to="/register" className="text-md text-[#1E4AE9] font-normal">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:3000/api/login", {
        email,
        password,
      });

      localStorage.setItem("token", response.data.token);
      navigate("/dashboard");
    } catch (error) {
      alert(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#f8f1ea] px-4">
      <div className="flex flex-col md:flex-row items-center w-full max-w-5xl bg-[#f8f1ea] rounded-lg p-6 md:p-12">
        
        {/* Left Section */}
        <div className="flex-1 text-center md:text-left">
          <img src="/assets/logo.png" alt="Logo" className="w-40 mx-auto md:mx-0" />
          <h2 className="text-3xl font-bold text-[#4a2c27] mt-4 mb-6">Simplifying Room Rentals</h2>
          <img
            src="/assets/illustration.jpg"
            alt="Illustration"
            className="w-full max-w-md mx-auto"
          />
        </div>

        {/* Right Section */}
        <div className="flex-1 p-6 md:p-12">
          <h2 className="text-3xl font-bold text-[#4a2c27] flex items-center">
            Welcome Back <span className="ml-2">👋</span>
          </h2>
          
          <form onSubmit={handleLogin} className="mt-6">
            <label className="block text-lg font-medium text-gray-700">Username</label>
            <input
              type="email"
              placeholder="Enter your email"
              required
              className="w-full p-3 mt-2 mb-4 border-2 border-[#caa38d] rounded-lg text-black bg-[#f0e0d1] focus:outline-none focus:ring-2 focus:ring-[#a87d68]"
              onChange={(e) => setEmail(e.target.value)}
            />

            <label className="block text-lg font-medium text-gray-700">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              required
              className="w-full p-3 mt-2 mb-2 border-2 border-[#caa38d] rounded-lg text-black bg-[#f0e0d1] focus:outline-none focus:ring-2 focus:ring-[#a87d68]"
              onChange={(e) => setPassword(e.target.value)}
            />

            <div className="text-right text-lg mb-6">
              <Link to="/forgot-password" className="text-[#e48f44] hover:underline">
                Forgot Password?
              </Link>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#e48f44] text-white text-lg font-semibold rounded-lg shadow-md hover:bg-[#d67d3b]"
            >
              Sign in
            </button>
          </form>

          <p className="text-center text-gray-500 my-6">Or</p>

          <button className="w-full flex items-center justify-center py-3 bg-white border-2 border-[#d6b899] text-black text-lg rounded-lg shadow-md hover:bg-gray-100">
            <img src="/assets/google_logo.png" alt="Google" className="w-6 mr-2" />
            Sign in with Google
          </button>

          <p className="text-center text-lg mt-6">
            Don’t have an account?{" "}
            <Link to="/register" className="text-[#e48f44] hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;

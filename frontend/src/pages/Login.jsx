import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginWithEmail, loginWithGoogle } from "../auth/auth"; // Import authentication functions

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Function to handle login with API
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    const response = await loginWithEmail(email, password);
    if (response.success) {
      navigate("/dashboard");
    } else {
      alert(response.message);
    }

    setLoading(false);
  };

  // Function to handle Google Sign-in
  const handleGoogleLogin = async () => {
    const response = await loginWithGoogle();
    if (response.success) {
      navigate("/dashboard");
    } else {
      alert(response.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#f8f1ea] px-4">
      <div className="flex flex-col md:flex-row items-center w-full max-w-full bg-[#f8f1ea] rounded-lg p-8 md:px-20 md:pb-4">
        {/* Left Section */}
        <div className="flex-3 md:text-left pl-20 pr-40 mb-50">
          <div className="flex items-center space-x-3 mb-6">
            <img src="/assets/logo.png" alt="Logo" className="w-20 relative mb-20 max-w-md" />
            <h1 className="text-4xl absolute mb-10 ml-20 font-bold text-[#4a2c27] italic" style={{ fontFamily: "Brush Script MT" }}>
              Find My Space
            </h1>
          </div>
          <h2 className="text-4xl font-bold text-[#4a2c27] mt-4 mb-6 max-w-md">SIMPLIFYING ROOM RENTALS</h2>
          <h2 className="text-2xl font-normal text-[#4a2c27] mt-4 mb-6 max-w-md">
            List, browse, inspect, and rent securely - all in one place.
          </h2>
        </div>

        {/* Right Section */}
        <div className="flex-2 mt-8 mr-15">
          <h2 className="text-2xl font-bold mb-6 flex items-center justify-left gap-10">
            Log in to your account
            <span className="text-lg font-bold underline">
              <Link to="/register" className="text-[#4a2c27]">Create an account</Link>
            </span>
          </h2>

          <form onSubmit={handleLogin}>
            <label htmlFor="email" className="font-bold">Email</label>
            <input
              id="email"
              type="email"
              required
              className="w-full p-2 mb-2 border-2 border-[#8d6d62] rounded-lg bg-[#d6b899] text-black text-lg"
              onChange={(e) => setEmail(e.target.value)}
            />

            <label htmlFor="password" className="font-bold">Password</label>
            <input
              id="password"
              type="password"
              required
              className="w-full p-2 mb-2 border-2 border-[#8d6d62] rounded-lg bg-[#d6b899] text-black text-lg"
              onChange={(e) => setPassword(e.target.value)}
            />

            <p className="text-Md text-black mb-2">
              By logging in, you agree to our{" "}
              <Link to="/terms" className="text-Md text-[#e48f44] font-bold">
                Terms & Conditions
              </Link>
            </p>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 bg-[#e48f44] text-white text-xl rounded-lg ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#d67d3b]'}`}
            >
              {loading ? "Logging in..." : "Log in"}
            </button>
          </form>

          {/* Forgot Password */}
          <p
            className="text-md text-[#e48f44] font-bold cursor-pointer text-center mt-2"
            onClick={() => navigate("/forgot-password")}
          >
            Forgot Password?
          </p>

          <p className="text-center text-lg my-2 text-gray-500">- OR -</p>

          {/* Google Sign-in Button */}
          <button
            className="w-full flex items-center justify-center py-2 bg-white border-2 border-[#d6b899] text-black text-lg rounded-lg shadow-md hover:bg-gray-100"
            onClick={handleGoogleLogin}
          >
            <img src="/assets/google_logo.png" alt="Google" className="w-6 mr-2" />
            Sign in with Google
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;

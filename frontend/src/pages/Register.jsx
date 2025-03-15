import { useState } from "react";
// import { signInWithGoogle } from "../firebase"; // Firebase only for Google login
import { Link, useNavigate } from "react-router-dom";
import axios from "axios"; // Import axios for API requests

function Register() {
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("tenant");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:3000/api/signup", {
        username:username,
        phone:phone,
        email:email,
        password:password,
        role:role,
      });

      // Store token & redirect to dashboard
      localStorage.setItem("token", response.data.token);
      navigate("/dashboard");
    } catch (error) {
      alert(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#f8f1ea] px-4">
      <div className="flex flex-col md:flex-row items-center w-full max-w-full bg-[#f8f1ea] rounded-lg p-8 md:px-20 md:pb-4">
      {/* Left Section */}
      <div className="flex-3 md:text-left pl-20 pr-40 mb-50">
          <div className="flex items-center space-x-3 mb-6">
            {/* Logo (Left) */}
            <img src="/assets/logo.png" alt="Logo" className="w-20 relative mb-20 max-w-md" />

            {/* Brand Name (Right) */}
            <h1 className="text-4xl absolute mb-10 ml-20  mb-2 font-bold text-[#4a2c27] italic" style={{ fontFamily: "Brush Script MT" }}>Find My Space</h1>
          </div>

          <h2 className="text-4xl font-bold text-[#4a2c27] mt-4 mb-6 max-w-md">
            SIMPLIFYING ROOM RENTALS
          </h2>
          <h2 className="text-2xl font-normal text-[#4a2c27] mt-4 mb-6 max-w-md">
            List, browse, inspect, and rent securly-all in one place.
          </h2>
</div>

        {/* Right Section */}
        <div className="flex-2 mt-8 mr-15">
          <h2 className="text-2xl font-bold mb-6 flex items-center justify-left gap-10">
            Create an account
            <span className="text-lg font-bold underline">
              <Link to="/login" className="text-[#fffff]">Login instead</Link>
            </span>
          </h2>

          <form onSubmit={handleRegister}>
            <label className="font-bold">Username</label>
            <input
              type="text"
              required
              className="w-full p-2 mb-2 border-2 border-[#8d6d62] rounded-lg bg-[#d6b899] text-black text-lg"
              onChange={(e) => setUsername(e.target.value)}
            />

            <label className="font-bold">Number</label>
            <input
              type="text"
              required
              className="w-full p-2 mb-2 border-2 border-[#8d6d62] rounded-lg bg-[#d6b899] text-black text-lg"
              onChange={(e) => setPhone(e.target.value)}
            />

            <label className="font-bold">Email</label>
            <input
              type="email"
              required
              className="w-full p-2 mb-2 border-2 border-[#8d6d62] rounded-lg bg-[#d6b899] text-black text-lg"
              onChange={(e) => setEmail(e.target.value)}
            />

            <label className="font-bold">Password</label>
            <input
              type="password"              required
              className="w-full p-2 mb-2 border-2 border-[#8d6d62] rounded-lg bg-[#d6b899] text-black text-lg"
              onChange={(e) => setPassword(e.target.value)}
            />

            <div className="text-1xl text-[#8d6d62] font-semibold mb-4">What’s your role?</div>
            <div className="flex justify-center gap-8 mb-4">
              <label className="text-lg text-[#8d6d62]">
                <input
                  type="radio"  
                  value="tenant"
                  checked={role === "tenant"}
                  onChange={() => setRole("tenant")}
                  className="mr-2"
                />
                Tenant
              </label>
              <label className="text-lg text-[#8d6d62]">
                <input
                  type="radio"
                  value="landlord"
                  checked={role === "landlord"}
                  onChange={() => setRole("landlord")}
                  className="mr-2"
                />
                Landlord
              </label>
            </div>

            <p className="text-Md text-black mb-2">
              By signing up, you agree to our{" "}
              <Link to="/terms" className="text-Md text-[#e48f44] font-bold">
                Terms & Conditions
              </Link>
            </p>

            <button
              type="submit"
              className="w-full py-2 bg-[#e48f44] text-white text-xl rounded-lg cursor-pointer hover:bg-[#d67d3b] mb-1"
            >
              Create an account
            </button>
          </form>

          <p className="text-center text-lg my-2 text-gray-500">- OR -</p>
          <button className="w-full flex items-center justify-center py-2 bg-white border-2 border-[#d6b899] text-black text-lg rounded-lg shadow-md hover:bg-gray-100">
            <img src="/assets/google_logo.png" alt="Google" className="w-6 mr-2" />
            Sign in with Google
          </button>
        </div>
      </div>
    </div>
  );
}

export default Register;
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
    <div className="flex justify-center items-center min-h-screen bg-[#f2ece3]">
      <div className="flex w-full max-w-4xl bg-[#f2ece3] rounded-lg p-8">
        {/* Left Section */}
        <div className="flex-1 text-center p-8">
          <img src="/assets/logo.png" alt="Logo" className="w-32 mb-8" />
          <h2 className="text-3xl font-bold mb-4">Simplifying Room Rentals</h2>
          <p className="text-xl text-[#8d6d62] font-semibold mb-6">
            List, browse, inspect, and rent securely - all in one place.
          </p>
        </div>

        {/* Right Section */}
        <div className="flex-1 p-8">
          <h2 className="text-3xl font-bold mb-6 flex items-center justify-center gap-2">
            Create an account
            <span className="text-lg font-normal">
              <Link to="/login" className="text-[#e48f44]">Login instead</Link>
            </span>
          </h2>

          <form onSubmit={handleRegister}>
            <input
              type="text"
              placeholder="Full Name"
              required
              className="w-full p-4 mb-4 border-2 border-[#8d6d62] rounded-lg bg-[#d6b899] text-black text-lg"
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              type="text"
              placeholder="Phone Number"
              required
              className="w-full p-4 mb-4 border-2 border-[#8d6d62] rounded-lg bg-[#d6b899] text-black text-lg"
              onChange={(e) => setPhone(e.target.value)}
            />
            <input
              type="email"
              placeholder="Email"
              required
              className="w-full p-4 mb-4 border-2 border-[#8d6d62] rounded-lg bg-[#d6b899] text-black text-lg"
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              required
              className="w-full p-4 mb-4 border-2 border-[#8d6d62] rounded-lg bg-[#d6b899] text-black text-lg"
              onChange={(e) => setPassword(e.target.value)}
            />

            <div className="text-xl text-[#8d6d62] font-semibold mb-4">What’s your role?</div>
            <div className="flex justify-center gap-10 mb-6">
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

            <p className="text-lg text-black mb-4">
              By signing up, you agree to our{" "}
              <Link to="/terms" className="text-[#e48f44] font-bold">
                Terms & Conditions
              </Link>
            </p>

            <button
              type="submit"
              className="w-full py-4 bg-[#e48f44] text-white text-xl rounded-lg cursor-pointer hover:bg-[#d67d3b] mb-6"
            >
              Create an account
            </button>
          </form>

          <p className="text-center text-lg my-4 text-gray-500">- OR -</p>
          <button
            className="w-full py-4 bg-white border-2 border-[#d6b899] text-black text-lg rounded-lg flex justify-center items-center"
            // onClick={signInWithGoogle}
          >
            <img src="/assets/google-logo.png" alt="Google" className="w-6 mr-2" />
            Continue with Google
          </button>
        </div>
      </div>
    </div>
  );
}

export default Register;
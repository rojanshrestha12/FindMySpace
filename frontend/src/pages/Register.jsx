import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerWithEmail, handleGoogleSignIn } from "../auth/auth"; // Import updated auth functions

function Register() {
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Handle user registration
  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    const response = await registerWithEmail(username, phone, email, password);
    if (response.success) {
      navigate("/dashboard");
    } else {
      alert(response.message);
    }

    setLoading(false);
  };

  // Handle Google Sign-In
  const handleGoogleLogin = async () => {
    const response = await handleGoogleSignIn();
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
        <div className="flex-2 p-8">
        <img src="/assets/logo.png" alt="Logo" className="w-40 absolute top-10" />
          <h2 className="text-6xl  mb-4">SIMPLIFYING ROOM RENTALS</h2>
          <p className="text-lg font-bold mb-6 mr-40 text-[#8d6d62]">
          A digital platform connecting landlords and tenants for easy rentals. Owners list properties with details like price, location, and amenities. Renters can search, filter, and book visits online. The system includes rental agreements and payment tracking for transparency. Admins manage listings for hassle-free property management.
          </p>
        </div>

        {/* Right Section */}
        <div className="flex-1 p-8">
          <h2 className="text-2xl mb-6 flex items-center gap-30">
            Create an account
            <span className="text-sm font-normal">
              <Link to="/login" className="text-[#1E4AE9]">Login instead</Link>
            </span>
          </h2>

          <form onSubmit={handleRegister}>
            <label>Username</label>
            <input
              type="text"
              required
              className="w-full p-2 mb-2 border-2 border-[#8d6d62] rounded-lg bg-[#d6b899] text-black text-lg"
              onChange={(e) => setUsername(e.target.value)}
            />

            <label>Number</label>
            <input
              type="text"
              required
              className="w-full p-2 mb-2 border-2 border-[#8d6d62] rounded-lg bg-[#d6b899] text-black text-lg"
              onChange={(e) => setPhone(e.target.value)}
            />

            <label>Email</label>
            <input
              type="email"
              required
              className="w-full p-2 mb-2 border-2 border-[#8d6d62] rounded-lg bg-[#d6b899] text-black text-lg"
              onChange={(e) => setEmail(e.target.value)}
            />

            <label>Password</label>
            <input
              type="password"
              required
              className="w-full p-2 mb-2 border-2 border-[#8d6d62] rounded-lg bg-[#d6b899] text-black text-lg"
              onChange={(e) => setPassword(e.target.value)}
            />

            {/* Submit Button */}
            <button 
              type="submit" 
              className="w-full py-2 bg-[#e48f44] text-black text-lg rounded-lg cursor-pointer hover:bg-[#d67d3b] mt-4 mb-4" 
              disabled={loading}
            >
              {loading ? "Creating account..." : "Create an account"}
            </button>
          </form>

          {/* OR Separator */}
          <div class="flex items-center w-full gap-3 mb-4">
            <div class="flex-grow h-[2px] bg-[#cfdfe2]"></div>
            <span class=" whitespace-nowrap">OR</span>
            <div class="flex-grow h-[2px] bg-[#cfdfe2]"></div>
          </div>

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

export default Register;

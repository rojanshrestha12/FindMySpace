import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerWithEmail, handleGoogleSignIn } from "../auth/auth"; // Import updated auth functions

function Register() {
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("tenant");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Handle user registration
  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    const response = await registerWithEmail(username, phone, email, password, role);
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
      <div className="flex flex-col md:flex-row items-center w-full max-w-4xl bg-white shadow-lg rounded-lg p-8 md:px-16 md:py-12">
        
        {/* Left Section */}
        <div className="flex-1 md:text-left px-8">
          <div className="flex items-center space-x-3 mb-6">
            <img src="/assets/logo.png" alt="Logo" className="w-16" />
            <h1 className="text-3xl font-bold text-[#4a2c27] italic" style={{ fontFamily: "Brush Script MT" }}>
              Find My Space
            </h1>
          </div>
          <h2 className="text-3xl font-bold text-[#4a2c27] mb-4">SIMPLIFYING ROOM RENTALS</h2>
          <p className="text-lg text-[#4a2c27] max-w-md">
            List, browse, inspect, and rent securely—all in one place.
          </p>
        </div>

        {/* Right Section (Form) */}
        <div className="flex-1 mt-8">
          <h2 className="text-2xl font-bold mb-4">Create an account</h2>
          
          <p className="text-md text-gray-600 mb-2">
            Already have an account? 
            <Link to="/login" className="text-[#e48f44] font-bold ml-2">Login here</Link>
          </p>

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block font-semibold">Username</label>
              <input 
                type="text" 
                required 
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#e48f44]"
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div>
              <label className="block font-semibold">Phone Number</label>
              <input 
                type="text" 
                required 
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#e48f44]"
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <div>
              <label className="block font-semibold">Email</label>
              <input 
                type="email" 
                required 
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#e48f44]"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="block font-semibold">Password</label>
              <input 
                type="password" 
                required 
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#e48f44]"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {/* Role Selection */}
            <div>
              <p className="text-lg font-semibold text-[#8d6d62]">What’s your role?</p>
              <div className="flex space-x-6">
                <label className="flex items-center text-lg text-[#8d6d62]">
                  <input 
                    type="radio" 
                    value="tenant" 
                    checked={role === "tenant"} 
                    onChange={() => setRole("tenant")}
                    className="mr-2"
                  />
                  Tenant
                </label>
                <label className="flex items-center text-lg text-[#8d6d62]">
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
            </div>

            {/* Terms & Conditions */}
            <p className="text-md text-gray-600">
              By signing up, you agree to our  
              <Link to="/terms" className="text-[#e48f44] font-bold ml-1">Terms & Conditions</Link>
            </p>

            {/* Submit Button */}
            <button 
              type="submit" 
              className="w-full py-2 bg-[#e48f44] text-white text-lg rounded-lg cursor-pointer hover:bg-[#d67d3b]"
              disabled={loading}
            >
              {loading ? "Creating account..." : "Create an account"}
            </button>
          </form>

          {/* OR Separator */}
          <div className="flex items-center justify-center my-4">
            <div className="border-b border-gray-300 w-1/3"></div>
            <p className="text-md text-gray-500 mx-2">OR</p>
            <div className="border-b border-gray-300 w-1/3"></div>
          </div>

          {/* Google Sign-In Button */}
          <button 
            onClick={handleGoogleLogin} 
            className="w-full flex items-center justify-center border border-gray-400 rounded-lg p-2 text-gray-700 hover:bg-gray-100">
            <img src="/assets/google_logo.png" alt="Google" className="w-6 mr-2" />
            Sign up with Google
          </button>
        </div>
      </div>
    </div>
  );
}

export default Register;

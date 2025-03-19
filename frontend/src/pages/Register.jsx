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
        <div className="flex-1 text-center p-8">
          <img src="/assets/logo.png" alt="Logo" className="w-32 mb-8" />
          <h2 className="text-3xl font-bold mb-4">Simplifying Room Rentals</h2>
          <p className="text-xl text-[#8d6d62] font-semibold mb-6">
            List, browse, inspect, and rent securely - all in one place.
          </p>
        </div>

        {/* Right Section */}
        <div className="flex-1 p-8">
          <h2 className="text-3xl font-bold mb-6 flex items-center justify-center gap-50">
            Create an account
            <span className="text-lg font-normal">
              <Link to="/login" className="text-[#8d6d62] underline">Login instead</Link>
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


            {/* Terms & Conditions */}
            <p className="text-md text-gray-600">
              By signing up, you agree to our  
              <Link to="/terms" className="text-[#8d6d62] font-bold ml-1">Terms & Conditions</Link>
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

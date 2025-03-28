import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerWithEmail, handleGoogleSignIn } from "../auth/auth";

function Register() {
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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

  const handleGoogleLogin = async () => {
    const response = await handleGoogleSignIn();
    if (response.success) {
      navigate("/dashboard");
    } else {
      alert(response.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f1ea] flex flex-col items-center justify-center p-4 sm:p-8">
      {/* Main Container */}
      <div className="w-full max-w-6xl bg-[#f8f1ea] flex flex-col lg:flex-row gap-8">
        {/* Left Section */}
        <div className="w-full lg:w-1/2 relative p-4 sm:p-8">
          {/* Logo */}
          <img
            src="/assets/logo.png"
            alt="Logo"
            className="w-24 sm:w-32 absolute top-0 left-0 mt-4 ml-4 sm:mt-6 sm:ml-6"
          />
          
          {/* Content */}
          <div className="mt-24 sm:mt-32">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">FIND MY SPACE</h1>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-normal mb-4 sm:mb-6 leading-tight">
              SIMPLIFYING ROOM RENTALS
            </h2>
            <p className="text-sm sm:text-base md:text-lg font-bold text-[#8d6d62]">
              A digital platform connecting landlords and tenants for easy rentals. Owners list properties with details like price, location, and amenities. Renters can search, filter, and book visits online. The system includes rental agreements and payment tracking for transparency. Admins manage listings for hassle-free property management.
            </p>
          </div>
        </div>

        {/* Right Section */}
        <div className="w-full lg:w-1/2 p-4 sm:p-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl mb-2 sm:mb-0">Create an account</h2>
            <Link to="/login" className="text-sm text-[#1E4AE9]">Login instead</Link>
          </div>

          {/* Form */}
          <form onSubmit={handleRegister} className="space-y-3 sm:space-y-4">
            <div>
              <label className="block mb-1 text-sm sm:text-base">Username</label>
              <input
                type="text"
                required
                className="w-full p-2 text-sm sm:text-base border-2 border-[#8d6d62] rounded-lg bg-[#d6b899]"
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div>
              <label className="block mb-1 text-sm sm:text-base">Number</label>
              <input
                type="text"
                required
                className="w-full p-2 text-sm sm:text-base border-2 border-[#8d6d62] rounded-lg bg-[#d6b899]"
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <div>
              <label className="block mb-1 text-sm sm:text-base">Email</label>
              <input
                type="email"
                required
                className="w-full p-2 text-sm sm:text-base border-2 border-[#8d6d62] rounded-lg bg-[#d6b899]"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="block mb-1 text-sm sm:text-base">Password</label>
              <input
                type="password"
                required
                className="w-full p-2 text-sm sm:text-base border-2 border-[#8d6d62] rounded-lg bg-[#d6b899]"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 text-sm sm:text-base bg-[#e48f44] rounded-lg hover:bg-[#d67d3b] mt-4 sm:mt-6"
              disabled={loading}
            >
              {loading ? "Creating account..." : "Create an account"}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center my-4 sm:my-6">
            <div className="flex-grow h-[1px] sm:h-[2px] bg-[#cfdfe2]"></div>
            <span className="px-2 sm:px-4 text-sm sm:text-base">OR</span>
            <div className="flex-grow h-[1px] sm:h-[2px] bg-[#cfdfe2]"></div>
          </div>

          {/* Google Button */}
          <button
            className="w-full flex items-center justify-center py-2 text-sm sm:text-base bg-white border-2 border-[#d6b899] rounded-lg shadow-md hover:bg-gray-100"
            onClick={handleGoogleLogin}
          >
            <img src="/assets/google_logo.png" alt="Google" className="w-4 sm:w-6 mr-2" />
            Sign in with Google
          </button>
        </div>
      </div>
    </div>
  );
}

export default Register;
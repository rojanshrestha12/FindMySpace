import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Register() {
  const [fullname, setfullname] = useState("");
  const [phone_number, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [showPasswordHint, setShowPasswordHint] = useState(false);
  const navigate = useNavigate();

  // Password checks
  const isLengthValid = password.length >= 8;
  const hasSpecialChar = /[^A-Za-z0-9]/.test(password);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(""); // Hide the error after 5 seconds
      }, 5000);
      
      return () => clearTimeout(timer); // Clean up the timer on component unmount
    }
  }, [error]);

  // Email check
  const validateEmail = (value) => {
    if (!value.includes("@") || !value.includes(".")) {
      setEmailError("Email must include '@' and '.'");
    } else {
      setEmailError("");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      setLoading(false);
      return;
    }

    if (!isLengthValid || !hasSpecialChar) {
      setError("Password must be at least 8 characters and contain a special character.");
      setLoading(false);
      return;
    }

    if (emailError) {
      setError("Please enter a valid email.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(`http://localhost:5000/api/auth/register`, {
        fullname,
        phone_number,
        email,
        password,
      });

      localStorage.setItem("token", response.data.token);
      alert("Account created successfully!");
      navigate("/login");
    } catch (error) {
      setError(error.response?.data?.message || error.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#f8f1ea] px-4">
      <div className="flex flex-col md:flex-row items-center w-full max-w-full bg-[#f8f1ea] rounded-lg p-8 md:px-20 md:pb-4">
        
        {/* Left Section */}
        <div className="hidden md:block flex-2 p-8">
          <img src="/assets/logo.png" alt="Logo" className="w-40 absolute top-10" />
          <h2 className="text-6xl mb-4">SIMPLIFYING ROOM RENTALS</h2>
          <p className="text-lg font-bold mb-6 mr-40 text-[#8d6d62]">
            A digital platform connecting landlords and tenants for easy rentals. Owners list properties with details like price, location, and amenities. Renters can search, filter, and book visits online. The system includes rental agreements and payment tracking for transparency. Admins manage listings for hassle-free property management.
          </p>
        </div>

        {/* Right Section */}
        <div className="flex-1 p-8">
          <h2 className="text-2xl mb-6">Create an account</h2>
          {error && (
            <div className="absolute bottom-4 right-4 bg-transparent bg-opacity-40 flex justify-center items-center z-50">
              <div className="bg-white rounded-lg shadow-lg p-4 max-w-sm w-full">
                <h2 className="text-lg font-semibold mb-3 text-red-600">Error</h2>
                <p className="mb-3 text-gray-800">Email is used or invalid</p>
                <div className="flex justify-end">
                </div>
              </div>
            </div>
          )}


          <form onSubmit={handleRegister}>
            <label>Full Name</label>
            <input
              type="text"
              required
              value={fullname}
              className="w-full p-2 mb-2 border-2 border-[#8d6d62] rounded-lg bg-[#d6b899] text-black text-lg"
              onChange={(e) => setfullname(e.target.value)}
            />

            <label>Number</label>
            <input
              type="text"
              required
              value={phone_number}
              className="w-full p-2 mb-2 border-2 border-[#8d6d62] rounded-lg bg-[#d6b899] text-black text-lg"
              onChange={(e) => setPhone(e.target.value)}
            />

            <label>Email</label>
            <input
              type="email"
              required
              value={email}
              className={`w-full p-2 mb-1 border-2 rounded-lg bg-[#d6b899] text-black text-lg ${emailError ? "border-red-500" : "border-[#8d6d62]"}`}
              onChange={(e) => {
                setEmail(e.target.value);
                validateEmail(e.target.value);
              }}
            />
            {emailError && <p className="text-red-600 text-sm mb-2">{emailError}</p>}

            <label>Password</label>
            <input
              type="password"
              required
              value={password}
              autoComplete="new-password"
              className="w-full p-2 mb-2 border-2 border-[#8d6d62] rounded-lg bg-[#d6b899] text-black text-lg"
              onFocus={() => setShowPasswordHint(true)}
              onBlur={() => setShowPasswordHint(false)}
              onChange={(e) => setPassword(e.target.value)}
            />

            <label>Confirm Password</label>
            <input
              type="password"
              required
              value={confirmPassword}
              autoComplete="new-password"
              className="w-full p-2 mb-2 border-2 border-[#8d6d62] rounded-lg bg-[#d6b899] text-black text-lg"
              onFocus={() => setShowPasswordHint(true)}
              onBlur={() => setShowPasswordHint(false)}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            {/* Password Hints */}
            {showPasswordHint && (
              <div className="text-sm text-[#5c4033] mb-4 space-y-1">
                <div className="flex items-center">
                  <span className="mr-2">{isLengthValid ? "✔️" : "❌"}</span>
                  Minimum 8 characters
                </div>
                <div className="flex items-center">
                  <span className="mr-2">{hasSpecialChar ? "✔️" : "❌"}</span>
                  At least one special character
                </div>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-2 bg-[#e48f44] text-black text-lg rounded-lg cursor-pointer hover:bg-[#d67d3b] mt-2"
              disabled={loading}
            >
              {loading ? "Creating account..." : "Create an account"}
            </button>
          </form>

          <div className="text-center w-full mt-4">
            <p className="text-sm font-normal">
              Already have an account?{" "}
              <Link to="/login" className="text-[#1E4AE9]">Login here</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;

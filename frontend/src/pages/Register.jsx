import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { toast } from "react-toastify";  // Import toast
import "react-toastify/dist/ReactToastify.css";  // Import toast styles

// Initialize toast container
// toast.configure();

function Register() {
  const [fullname, setfullname] = useState("");
  const [phone_number, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [showPasswordHint, setShowPasswordHint] = useState("");

  const navigate = useNavigate();

  const isLengthValid = password.length >= 8;
  const hasSpecialChar = /[^A-Za-z0-9]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasUpperCase = /[A-Z]/.test(password);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const validateEmail = (value) => {
    if (!value.includes("@") || !value.includes(".")) {
      setEmailError("Email must include '@' and '.'");
    } else {
      setEmailError("");
    }
  };

  const validatePhone = (value) => {
    if (!/^[9][0-9]{9}$/.test(value)) {
      setPhoneError("Start with 9 and must have 10 digits.");
    } else {
      setPhoneError("");
    }
  };

  const sendOtp = async (e) => {
    e.preventDefault();
    setError("");
    if (!isLengthValid || !hasSpecialChar || !hasNumber || !hasUpperCase) {
      setError("Password must be at least 8 characters and contain a special character.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }
    if (emailError) {
      setError("Please enter a valid email.");
      return;
    }
    if (phoneError) {
      setError("Please enter a valid phone number.");
      return;
    }

    try {
      setLoading(true);
      await axios.post("http://localhost:5000/api/auth/send-otp", {
        fullname,
        phone_number,
        email,
        password,
      });
      setOtpSent(true);
      toast.success("OTP sent to your email!");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send OTP");
      toast.error(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    if (!otp) {
      setError("Please enter the OTP sent to your email.");
      toast.error("Please enter the OTP sent to your email.");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post("http://localhost:5000/api/auth/register", {
        fullname,
        phone_number,
        email,
        password,
        notp: otp,
      });
      toast.success("Registration successful!");
      localStorage.setItem("token", res.data.token);

      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#f8f1ea] px-4">
      <div className="flex flex-col md:flex-row items-center w-full max-w-full bg-[#f8f1ea] rounded-lg p-8 md:px-20 md:pb-4">
        <div className="hidden md:block flex-2 p-8">
          <img src="/assets/logo.png" alt="Logo" className="w-40 absolute top-10" />
          <h2 className="text-6xl mb-4">SIMPLIFYING ROOM RENTALS</h2>
          <p className="text-lg font-bold mb-6 mr-40 text-[#8d6d62]">
            A digital platform connecting landlords and tenants for easy rentals. Owners list properties with details like price, location, and amenities. Renters can search, filter, and book visits online. The system includes rental agreements and payment tracking for transparency. Admins manage listings for hassle-free property management.
          </p>
        </div>

        <div className="flex-1 p-8">
          <h2 className="text-2xl mb-6 font-semibold">Create an account</h2>

          <form onSubmit={otpSent ? handleRegister : sendOtp}>
            <label>Full Name</label>
            <input
              type="text"
              required
              value={fullname}
              className="w-full p-2 mb-2 border-2 border-[#8d6d62] rounded-lg bg-white text-black text-lg"
              onChange={(e) => setfullname(e.target.value)}
            />

            <label>Phone Number</label>
            <input
              type="text"
              required
              value={phone_number}
              className={`w-full p-2 mb-2 border-2 rounded-lg bg-white text-black text-lg ${phoneError ? "border-red-500" : "border-[#8d6d62]"}`}
              onChange={(e) => {
                setPhone(e.target.value);
                validatePhone(e.target.value);
              }}
            />
            {phoneError && <p className="text-red-600 text-sm mb-2">{phoneError}</p>}

            <label>Email</label>
            <input
              type="email"
              required
              value={email}
              className={`w-full p-2 mb-1 border-2 rounded-lg bg-white text-black text-lg ${emailError ? "border-red-500" : "border-[#8d6d62]"}`}
              onChange={(e) => {
                setEmail(e.target.value);
                validateEmail(e.target.value);
              }}
            />
            {emailError && <p className="text-red-600 text-sm mb-2">{emailError}</p>}

            <label>Password</label>
            <div className="relative">
              <input
                type={passwordVisible ? "text" : "password"}
                required
                value={password}
                autoComplete="new-password"
                className="w-full p-2 mb-2 border-2 border-[#8d6d62] rounded-lg bg-white text-black text-lg"
                onFocus={() => setShowPasswordHint(true)}
                onBlur={() => setShowPasswordHint(false)}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute right-2 top-2 text-gray-500"
                onClick={() => setPasswordVisible(!passwordVisible)}
              >
                {passwordVisible ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>

            <label>Confirm Password</label>
            <div className="relative">
              <input
                type={confirmPasswordVisible ? "text" : "password"}
                required
                value={confirmPassword}
                autoComplete="new-password"
                className={`w-full p-2 mb-2 border-2 border-[#8d6d62] rounded-lg bg-white text-black text-lg ${password !== confirmPassword ? "border-red-500" : "border-[#8d6d62]"}`}
                onFocus={() => setShowPasswordHint(true)}
                onBlur={() => setShowPasswordHint(false)}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute right-2 top-2 text-gray-500"
                onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
              >
                {confirmPasswordVisible ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
            {password !== confirmPassword && <p className="text-red-600 text-sm mb-2">Passwords do not match</p>}

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
                <div className="flex items-center">
                  <span className="mr-2">{hasNumber ? "✔️" : "❌"}</span>
                  At least one number
                </div>
                <div className="flex items-center">
                  <span className="mr-2">{hasUpperCase ? "✔️" : "❌"}</span>
                  At least one uppercase letter
                </div>
              </div>
            )}

            {otpSent && (
              <>
                <label>OTP</label>
                <input
                  type="text"
                  required
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full p-2 mb-2 border-2 border-[#8d6d62] rounded-lg bg-white text-black text-lg"
                />
              </>
            )}

            <button
              type="submit"
              className="w-full py-2 bg-[#e48f44] text-black text-lg rounded-lg cursor-pointer hover:bg-[#d67d3b] mt-2"
              disabled={loading}
            >
              {loading ? "Processing..." : otpSent ? "Register" : "Send OTP"}
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

<<<<<<< HEAD
// import React, { useState } from "react";
// import { loginWithGoogle} from "../firebase";
// export default function App() {
//    const [email, setEmail] = useState("");
//    const [password, setPassword] = useState("");
//    const [token, setToken] = useState("");

//    const handleLoginWithGoogle = async () => {
//        const googleToken = await loginWithGoogle();
//        if (googleToken) {
//            console.log("Google Login Success", googleToken);
//            // Send the Firebase token to the backend
//            const response = await fetch("http://localhost:5000/api/login/google", {
//                method: "POST",
//                headers: {
//                    "Content-Type": "application/json",
//                    Authorization: `Bearer ${googleToken}`,
//                },
//            });
//            const data = await response.json();
//            setToken(data.token); // Store your application's JWT in the frontend state
//        }
//    };

//    const handleLoginWithEmail = async (e) => {
//        e.preventDefault();
//        fetch("http://localhost:5000/api/login/email", {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({ email, password }),
//         })
//         .then(res => res.json())
//         .then(data => {
//             console.log("Login Response:", data); // Debug log
//             if (data.token) {
//                 localStorage.setItem("token", data.token); // Store token
//                 // Redirect or update state
//             } else {
//                 console.error("Login failed:", data.error);
//             }
//         })
//         .catch(error => console.error("Error in login request:", error));

//        }
//    return (
//        <div>
//            <h1>Login</h1>
//            <button onClick={handleLoginWithGoogle}>Login with Google</button>

//            <form onSubmit={handleLoginWithEmail}>
//                <input
//                    type="email"
//                    value={email}
//                    onChange={(e) => setEmail(e.target.value)}
//                    placeholder="Email"
//                    required
//                />
//                <input
//                    type="password"
//                    value={password}
//                    onChange={(e) => setPassword(e.target.value)}
//                    placeholder="Password"
//                    required
//                />
//                <button type="submit">Login with Email</button>
//            </form>

//            {token && (
//                <div>
//                    <h2>Token</h2>
//                    <p>{token}</p>
//                </div>
//            )}
//        </div>
//    );
// }

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginWithGoogle } from "../firebase";

export default function Login() {
=======
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginWithEmail, loginWithGoogle } from "../auth/auth"; // Import authentication functions
import axios from "axios"; // Import axios for making API requests

function Login() {
>>>>>>> 7575c6bbe24f0412b22554f19831faf7083e5d6c
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

<<<<<<< HEAD
  const handleLoginWithGoogle = async () => {
    const googleToken = await loginWithGoogle();
    if (googleToken) {
      console.log("Google Login Success", googleToken);
      const response = await fetch("http://localhost:5000/api/login/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${googleToken}`,
        },
      });
      const data = await response.json();
      localStorage.setItem("token", data.token);
      navigate("/"); // Redirect after successful login
    }
  };

  const handleLoginWithEmail = async (e) => {
    e.preventDefault();
    setLoading(true);
    fetch("http://localhost:5000/api/login/email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Login Response:", data);
        if (data.token) {
          localStorage.setItem("token", data.token);
          navigate("/"); // Redirect after successful login
        } else {
          console.error("Login failed:", data.error);
        }
      })
      .catch((error) => console.error("Error in login request:", error))
      .finally(() => setLoading(false));
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#f8f1ea] px-4">
      <div className="flex flex-col md:flex-row items-center w-full max-w-full bg-[#f8f1ea] rounded-lg p-8 md:px-8 md:pb-4">
        {/* Left Section */}
        <div className="flex-3 md:text-left pl-20 pr-40">
          <img src="/assets/logo.png" alt="Logo" className="w-40 absolute top-10" />
          <h2 className="text-4xl font-bold mt-40 mb-6 max-w-md">SIMPLIFYING ROOM RENTALS</h2>
          <img src="/assets/illustration.jpg" className="w-150" />
        </div>

        {/* Right Section */}
        <div className="flex-2 mr-15">
          <h2 className="text-3xl mb-6">Welcome Back 👋</h2>
          <form onSubmit={handleLoginWithEmail}>
=======
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
      // Save user information to MySQL database
      try {
        await axios.post("http://localhost:3000/api/saveUser", {
          email: response.user.email,
          name: response.user.displayName,
          google_id: response.user.uid,
          // Add other user information as needed
        });
        navigate("/dashboard");
      } catch {
        alert("Failed to save user information.");
      }
    } else {
      alert(response.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#f8f1ea] px-4 sm:px-0"> {/* Added sm:px-0 */}
      <div className="flex flex-col md:flex-row items-center w-full max-w-full bg-[#f8f1ea] rounded-lg p-8 md:px-8 md:pb-4">
        {/* Left Section - Only changed padding/margins for mobile */}
        <div className="flex-3 md:text-left pl-4 md:pl-20 pr-4 md:pr-40"> {/* Responsive padding */}
          <div className="flex items-center justify-center md:justify-start space-x-3 mb-6"> {/* Centered logo on mobile */}
            <img src="/assets/logo.png" alt="Logo" className="w-32 md:w-40 absolute top-4 md:top-10" /> {/* Responsive size/position */}
          </div>
          <h2 className="text-2xl md:text-4xl font-bold mt-20 md:mt-40 mb-6 max-w-md"> {/* Responsive text size */}
            SIMPLIFYING ROOM RENTALS
          </h2>
          <img src="/assets/illustration.jpg" className="w-full max-w-xs md:max-w-full" /> {/* Responsive image */}
        </div>

        {/* Right Section - Only added mobile margin */}
        <div className="flex-2 mr-0 md:mr-15 mt-8 md:mt-0"> {/* Added mt-8 for mobile spacing */}
          <h2 className="text-2xl md:text-3xl mb-6 flex items-center justify-center md:justify-left"> {/* Centered on mobile */}
            Welcome Back 👋
          </h2>

          <form onSubmit={handleLogin}>
>>>>>>> 7575c6bbe24f0412b22554f19831faf7083e5d6c
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              required
              className="w-full p-2 mb-2 border-2 border-[#8d6d62] rounded-lg bg-[#d6b899] text-black text-lg"
              onChange={(e) => setEmail(e.target.value)}
            />

            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              required
              className="w-full p-2 mb-2 border-2 border-[#8d6d62] rounded-lg bg-[#d6b899] text-black text-lg"
              onChange={(e) => setPassword(e.target.value)}
            />

<<<<<<< HEAD
=======
            {/* Forgot Password */}
>>>>>>> 7575c6bbe24f0412b22554f19831faf7083e5d6c
            <p
              className="text-md text-[#1E4AE9] cursor-pointer text-right mt-4 mb-4"
              onClick={() => navigate("/forgotpassword")}
            >
              Forgot Password?
            </p>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 bg-[#e48f44] text-black text-xl rounded-lg ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#d67d3b]'}`}
            >
              {loading ? "Logging in..." : "Sign in"}
            </button>
          </form>

<<<<<<< HEAD
          <div className="flex items-center w-full gap-3 mt-4 mb-4">
            <div className="flex-grow h-[2px] bg-[#cfdfe2]"></div>
            <span className="whitespace-nowrap">OR</span>
            <div className="flex-grow h-[2px] bg-[#cfdfe2]"></div>
          </div>

          <button
            className="w-full flex items-center justify-center py-2 bg-white border-2 border-[#d6b899] text-black text-lg rounded-lg shadow-md hover:bg-gray-100"
            onClick={handleLoginWithGoogle}
=======
          <div class="flex items-center w-full gap-3 mt-4 mb-4">
            <div class="flex-grow h-[2px] bg-[#cfdfe2]"></div>
            <span class=" whitespace-nowrap">OR</span>
            <div class="flex-grow h-[2px] bg-[#cfdfe2]"></div>
          </div>

          {/* Google Sign-in Button */}
          <button
            className="w-full flex items-center justify-center py-2 bg-white border-2 border-[#d6b899] text-black text-lg rounded-lg shadow-md hover:bg-gray-100"
            onClick={handleGoogleLogin}
>>>>>>> 7575c6bbe24f0412b22554f19831faf7083e5d6c
          >
            <img src="/assets/google_logo.png" alt="Google" className="w-6 mr-2" />
            Sign in with Google
          </button>

<<<<<<< HEAD
          <p className="text-md text-black mb-2 mt-4 text-center">
            Don't have an account? {" "}
            <Link to="/register" className="text-md text-[#1E4AE9] font-normal">
=======
          <p className="text-Md text-black mb-2 mt-4 text-center">
            Don't you have an account?{" "}
            <Link to="/register" className="text-Md text-[#1E4AE9] font-normal">
>>>>>>> 7575c6bbe24f0412b22554f19831faf7083e5d6c
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
<<<<<<< HEAD
=======

export default Login;
>>>>>>> 7575c6bbe24f0412b22554f19831faf7083e5d6c

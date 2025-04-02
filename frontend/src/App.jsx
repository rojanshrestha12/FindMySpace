// import React, { useState } from "react";
// import { loginWithGoogle, loginWithEmail } from "./firebase";

// export default function App() {
//     const [files, setFiles] = useState([]);
//     const [form, setForm] = useState({
//         amenities: "",
//         type: "apartment",
//         price: "",
//         location: "",
//         description: "",
//     });

//     const [token] = useState("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsImlhdCI6MTc0MzQyODgxNywiZXhwIjoxNzQzNTE1MjE3fQ.yJUGkbzirHuMV0PFCKNNKZx05Koj2OpaUPjUylwvY1E");


//     const handleFileChange = (e) => {
//         setFiles(e.target.files);
//     };

//     const handleChange = (e) => {
//         setForm({ ...form, [e.target.name]: e.target.value });
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         const formData = new FormData();

//         // Convert amenities to JSON format
//         form.amenities = JSON.stringify(form.amenities.split(",").map(item => item.trim()));

//         Object.entries(form).forEach(([key, value]) => formData.append(key, value));
//         Array.from(files).forEach((file) => formData.append("images", file));

//         try {
//             const res = await fetch("http://localhost:5000/api/properties", {
//                 method: "POST",
//                 headers: {
//                     "Authorization": `Bearer ${token}`,
//                 },
//                 body: formData,
//             });
//             const data = await res.json();
//             console.log("Response:", data);
//         } catch (error) {
//             console.error("Error uploading:", error);
//         }
//     };

//     return (
//         <div>
//             <h2>Upload Property</h2>
//             <form onSubmit={handleSubmit}>
//                 <input
//                     type="text"
//                     name="location"
//                     placeholder="Location"
//                     onChange={handleChange}
//                 />
//                 <input
//                     type="text"
//                     name="price"
//                     placeholder="Price"
//                     onChange={handleChange}
//                 />
//                 <input
//                     type="text"
//                     name="description"
//                     placeholder="Description"
//                     onChange={handleChange}
//                 />
//                 <input
//                     type="text"
//                     name="amenities"
//                     placeholder="Amenities (comma separated)"
//                     onChange={handleChange}
//                 />
//                 <select name="type" onChange={handleChange}>
//                     <option value="apartment">Apartment</option>
//                     <option value="flat">Flat</option>
//                     <option value="room">Room</option>
//                     <option value="shutter">Shutter</option>
//                 </select>
//                 <input type="file" multiple onChange={handleFileChange} />
//                 <button type="submit">Upload</button>
//             </form>
//         </div>
//     );

// }

// // export default function App() {
// //    const [email, setEmail] = useState("");
// //    const [password, setPassword] = useState("");
// //    const [token, setToken] = useState("");

// //    const handleLoginWithGoogle = async () => {
// //        const googleToken = await loginWithGoogle();
// //        if (googleToken) {
// //            console.log("Google Login Success", googleToken);
// //            // Send the Firebase token to the backend
// //            const response = await fetch("http://localhost:5000/api/login/google", {
// //                method: "POST",
// //                headers: {
// //                    "Content-Type": "application/json",
// //                    Authorization: `Bearer ${googleToken}`,
// //                },
// //            });
// //            const data = await response.json();
// //            setToken(data.token); // Store your application's JWT in the frontend state
// //        }
// //    };

// //    const handleLoginWithEmail = async (e) => {
// //        e.preventDefault();
// //        const emailToken = await loginWithEmail(email, password);
// //        if (emailToken) {
// //            console.log("Email Login Success", emailToken);
// //            // Send the Firebase token to the backend
// //            const response = await fetch("http://localhost:5000/api/login/email", {
// //                method: "POST",
// //                headers: {
// //                    "Content-Type": "application/json",
// //                    Authorization: `Bearer ${emailToken}`,
// //                },
// //            });
          //         if(Response.ok){
          //  const data = await response.json();
          //  localStorage.setItem("token", data.token);
          //         }


// //            setToken(data.token); // Store your application's JWT
// //        }
// //    };

// //    return (
// //        <div>
// //            <h1>Login</h1>
// //            <button onClick={handleLoginWithGoogle}>Login with Google</button>

// //            <form onSubmit={handleLoginWithEmail}>
// //                <input
// //                    type="email"
// //                    value={email}
// //                    onChange={(e) => setEmail(e.target.value)}
// //                    placeholder="Email"
// //                    required
// //                />
// //                <input
// //                    type="password"
// //                    value={password}
// //                    onChange={(e) => setPassword(e.target.value)}
// //                    placeholder="Password"
// //                    required
// //                />
// //                <button type="submit">Login with Email</button>
// //            </form>

// //            {token && (
// //                <div>
// //                    <h2>Token</h2>
// //                    <p>{token}</p>
// //                </div>
// //            )}
// //        </div>
// //    );


import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import PropertyForm from "./pages/PropertyForm.jsx";
import Profile from "./pages/Profile.jsx";
import About from "./pages/About";
import ProfileEdit from "./pages/ProfileEdit";

// Protected Route Component
const ProtectedRoute = ({ element }) => {
  localStorage.getItem("token");
  const token = localStorage.getItem("token");
  return token ? element : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ProtectedRoute element={<Dashboard />} />} /> 
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route path="/resetpassword" element={<ResetPassword />} />
        <Route path="/PropertyForm" element={<PropertyForm/>} />
        <Route path="/profile" element={<Profile/>} />
        <Route path="/about" element={<About />} />
        <Route path="/ProfileEdit" element={<ProfileEdit />} />
      </Routes>
    </Router>
  );
}

export default App;
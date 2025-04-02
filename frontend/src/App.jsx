import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import PropertyListing from "./pages/Dashboard";
import { auth } from "./auth/firebase"; 
import PropertyForm from "./pages/PropertyForm.jsx";
import Profile from "./pages/Profile.jsx"
import About from "./pages/About";
import ProfileEdit from "./pages/ProfileEdit";
import PropertyDetail from "./pages/PropertyDetail";

// Protected Route Component
const ProtectedRoute = ({ element }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) return <p>Loading...</p>; // Prevents flicker while checking auth status

  return user ? element : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard />} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route path="/resetpassword" element={<ResetPassword />} />
        <Route path="/PropertyListing" element={<PropertyListing/>} />
        <Route path="/PropertyForm" element={<PropertyForm/>} />
        <Route path="/profile" element={<Profile/>} />
        <Route path="/about" element={<About />} />
        <Route path="/ProfileEdit" element={<ProfileEdit />} />
        <Route path="/PropertyDetail" element={<PropertyDetail/>}/>

      </Routes>
    </Router>
  );
}

export default App;
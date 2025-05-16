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
import PropertyDetail from "./pages/PropertyDetail.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import PropertyList from "./pages/PropertyList.jsx";
import UserList from "./pages/UserList.jsx";
import Notification from "./pages/Notifications.jsx";
import MyProperties from "./pages/MyProperties.jsx";
import Saved from "./pages/Saved.jsx";
import LandlordPayment from "./pages/landlordPayments.jsx";
import TermsAndPolicy from "./components/TermsAndpolicy.jsx";
import EditProperty from "./pages/EditProperty.jsx";

// ✅ General Protected Route for authenticated users
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" replace />;
};

// ✅ Admin-only Route
const AdminRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("isAdmin");
  return token && role === "true" ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Pages */}
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route path="/resetpassword" element={<ResetPassword />} />
        <Route path="/about" element={<About />} />
        <Route path="/terms" element={<TermsAndPolicy />} />
        <Route path="/property/:id" element={<PropertyDetail />} />

        {/* Protected Pages (requires login) */}
        <Route path="/PropertyForm" element={<ProtectedRoute><PropertyForm /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/ProfileEdit" element={<ProtectedRoute><ProfileEdit /></ProtectedRoute>} />
        {/* <Route path="/property/:id" element={<ProtectedRoute><PropertyDetail /></ProtectedRoute>} /> */}
        <Route path="/my_properties" element={<ProtectedRoute><MyProperties /></ProtectedRoute>} />
        <Route path="/notifications" element={<ProtectedRoute><Notification /></ProtectedRoute>} />
        <Route path="/saved" element={<ProtectedRoute><Saved /></ProtectedRoute>} />
        <Route path="/payments" element={<ProtectedRoute><LandlordPayment /></ProtectedRoute>} />
        <Route path="/edit-property/:id" element={<ProtectedRoute><EditProperty /></ProtectedRoute>} />

        {/* Admin Only Pages */}
        <Route path="/AdminDashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        <Route path="/PropertyList" element={<AdminRoute><PropertyList /></AdminRoute>} />
        <Route path="/UserList" element={<AdminRoute><UserList /></AdminRoute>} />

        {/* Optional Fallback Route */}
        {/* <Route path="*" element={<Navigate to="/" replace />} /> */}
      </Routes>
    </Router>
  );
}

export default App;

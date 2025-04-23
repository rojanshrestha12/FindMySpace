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
import PropertyDetail from "./pages/PropertyDetail.jsx"; // Import PropertyDetail
import AdminDashboard from "./pages/AdminDashboard.jsx";
import PropertyList from "./pages/PropertyList.jsx"; 
import UserList from "./pages/UserList.jsx";

// ✅ Protected Route Component
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <Router>
      <Routes>
        {/*  Public Route */}
        <Route path="/" element={<Dashboard />} />

        {/*  Auth Pages */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route path="/resetpassword" element={<ResetPassword />} />
        <Route path="/about" element={<About />} />

        {/*  Protected Pages */}
        <Route
          path="/PropertyForm"
          element={
            <ProtectedRoute>
              <PropertyForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ProfileEdit"
          element={
            <ProtectedRoute>
              <ProfileEdit />
            </ProtectedRoute>
          }
        />

        {/*  PropertyDetail Page - Add the dynamic route */}
        <Route path="/property/:id" element={<PropertyDetail />} /> {/* Dynamic route for PropertyDetail */}
        <Route
          path="/AdminDashboard"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/PropertyList"
          element={
            <ProtectedRoute>
              <PropertyList />
            </ProtectedRoute>
          }
        />

<Route
          path="/UserList"
          element={
            <ProtectedRoute>
              <UserList />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;

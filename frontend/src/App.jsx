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


// ✅ General Protected Route
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("isAdmin");
  if (role =="true" ){
    return token ? children : <Navigate to="/AdminDashboard" replace />;
  }else{
  return token ? children : <Navigate to="/login" replace />;

  }
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
        <Route path="/my_properties" element={<MyProperties />} />
        <Route path="/notifications" element={<Notification />} />
        <Route path="/saved" element={<Saved />} />

        {/* Protected Routes */}
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
        <Route
          path="/property/:id"
          element={
            <ProtectedRoute>
              <PropertyDetail />
            </ProtectedRoute>
          }
        />

        {/* Admin Only Routes */}
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

        {/* Fallback */}
        {/* <Route path="*" element={<Navigate to="/" replace />} /> */}
      </Routes>
    </Router>
  );
}

export default App;

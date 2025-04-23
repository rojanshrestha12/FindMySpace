import express from 'express'; // Import express framework
import { json } from 'body-parser'; // Import body-parser to handle JSON requests
import { loginWithGoogle, login, register } from './controllers/authController'; // Import authentication routes
import { createProperty, getAllProperties, getPropertyDetails } from './controllers/propertyController'; // Import property-related routes
import upload from './middlewares/uploadMiddleware'; // Import upload middleware for handling file uploads
import authenticate from './middlewares/authMiddleware'; // Import authentication middleware for protected routes
import { getUserDetails } from './controllers/userController'; // Import user details fetching route
import { forgotPassword, resetPassword } from './controllers/forgotPasswordController'; // Import forgot & reset password routes
import { handleDeleteUser } from './controllers/profileController'; // Import delete user route
import { updateProfile, updatePassword } from './controllers/profileController'; // Import update profile & password routes
import cors from "cors"; // Import CORS for cross-origin requests handling

const app = express(); // Initialize the Express app

// CORS middleware to allow cross-origin requests from the frontend (running on localhost:5173)
app.use(
    cors({
      origin: "http://localhost:5173", // Frontend allowed origin
      credentials: true, // Allow credentials (cookies, auth tokens)
    })
);

// Middleware to parse incoming JSON data in requests
app.use(express.json());

// Serve static images from the 'uploads' folder
app.use('/uploads', express.static('uploads')); // Allows images to be publicly accessible via '/uploads'

// Authentication routes
app.post('/api/auth/register', register); // Register new user
// app.post('/api/auth/login', login); // Uncomment if email login is needed
app.post('/api/login/google', loginWithGoogle); // Handle Google login
app.post('/api/login/email', login); // Handle Email login

// Property routes
app.post('/api/properties', authenticate, upload, createProperty); // Create new property (protected by authentication)
app.get('/api/properties', getAllProperties); // Get all properties
app.get('/api/properties/:propertyId/details', getPropertyDetails); // Get specific property details by ID

// User routes
app.get('/api/users/:userId', getUserDetails); // Fetch user details by userId

// Forgot password and reset password routes
app.post('/api/auth/forgotpassword', forgotPassword); // Forgot password request
app.post('/api/auth/resetpassword', resetPassword); // Reset password using token

// Profile update routes (authentication required)
app.post("/api/user/profile/update", authenticate, updateProfile); // Update user profile
app.post("/api/user/password/update", authenticate, updatePassword); // Update user password

// Delete user route (authentication required)
app.delete("/api/user/delete", authenticate, handleDeleteUser); // Delete user account

// Set the server to listen on the given port (default to 5000)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`); // Log the server status when it starts
});

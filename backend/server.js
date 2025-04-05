import express from 'express';
import { json } from 'body-parser';
import { loginWithGoogle, login, register } from './controllers/authController'
import { createProperty, getAllProperties, getPropertyDetails } from './controllers/propertyController';
import upload from './middlewares/uploadMiddleware';
import authenticate from './middlewares/authMiddleware';
import { getUserDetails } from './controllers/userController';
import { forgotPassword, resetPassword } from './controllers/forgotPasswordController';
import { handleDeleteUser } from './controllers/profileController';
import { updateProfile, updatePassword } from './controllers/profileController';
import cors from "cors";
const app = express();

app.use(
    cors({
      origin: "http://localhost:5173", // Allow requests from your frontend
      credentials: true, // Allow cookies & authentication
    })
  );
  
  app.use(express.json());
app.use('/uploads', express.static('uploads')); // Serve images statically

app.post('/api/auth/register', register);
// app.post('/api/auth/login', login);
app.post('/api/login/google', loginWithGoogle);  // Handle Google login
app.post('/api/login/email', login);   // Handle Email login

// Property Things:
app.post('/api/properties', authenticate, upload, createProperty);
app.get('/api/properties', getAllProperties);
app.get('/api/properties/:propertyId/details', getPropertyDetails);

// User Things: 
app.get('/api/users/:userId', getUserDetails);

//Forgot Password:
app.post('/api/auth/forgotpassword', forgotPassword)
app.post('/api/auth/resetpassword', resetPassword)

// Profile update route
app.post("/api/user/profile/update", authenticate, updateProfile);
app.post("/api/user/password/update", authenticate, updatePassword);

app.delete("/api/user/delete", authenticate, handleDeleteUser);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});


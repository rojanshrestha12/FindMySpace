import express from 'express';
import { json } from 'body-parser';
import { loginWithGoogle, login, register, requestOtp } from './controllers/authController.js'
import { createProperty, getAllProperties, getPropertyDetails, editProperty, deleteProperty } from './controllers/propertyController.js';
import upload from './middlewares/uploadMiddleware.js';
import authenticate from './middlewares/authMiddleware.js';
import { getUserDetails } from './controllers/userController.js';
import { forgotPassword, resetPassword } from './controllers/forgotPasswordController.js';
import { handleDeleteUser } from './controllers/profileController.js';
import { updateProfile, updatePassword } from './controllers/profileController.js';
import router from "./Services/notificationService.js"
import agreement from "./Services/agreementService.js"
import cors from "cors";
const app = express();

import adminRouter from './router/admin.js';
import Savedrouter from './controllers/SavedController.js'; // Import the save property routes
import agreementRouter from './controllers/agreement.js';
import paymentRouter from './controllers/payments.js';

app.use(
    cors({
      origin: "http://localhost:5173", // Allow requests from your frontend
      credentials: true, // Allow cookies & authentication
    })
  );
  
  app.use(express.json());
app.use('/uploads', express.static('uploads')); // Serve images statically

app.use("/api/admin",adminRouter);
app.use("/api/booking",router);
// app.use("/api/agreement",agreement);
app.use("/api", agreementRouter); // Use the agreement router for handling agreements
app.use("/api", Savedrouter);
app.use("/api/payments", paymentRouter); // Use the payment router for handling payments


app.post('/api/auth/register', register);
// app.post('/api/auth/login', login);
app.post('/api/login/google', loginWithGoogle);  // Handle Google login
app.post('/api/login/email', login);   // Handle Email login
app.post('/api/auth/send-otp', requestOtp); // Send OTP for email verification
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

app.delete('/api/propertyDelete/:propertyId', deleteProperty);
app.put('/api/propertyEdit/:propertyId', upload, editProperty);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
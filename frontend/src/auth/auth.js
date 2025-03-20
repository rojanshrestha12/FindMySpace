import axios from "axios";
import { auth, provider } from "./firebase";
import { signInWithPopup,  signOut } from "firebase/auth";

// API Base URL
const API_URL = "http://localhost:3000/api";

/**
 * Register user with email and password (API-based)
 */
export const registerWithEmail = async (username, phone, email, password) => {
  try {
    const response = await axios.post(`${API_URL}/signup`, {
      username,
      phone,
      email,
      password,
    });

    // Store token in local storage
    localStorage.setItem("token", response.data.token);
    return { success: true };
  } catch (error) {
    return { success: false, message: error.response?.data?.message || "Registration failed" };
  }
};

/**
 * Google Sign-In (Firebase)
 */
export const handleGoogleSignIn = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    console.log("Google Sign-in successful:", user);
    return { success: true, user };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

/**
 * Logout user (Firebase)
 */
export const logoutUser = async () => {
  try {
    await signOut(auth);
    localStorage.removeItem("token");
    return { success: true };
  } catch (error) {
    return { success: false, message: error.message };
  }
};


/**
 * Login user with email and password (API-based)
 */
export const loginWithEmail = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/login`, {
      email,
      password,
    });

    // Store token in local storage
    localStorage.setItem("token", response.data.token);
    return { success: true };
  } catch (error) {
    return { success: false, message: error.response?.data?.message || "Login failed" };
  }
};

// Change handleGoogleSignIn to loginWithGoogle
export const loginWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    console.log("Google Sign-in successful:", user);

    // Save user information to the database
    await axios.post(`${API_URL}/saveUser`, {
      email: user.email,
      name: user.displayName,
      google_id: user.uid,
    });

    return { success: true, user };
  } catch (error) {
    return { success: false, message: error.message };
  }
};
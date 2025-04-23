import bcrypt from 'bcryptjs';
import User from '../models/Users.js';
import { sign } from 'jsonwebtoken';
import admin from '../firebaseAdmin.js';

require('dotenv').config();

// Register a new user
async function register(req, res) {
    const { fullname, phone_number, email, password } = req.body;

    // Check if required fields are present
    if (!fullname || !email || !password) {
        return res.status(400).json({ error: 'Fullname, email, and password are required' });
    }

    try {
        // Check if user already exists with the same email
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(409).json({ error: 'Email already in use' });
        }

        // Hash the user's password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user in the database
        const newUser = await User.create({
            fullname,
            phone_number,
            email,
            password: hashedPassword,
        });

        // Respond with basic user info
        res.status(201).json({
            user: {
                fullname: newUser.fullname,
                phone_number: newUser.phone_number,
                email: newUser.email,
            },
        });
    } catch (err) {
        console.error('Error registering user:', err);
        res.status(500).json({ error: 'Failed to register user' });
    }
}

// User login with email and password
async function login(req, res) {
    const { email, password } = req.body;

    // Ensure email and password are provided
    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    try {
        // Find user by email
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }

        // Compare input password with stored hashed password
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }

        // Create JWT token
        const token = sign(
            { userId: user.user_id },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        // Respond with token
        res.status(200).json({
            message: 'Login successful',
            token,
        });
    } catch (err) {
        console.error('Error logging in:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
}

// Login using Google (Firebase token)
async function loginWithGoogle(req, res) {
    const firebaseToken = req.header('Authorization')?.replace('Bearer ', '');

    // Check for Firebase token
    if (!firebaseToken) {
        return res.status(400).json({ error: 'Firebase token is missing' });
    }

    try {
        // Verify token using Firebase Admin SDK
        const decodedToken = await admin.auth().verifyIdToken(firebaseToken);
        const firebaseUID = decodedToken.uid;

        // Find the user in your database using the email from Firebase
        const user = await User.findOne({ where: { email: decodedToken.email } });

        if (!user) {
            return res.status(404).json({ error: 'User not found in database' });
        }

        // Generate your own JWT using internal user ID
        const jwtToken = sign(
            { userId: user.user_id },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        // Send JWT back to client
        res.status(200).json({
            message: 'Login successful',
            token: jwtToken,
        });

    } catch (error) {
        console.error('Google login error:', error);
        res.status(400).json({ error: 'Google login failed' });
    }
}

// Export the authentication functions
export { loginWithGoogle, login, register };

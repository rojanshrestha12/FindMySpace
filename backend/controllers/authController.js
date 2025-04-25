import bcrypt from 'bcryptjs';
import User from '../models/Users.js';
import { sign } from 'jsonwebtoken';
import admin from '../firebaseAdmin.js';

import dotenv from 'dotenv';
dotenv.config();


async function register(req, res) {
    const { fullname, phone_number, email, password } = req.body;
    console.log(fullname,email,phone_number,email);
    

    if (!fullname || !email || !password) {
        return res.status(400).json({ error: 'Fullname, email, and password are required' });
    }

    try {
        // 🔹 Check if user with the same email already exists
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(409).json({ error: 'Email already in use' }); // 409 Conflict
        }

        // 🔹 Hash password and create user
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({
            fullname,
            phone_number,
            email,
            password: hashedPassword,
        });

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


async function login(req, res) {
    const { email, password } = req.body;

    if (!email || !password) {
        console.log("Email and password are required");
        return res.status(400).json({ error: 'Email and password are required' });
    }

    try {
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }
        let token;
        console.log(user)
        if (user.role==='admin'){
            console.log("claims as admin")
             token = sign(
                { userId: user.user_id, "role":"admin" },
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );
            console.log(user.role);
    }else{
        token = sign(
            { userId: user.user_id },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
    );}
        res.setHeader("Authorization",`Bearer ${token}`);
    
        if (user.role=='admin'){
        res.status(200).json({
          message: "Login successful",
          token: token,
          isAdmin: "Yes very much an admin",
        });
        }else{
        res.status(200).json({
          message: "Login successful",
          token: token,
          isAdmin: "Nah fuck u",
        });
        }
    } catch (err) {
        console.error('Error logging in:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
}


// Google Login handler
async function loginWithGoogle(req, res) {
    const firebaseToken = req.header('Authorization')?.replace('Bearer ', '');

    if (!firebaseToken) {
        return res.status(400).json({ error: 'Firebase token is missing' });
    }

    try {
        // Step 1: Verify the Firebase token and get the Firebase UID
        const decodedToken = await admin.auth().verifyIdToken(firebaseToken);
        const firebaseUID = decodedToken.uid;  // This is the Firebase UID

        // Step 2: Find the user in your database by Firebase UID or email
        const user = await User.findOne({ where: { email: decodedToken.email } });

        if (!user) {
            return res.status(404).json({ error: 'User not found in database' });
        }

        // Step 3: Generate a JWT for your system with your own userID from the database
        const jwtToken = sign(
            { userId: user.user_id },  // Here you use the userID from your database
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(200).json({
            message: 'Login successful',
            token: jwtToken,  // This is the JWT you can use in your app
        });

    } catch (error) {
        console.error('Google login error:', error);
        res.status(400).json({ error: 'Google login failed' });
    }
}


export { loginWithGoogle, login, register };

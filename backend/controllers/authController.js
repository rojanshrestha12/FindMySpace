import bcrypt from 'bcryptjs';
import User from '../models/Users.js';
import { sign } from 'jsonwebtoken';
import admin from '../firebaseAdmin.js';
import mbv  from "mailboxvalidator-nodejs";

import dotenv from 'dotenv';
dotenv.config();

const validateEmail = async (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
        return { valid: false, reason: "Please enter a valid email format." };
    }

    mbv.MailboxValidator_init(process.env.EMAIL_VALIDATOR_API_KEY);

    try {
        const data = await mbv.MailboxValidator_single_query(email);

        if (
            data.is_smtp === true &&
            data.is_verified === true &&
            data.is_domain === true &&
            data.is_disposable !== true &&
            data.is_high_risk !== true
        ) {
            return { valid: true, reason: "Email is valid." };
        }

        if (data.is_disposable === true) {
            return { valid: false, reason: "Disposable email addresses are not allowed." };
        }

        if (data.is_high_risk === true) {
            return { valid: false, reason: "This email address appears to be high risk." };
        }

        return { valid: false, reason: "Your email looks risky or unverifiable." };

    } catch (error) {
        return { valid: false, reason: "Could not verify email. Try again later." };
    }
};

async function register(req, res) {
    const { fullname, phone_number, email, password } = req.body;

    if (!fullname || !email || !password) {
        return res.status(400).json({
            error: "Fullname, email, and password are required.",
        });
    }

    // Validate email format and reputation
    const emailValidation = await validateEmail(email);
    if (!emailValidation.valid) {
        return res.status(400).json({
            error: emailValidation.reason,
        });
    }

    try {
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            alert("Email already registered.");
            return res.status(409).json({
                error: "This email is already registered.",
            });
        }

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
        console.error("Error registering user:", err);
        res.status(500).json({ error: "An unexpected error occurred during registration." });
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
        const decodedToken = await admin.auth().verifyIdToken(firebaseToken);
        const firebaseUID = decodedToken.uid;
        
        const userEmail = decodedToken.email;

        if (!userEmail) {
            return res.status(400).json({ error: 'Email missing in Firebase token' });
        }

        const user = await User.findOne({ where: { email: userEmail} });
        console.log(user);
        

        if (!user) {
            return res.status(404).json({ error: 'User not found in database' });
        }

        const jwtToken = sign(
            { userId: user.user_id },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );
        console.log("dsfadsf");
        
        console.log(jwtToken);

        return res.status(200).json({
            message: 'Login successful',
            token: jwtToken,
        });
        

    } catch (error) {
        console.error('Error during Google login:', error);
        return res.status(400).json({ error: 'Invalid Firebase token or user lookup failed' });
    }

  


    
}



export { loginWithGoogle, login, register };

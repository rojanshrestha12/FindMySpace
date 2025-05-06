import bcrypt from 'bcryptjs';
import User from '../models/Users.js';
import { sign } from 'jsonwebtoken';
import admin from '../firebaseAdmin.js';
import mbv from 'mailboxvalidator-nodejs';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

// Initialize MailboxValidator once
mbv.MailboxValidator_init(process.env.EMAIL_VALIDATOR_API_KEY);

// Setup email transporter
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// Email Validation
const validateEmail = async (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
        return { valid: false, reason: "Please enter a valid email format." };
    }

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

// Request OTP
async function requestOtp(req, res) {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ error: "Email is required" });
    }

    const emailValidation = await validateEmail(email);
    if (!emailValidation.valid) {
        return res.status(400).json({ error: emailValidation.reason });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
        return res.status(409).json({ error: "This email is already registered." });
    }

    if (!global.otpStore) global.otpStore = {};

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    global.otpStore[email] = {
        otp,
        expiresAt: Date.now() + 5 * 60 * 1000, // 5 minutes expiry
    };

    await transporter.sendMail({
        from: `"Support" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Email Validation OTP",
        text: `Your OTP for email validation is: ${otp}`,
    });

    return res.status(200).json({ message: "OTP sent to your email." });
}

// Register
async function register(req, res) {
    const { fullname, phone_number, email, password, notp } = req.body;

    if (!fullname || !email || !password) {
        return res.status(400).json({ error: "Fullname, email, and password are required." });
    }

    const emailValidation = await validateEmail(email);
    if (!emailValidation.valid) {
        return res.status(400).json({ error: emailValidation.reason });
    }

    try {
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(409).json({ error: "This email is already registered." });
        }

        if (!global.otpStore) global.otpStore = {};
        const otpEntry = global.otpStore[email];

        if (!otpEntry) {
            const otp = Math.floor(100000 + Math.random() * 900000).toString();
            global.otpStore[email] = {
                otp,
                expiresAt: Date.now() + 5 * 60 * 1000,
            };

            await transporter.sendMail({
                from: `"Support" <${process.env.EMAIL_USER}>`,
                to: email,
                subject: "Email Validation OTP",
                text: `Your OTP for email validation is: ${otp}`,
            });

            return res.status(202).json({ message: "OTP sent to email. Please verify it." });
        }

        if (Date.now() > otpEntry.expiresAt) {
            delete global.otpStore[email];
            return res.status(400).json({ error: "OTP has expired. Please request a new one." });
        }

        if (notp !== otpEntry.otp) {
            return res.status(400).json({ error: "Invalid OTP. Please try again." });
        }

        delete global.otpStore[email]; // OTP verified

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

// Login
async function login(req, res) {
    const { email, password } = req.body;

    if (!email || !password) {
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

        const isAdmin = user.role === 'admin';
        const token = sign(
            isAdmin
                ? { userId: user.user_id, role: 'admin' }
                : { userId: user.user_id },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(200).json({
            message: "Login successful",
            token,
            isAdmin: isAdmin.toString(),
        });
    } catch (err) {
        console.error('Error logging in:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
}

// Google Login
async function loginWithGoogle(req, res) {
    const firebaseToken = req.header('Authorization')?.replace('Bearer ', '');

    if (!firebaseToken) {
        return res.status(400).json({ error: 'Firebase token is missing' });
    }

    try {
        const decodedToken = await admin.auth().verifyIdToken(firebaseToken);
        const userEmail = decodedToken.email;

        if (!userEmail) {
            return res.status(400).json({ error: 'Email missing in Firebase token' });
        }

        const user = await User.findOne({ where: { email: userEmail } });

        if (!user) {
            return res.status(404).json({ error: 'User not found in database' });
        }

        const jwtToken = sign(
            { userId: user.user_id },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        return res.status(200).json({
            message: 'Login successful',
            token: jwtToken,
        });

    } catch (error) {
        console.error('Error during Google login:', error);
        return res.status(400).json({ error: 'Invalid Firebase token or user lookup failed' });
    }
}

export { requestOtp, register, login, loginWithGoogle };

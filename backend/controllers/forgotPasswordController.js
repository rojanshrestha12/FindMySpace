import nodemailer from 'nodemailer';
import { hash } from 'bcryptjs';
import User from '../models/Users.js';

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

export const forgotPassword = async (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "Email is required" });

    try {
        const user = await User.findOne({ where: { email } });
        if (!user) return res.status(404).json({ error: "User not found" });

        // Generate a 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Save OTP in database
        await user.update({ reset_token: otp });

        // Send OTP via email
        await transporter.sendMail({
            from: `"Support" <${process.env.EMAIL_USER}>`,
            to: user.email,
            subject: "Password Reset OTP",
            text: `Your OTP for password reset is: ${otp}`,
        });

        res.json({ message: "OTP sent to your email" });
    } catch (err) {
        console.error("Error in forgot password:", err);
        res.status(500).json({ error: "Something went wrong" });
    }
};

export const resetPassword = async (req, res) => {
    const {email, otp, newPassword } = req.body;
    if (!otp || !newPassword) {
        return res.status(400).json({ error: "OTP, and new password are required" });
    }

    try {
        const user = await User.findOne({ where: { email, reset_token: otp } });
        if (!user) return res.status(400).json({ error: "Invalid OTP or email" });

        const hashedPassword = await hash(newPassword, 10);

        await user.update({ password: hashedPassword, reset_token: null });

        res.json({ message: "Password reset successful" });
    } catch (err) {
        console.error("Error in resetting password:", err);
        res.status(500).json({ error: "Something went wrong" });
    }
};


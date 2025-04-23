import { DataTypes } from 'sequelize';
import sequelize from '../db/config';

// Define the User model
const User = sequelize.define('User', {
    // Primary key for each user, auto-incremented
    user_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },

    // Full name of the user, cannot be null
    fullname: {
        type: DataTypes.STRING,
        allowNull: false,
    },

    // Optional phone number for the user
    phone_number: {
        type: DataTypes.STRING,
        allowNull: true,
    },

    // Email must be unique and is required for each user
    email: {
        type: DataTypes.STRING,
        unique: true,   // Ensures email is unique in the database
        allowNull: false,
    },

    // Password hash, required field for user authentication
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },

    // Google ID for users who log in with Google
    google_id: {
        type: DataTypes.STRING,
        allowNull: true,
    },

    // Token for password reset, optional and can be null
    reset_token: {
        type: DataTypes.STRING,
        allowNull: true,
    },

    // User's location (e.g., city or region), optional
    location: {
        type: DataTypes.STRING,
        allowNull: true,
    },

    // Gender of the user, optional
    gender: {
        type: DataTypes.STRING,
        allowNull: true,
    },

    // User's birth date, stored as a DATEONLY format (YYYY-MM-DD)
    birth_date: {
        type: DataTypes.DATEONLY,  // Ensures proper date handling
        allowNull: true,
    },

    // A description or bio about the user, optional
    about_me: {
        type: DataTypes.TEXT,  // Allows for longer text descriptions
        allowNull: true,
    },
}, {
    timestamps: true,  // Automatically adds createdAt and updatedAt fields
});

export default User;

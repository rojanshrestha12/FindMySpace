import { DataTypes } from 'sequelize';
import sequelize from '../db/config.js';
import User from '../models/Users';

// Define the Property model
const Property = sequelize.define('Property', {
    // Primary key for each property
    property_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },

    // Foreign key to associate property with a user
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,       // References the User model
            key: 'user_id',    // Links to user_id column in User model
        },
        onDelete: 'CASCADE',   // Delete property if the associated user is deleted
    },

    // JSON field to store amenities like wifi, parking, AC, etc.
    amenities: {
        type: DataTypes.JSON,
        allowNull: true,
    },

    // Property type must be one of the specified values
    type: {
        type: DataTypes.ENUM('apartment', 'flat', 'room', 'shutter'),
        allowNull: false,
    },

    // Price of the property
    price: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },

    // Location of the property
    location: {
        type: DataTypes.STRING,
        allowNull: false,
    },

    // Optional description of the property
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },

    // JSON array to store image filenames, URLs, or paths
    images: {
        type: DataTypes.JSON,
        allowNull: true,
    },
}, {
    timestamps: true, // Adds createdAt and updatedAt fields automatically
});

export default Property;

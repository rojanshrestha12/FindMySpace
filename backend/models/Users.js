import { DataTypes } from 'sequelize';
import sequelize from '../db/config.js';

const User = sequelize.define('User', {
    user_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    fullname: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    phone_number: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    role: {
        type: DataTypes.ENUM('user', 'admin'),
        allowNull: false,
        defaultValue: 'user'
      },
    google_id: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    reset_token: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    location: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    gender: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    birth_date: {
        type: DataTypes.DATEONLY,  // Ensures proper date handling
        allowNull: true,
    },
    about_me: {
        type: DataTypes.TEXT,  // Longer descriptions allowed
        allowNull: true,
    },
    
    location: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    gender: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    birth_date: {
        type: DataTypes.DATEONLY,  // Ensures proper date handling
        allowNull: true,
    },
    about_me: {
        type: DataTypes.TEXT,  // Longer descriptions allowed
        allowNull: true,
    },
    
});



export default User;

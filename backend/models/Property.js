import { DataTypes } from 'sequelize';
import sequelize from '../db/config.js';
import User from '../models/Users';

const Property = sequelize.define('Property', {
    property_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'user_id',
        },
        onDelete: 'CASCADE',
    },
    amenities: {
        type: DataTypes.JSON,
        allowNull: true,
    },
    type: {
        type: DataTypes.ENUM('apartment', 'flat', 'room', 'shutter'),
        allowNull: false,
    },
    price: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    location: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    images: {
        type: DataTypes.JSON,
        allowNull: true,
    },
}, {
    timestamps: true,
});

export default Property;

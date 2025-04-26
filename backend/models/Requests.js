// models/Request.js

import { DataTypes } from 'sequelize';
import sequelize from '../db/config.js';
import User from './Users.js';   // Make sure it matches your model name
import Property from './Property.js';

const Request = sequelize.define('Request', {
  request_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  tenant_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'user_id',
    },
    onDelete: 'CASCADE',
  },
  landlord_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'user_id',
    },
    onDelete: 'CASCADE',
  },
  property_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Property,
      key: 'property_id',
    },
    onDelete: 'CASCADE',
  },
  status: {
    type: DataTypes.ENUM('PENDING', 'ACCEPTED', 'REJECTED'),
    allowNull: false,
    defaultValue: 'PENDING',
  },
}, {
  timestamps: true,    // To create createdAt and updatedAt automatically
  freezeTableName: true, // Optional: keeps table name singular (Request) instead of plural (Requests)
});

export default Request;

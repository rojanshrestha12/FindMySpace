// models/Request.js

import { DataTypes } from 'sequelize';
import sequelize from '../db/config.js';
import User from './Users.js';
import Property from './Property.js';
import Agreement from './Agreement.js';

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
  request_type: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isIn: [["visit", "rent"]],
    }
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  date_time: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  timestamps: true,
  freezeTableName: true,
});

// ✅ Define associations
Request.belongsTo(User, { as: 'tenant', foreignKey: 'tenant_id' });
Request.belongsTo(User, { as: 'landlord', foreignKey: 'landlord_id' });
Request.belongsTo(Property, { foreignKey: 'property_id' });

Agreement.belongsTo(Request, { foreignKey: 'request_id' });

Request.hasOne(Agreement, { foreignKey: 'request_id', as: 'agreement' });

export default Request;

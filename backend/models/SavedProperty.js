import { DataTypes } from 'sequelize';
import sequelize from '../db/config.js';

const SavedProperty = sequelize.define('SavedProperty', {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
  },
  propertyId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
  },
}, {
  timestamps: true, // Enables createdAt and updatedAt columns
  freezeTableName: true, // Prevents Sequelize from pluralizing table names
});

export default SavedProperty;
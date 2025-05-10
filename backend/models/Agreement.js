import { DataTypes } from 'sequelize';
import sequelize from '../db/config.js';
import Request from './Requests.js';

const Agreement = sequelize.define('agreement', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  movingDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  dueDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  permanentAddress: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  request_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Request,
      key: 'request_id',
    },
    onDelete: 'CASCADE',
  },
}, {
  timestamps: false,
  freezeTableName: true,
});

// ✅ Association
Agreement.belongsTo(Request, { foreignKey: 'request_id' });

export default Agreement;

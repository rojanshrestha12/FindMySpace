// models/PaymentHistory.js
import { DataTypes } from 'sequelize';
import sequelize from '../db/config.js';
import Agreement from './Agreement.js';

const PaymentHistory = sequelize.define('PaymentHistory', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  agreement_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Agreement,
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  payment_date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  amount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('PAID', 'PENDING'),
    defaultValue: 'PENDING',
    allowNull: false,
  },
  remarks: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  timestamps: true,
  freezeTableName: true,
});

PaymentHistory.belongsTo(Agreement, { foreignKey: 'agreement_id' });

export default PaymentHistory;

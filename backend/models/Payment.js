
import { DataTypes } from 'sequelize';
import sequelize from '../db/config.js'; // separate DB connection
import Request from './Requests.js'; // import the Request model

const Payment = sequelize.define('Payment', {
  payment_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  request_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  landlord_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  tenant_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  timestamps: true,
  freezeTableName: true,
});

Payment.belongsTo(Request, { foreignKey: 'request_id', as: 'request' });


export default Payment;

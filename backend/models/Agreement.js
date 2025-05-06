// models/Agreement.js
const { DataTypes } = require('sequelize');
const sequelize = require('../db/config.js'); // Adjust the path as necessary

const Agreement = sequelize.define('Agreement', {
    agreement_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
  moveInDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  duration: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  message: {
    type: DataTypes.TEXT,
  },
});

module.exports = Agreement;

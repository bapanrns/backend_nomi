const sequelize = require("../../database/connection");


const {  DataTypes, Model } = require('sequelize');

class Delivery_Boy extends Model {}

Delivery_Boy.init({
  // Model attributes are defined here
  name:{
    type: DataTypes.STRING(255),
    allowNull: false
  },father_name:{
    type: DataTypes.STRING(255),
    allowNull: false
  },sex:{
    type: DataTypes.STRING(10),
    allowNull: false
  },
  mobile_no:{
    type: DataTypes.STRING(12),
    allowNull: true
  },
  whatsappNumber:{
    type: DataTypes.STRING(12),
    allowNull: true
  },aadhar_number: {
    type: DataTypes.INTEGER,
    allowNull: true
  },pan_number: {
    type: DataTypes.STRING(12),
    allowNull: true
  },active_status:{
    type: DataTypes.STRING(12),
    defaultValue: 1
  }
}, {
  // Other model options go here
  sequelize, // We need to pass the connection instance
  modelName: 'Delivery_Boy' // We need to choose the model name
});

// the defined model is the class itself
console.log(Delivery_Boy === sequelize.models.Delivery_Boy);

module.exports = Delivery_Boy;
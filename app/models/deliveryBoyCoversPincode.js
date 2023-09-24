const sequelize = require("../../database/connection");


const {  DataTypes, Model } = require('sequelize');

class Delivery_Boy_Covers_Pincode extends Model {}

Delivery_Boy_Covers_Pincode.init({
  // Model attributes are defined here
  delivery_boy_id:{
    type: DataTypes.INTEGER,
    allowNull: false
  },pincode:{
    type: DataTypes.STRING(255),
    allowNull: false
  },status:{
    type: DataTypes.STRING(12),
    defaultValue: 1
  }
}, {
  // Other model options go here
  sequelize, // We need to pass the connection instance
  modelName: 'Delivery_Boy_Covers_Pincode' // We need to choose the model name
});

// the defined model is the class itself
console.log(Delivery_Boy_Covers_Pincode === sequelize.models.Delivery_Boy_Covers_Pincode);

module.exports = Delivery_Boy_Covers_Pincode;
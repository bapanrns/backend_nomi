const sequelize = require("../../database/connection");


const {  DataTypes, Model } = require('sequelize');

class Pincode extends Model {}

Pincode.init({
  // Model attributes are defined here
    code:{
        type: DataTypes.INTEGER,
        allowNull: false
    },
    active_status:{
        type: DataTypes.TINYINT,
        allowNull: false,
        defaultValue: 0
    }
}, {
  // Other model options go here
  sequelize, // We need to pass the connection instance
  modelName: 'Pincode' // We need to choose the model name
});

// the defined model is the class itself
console.log(Pincode === sequelize.models.Pincode);

module.exports = Pincode;
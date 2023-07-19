const sequelize = require("../../database/connection");


const {  DataTypes, Model } = require('sequelize');

class New_Pincode extends Model {}

New_Pincode.init({
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
  modelName: 'New_Pincode' // We need to choose the model name
});

// the defined model is the class itself
console.log(New_Pincode === sequelize.models.New_Pincode);

module.exports = New_Pincode;
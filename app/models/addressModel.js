const sequelize = require("../../database/connection");


const {  DataTypes, Model } = require('sequelize');

class Address extends Model {}

Address.init({
  // Model attributes are defined here
  user_id:{
        type: DataTypes.INTEGER,
        allowNull: false
    },
    name:{
        type: DataTypes.STRING,
        allowNull: false
    },
    mobile_no:{
        type: DataTypes.STRING(15),
        allowNull: false
    },
    alternative_mobile_no:{
        type: DataTypes.STRING(15),
        allowNull: true
    },
    pincode:{
        type: DataTypes.STRING(15),
        allowNull: true
    },
    landmark:{
        type: DataTypes.STRING,
        allowNull: true
    },
    city:{
       type: DataTypes.STRING,
       allowNull: true
    },
    address:{
       type: DataTypes.TEXT,
       allowNull: true
    },
    street:{
       type: DataTypes.STRING,
       allowNull: true
    },
    village:{
       type: DataTypes.STRING,
       allowNull: true
    }
}, {
  // Other model options go here
  sequelize, // We need to pass the connection instance
  modelName: 'Address' // We need to choose the model name
});

// the defined model is the class itself
console.log(Address === sequelize.models.Address);

module.exports = Address;
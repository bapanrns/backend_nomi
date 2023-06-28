const sequelize = require("../../database/connection");


const {  DataTypes, Model } = require('sequelize');

class Shop_Details extends Model {}

Shop_Details.init({
  // Model attributes are defined here
  shop_name:{
        type: DataTypes.TEXT,
        allowNull: false,
        unique: true
    },
    shop_phone_no:{
        type: DataTypes.INTEGER(15),
        allowNull: true
    },
    shop_whatsapp_no:{
        type: DataTypes.INTEGER(15),
        allowNull: true
    },
    calling_time:{
        type: DataTypes.TEXT,
        allowNull: true
    },
    address:{
        type: DataTypes.TEXT,
        allowNull: true
    },
    active_status:{
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    }
}, {
  // Other model options go here
  sequelize, // We need to pass the connection instance
  modelName: 'Shop_Details' // We need to choose the model name
});

// the defined model is the class itself
console.log(Shop_Details === sequelize.models.Shop_Details);

module.exports = Shop_Details; 
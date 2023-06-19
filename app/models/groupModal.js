const sequelize = require("../../database/connection");


const {  DataTypes, Model } = require('sequelize');

class Product_Group extends Model {}

Product_Group.init({
  // Model attributes are defined here
    Product_id:{
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
  // Other model options go here
  sequelize, // We need to pass the connection instance
  modelName: 'Product_Group' // We need to choose the model name
});

// the defined model is the class itself
console.log(Product_Group === sequelize.models.Product_Group);

module.exports = Product_Group;
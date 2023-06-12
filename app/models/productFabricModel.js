const sequelize = require("../../database/connection");


const {  DataTypes, Model } = require('sequelize');

class productFabric extends Model {}

productFabric.init({
  // Model attributes are defined here
  product_fabric_name:{
    type: DataTypes.STRING,
    allowNull: false
  },
  active_status:{
    type: DataTypes.TINYINT,
    allowNull: true,
    defaultValue: 0
  }
}, {
  // Other model options go here
  sequelize, // We need to pass the connection instance
  modelName: 'productFabric' // We need to choose the model name
});

// the defined model is the class itself
console.log(productFabric === sequelize.models.productFabric);

module.exports = productFabric;
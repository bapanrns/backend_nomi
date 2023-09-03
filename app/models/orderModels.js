const sequelize = require("../../database/connection");


const {  DataTypes, Model } = require('sequelize');

class Order extends Model {}

Order.init({
  // Model attributes are defined here
  customer_id:{
    type: DataTypes.INTEGER,
    allowNull: false
  },
  total_amount:{
    type: DataTypes.DECIMAL,
    allowNull: false
  },
  delivery_pincode:{
    type: DataTypes.STRING
  },
  delivery_address_id:{
    type: DataTypes.STRING
  }
}, {
  // Other model options go here
  sequelize, // We need to pass the connection instance
  modelName: 'Order' // We need to choose the model name
});

// the defined model is the class itself
console.log(Order === sequelize.models.Order);

module.exports = Order;
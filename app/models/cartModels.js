const sequelize = require("../../database/connection");


const {  DataTypes, Model } = require('sequelize');

class Cart extends Model {}

Cart.init({
  // Model attributes are defined here
  user_id:{
        type: DataTypes.INTEGER,
        allowNull: false
    },
    product_id:{
        type: DataTypes.INTEGER,
        allowNull: false
    },
    quantity:{
        type: DataTypes.INTEGER
    },
    size:{
        type: DataTypes.STRING
    }
}, {
  // Other model options go here
  sequelize, // We need to pass the connection instance
  modelName: 'Cart' // We need to choose the model name
});

// the defined model is the class itself
console.log(Cart === sequelize.models.Cart);

module.exports = Cart;
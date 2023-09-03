const sequelize = require("../../database/connection");


const {  DataTypes, Model } = require('sequelize');

class order_Item extends Model {}

order_Item.init({
  // Model attributes are defined here
  order_id:{
    type: DataTypes.INTEGER,
    allowNull: false
  },
  product_id:{
    type: DataTypes.DECIMAL,
    allowNull: false
  },
  quantity:{
    type: DataTypes.INTEGER
  },
  price:{
    type: DataTypes.DECIMAL
  },
  size:{
    type: DataTypes.STRING
  },order_status:{
    type: DataTypes.STRING(50),
    defaultValue: 'Pending'
  },return_available:{
    type: DataTypes.INTEGER(10),
    comment: 'return_available only for 1',
    defaultValue: 1
  },is_open_delivery:{
    type: DataTypes.INTEGER(10),
    comment: 'is_open_delivery only for 1',
  },delivery_date:{
    type: DataTypes.DATE
  },return_place_date:{
    type: DataTypes.DATE
  },delivery_boy_id:{
    type: DataTypes.INTEGER
  },return_delivery_boy_id:{
    type: DataTypes.INTEGER
  }
}, {
  // Other model options go here
  sequelize, // We need to pass the connection instance
  modelName: 'order_Item' // We need to choose the model name
});

// the defined model is the class itself
console.log(order_Item === sequelize.models.order_Item);

module.exports = order_Item;
const sequelize = require("../../database/connection");


const {  DataTypes, Model } = require('sequelize');

class userAccountDetails extends Model {}

userAccountDetails.init({
  // Model attributes are defined here
  user_id:{
    type: DataTypes.INTEGER,
    allowNull: false
  },
  order_item_id:{
    type: DataTypes.INTEGER,
    allowNull: false
  },
  reason_for_cancellation:{
    type: DataTypes.STRING,
    allowNull: false
  },
  bank_name:{
    type: DataTypes.STRING,
    allowNull: false
  },
  ifsc_code:{
    type: DataTypes.STRING,
    allowNull: false
  },
  account_number:{
    type: DataTypes.INTEGER,
    allowNull: false
  },
  payment_status:{
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "Pending"
  }
}, {
  // Other model options go here
  sequelize, // We need to pass the connection instance
  modelName: 'userAccountDetails' // We need to choose the model name
});

// the defined model is the class itself
console.log(userAccountDetails === sequelize.models.userAccountDetails);

module.exports = userAccountDetails;
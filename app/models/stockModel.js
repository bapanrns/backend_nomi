const sequelize = require("../../database/connection");


const {  DataTypes, Model } = require('sequelize');

class Stock extends Model {
  /*static associate(models) {
    // Define the association with the User model
    Stock.belongsTo(models.Product, {
      foreignKey: 'product_id' // Foreign key field in the Post model
    });
  }*/
}

Stock.init({
  // Model attributes are defined here
  product_id:{
    type: DataTypes.STRING,
    allowNull: false
  },
  no_of_product:{
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0
  },
  size:{
    type: DataTypes.STRING(15),
    allowNull: true
  },
  buy_price:{
    type: DataTypes.FLOAT,
    allowNull: false
  },
  sell_price: {
    type: DataTypes.FLOAT,
    allowNull: false
  }, 
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "Pending"
  },
  bill_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  mrp_price: {
    type: DataTypes.FLOAT,
    allowNull: false,
  }

}, {
  // Other model options go here
  sequelize, // We need to pass the connection instance
  modelName: 'Stock' // We need to choose the model name
});

// the defined model is the class itself
console.log(Stock === sequelize.models.Stock);

module.exports = Stock;
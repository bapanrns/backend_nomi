const sequelize = require("../../database/connection");


const {  DataTypes, Model } = require('sequelize');

class Product_Image extends Model {}

Product_Image.init({
  // Model attributes are defined here
  product_id:{
        type: DataTypes.INTEGER,
        allowNull: false
    },
    image_name:{
        type: DataTypes.TEXT,
        allowNull: true
    },
    image_url:{
        type: DataTypes.TEXT,
        allowNull: true
    }
}, {
  // Other model options go here
  sequelize, // We need to pass the connection instance
  modelName: 'Product_Image' // We need to choose the model name
});

// the defined model is the class itself
console.log(Product_Image === sequelize.models.Product_Image);

module.exports = Product_Image;
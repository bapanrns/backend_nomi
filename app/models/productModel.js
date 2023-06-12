const sequelize = require("../../database/connection");


const {  DataTypes, Model } = require('sequelize');

class Product extends Model {}

Product.init({
  // Model attributes are defined here
  category_id :{
        type: DataTypes.INTEGER,
        allowNull: false
    },
    sub_category_id :{
          type: DataTypes.INTEGER,
          allowNull: false
    },
    product_name:{
        type: DataTypes.STRING,
        allowNull: true
    },
    active_status:{
        type: DataTypes.TINYINT,
        allowNull: false,
        defaultValue: 0
    },
    company_name:{
        type: DataTypes.STRING,
        allowNull: true
    },
    year_month:{
        type: DataTypes.STRING,
        allowNull: true
    },
    product_original_price:{
        type: DataTypes.FLOAT,
        allowNull: false
    },
    product_selling_price:{
       type: DataTypes.FLOAT,
       allowNull: false
    },
    product_offer_percentage:{
       type: DataTypes.INTEGER,
       allowNull: true
    },
    product_offer_price:{
       type: DataTypes.FLOAT,
       allowNull: true
    },
    delivery_charges:{
       type: DataTypes.FLOAT,
       allowNull: true
    },
    product_febric_id:{
        type: DataTypes.STRING,
        allowNull: true
    },
    product_febric:{
        type: DataTypes.STRING,
        allowNull: true
    },
    color:{
        type: DataTypes.STRING,
        allowNull: true
    },
    images:{
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
  // Other model options go here
  sequelize, // We need to pass the connection instance
  modelName: 'Product' // We need to choose the model name
});

// the defined model is the class itself
console.log(Product === sequelize.models.Product);

module.exports = Product;
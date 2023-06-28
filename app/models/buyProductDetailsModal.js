const sequelize = require("../../database/connection");


const {  DataTypes, Model } = require('sequelize');

class Buy_Product_Details extends Model {}

Buy_Product_Details.init({
  // Model attributes are defined here
  shop_id:{
        type: DataTypes.INTEGER,
        allowNull: false
    },
    buy_price:{
        type: DataTypes.FLOAT,
        allowNull: true
    },
    payment_amount:{
        type: DataTypes.FLOAT,
        allowNull: true
    },
    discount_amount:{
        type: DataTypes.FLOAT,
        allowNull: true
    },
    transport_amount:{
        type: DataTypes.FLOAT,
        allowNull: true
    },
    no_of_product:{
        type: DataTypes.INTEGER,
        allowNull: true
    },
    notes:{
        type: DataTypes.TEXT,
        allowNull: true
    },
    transition_type:{
        type: DataTypes.TEXT,
        allowNull: true
    },
    transition_date:{
        type: DataTypes.DATE,
        allowNull: true
    },
    bill:{
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
  modelName: 'Buy_Product_Details' // We need to choose the model name
});

// the defined model is the class itself
console.log(Buy_Product_Details === sequelize.models.Buy_Product_Details);

module.exports = Buy_Product_Details;
const sequelize = require("../../database/connection");


const {  DataTypes, Model } = require('sequelize');

class Category extends Model {}

Category.init({
  // Model attributes are defined here
  category_name:{
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
  modelName: 'Category' // We need to choose the model name
});

// the defined model is the class itself
console.log(Category === sequelize.models.Category);

module.exports = Category;
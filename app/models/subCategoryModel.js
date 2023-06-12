const sequelize = require("../../database/connection");


const {  DataTypes, Model } = require('sequelize');

class SubCategory extends Model {}

SubCategory.init({
  // Model attributes are defined here
  category_id:{
    type: DataTypes.INTEGER,
    allowNull: false
  },
  sub_category_name:{
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
  modelName: 'SubCategory' // We need to choose the model name
});

// the defined model is the class itself
console.log(SubCategory === sequelize.models.SubCategory);

module.exports = SubCategory;
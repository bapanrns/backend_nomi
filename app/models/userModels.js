const sequelize = require("../../database/connection");


const {  DataTypes, Model } = require('sequelize');

class User extends Model {}

User.init({
  // Model attributes are defined here
  name:{
        type: DataTypes.STRING,
        allowNull: false
    },
    email:{
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    phone:{
        type: DataTypes.STRING(15),
        allowNull: false,
        unique: true,
        validate: {
          is: /^\+?[1-9]\d{1,14}$/,
        },
    },
    whatsapp:{
        type: DataTypes.STRING(15),
        allowNull: false
    },
    password:{
        type: DataTypes.TEXT,
        allowNull: true
    },
    last_otp:{
        type: DataTypes.STRING,
        allowNull: true
    },
    user_type:{
       type: DataTypes.STRING,
       defaultValue: "user"
    },gender:{
        type: DataTypes.STRING(10),
        allowNull: true
    }
}, {
  // Other model options go here
  sequelize, // We need to pass the connection instance
  modelName: 'User' // We need to choose the model name
});

// the defined model is the class itself
console.log(User === sequelize.models.User);

module.exports = User;
const { Sequelize, DataTypes, Model } = require('sequelize');
//const mysql = require('mysql');
 
/*
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'more_buy'
})*/


const sequelize = new Sequelize('more_buy', 'root', '', {
    host: 'localhost',
    dialect: 'mysql'
  });

  try {
    sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }


module.exports = sequelize;
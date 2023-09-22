const { Sequelize, DataTypes, Model } = require('sequelize');

const logger = require("../app/loger/winstonlogger")
//const mysql = require('mysql');
 
/*
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'more_buy'
})*/
const color = require('colors-cli/safe');

const _select = color.blue;
const _update = color.yellow;
const _insert = color.green;
const _delete = color.red;
const _alter = color.magenta;

function customLogger ( queryString, queryObject ) {
    // console.log( queryString ) // outputs a string
    // console.log( queryObject) // outputs an array
    type = queryObject.type
    if (type == 'SELECT') {
    	logger.debug(_select(queryString))
    } else if (type == 'BULKUPDATE') {
    	logger.debug(_update(queryString)) 
    } else if (type == 'INSERT') {
      logger.debug(_insert(queryString))
    }
}
const sequelize = new Sequelize('nomimart_bapan', 'nomimart_bapan', 'MTbapan@1', {
//const sequelize = new Sequelize('nomimart_bapan', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',
    logQueryParameters: true,
    logging: customLogger
  });

  try {
    sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }


module.exports = sequelize;
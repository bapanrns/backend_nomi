const {db} = require('../../database/connection');

const UserModel = require("../models/userModels");
const addressModel = require("../models/addressModel");


async function handalAllUesr(req, res){
   let result = 
    await UserModel.findAll();
    res.status(200).json(result);
}

async function handalSaveAddress(req, res){
    const { name } = req.body;
    console.log(`Received name: ${name}`);
    console.log(req.body);
    let date_ob = new Date();
    let date = ("0" + date_ob.getDate()).slice(-2);
    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
    let year = date_ob.getFullYear();
    let hours = date_ob.getHours();
    let minutes = date_ob.getMinutes();
    let seconds = date_ob.getSeconds();
    let dateTime = year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds;


    const jane = await addressModel.create({ user_id: 1, name: req.body.name, mobile_no: req.body.phone_number, alternative_mobile_no: req.body.alternativeMobileNo, pincode: req.body.pincode, landmark: req.body.landmark, city: req.body.city });
    console.log(jane.toJSON());
 
/*

    const sql = "INSERT INTO address (user_id, name, mobile_no, alternative_mobile_no, pincode, landmark, city, created_at, updated_at) VALUES ?";
    const values = [
          [1, req.body.name, req.body.phone_number, req.body.alternativeMobileNo, req.body.pincode, req.body.landmark, req.body.cityTown, dateTime, dateTime]];
          db.query(sql, [values], function (err, result) {
          if (err) throw err;
          console.log("Number of records inserted: " + req.body);
          console.log("Number of records inserted: " + result.affectedRows);
         // console.log(req);
          });
  
    // Send a response back to the React app
    res.send(`Hello, ${name}!`);*/
}
 
module.exports = {
    handalSaveAddress, handalAllUesr
}
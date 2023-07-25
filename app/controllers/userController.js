const {db} = require('../../database/connection');
const { Sequelize } = require("sequelize");
const { Op } = require('sequelize');

const UserModel = require("../models/userModels");
const addressModel = require("../models/addressModel");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


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

async function saveUserRecord(req, res){
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const newPass = await UserModel.create({
            name: req.body.firstName+" "+req.body.lastName,
            email: req.body.email_address,
            phone: req.body.mobile_no,
            whatsapp: req.body.whatsappNumber,
            password: hashedPassword,
            gender: req.body.gender
        });
        if(newPass.id > 0){
            return res.status(200).send({succ: 1, message: "Signup Successfully."});
        }
    } catch (error) {
        let errorMessage = "";
        if (error instanceof Sequelize.UniqueConstraintError) {
            // Handle unique constraint violation (duplicate phone number)
            console.error('Error: Phone number already exists:', req.body.mobile_no);
            errorMessage = "Error: Phone number already exists: "+req.body.mobile_no;
        } else {
            // Handle other errors
            console.error('Error creating user:', error);
            errorMessage = "Error creating user";
        }
        return res.status(200).send({succ: 0, message: errorMessage});
    }
}

async function loginUser(req, res){
    console.log(req.body);
    const userName = req.body.email_address;
    const password = req.body.password;
    if(userName !="" && password !=""){
        let whereCluse = {};
        whereCluse[Op.or] = [
            {email: userName},
            {phone: userName}
        ];

        const userObj = await UserModel.findOne({
            where: whereCluse
        })

        if (!userObj) {
            return res.status(404).json({ message: 'User not found' });
        }

        const passwordMatch = await bcrypt.compare(password, userObj.password);

        if (!passwordMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: userObj.id }, tGlobalSecretKey, { expiresIn: '1h' });
        let userType = userObj.user_type;
        if(userObj.user_type == "adMin"){
            userType = "Admin"
        }
        const userInfo = {
            user_id: userObj.id,
            name: userObj.name,
            email: userObj.email,
            phone: userObj.phone,
            whatsapp: userObj.whatsapp,
            gender: userObj.gender,
            user_type: userType,
            token: token
        }
        res.json(userInfo);
    }
   // return res.status(200).send({succ: 0, message: userObj});
}
 
module.exports = {
    handalSaveAddress, handalAllUesr, saveUserRecord, loginUser
}
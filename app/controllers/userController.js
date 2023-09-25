const {db} = require('../../database/connection');
const { Sequelize } = require("sequelize");
const { Op } = require('sequelize');

const UserModel = require("../models/userModels");
const addressModel = require("../models/addressModel");
const cartModel = require("../models/cartModels");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


//const { transporter } = require('../mailers/user_mailer');
const { transporter } = require('../mailers/user_mailer');

async function handalAllUesr(req, res){
   let result = 
    await UserModel.findAll();
    res.status(200).json(result);
}

async function handalSaveAddress(req, res){
    const { name } = req.body;
    console.log(`Received name: ${name}`);
    const token = req.headers.authorization;
    const decodedToken = jwt.verify(token, tGlobalSecretKey);

    const user_id = decodedToken.id;
    let saveHash = { 
        user_id: user_id, 
        name: req.body.name, 
        mobile_no: req.body.mobile_no, 
        alternative_mobile_no: req.body.alternative_mobile_no, 
        pincode: req.body.pincode, 
        landmark: req.body.landmark, 
        city: req.body.city,
        village: req.body.village  
    }
    let address = null;
    let returnHash = {success: 0}
    if(["721648", "721636"].includes(saveHash.pincode)){
        if(req.body.id > 0){
            address = await addressModel.update(saveHash, {
                where: {
                    id: req.body.id
                }
            });
            if(address > 0){
                returnHash['success']=1;
            }
        }else{
            address = await addressModel.create(saveHash);
            if(address.id > 0){
                returnHash['success']=1;
            }
        }
    }
    return res.status(200).send(returnHash);
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

            var mailOptions = {
                from: 'bapan.rns@gmail.com',
                to: `roymrinmoy2000@gmail.com`,
                // to: 'roymrinmoy2000@gmail.com',
                subject: 'Welcome to our system',
                html: '<p>Hi </p><p>You are successfully registered in our system.</p>'
              };
      
              transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                  console.log(error);
                } else {
                  console.log('Email sent: ' + info.response);
                }
              });



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

        product_ids = await getCartDetails(userObj.id);

        const userInfo = {
            user_id: userObj.id,
            name: userObj.name,
            email: userObj.email,
            phone: userObj.phone,
            whatsapp: userObj.whatsapp,
            gender: userObj.gender,
            user_type: userType,
            token: token,
            product_ids: product_ids
        }
        res.json(userInfo);
    }
   // return res.status(200).send({succ: 0, message: userObj});
}


async function getCartDetails(uid){
   let product_ids = [];
    const cartObj = await cartModel.findAll({
        where: {
            user_id: uid
        }
    }).then((obj) => {
        
        product_ids = obj.map((cart) => cart.product_id+"@"+cart.size);
    })
    
    return product_ids;
    
}

async function getAddress(req, res){
    const token = req.headers.authorization;
    const decodedToken = jwt.verify(token, tGlobalSecretKey);
    const user_id = decodedToken.id;
    let addressArray = [];
    const addressObj = await addressModel.findAll({
        where: {user_id: user_id},
    }).then((address) => {
        address.forEach((obj) => {
            let inner_hash = {}
            inner_hash["id"] = obj.id;
            inner_hash["name"] = obj.name;
            inner_hash["mobile_no"] = obj.mobile_no;
            inner_hash["alternative_mobile_no"] = obj.alternative_mobile_no;
            inner_hash["pincode"] = obj.pincode;
            inner_hash["landmark"] = obj.landmark;
            inner_hash["village"] = obj.village;
            addressArray.push(inner_hash);
        })
    });

    return res.status(200).send(addressArray);
}

async function getAddressById(req, res){
    let addressHash = {};
    const addressObj = await addressModel.findOne({
        where: {
            id: req.body.addressId
        }
    }).then((obj) => {
        addressHash["id"] = obj.id;
        addressHash["name"] = obj.name;
        addressHash["mobile_no"] = obj.mobile_no;
        addressHash["alternative_mobile_no"] = obj.alternative_mobile_no;
        addressHash["pincode"] = obj.pincode;
        addressHash["landmark"] = obj.landmark;
        addressHash["village"] = obj.village;
        addressHash["city"] = obj.city;
    })

    return res.status(200).send(addressHash);
}

async function deleteAddress(req, res){
    if(req.body.addressId !=""){
        const address = addressModel.destroy({
            where: {
                id: req.body.addressId
            }
        })
        console.log(address);
    }
    return res.status(200).send("Deleted successfully");
}

function generateOTP() {
    const otp = Math.floor(1000 + Math.random() * 9000); // Generate a 4-digit random number
    return otp.toString();
}

async function forgotPassword(req, res){
    let returnMessage = {messageStatus: 1, message: ""};
    let newOtp = "";
    await UserModel.findOne({
        where: { email: req.body.email },
    })
    .then(user => {
        if (user) {
            newOtp = generateOTP();
            user.last_otp = newOtp; // Update the firstName
            return user.save(); // Save the changes to the database
        } else {
            returnMessage["message"] = 'Email address not found';
            returnMessage["messageStatus"] = 1;
        }
    })
    .then(updatedUser => {
        if (updatedUser) {
            var mailOptions = {
                from: 'bapan.rns@gmail.com',
                to: req.body.email,
                subject: 'BsKart.com New OTP',
                html: `Your OTP code is: ${newOtp}`
            };
      
            transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                  console.log(error);
                } else {
                  console.log('Email sent: ' + info.response);
                }
            });

            returnMessage["message"] = 'An OTP has been sent to your email address successfully.';
            returnMessage["messageStatus"] = 0;
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
    return res.status(200).send(returnMessage);
}

async function setNewPassword(req, res){
    let returnMessage = {messageStatus: 0, message: ""};
    let newOtp = "";
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    await UserModel.findOne({
        where: { email: req.body.email },
    })
    .then(user => {
        if (user) {
            if(user.last_otp == req.body.otp && user.last_otp != null){
                user.password = hashedPassword; // Update the firstName
                user.last_otp = null;
                return user.save(); // Save the changes to the database
            }else{
                returnMessage["message"] = 'Incorrect OTP, please try again.';
                returnMessage["messageStatus"] = 1;
            }
        } else {
            returnMessage["message"] = 'Email address not found';
            returnMessage["messageStatus"] = 0;
        }
    })
    .then(updatedUser => {
        if (updatedUser) {
            var mailOptions = {
                from: 'bapan.rns@gmail.com',
                to: req.body.email,
                subject: 'BsKart.com Password Change',
                html: `Password changed successfully`
            };
      
            transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                  console.log(error);
                } else {
                  console.log('Email sent: ' + info.response);
                }
            });

            returnMessage["message"] = 'Password change successfully.';
            returnMessage["messageStatus"] = 0;
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
    return res.status(200).send(returnMessage);
}
 
module.exports = {
    handalSaveAddress, handalAllUesr, saveUserRecord, loginUser, getAddress, getAddressById, deleteAddress, forgotPassword, setNewPassword
}
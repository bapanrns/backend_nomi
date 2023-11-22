const {db} = require('../../database/connection');
const { Op } = require('sequelize');

const pincodeModel = require("../models/pincodeModel");
const newPincodeModel = require("../models/newPincodeModel");
const deliveryBoyModel = require("../models/deliveryBoyModel");
const Nodelogger = require("../loger/winstonlogger")
const OrderItemModels = require("../models/orderItemModels");
const Address = require("../models/addressModel");
const path = require('path');

async function checkDeliveryCode(req, res){
    Nodelogger.info("checkDeliveryCode: "+path.basename(__filename));
    Nodelogger.info(req.body);
    try {
        let returnMessage = "";
        if(req.body.deliveryCode !=""){
            const pincodeObj = await pincodeModel.findOne({
                where: {
                    code: req.body.deliveryCode,
                    active_status: 1
                }
            }).then(resultObj => {
                console.log(resultObj)
                if(resultObj){
                    returnMessage = "Valid code";
                }else{
                    returnMessage = "Not Valid code";
                    newPincodeModel.create({code: req.body.deliveryCode});
                }
            })
        }else{
            Nodelogger.warn("Accept only numbers with 6 digits.: "+path.basename(__filename));
            returnMessage = "Accept only numbers with 6 digits.";
        }
        return res.status(200).send(returnMessage);
    } catch (error) {
        Nodelogger.error("checkDeliveryCode: "+path.basename(__filename));
        Nodelogger.error(error);
        return res.status(200).send("Error");
    }
}

async function handalGetPinCode(req, res) {
    Nodelogger.info("handalGetPinCode: "+path.basename(__filename));
    Nodelogger.info(req.body);
    try {
        const groupedData = await pincodeModel.findAll({
            where: { active_status: 1 },
        });
        const pincode = groupedData.map(result => result['code']);
        return res.status(200).send({ pinCodes: pincode });
    } catch (error) {
        console.error('Error fetching pin codes:', error);
        Nodelogger.error("handalGetPinCode: "+path.basename(__filename));
        Nodelogger.error(error);
        return res.status(500).send({ error: 'Internal Server Error' });
    }
}

async function deliveryBoyDataSave(req, res) {
    Nodelogger.info("deliveryBoyDataSave: "+path.basename(__filename));
    Nodelogger.info(req.body);
    // Initialize variables to store messages and request data
    let returnMessage = "";
    let id = req.body.id;

    // Create an inner object to hold delivery boy data
    let inner_hash = {
        name: req.body.name,
        father_name: req.body.father_name,
        sex: "Male",
        mobile_no: req.body.mobile_no,
        whatsappNumber: req.body.whatsappNumber,
        aadhar_number: req.body.aadhar_number,
        pan_number: req.body.pan_number
    }

    try {
        // Attempt to create a new delivery boy object in the database
        const newObj = await deliveryBoyModel.create(inner_hash);

        if (newObj.id > 0) {
            returnMessage = 'Save successful';
        }
        
        // Respond with a success message and a flag indicating success
        return res.status(200).send({ successMessage: returnMessage, flag: true });
    } catch (error) {
        // Handle any errors that occur during the database operation
        console.error('Error while saving delivery boy data:', error);
        Nodelogger.error("deliveryBoyDataSave: "+path.basename(__filename));
        Nodelogger.error(error);
        // Respond with an error message and a flag indicating failure
        return res.status(500).send({ errorMessage: 'Failed to save data', flag: false });
    }
}

async function findAlldeliveryBoy(req, res){
    Nodelogger.info("findAlldeliveryBoy: "+path.basename(__filename));
    Nodelogger.info(req.body);
    try {
        let orderStatus = "";
        const results = await deliveryBoyModel.findAll();
    
        const orderArray = [];
  
          results.forEach((resultObj, key) => {
              console.log(resultObj);
              let innerHash = {};
              innerHash["id"] = resultObj.id;
              innerHash["name"] = resultObj.name;
              innerHash["mobile_no"] = resultObj.mobile_no;
              innerHash["whatsappNumber"] = resultObj.whatsappNumber;
              orderArray.push(innerHash);
          })
  
        
        return res.status(200).send(orderArray);
    } catch (error) {
        // Handle any errors here
        Nodelogger.error("findAlldeliveryBoy: "+path.basename(__filename));
        Nodelogger.error(error);
        return res.status(500).send('Error executing the query.');
    }
}

async function handalAssignDeliveryBoy(req, res){
    Nodelogger.info("handalAssignDeliveryBoy: "+path.basename(__filename));
    Nodelogger.info(req.body);
    try {
        const { DeliveryBoyId, orderMessage, id } = req.body;

       //console.log(req.body);
/*
        const OrderStatus =  req.body.OrderStatus;
        const orderMessage =  req.body.orderMessage;
        const id =  req.body.id;
*/
        //console.log(OrderStatus, orderMessage, id);
        

        // Validate input data
        if (DeliveryBoyId == "" ) {
            return res.status(200).json({ message: "Boy are missing.", status: false });
        }

        const updateData = {};

        if (DeliveryBoyId) {
            updateData.delivery_boy_id = DeliveryBoyId;
        }

        const updatedRows = await OrderItemModels.update(updateData, {
            where: { id }
        });

        

        if (updatedRows > 0) {
            return res.status(200).json({ message: "Update successful", status: true });
        } else {
            return res.status(200).json({ message: "No matching record found for the given id.", status: false });
        }
    } catch (error) {
        Nodelogger.error("handalAssignDeliveryBoy: "+path.basename(__filename));
        Nodelogger.error(error);
        return res.status(200).json({ message: "Internal server error", status: false });
    }
}

async function handalGetDeliveryAddress(req, res){
    Nodelogger.info("handalGetDeliveryAddress: "+path.basename(__filename));
    Nodelogger.info(req.body);
    try {
        let addressObj = await Address.findOne({
            where:{
                id: req.body.id
            }
        });
        return res.status(200).send(addressObj);
    }catch(error){
        Nodelogger.error("handalGetDeliveryAddress: "+path.basename(__filename));
        Nodelogger.error(error);
        return res.status(200).json({ message: "Internal server error", status: false });
    }
}


module.exports = {
    checkDeliveryCode, handalGetPinCode, deliveryBoyDataSave, findAlldeliveryBoy, handalAssignDeliveryBoy, handalGetDeliveryAddress
}
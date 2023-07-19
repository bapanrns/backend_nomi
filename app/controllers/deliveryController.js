const {db} = require('../../database/connection');
const { Op } = require('sequelize');

const pincodeModel = require("../models/pincodeModel");
const newPincodeModel = require("../models/newPincodeModel");

async function checkDeliveryCode(req, res){
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
        returnMessage = "Accept only numbers with 6 digits.";
    }
    console.log(returnMessage);
    return res.status(200).send(returnMessage);
}


module.exports = {
    checkDeliveryCode
}
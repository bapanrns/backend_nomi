const {db} = require('../../database/connection');
const { Op } = require('sequelize');

const ShopDetailsModal = require("../models/shopDetailsModal");
const buyProductDetailsModal = require("../models/buyProductDetailsModal");
const path = require('path');
const fs = require('fs');
const uploadMiddleware = require("../helper/uploadMiddleware");
const moment = require('moment');


async function SaveShopDetails(req, res){
    //const { name } = req.body;
   // console.log(`Received name: ${name}`);
   // console.log(req.body);
    let returnMessage = "";
    
    const shop_name = req.body.shop_name;
    const id = req.body.id;
    const inner_hash = {
        shop_name: shop_name,
        shop_phone_no: req.body.shop_phone_no,
        shop_whatsapp_no: req.body.shop_whatsapp_no,
        calling_time: req.body.calling_time,
        address: req.body.address
    }

    // For insert
    let whereCluse = { 
        where: { shop_name }
    }
    // For Update
    if(id !== ""){
        whereCluse = {
            where: { shop_name, id: { [Op.notIn]: [id] } }
        }
    }
    
    const existingUser = await ShopDetailsModal.findOne(whereCluse);
    if (existingUser) { 
        returnMessage = 'Shop name already exists';
    }else{

        if(req.body.id > 0){
            // Edit
            await ShopDetailsModal.update(inner_hash, {
                where: {
                    id: req.body.id
                }
            });
            returnMessage = "Update Successfully";
        }else{
            // Add
            const Shop = await ShopDetailsModal.create(inner_hash);
            returnMessage = "Save Successfully";
        }
    }

    return res.status(200).send(returnMessage);
}

async function AllShopDetails(req, res){
    const arrayOfHash = [];
    let whereCluse = {};
    const Shop = await ShopDetailsModal.findAll({
        where: whereCluse,
        include: [
            {
                model: buyProductDetailsModal,
                as: 'Buy_Product_Details'
            }
        ]
    }).then((products) => {
        products.forEach((shopObj) => {
            const inner_hash = {
                id: shopObj.id,
                shop_name: shopObj.shop_name,
                shop_phone_no: shopObj.shop_phone_no,
                shop_whatsapp_no: shopObj.shop_whatsapp_no,
                calling_time: shopObj.calling_time,
                address: shopObj.address
            }
            //console.log(shopObj.shop_name);
            let buyAmount = 0;
            let paymentAmount = 0;
            shopObj.Buy_Product_Details.forEach((buyProductObj) => {
                console.log(buyProductObj);
               // buyAmount.push(buyProductObj.buy_price);
                buyAmount +=buyProductObj.buy_price;
                paymentAmount += buyProductObj.payment_amount;
            });
            inner_hash["buy_price"] =  buyAmount;
            inner_hash["payment_amount"] =  paymentAmount;
            inner_hash["due"] =  paymentAmount - buyAmount;
            arrayOfHash.push(inner_hash);
        })
    });

    //console.log(Shop);
    return res.status(200).send(arrayOfHash);
}

async function AllShopDetailsList(req, res){
    const Shop = await ShopDetailsModal.findAll();

    //console.log(Shop);
    return res.status(200).send(Shop);
}

async function findShopDetailsByPK(req, res){
    const id = req.body.id;
    const Shop = await ShopDetailsModal.findByPk(id);
    return res.status(200).send(Shop);
}

async function deleteShopById(req, res){
    const id = req.body.id;
    await ProductFabricModel.update({ active_status: 0 }, {
        where: {
            id: req.body.id
        }
    });
    return res.status(200).send("Deleted Successfully");
}

// ---------------------------------------------------------------------------------------
// --------------------------- ------Buy Product Details ---------------------------------
// ---------------------------------------------------------------------------------------

async function saveBuyProduct(req, res){
    //const { name } = req.body;
   // console.log(`Received name: ${name}`);
   // console.log(req.body);
    let returnMessage = "";
    let OriginBill = "";
    const id = req.body.id;
    if(id !=""){
        const buyProductObj = await buyProductDetailsModal.findByPk(id);
        OriginBill = buyProductObj.dataValues.bill
    }

    let bill_name = OriginBill;
    let imagePath = "";
    let decodedImage = "";
    if(req.body.bill !=="" && OriginBill != req.body.bill){
        base64Image = req.body.bill;
        decodedImage = uploadMiddleware.decodeBase64Image(base64Image);
        imagePath = path.resolve('/Bapan/React/frontend_nomi/src/images/bill/'+decodedImage.name);
        bill_name = decodedImage.name;
    }
    const inner_hash = {
        shop_id: req.body.shop_id,
        buy_price: req.body.buy_price,
        payment_amount: req.body.payment_amount,
        discount_amount: req.body.discount_amount,
        transport_amount: req.body.transport_amount,
        no_of_product: req.body.no_of_product,
        notes: req.body.notes,
        transition_type: req.body.transition_type,
        transition_date: req.body.transition_date,
        bill: bill_name,
    }
    let shopId = "";
    if(req.body.id > 0){
        // Edit
        const shopObj = await buyProductDetailsModal.update(inner_hash, {
            where: {
                id: req.body.id
            }
        });
        shopId = shopObj[0];
        returnMessage = "Update Successfully";
    }else{
        // Add
        
        const shopObj = await buyProductDetailsModal.create(inner_hash);
        shopId = shopObj.dataValues.id
        returnMessage = "Save Successfully";
    }
    console.log(shopId);
    if(shopId > 0 && imagePath != "" && OriginBill != req.body.bill){
        // Transfer image
        fs.writeFileSync(imagePath, decodedImage.data);
        // Remove file
        if(OriginBill !=""){
            if(fileCheck("/Bapan/React/frontend_nomi/src/images/bill/"+OriginBill)){

                fs.access("/Bapan/React/frontend_nomi/src/images/bill/"+OriginBill, fs.constants.F_OK, (error) => {
                    if (error) {
                        console.error('File does not exist:', error);
                    } else {
                       // File Exist

                        fs.unlink("/Bapan/React/frontend_nomi/src/images/bill/"+OriginBill,function(err){
                            if(err) return console.log(err);
                            console.log('file deleted successfully');
                        })
                    }
                });

                
            }
        }
    }

    return res.status(200).send(returnMessage);
}

async function fileCheck(fileLink){
    fs.access(fileLink, fs.constants.F_OK, (error) => {
        if (error) {
            return false;
        } else {
            return true;
        }
    });
}

async function AllBuyProductDetails(req, res){
    let whereCluse = {}
    if(req.body.shop_id !=""){
        whereCluse['shop_id'] = req.body.shop_id;
    }

    if(req.body.transition_type !=""){
        whereCluse['transition_type'] = req.body.transition_type;
    }
    
    /*if(req.body.active_status !=""){
        whereCluse['active_status'] = req.body.active_status;
    }*/
   // console.log(whereCluse);
    const productArray = [];
    //SubCategoryModel.findAll({ include: [ CategoryModel ], order: [ [ CategoryModel, 'category_name' ] ] });
    await buyProductDetailsModal.findAll({
        where: whereCluse,
        include: [
            {
                model: ShopDetailsModal,
                as: 'Shop_Details'
            }
        ]
    })
    .then((products) => {
        
        products.forEach((product) => {
            let bill = "";
            if(product.dataValues.bill != ""){
                bill = product.dataValues.bill;
            }
            const inner_hash = {
                id: product.dataValues.id,
                shop_name: product.dataValues.Shop_Details.dataValues.shop_name,
                buy_price: product.dataValues.buy_price,
                discount_amount: product.dataValues.discount_amount,
                transport_amount: product.dataValues.transport_amount,
                no_of_product: product.dataValues.no_of_product,
                transition_type: product.dataValues.transition_type,
                transition_date: moment(product.dataValues.transition_date).format('YYYY-MM-DD'),
                bill: bill
            }
            productArray.push(inner_hash);
        });
        //productArray.push(inner_hash);
    })
    .catch((error) => {
          console.error('Error:', error);
    });
    return res.status(200).send(productArray);
}

async function findBuyProductByPK(req, res){
    const id = req.body.id;
    const buyProductObj = await buyProductDetailsModal.findByPk(id);
    //console.log(buyProductObj.dataValues);

    /*
    let bill = "";
    fs.access("/Bapan/React/frontend_nomi/src/images/bill/"+buyProductObj.dataValues.bill, fs.constants.F_OK, (error) => {
        if (error) {
            console.error('File does not exist:', error);
        } else {
            console.log('File exists.');
            bill = buyProductObj.dataValues.bill;
        }
    });*/
    
    const inner_hash = {
        id: buyProductObj.dataValues.id,
        shop_id: buyProductObj.dataValues.shop_id,
        buy_price: buyProductObj.dataValues.buy_price,
        payment_amount: buyProductObj.dataValues.payment_amount,
        discount_amount: buyProductObj.dataValues.discount_amount,
        transport_amount: buyProductObj.dataValues.transport_amount,
        no_of_product: buyProductObj.dataValues.no_of_product,
        notes: buyProductObj.dataValues.notes,
        transition_type: buyProductObj.dataValues.transition_type,
        transition_date: moment(buyProductObj.dataValues.transition_date).format('yyyy-MM-DD'),
        bill: buyProductObj.dataValues.bill
    }
    return res.status(200).send(inner_hash);
}
 
module.exports = {
    SaveShopDetails, AllShopDetails, findShopDetailsByPK, deleteShopById, saveBuyProduct, AllBuyProductDetails, findBuyProductByPK, AllShopDetailsList
}
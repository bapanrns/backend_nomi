const {db} = require('../../database/connection');
const { Op } = require('sequelize');
const jwt = require('jsonwebtoken');

const ProductModel = require("../models/productModel");
const productImageModel = require("../models/productImageModel");
const quantityModel = require("../models/quantityModel");
const cartModel = require("../models/cartModels");
const orderController = require('./orderController');

async function getCartData(req, res){
    const token = req.headers.authorization;
    const decodedToken = jwt.verify(token, tGlobalSecretKey);

    let itemIds = JSON.parse(req.body.itemIds)
    //console.log(itemIds);
    try {
        let whereClase  = {
            /*id: {
                [Op.in]: itemIds,
            },*/
        }
        if(itemIds.length > 0){
            whereClase[Op.or]=[]
        }
        for(i=0; i<itemIds.length; i++){
            //console.log("================", itemIds[i]);
            let itemIdSize = itemIds[i].split("@");
            //console.log(itemIdSize);
            let innerHash = {
                product_id: itemIdSize[0],
                size: itemIdSize[1]
            }
            whereClase[Op.or].push(innerHash);
        }

        //console.log(whereClase);

        //let itemsListArray = [];
        let itemListHash = {};
        let totalPrice = []
        const groupedData = await ProductModel.findAll({
            where: {},
            include: [{
                model: productImageModel,
                as: "Product_Image",
                where: {}
            },{
                model: quantityModel,
                as: 'Quantity',
                where: whereClase
              },{
                model: cartModel,
                as: 'Cart',
                where: {
                   user_id: decodedToken.id
                }
              }],
            order: [
                ['updatedAt', 'DESC'],
                [{ model: productImageModel, as: 'Product_Image' }, 'primary', 'DESC']
            ]  
        }).then((products) => {
            products.forEach((product) => { 
                //console.log(product.category_id.toString() in itemListHash)
                if (product.id.toString() in itemListHash) {
                }else{
                    itemListHash[product.id] = {};
                }
                let inner_hash = {
                    item_id: product.id,
                    product_offer_percentage: product.product_offer_percentage,
                    product_name: product.product_name,
                    company_name: product.company_name
                }
                
                if(product.Product_Image !=undefined){
                    //console.log("product.Product_Image", product.Product_Image);
                    product.Product_Image.forEach((Product_Image, key) => {
                        //console.log("key", key);
                        if(key == 0 || Product_Image.primary == 1){
                            inner_hash['image_name'] = Product_Image.image_name
                            inner_hash['primary'] = Product_Image.primary
                        }
                    })
                }
    
                //console.log(inner_hash);
    
                if(product.Quantity !=undefined){
                   // console.log("product.Quantity", product.Quantity);
                    product.Quantity.forEach((quantity) => {
                        inner_hash['quantity'] = quantity.no_of_product
                        inner_hash['price'] = quantity.sell_price
                        
                        let offerPrice = 0;
                        let newPercentage = 0;
                        if(product.product_offer_percentage > 0){
                            offerPrice = quantity.sell_price * product.product_offer_percentage/100;
                            // Formula
                            /*
                            oldVal = 100
                            newVal = 120
                            percentage = ((oldVal - newVal)/oldVal)*100
                            */
                            newPercentage = Math.floor((((quantity.sell_price + offerPrice) - quantity.sell_price)/(quantity.sell_price + offerPrice))*100);
                        }
                        inner_hash['offerPrice'] = quantity.sell_price + offerPrice;
                        inner_hash['newPercentage'] = newPercentage;
                        inner_hash['size'] = quantity.size;
                        if(quantity.no_of_product > 0){
                            totalPrice.push(quantity.sell_price);
                        }
                    })
                }
                itemListHash[product.id] = inner_hash;
                //itemsListArray.push(inner_hash)
            });
        })

        console.log("========================================");
        let totalPriceCalObj = await totalPriceCal(totalPrice);
        /*let total_price = 0;
        let grossTotal = 0;
        if(totalPrice.length > 0){
            grossTotal = total_price = totalPrice.reduce((sum, num) => sum + num, 0);
        }
        let deliveryCharge = 0;
        if(total_price <= 399 && total_price > 0){
            deliveryCharge = 20;
            grossTotal += deliveryCharge;
        }*/
    
        return res.status(200).send({itemListHash: itemListHash, total_price: totalPriceCalObj['total_price'], deliveryCharge: totalPriceCalObj['deliveryCharge'], grossTotal: totalPriceCalObj['grossTotal']});
    } catch (error) {
        console.error('Error retrieving grouped data:', error);
        throw error;
    }
}


async function totalPriceCal(totalPrice){
    let total_price = 0;
    let grossTotal = 0;
    if(totalPrice.length > 0){
        grossTotal = total_price = totalPrice.reduce((sum, num) => sum + num, 0);
    }
    let deliveryCharge = 0;
    if(total_price <= 399 && total_price > 0){
        deliveryCharge = 20;
        grossTotal += deliveryCharge;
    }

    return {total_price: total_price, grossTotal: grossTotal, deliveryCharge: deliveryCharge}
}

async function saveCartData(req, res){
    const token = req.headers.authorization;
    const decodedToken = jwt.verify(token, tGlobalSecretKey);
    let returnMessage = "";
    let returnMessageError = "";
    let avaliableObj = await orderController.productAvailability(req.body.itemIds, req.body.itemSize);
    if (avaliableObj.length > 0) {
        const cartObj = await cartModel.create({ 
            user_id: decodedToken.id, 
            product_id: req.body.itemIds, 
            quantity: 1,
            size: req.body.itemSize
        });

        if(cartObj.id > 0){
            returnMessage = 'Item added to cart successfully';
        }
    }else{
        returnMessageError = 'Items are not available.';
    }
    return res.status(200).send({successMessage: returnMessage, errorMessage: returnMessageError});
}

async function removeCartData(req, res){
    try {
        const token = req.headers.authorization;
        const decodedToken = jwt.verify(token, tGlobalSecretKey);
        const deletedCart = await cartModel.destroy({
            where: { 
                user_id: decodedToken.id,
                product_id: req.body.itemIds
            },
        });
        console.log(deletedCart);
        return res.status(200).send({success: true});
    } catch (error) {
        console.error('Error deleting user:', error);
        return res.status(200).send({success: false});
    }

}

async function saveCartDataWhenLogin(req, res){
    //console.log("saveCartDataWhenLogin=========================", req.body.product_ids);
    try {
        const token = req.headers.authorization;
        const decodedToken = jwt.verify(token, tGlobalSecretKey);

        const user_id = decodedToken.id;
        const product_ids = req.body.product_ids;
        console.log("product_ids", product_ids);
        if(product_ids.length > 0){
            for (let i = 0; i < product_ids.length; i++) {
                let product_id_size = product_ids[i].split("@");
                console.log("product_id_size: ",product_id_size);
                const product_id = product_id_size[0];
                let size = "";
                if (product_id_size.length>1){
                    size = product_id_size[1];
                }
                
                const quantity = 1;
                const [user, created] = await cartModel.findOrCreate({
                    where: { 
                        user_id: user_id,
                        product_id: product_id,
                        size: size }, // Search criteria based on username
                    defaults: { user_id, product_id, quantity}, // Data to be created if the user is not found
                });
            }
        }
        return res.status(200).send({success: true});
    } catch (error) {
        console.error('Error deleting user:', error);
        return res.status(200).send({success: false});
    }
}

 
module.exports = {
    getCartData, saveCartData, removeCartData, saveCartDataWhenLogin
}
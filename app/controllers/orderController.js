const sequelize = require('../../database/connection');
const { Op } = require('sequelize');
const jwt = require('jsonwebtoken');

const OrderModels = require("../models/orderModels");
const OrderItemModels = require("../models/orderItemModels");
const ProductModel = require("../models/productModel");
const quantityModel = require("../models/quantityModel");
const Cart = require('../models/cartModels');
const addressModel = require('../models/addressModel');
const productImageModel = require('../models/productImageModel');
const userAccountDetails = require('../models/userAccountDetails');


/*
async function continueToBuy(req, res){
    const token = req.headers.authorization;
    const decodedToken = jwt.verify(token, tGlobalSecretKey);
    let returnMessage = "";
    let deliveryAddress = req.body.deliveryAddress.split("-");
    let itemsArray = req.body.items;
  
    let outOfStockItemArray = [];
    let buyItemArray = [];
    whereCluse = {}
    whereCluse['user_id'] = decodedToken.id;
    whereCluse[Op.or] = [];
    let itemFoundFlag = false;
    for (let i = 0; i < itemsArray.length; i++) {
        let product_id_size = itemsArray[i].split("@");
        let size = "";
        // console.log(itemsArray, "------------",product_id_size[1])
        if(product_id_size[1] !=undefined){
            size = product_id_size[1]
        }
        
        let obj = await productAvailability(product_id_size[0], size);

        if(obj.length>0){
            itemFoundFlag = true;
            whereCluse[Op.or].push({
                product_id: product_id_size[0],
                size: size
            });
        }
    }
    //console.log("-------------------------------");

    if(itemFoundFlag){
        const orderObj = await OrderModels.create({ 
            customer_id: decodedToken.id, 
            total_amount: 0, 
            delivery_pincode: deliveryAddress[1],
            delivery_address_id: deliveryAddress[0]
        });
        if(orderObj.id > 0){
            await Cart.findAll({
                where: whereCluse
            }).then((carts) => {
                
                carts.forEach(async(cartsObj, key) => {
                    let item = await orderItemInsert(orderObj.id, cartsObj);
                    if(item !=""){
                        outOfStockItemArray.push(cartsObj.product_id+"@"+cartsObj.size);
                    } else{
                        buyItemArray.push(cartsObj.product_id+"@"+cartsObj.size);
                    }
                    console.log("///////////////// |"+carts.length," == ",key+1);
                    if(carts.length == key+1){
                        updateOrderPrice(orderObj.id)
                    }
                });
                console.log("END--------------------");
            });
        }
    }
    return res.status(200).send({outOfStockItemArray: outOfStockItemArray, buy_item: buyItemArray});
}
*/

async function continueToBuy(req, res) {
    try {
        const token = req.headers.authorization;
        const decodedToken = jwt.verify(token, tGlobalSecretKey);
        let returnMessage = "";
        let deliveryAddress = req.body.deliveryAddress.split("-");
        let itemsArray = req.body.items;

        let outOfStockItemArray = [];
        let buyItemArray = [];
        let whereClause = {}
        whereClause['user_id'] = decodedToken.id;
        whereClause[Op.or] = [];
        let itemFoundFlag = false;

        for (let i = 0; i < itemsArray.length; i++) {
            let product_id_size = itemsArray[i].split("@");
            let size = product_id_size[1];

            let obj = await productAvailability(product_id_size[0], size);

            if (obj.length > 0) {
                itemFoundFlag = true;
                whereClause[Op.or].push({
                    product_id: product_id_size[0],
                    size: size
                });
            }else{
                outOfStockItemArray.push(product_id_size[0] + "@" + size);
            }
        }

        if (itemFoundFlag) {
            const orderObj = await OrderModels.create({
                customer_id: decodedToken.id,
                total_amount: 0,
                delivery_pincode: deliveryAddress[1],
                delivery_address_id: deliveryAddress[0]
            });

            if (orderObj.id > 0) {
                const carts = await Cart.findAll({
                    where: whereClause
                });

                for (let key = 0; key < carts.length; key++) {
                    let cartsObj = carts[key];
                    let item = await orderItemInsert(orderObj.id, cartsObj);

                    if (item !== "") {
                        outOfStockItemArray.push(cartsObj.product_id + "@" + cartsObj.size);
                    } else {
                        buyItemArray.push(cartsObj.product_id + "@" + cartsObj.size);
                    }

                    //console.log("outOfStockItemArray", outOfStockItemArray);
                    //console.log("buyItemArray", buyItemArray);

                    if (key === carts.length - 1) {
                        await updateOrderPrice(orderObj.id);
                    }
                }
            }
        }

        return res.status(200).send({
            outOfStockItemArray: outOfStockItemArray,
            buy_item: buyItemArray
        });
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).send({ error: 'An error occurred' });
    }
}


async function orderItemInsert(order_id, cartsObj){
    let obj = await productAvailability(cartsObj.product_id, cartsObj.size);
    let outOfStockItemArray = "";
    let sell_price = 0;
    if(obj.length > 0){
        let objHash = obj[0]['dataValues']['Quantity'][0]['dataValues'];
        sell_price = objHash['sell_price'];
        const orderItemObj = await OrderItemModels.create({ 
            order_id: order_id, 
            product_id: cartsObj.product_id, 
            quantity: cartsObj.quantity,
            size: cartsObj.size,
            price: sell_price,
            size: cartsObj.size
        }).then(newRecord => {
            if (newRecord) {
              //console.log('Created new record:', newRecord.toJSON());
            }
          });
        await updateOrderQuantity(objHash['id'], objHash['no_of_product'] - 1);
        await deleteCardRecord(cartsObj.user_id, cartsObj.product_id, cartsObj.size);
    }else{
        outOfStockItemArray = cartsObj.size;
    }
    //console.log("orderItemInsert===========================");
    return outOfStockItemArray;
}

async function updateOrderQuantity(id, no_of_product){
    await quantityModel.update({no_of_product: no_of_product}, {
        where: {
            id: id
        }
    });
}

async function deleteCardRecord(user_id, product_id, size){
    let whereClase = {
        user_id: user_id,
        product_id: product_id
    }

    if (size !="" && size !=undefined){
        whereClase["size"] = size;
    }

    const deletedOrdersCount = await Cart.destroy({
        where: whereClase,
    });

    return deletedOrdersCount;
}

async function productAvailability(product_id, size=""){
    let whereCluse = {}
    /*whereCluse["where"] = {
        no_of_product: {
            [Op.gt]: 0,
        }
    }*/
    if (size !="" && size !=undefined){
        whereCluse["size"] = size;
    }

    // console.log("===============================");
    // console.log(whereCluse)
    return await ProductModel.findAll({
      where: {
        id: product_id
      },
      include: [
        {
          model: quantityModel,
          as: 'Quantity',
          where: {
                no_of_product: {
                    [Op.gt]: 0,
                },
                size: size
            }
        }
      ]
    });
}

async function checkProductAvailability(req, res){
    let obj = await productAvailability(req.body.item_id, req.body.size)
   // console.log(obj[0]['dataValues'])
    //console.log(obj[0]['product_offer_percentage'])
    inner_hash = {
        total_item: 0,
        price: 0,
        offerPrice: 0,
        newPercentage: 0
    }
    if(obj.length > 0){
        let quantityObj = obj[0]['dataValues']['Quantity'][0]['dataValues'];
        inner_hash["total_item"] = quantityObj['no_of_product']
        inner_hash["price"] = quantityObj['sell_price']

        let offerPrice = 0;
        let newPercentage = 0;
        if (obj[0]['product_offer_percentage'] > 0){
            offerPrice = quantityObj['sell_price'] * obj[0]['product_offer_percentage']/100;
            newPercentage = Math.floor((((quantityObj['sell_price'] + offerPrice) - quantityObj['sell_price'])/(quantityObj['sell_price'] + offerPrice))*100);
        }

        inner_hash["offerPrice"] = quantityObj['sell_price'] + offerPrice;
        inner_hash["newPercentage"] = newPercentage
    }
    return res.status(200).send(inner_hash);
}

async function getOrderData(req, res){
    const token = req.headers.authorization;
    const decodedToken = jwt.verify(token, tGlobalSecretKey);
    const orderItem = await OrderModels.findAll({
        where: {
            customer_id: decodedToken.id
        },
        order: [['id', 'DESC']],
        required: true,
        include: [
            {
                model: OrderItemModels,
                as: 'OrderItem',
                where: {}
            }
        ]
    });
    
    const orderHash = await fetchOrderItemDetails(orderItem);
    
    return res.status(200).send({orderItemList: orderHash[0], orderPrice: orderHash[1], deliveryAddress: orderHash[2]});
}

async function totalPriceCal(totalPrice){
    let total_price = 0;
    let grossTotal = 0;
    if(totalPrice.length > 0){
        grossTotal = total_price = totalPrice.reduce((sum, num) => parseFloat(sum) + parseFloat(num), 0);
    }
    let deliveryCharge = 0;
    if(total_price <= 399 && total_price > 0){
        deliveryCharge = 20;
        grossTotal = parseFloat(deliveryCharge) + parseFloat(grossTotal);
    }

    return {total_price: total_price, grossTotal: grossTotal, deliveryCharge: deliveryCharge, itemCount: totalPrice.length}
}


async function fetchOrderItemDetails(orderItem){
    let orderHash = {};
    let orderPriceDetails = {};
    let orderItemAddress = {};
    for (const orderObj of orderItem) {
        if(orderObj.OrderItem.length > 0){
            orderHash[orderObj.id] = [];
            let allPriceArray = [];
            let orderId = 0;
            for (const itemObj of orderObj.OrderItem) {
                try {
                    let productObj = await productDetails(itemObj.product_id);
                    let innerHash = {}
                    innerHash['quantity'] = itemObj.quantity;
                    innerHash['price'] = itemObj.price;
                    innerHash['size'] = itemObj.size;
                    innerHash['createdAt'] = itemObj.createdAt;
                    innerHash['order_status'] = itemObj.order_status;
                    innerHash['return_available'] = itemObj.return_available;
                    innerHash['delivery_date'] = itemObj.delivery_date;
                    innerHash['return_place_date'] = itemObj.return_place_date;
                    innerHash['order_item_id'] = itemObj.id;
                    innerHash['delivery_address_id'] = orderObj.delivery_address_id;
                    innerHash['order_id'] = itemObj.order_id;

                    innerHash['returnDay'] = 0;
                    if(!['Return', 'Cancel'].includes(itemObj.order_status)){
                        allPriceArray.push(itemObj.price);
                    }

                    if(itemObj.delivery_date !=null){
                        const dateString1 = itemObj.delivery_date;
                        const dateString2 = (new Date());
                        // Parse the input dates into Date objects
                        const date1 = new Date(dateString1);
                        const date2 = new Date(dateString2);

                        // Calculate the time difference in milliseconds
                        const timeDifference = date2 - date1;

                        // Convert milliseconds to days
                        const daysDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
                        innerHash['returnDay'] = daysDifference;
                    }

                    innerHash['image_name'] = productObj.image_name;
                    innerHash['product_name'] = productObj.product_name;
                    innerHash['company_name'] = productObj.company_name;
                    innerHash['p_id'] = productObj.p_id;
                    //console.log(innerHash);
                    orderHash[itemObj.order_id].push(innerHash);
                    orderId = itemObj.order_id;
                    
                } catch (error) {
                    console.error("Error fetching product:", error);
                    return null;
                }
            }

            orderPriceDetails[orderId] = await totalPriceCal(allPriceArray);
            orderItemAddress[orderId] = await getDeliveryAddress(orderObj.delivery_address_id);
        }
    }

    return [orderHash, orderPriceDetails, orderItemAddress];
}

async function productDetails(product_id){
    const productObj = await ProductModel.findAll({
        where: {
            id: product_id
        },
        include: [
        {
            model: productImageModel,
            as: 'Product_Image'
        }
        ]
    })
    let inner_hash = {};
    inner_hash["image_name"] = "";
    inner_hash["company_name"] = "";
    inner_hash["product_name"] = "";
    productObj.forEach(async (orderObj) => {
        inner_hash["p_id"] = orderObj.id;
        inner_hash["product_name"] = orderObj.product_name;
        inner_hash["company_name"] = orderObj.company_name;
        if(orderObj.Product_Image !=undefined){
            orderObj.Product_Image.forEach((Product_Image, key) => {
                //console.log("key", key);
                if(key == 0 || Product_Image.primary == 1){
                    inner_hash['image_name'] = Product_Image.image_name;
                }
            })
        }
        //console.log(inner_hash);
    })
    return inner_hash;
}

async function cancelOrderItem(req, res){
    const upadte = await OrderItemModels.update({order_status: "Cancel"}, {
        where: {
            id: req.body.order_item_id, // Specify the condition to match (e.g., id = 1)
            order_status:{
                [Op.in]: ["Pending", "Confirm"]
            }
        }
    });
    orderItemQuentityUpdate(req.body.order_item_id);
    updateOrderPrice(req.body.order_id)
    return res.status(200).send(upadte);
}

async function returnOrderItem(req, res){
    const upadte = await OrderItemModels.update({order_status: "Return"}, {
        where: {
            id: req.body.order_item_id, // Specify the condition to match (e.g., id = 1)
            order_status:{
                [Op.in]: ["Complete"]
            }
        }
    });

    console.log("upadte",upadte)
    const token = req.headers.authorization;
    const decodedToken = jwt.verify(token, tGlobalSecretKey);
    returnUserAccountDetails(req, decodedToken);

    // Update Quentity
    //orderItemQuentityUpdate(req.body.order_item_id);    
    updateOrderPrice(req.body.order_id);
    return res.status(200).send(upadte);
} 

async function returnUserAccountDetails(req, decodedToken){
    const orderObj = await userAccountDetails.create({
        user_id: decodedToken.id,
        order_item_id: req.body.order_item_id,
        reason_for_cancellation: req.body.reason_for_cancellation,
        bank_name: req.body.bank_name,
        ifsc_code: req.body.ifsc_code,
        account_number: req.body.account_number,
    });
}

async function orderItemQuentityUpdate(order_item_id){
    OrderItemModels.findOne({
        where: {
            id: order_item_id
        },
    })
    .then(orderItemObj => {
        quantityModel.findAll({
            where: {
                product_id: orderItemObj["product_id"],
                size: orderItemObj["size"]
            },
            attributes: ['product_id', 'no_of_product', 'size', 'id']
        }).then(quantityObj => {
            let orderItemQuantity = orderItemObj["quantity"];
            quantityObj.forEach((obj, key) => {
                updateOrderQuantity(obj['id'], obj['no_of_product'] + orderItemQuantity);
            })    
        })
    })
}

async function updateOrderPrice(order_id){
    try {
        const sumResult = OrderItemModels.sum('price', {
            where: {
                order_id: order_id,
                order_status:{
                    [Op.in]: ["Complete", "Pending", "Confirm", "On the awaya"]
                }
            },
            }).then(sum => {
                //console.log(`Sum of columnName with WHERE clause: ${sum}`);
                if(sum == null){
                    sum = 0
                }
                // Update the target table with the sum value
                OrderModels.update({ total_amount: sum }, {
                    where: { id: order_id},
                });
            }).catch(err => {
                console.error('Error calculating sum with WHERE clause:', err);
            });
        //console.log('Sum:', sumResult);
    } catch (error) {
        console.error('Error:', error);
    }
}

async function getDeliveryAddress(delivery_address_id){
    let addressArray = [];
    const addressObj = await addressModel.findAll({
        where: {id: delivery_address_id},
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

    return addressArray;
}


async function allOrderDetails1(req, res){
    let orderArray = [];
    OrderModels.findAll({
        include: [
            {
                model: OrderItemModels,
                as: 'OrderItem',
                where: {
                    order_status: 'Pending'
                },
                attributes: ['price'],
            },
        ],
    }).then((order) => {
        
    })
    .catch((error) => {
          // Handle errors
    });
      
    console.log(orderArray);
        
    return res.status(200).send([{delivery_pincode: 5, total_amount: 5000, id: 5}]);
}


async function allOrderDetails(req, res) {
    try {
      let orderStatus = "";
      const results = await sequelize.query(`SELECT o.id AS 'orderId', p.id AS 'pId', p.product_name, oi.id AS 'orderItemId', oi.order_status, oi.price, oi.quantity, oi.size, o.delivery_pincode, o.total_amount, oi.order_status FROM Orders o, Products p, order_Items oi WHERE oi.product_id = p.id AND o.id = oi.order_id 
      -- AND oi.order_status = 'Pending' 
      ORDER BY o.id, o.delivery_pincode`);
  
        // Handle the results here
        const orderIDs = results[0].map(result => result['pId']);
        //console.log(orderIDs);
        const imageHash = await getProductImage(orderIDs);

        //console.log(imageHash);

        const orderArray = [];

        results[0].forEach((resultObj, key) => {
            console.log(resultObj);
            let innerHash = {};
            innerHash["orderId"] = resultObj.orderId;
            innerHash["orderItemId"] = resultObj.orderItemId;
            innerHash["pId"] = resultObj.pId;
            innerHash["product_name"] = resultObj.product_name;
            innerHash["product_image"] = imageHash[resultObj.pId];
            innerHash["quantity"] = resultObj.quantity;
            innerHash["price"] = resultObj.price;
            innerHash["total_amount"] = resultObj.total_amount
            innerHash["size"] = resultObj.size;
            innerHash["delivery_pincode"] = resultObj.delivery_pincode;
            innerHash["is_open_delivery"] = resultObj.is_open_delivery;
            innerHash["order_status"] = resultObj.order_status;
            orderArray.push(innerHash);
        })

      
      return res.status(200).send(orderArray);
    } catch (error) {
      // Handle any errors here
      console.error(error);
      return res.status(500).send('Error executing the query.');
    }
    //console.log(sequelize);
}

async function getProductImage(pIds){
    const productIds = [...new Set(pIds)];
    let imageHass = {};

    const products = await productImageModel.findAll({
        where: {
            product_id:{
                [Op.in]: productIds,
            }
        },
        attributes: ['image_name', 'product_id', 'primary']
    }).then(productImgObj => {
        productImgObj.forEach((ImgObj, key) => {
            if(key == 0 || ImgObj['primary'] == 1){
                imageHass[ImgObj.product_id] = ImgObj.image_name;
            }
        })
    })

    return imageHass;
}

async function handalUpdateOrderStatus(req, res) {
    console.log("handalUpdateOrderStatus");
    try {
        const { OrderStatus, orderMessage, id } = req.body;

       console.log(req.body);
/*
        const OrderStatus =  req.body.OrderStatus;
        const orderMessage =  req.body.orderMessage;
        const id =  req.body.id;
*/
        console.log(OrderStatus, orderMessage, id);
        

        // Validate input data
        if (OrderStatus == "" ) {
            return res.status(200).json({ message: "Both OrderStatus and orderMessage are missing.", status: false });
        }

        const updateData = {};

        if (OrderStatus) {
            updateData.order_status = OrderStatus;
        }

        if (orderMessage) {
            updateData.order_message = orderMessage;
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
        console.error("Error updating order:", error);
        return res.status(200).json({ message: "Internal server error", status: false });
    }
}


module.exports = {
    continueToBuy, checkProductAvailability, getOrderData, cancelOrderItem, productAvailability, returnOrderItem, allOrderDetails, handalUpdateOrderStatus
}
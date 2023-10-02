const {db} = require('../../database/connection');
const { Op } = require('sequelize');

const productImageModel = require("../models/productImageModel");
const ProductModel = require("../models/productModel");
const quantityModel = require("../models/quantityModel");

async function getSameColorWiseItem(req, res){
    let imageArray = [];

    const products = await ProductModel.findAll({
        where: {
            group_id: req.body.group_id,
            active_status: 1
        },
        attributes: ['id', 'group_id'], 
        include: [
            {
                model: productImageModel,
                as: "Product_Image",
                attributes: ['image_name'],
                where: {
                    primary: 1
                }
            },{
                model: quantityModel,
                as: "Quantity",
                where: {
                    no_of_product: {
                        [Op.gt]: 0,
                    }
                }
            }
        ]
    }).then(productObj => {
        productObj.forEach((obj) => {
            let inner_hash = {
                item_id: obj.id
            }
            obj['Product_Image'].forEach((ImgObj, key) => {
                if(key == 0 || ImgObj['primary'] == 1){
                    inner_hash['image_name'] = ImgObj.image_name
                    imageArray.push(inner_hash)
                }
            })
        })
    })
  
    return res.status(200).send(imageArray);
   
}

module.exports = { getSameColorWiseItem }
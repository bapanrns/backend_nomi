const {db} = require('../../database/connection');
const { Op } = require('sequelize');

const productImageModel = require("../models/productImageModel");
const ProductModel = require("../models/productModel");

async function getSameColorWiseItem(req, res){
    let imageArray = [];

    const products = await ProductModel.findAll({
        where: {
            group_id: req.body.group_id
        },
        attributes: ['id', 'group_id'], 
        include: {
            model: productImageModel,
            as: "Product_Image",
            attributes: ['image_name']
        }
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
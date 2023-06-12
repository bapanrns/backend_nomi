const {db} = require('../../database/connection');

const ProductModel = require("../models/productModel");
const quantityModel = require("../models/quantityModel");
const path = require('path');
const fs = require('fs');
const uploadMiddleware = require("../helper/uploadMiddleware");
const productImageModel = require("../models/productImageModel");
 



async function handalSaveProduct(req, res){
    //const { name } = req.body;
   // console.log(`Received name: ${name}`);
    console.log(req.body);

    const returnMessage = "";
    const saveHash = {
                    category_id: req.body.category_id, 
                    sub_category_id: req.body.sub_category_id,  
                    product_name: req.body.product_name, 
                    active_status: req.body.active_status,  
                    company_name: req.body.company_name,  
                    year_month: req.body.year_month,  
                    product_original_price: req.body.product_original_price, 
                    product_selling_price: req.body.product_selling_price, 
                    product_offer_percentage: req.body.product_offer_percentage, 
                    product_offer_price: req.body.product_offer_price,
                    delivery_charges: req.body.delivery_charges,
                    product_febric_id: req.body.product_febric_id, 
                    product_febric: req.body.product_febric, 
                    color: req.body.color.join(', ')
                }
    if(req.body.id > 0){
        // Edit
        await ProductModel.update(saveHash, {
            where: {
                id: req.body.id
            }
        });
        
    }else{
        // Add
        const product = await ProductModel.create(saveHash);
        /* Image Upload */
        if(product.dataValues.id > 0){
            
            const imageArray = [];
            if(req.body.images !== null){
                imageArray.push(req.body.images);
            }
            if(req.body.images2 !== null){
                imageArray.push(req.body.images2);
            }
            if(req.body.images3 !== null){
                imageArray.push(req.body.images3);
            }
            if(req.body.images4 !== null){
                imageArray.push(req.body.images4);
            }
            if(req.body.images5 !== null){
                imageArray.push(req.body.images5);
            }

            for (let i = 0; i < imageArray.length; i++) {
                base64Image = imageArray[i];
                const decodedImage = uploadMiddleware.decodeBase64Image(base64Image);
                const imagePath = path.resolve('/Bapan/img/'+decodedImage.name);
                // Save product Images
                const productImage = await productImageModel.create({
                        product_id: product.dataValues.id,
                        image_name: decodedImage.name,
                        image_url: imagePath
                    });
                if(productImage.dataValues.id > 0){
                    // Transfer image
                    fs.writeFileSync(imagePath, decodedImage.data);
                }
            }
        }
        const quantityArray = [];
        if (req.body.quantity > 0){
            quantityArray.push(
                {
                    product_id: product.dataValues.id,
                    no_of_product: req.body.quantity,
                    size: ""
                }
            )
        }
        if (req.body.quantityXs > 0){
            //quantityHash["quantity"] = req.body.quantityXs;
            quantityArray.push(
                {
                    product_id: product.dataValues.id,
                    no_of_product: req.body.quantityXs,
                    size: "XS"
                }
            )
        }
        if (req.body.quantityS > 0){
            quantityArray.push(
                {
                    product_id: product.dataValues.id,
                    no_of_product: req.body.quantityS,
                    size: "S"
                }
            )
        }
        if (req.body.quantityL > 0){
            quantityArray.push(
                {
                    product_id: product.dataValues.id,
                    no_of_product: req.body.quantityL,
                    size: "L"
                }
            )
        }
        if (req.body.quantityM > 0){
            quantityArray.push(
                {
                    product_id: product.dataValues.id,
                    no_of_product: req.body.quantityM,
                    size: "M"
                }
            )
        }
        if (req.body.quantityXl > 0){
            quantityArray.push(
                {
                    product_id: product.dataValues.id,
                    no_of_product: req.body.quantityXl,
                    size: "XL"
                }
            )
        }
        
        if (req.body.quantity2Xl > 0){
            quantityArray.push(
                {
                    product_id: product.dataValues.id,
                    no_of_product: req.body.quantity2Xl,
                    size: "2XL"
                }
            )
        }
        console.log(quantityArray);
        const quantity = await quantityModel.bulkCreate(quantityArray);
        console.log(product.dataValues.id);
    }

    return res.status(200).send("Save Successfully");
}

async function handalAllProduct(req, res){

    //SubCategoryModel.findAll({ include: [ CategoryModel ], order: [ [ CategoryModel, 'category_name' ] ] });
    ProductModel.findAll({
        include: [
          {
            model: quantityModel,
            as: 'Quantity'
          },
        ],
      })
        .then((users) => {
          // Access the data from the three tables

            //console.log(users)


          users.forEach((user) => {
            console.log('User:', user.toJSON());
            /*user.Posts.forEach((post) => {
              console.log('Post:', post.toJSON());
              post.Comments.forEach((comment) => {
                console.log('Comment:', comment.toJSON());
              });
            });*/
          });
        })
        .catch((error) => {
          console.error('Error:', error);
        });
      











    const category = await ProductModel.findAll();
    //console.log("All users:", JSON.stringify(JSON.stringify, null, 2));
    return res.status(200).send(category);
}

async function handalFindProductById(req, res){
    const id = req.body.id;
    const category = await ProductModel.findByPk(id);
    //console.log("All users:", JSON.stringify(JSON.stringify, null, 2));
    return res.status(200).send(category);
}

async function handalDeleteProductById(req, res){
    const id = req.body.id;
    await ProductModel.update({ active_status: 0 }, {
        where: {
            id: req.body.id
        }
    });
    return res.status(200).send("Deleted Successfully");
}
 
module.exports = {
    handalSaveProduct, handalAllProduct, handalFindProductById, handalDeleteProductById
}
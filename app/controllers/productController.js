const {db} = require('../../database/connection');
const { Op } = require('sequelize');

const ProductModel = require("../models/productModel");
const quantityModel = require("../models/quantityModel");
const categoryModel = require("../models/categoryModel");
const subCategoryModel = require("../models/subCategoryModel");
const path = require('path');
const fs = require('fs');
const uploadMiddleware = require("../helper/uploadMiddleware");
const productImageModel = require("../models/productImageModel");
const groupModal = require("../models/groupModal");
 



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
                    color: req.body.color.join(', '),
                    saree_length: req.body.saree_length,
                    blouse: req.body.blouse,
                    blouse_length: req.body.blouse_length,
                    weight: req.body.weight
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
    let whereCluse = {}
    if(req.body.category_id !=""){
        whereCluse['category_id'] = req.body.category_id;
    }

    if(req.body.sub_category_id !=""){
        whereCluse['sub_category_id'] = req.body.sub_category_id;
    }
    
    if(req.body.active_status !=""){
        whereCluse['active_status'] = req.body.active_status;
    }
    console.log(whereCluse);
    const productArray = [];
    //SubCategoryModel.findAll({ include: [ CategoryModel ], order: [ [ CategoryModel, 'category_name' ] ] });
    await ProductModel.findAll({
        where: whereCluse,
        include: [
          {
            model: quantityModel,
            as: 'Quantity'
          },{
            model: categoryModel,
            as: 'Category'
          },{
            model: subCategoryModel,
            as: 'SubCategory'
          }
        ]
      })
        .then((products) => {
          // Access the data from the three tables
          //console.log(products)
            products.forEach((product) => {
               //console.log('User:', products);
               const inner_hash = {
                    id: product.id, 
                    category_id: "", 
                    group_id: product.group_id,
                    color: product.color,
                    sub_category_id: product.sub_category_id, 
                    no_of_product: 0,
                    size: "",
                    active_status: product.active_status,
                    quantity_xs: 0,
                    quantity_s: 0,
                    quantity_l: 0,
                    quantity_m: 0,
                    quantity_xl: 0,
                    quantity_2xl: 0,
                }
                const quantityArray = [];
                product.Quantity.forEach((quantity) => {
                    //console.log('---------------------------');
                    //console.log('Post:', quantityS.toJSON());
                    quantityArray.push(quantity.no_of_product);
                    if(quantity.size == "XS"){
                        inner_hash['quantity_xs'] = quantity.no_of_product;
                    }else if(quantity.size == "S"){
                        inner_hash['quantity_s'] = quantity.no_of_product;
                    }else if(quantity.size == "L"){
                        inner_hash['quantity_l'] = quantity.no_of_product;
                    }else if(quantity.size == "M"){
                        inner_hash['quantity_m'] = quantity.no_of_product;
                    }else if(quantity.size == "XL"){
                        inner_hash['quantity_xl'] = quantity.no_of_product;
                    }else if(quantity.size == "2XL"){
                        inner_hash['quantity_2xl'] = quantity.no_of_product;
                    }
                });

                inner_hash['category_id'] = product.Category.category_name;
                inner_hash['sub_category_id'] = product.SubCategory.sub_category_name;
                inner_hash['no_of_product'] = quantityArray.reduce((sum, current) => sum + current, 0);
                productArray.push(inner_hash);
            });
            
        })
        .catch((error) => {
          console.error('Error:', error);
        });
      

       // console.log("=======================");
       //console.log(productArray);
    return res.status(200).send(productArray);
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

async function handalUpdateGroupId(req, res){
    const product_ids = req.body.product_id;
    let errorMessage = "Please select the same subcategory";
    const uniqeSubCategoryIdsLength = await findProductSubCategory(product_ids);
    if(uniqeSubCategoryIdsLength === 1){
        const groupObj = await groupModal.create({Product_id: product_ids.join(", ")});
        const group_id = groupObj.dataValues.id;
        if(group_id > 0){
            await ProductModel.update({ group_id: group_id }, {
                where: {
                    id:{
                    [Op.in]: product_ids,
                    }
                }
            });
        }
        errorMessage = "Update Successfully";
    }
    return res.status(200).send(errorMessage);
}

async function findProductSubCategory(product_ids){
    try{
        const product = await ProductModel.findAll({
            where: {
              id: {
                [Op.in]: product_ids, // Example condition: age greater than or equal to 18
              }
            },
            attributes: ['sub_category_id'], 
        })

        const sub_category_idsArray = product.map(user => user.sub_category_id);
        const uniqeSubCategoryIds = [...new Set(sub_category_idsArray)];
        return uniqeSubCategoryIds.length;
    } catch (error) {
        return "Error"
    }
}
 
module.exports = {
    handalSaveProduct, handalAllProduct, handalFindProductById, handalDeleteProductById, handalUpdateGroupId
}
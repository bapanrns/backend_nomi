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

    let productId = 0;
    const returnMessage = "";
    const bill_id_and_shop_id = req.body.bill_id_and_shop_id;
    let bill_id = 0;
    let shop_id = 0;
    if (bill_id_and_shop_id !="" && bill_id_and_shop_id != undefined){
        bill_id = bill_id_and_shop_id.split("@")[0];
        shop_id = bill_id_and_shop_id.split("@")[1];
    }
    const saveHash = {
                    category_id: req.body.category_id, 
                    sub_category_id: req.body.sub_category_id,  
                    product_name: req.body.product_name, 
                    active_status: req.body.active_status,  
                    company_name: req.body.company_name,  
                    year_month: req.body.year_month,  
                    product_offer_percentage: req.body.product_offer_percentage, 
                    delivery_charges: req.body.delivery_charges,
                    product_febric_id: req.body.product_febric_id, 
                    product_febric: req.body.product_febric, 
                    color: req.body.color.join(', '),
                    saree_length: req.body.saree_length,
                    blouse: req.body.blouse,
                    blouse_length: req.body.blouse_length,
                    weight: req.body.weight,
                    youtube_link: req.body.youtube_link,
                    fabric_care: req.body.fabric_care,
                    bill_id: bill_id,
                    shop_id: shop_id
                }
    if(req.body.id > 0){
        // Edit
        productId = req.body.id;
        await ProductModel.update(saveHash, {
            where: {
                id: productId
            }
        });
        // ---------------------------------------------------------------------------------------------------------------
        // ------------------------------------ Quantity Update and Insert -----------------------------------------------
        // ---------------------------------------------------------------------------------------------------------------

        // **************************** Quantity *************************************
        const quantity_hash = await createQuantityHash(productId, 
                                    req.body.quantity,
                                    size="", 
                                    req.body.quantity_buy_price, 
                                    req.body.quantity_selling_price
                                    );

        if(req.body.quantity_id > 0 ){
            // Update
            updateProductQuantity(req.body.quantity_id, quantity_hash);
        }else if(parseInt(req.body.quantity, 10) > 0){
            // Insert
            quantityModel.create(quantity_hash);
        }

        // **************************** XS Quantity *************************************
        const quantityXs_hash = await createQuantityHash(productId, 
                                    req.body.quantityXs,
                                    size="XS", 
                                    req.body.quantityXs_buy_price, 
                                    req.body.quantityXs_selling_price
                                    );

        if(req.body.quantity_Xs_id > 0 ){
            // Update
            updateProductQuantity(req.body.quantity_Xs_id, quantityXs_hash);
        }else if(parseInt(req.body.quantityXs, 10) > 0){
            // Insert
            quantityModel.create(quantityXs_hash);
        }        

        // **************************** S Quantity *************************************
        const quantityS_hash = await createQuantityHash(productId, 
                                    req.body.quantityS,
                                    size="S", 
                                    req.body.quantityS_buy_price, 
                                    req.body.quantityS_selling_price
                                    );

        if(req.body.quantity_S_id > 0 ){
            // Update
            updateProductQuantity(req.body.quantity_S_id, quantityS_hash);
        }else if(parseInt(req.body.quantityS, 10) > 0){
            // Insert
            quantityModel.create(quantityS_hash);
        }

        // **************************** L Quantity *************************************
        const quantityL_hash = await createQuantityHash(productId, 
                                    req.body.quantityL,
                                    size="L", 
                                    req.body.quantityL_buy_price, 
                                    req.body.quantityL_selling_price
                                    );

        if(req.body.quantity_L_id > 0 ){
            // Update
            updateProductQuantity(req.body.quantity_L_id, quantityL_hash);
        }else if(parseInt(req.body.quantityL, 10) > 0){
            // Insert
            quantityModel.create(quantityL_hash);
        }

        // **************************** M Quantity *************************************
        const quantityM_hash = await createQuantityHash(productId, 
                                    req.body.quantityM,
                                    size="M", 
                                    req.body.quantityM_buy_price, 
                                    req.body.quantityM_selling_price
                                    );

        if(req.body.quantity_M_id > 0 ){
            // Update
            updateProductQuantity(req.body.quantity_M_id, quantityM_hash);
        }else if(parseInt(req.body.quantityM, 10) > 0){
            // Insert
            quantityModel.create(quantityM_hash);
        }

        // **************************** XL Quantity *************************************
        const quantity_Xl_hash = await createQuantityHash(productId, 
                                    req.body.quantityXl,
                                    size="XL", 
                                    req.body.quantityXl_buy_price, 
                                    req.body.quantityXl_selling_price
                                    );

        if(req.body.quantity_Xl_id > 0 ){
            // Update
            updateProductQuantity(req.body.quantity_Xl_id, quantity_Xl_hash);
        }else if(parseInt(req.body.quantityXl, 10) > 0){
            // Insert
            quantityModel.create(quantity_Xl_hash);
        }

        // **************************** 2XL Quantity *************************************
        const quantity_2Xl_hash = await createQuantityHash(productId, 
                                    req.body.quantity2Xl,
                                    size="2XL", 
                                    req.body.quantity2Xl_buy_price, 
                                    req.body.quantity2Xl_selling_price
                                    );

        if(req.body.quantity_2Xl_id > 0 ){
            // Update
            updateProductQuantity(req.body.quantity_2Xl_id, quantity_2Xl_hash);
        }else if(parseInt(req.body.quantity2Xl, 10) > 0){
            // Insert
            quantityModel.create(quantity_2Xl_hash);
        }
        
    }else{
        // ---------------------------------------------------------------------------------------------------------------
        // ----------------------------------------------- Product Insert -----------------------------------------------
        // ---------------------------------------------------------------------------------------------------------------

        const product = await ProductModel.create(saveHash);
        productId = product.dataValues.id;
        //  ******************************* Image Upload *********************************
        if(productId > 0){
            // ---------------------------------------------------------------------------------------------------------------
            // ------------------------------------ Quantity Insert -----------------------------------------------
            // ---------------------------------------------------------------------------------------------------------------

            const quantityArray = [];
            if (req.body.quantity > 0){
                quantityArray.push(
                    {
                        product_id: productId,
                        no_of_product: req.body.quantity,
                        size: "",
                        buy_price: req.body.quantity_buy_price,
                        sell_price: req.body.quantity_selling_price
                    }
                )
            }
            if (req.body.quantityXs > 0){
                quantityArray.push(
                    {
                        product_id: productId,
                        no_of_product: req.body.quantityXs,
                        size: "XS",
                        buy_price: req.body.quantityXs_buy_price,
                        sell_price: req.body.quantityXs_selling_price
                    }
                )
            }
            if (req.body.quantityS > 0){
                quantityArray.push(
                    {
                        product_id: productId,
                        no_of_product: req.body.quantityS,
                        size: "S",
                        buy_price: req.body.quantityS_buy_price,
                        sell_price: req.body.quantityS_selling_price
                    }
                )
            }
            if (req.body.quantityL > 0){
                quantityArray.push(
                    {
                        product_id: productId,
                        no_of_product: req.body.quantityL,
                        size: "L",
                        buy_price: req.body.quantityL_buy_price,
                        sell_price: req.body.quantityL_selling_price
                    }
                )
            }
            if (req.body.quantityM > 0){
                quantityArray.push(
                    {
                        product_id: productId,
                        no_of_product: req.body.quantityM,
                        size: "M",
                        buy_price: req.body.quantityM_buy_price,
                        sell_price: req.body.quantityM_selling_price
                    }
                )
            }
            if (req.body.quantityXl > 0){
                quantityArray.push(
                    {
                        product_id: productId,
                        no_of_product: req.body.quantityXl,
                        size: "XL",
                        buy_price: req.body.quantityXl_buy_price,
                        sell_price: req.body.quantityXl_selling_price
                    }
                )
            }

            if (req.body.quantity2Xl > 0){
                quantityArray.push(await createQuantityHash(productId, 
                                                    req.body.quantity2Xl,
                                                    size="2XL", 
                                                    req.body.quantity2Xl_buy_price, 
                                                    req.body.quantity2Xl_selling_price
                                                    )
                                                );
            }

            //console.log(quantityArray);
            const quantity = await quantityModel.bulkCreate(quantityArray);
        }
    }

    console.log("productId", productId);

    if(productId > 0){
        const imageArray = [];
        let primary = 0;
        if(req.body.images1 !== ""){
            if(req.body.primary === "images1"){
                primary = 1;
            }
            imageArray.push({img: req.body.images1, primary: primary});
        }
        if(req.body.images2 !== ""){
            primary = 0;
            if(req.body.primary === "images2"){
                primary = 1;
            }
            imageArray.push({img: req.body.images2, primary: primary});
        }
        if(req.body.images3 !== ""){
            primary = 0;
            if(req.body.primary === "images3"){
                primary = 1;
            }
            imageArray.push({img: req.body.images3, primary: primary});
        }
        if(req.body.images4 !== ""){
            primary = 0;
            if(req.body.primary === "images4"){
                primary = 1;
            }
            imageArray.push({img: req.body.images4, primary: primary});
        }
        if(req.body.images5 !== ""){
            primary = 0;
            if(req.body.primary === "images5"){
                primary = 1;
            }
            imageArray.push({img: req.body.images5, primary: primary});
        }

        for (let i = 0; i < imageArray.length; i++) {
            base64Image = imageArray[i];
            const decodedImage = uploadMiddleware.decodeBase64Image(base64Image.img);
            const imagePath = path.resolve('/Bapan/React/frontend_nomi/src/images/product/'+decodedImage.name);
            // ********************* Save product Images **************************************
            const productImage = await productImageModel.create({
                    product_id: productId,
                    image_name: decodedImage.name,
                    image_url: imagePath,
                    primary: base64Image.primary
                });
            if(productImage.dataValues.id > 0){
                // ******************* Transfer image *******************************************
                fs.writeFileSync(imagePath, decodedImage.data);
            }
        }
    }
    return res.status(200).send("Save Successfully");
}

async function createQuantityHash(id="", no_of_product=0, size="", buy_price=0, sell_price=0){
    const inner_hash = {
        product_id: id,
        no_of_product: no_of_product,
        size: size,
        buy_price: buy_price,
        sell_price: sell_price
    }
    return inner_hash;
}

async function updateProductQuantity(id, updateHash){
    console.log("updateProductQuantity:", id, "=>", updateHash);
    await quantityModel.update(
        updateHash, 
        { where: { id: id } } 
    ).then((count) => {
        console.log(`Updated ${count} record(s).`);
      })
      .catch((error) => {
        console.error('Error occurred during update:', error);
    });
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
                    let quantity_price = quantity.no_of_product+" => "+quantity.buy_price+" => "+quantity.sell_price;
                    if(quantity.size == "XS"){
                        inner_hash['quantity_xs'] = quantity_price;
                    }else if(quantity.size == "S"){
                        inner_hash['quantity_s'] = quantity_price;
                    }else if(quantity.size == "L"){
                        inner_hash['quantity_l'] = quantity_price;
                    }else if(quantity.size == "M"){
                        inner_hash['quantity_m'] = quantity_price;
                    }else if(quantity.size == "XL"){
                        inner_hash['quantity_xl'] = quantity_price;
                    }else if(quantity.size == "2XL"){
                        inner_hash['quantity_2xl'] = quantity_price;
                    }else{
                        inner_hash['quantity'] = quantity_price;
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
    const productHash = {
        id: id,
        category_id: "",
        sub_category_id: "",
        product_name: "",
        active_status: "",
        company_name: "",
        year_month: "",
        product_offer_percentage: "",
        delivery_charges: "",
        quantity: "",
        quantity_id: "",
        quantity_buy_price: "",
        quantity_selling_price: "",
        quantityXs: "",
        quantity_Xs_id: "",
        quantityXs_buy_price: "",
        quantityXs_selling_price: "",
        quantityS: "",
        quantity_S_id: "",
        quantityS_buy_price: "",
        quantityS_selling_price: "",
        quantityL: "",
        quantity_L_id: "",
        quantityL_buy_price: "",
        quantityL_selling_price: "",
        quantityM: "",
        quantity_M_id: "",
        quantityM_buy_price: "",
        quantityM_selling_price: "",
        quantityXl: "",
        quantity_Xl_id: "",
        quantityXl_buy_price: "",
        quantityXl_selling_price: "",
        quantity2Xl: "",
        quantity_2Xl_id: "",
        quantity2Xl_buy_price: "",
        quantity2Xl_selling_price: "",
        product_febric_id: "",
        product_febric: "",
        color: [],
        imageArray: [],
        images1: "",
        images2: "",
        images3: "",
        images4: "",
        images5: "",
        saree_length: 5.5,
        blouse: "No",
        blouse_length: ".8",
        weight:"",
        youtube_link: "",
        fabric_care: "",
        bill_id_and_shop_id: ""
    }
    if(id !=""){
        let whereCluse = {}
        whereCluse['id'] = id;

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
            },{
                model: productImageModel,
                as: 'Product_Image'
            }
            ]
        })
        .then((products) => {
        // Access the data from the three tables
            //console.log(products)
            products.forEach((product) => {
           // console.log('User:', products);
                productHash['category_id'] = product.category_id;
                productHash['sub_category_id'] = product.sub_category_id;
                productHash['product_name'] = product.product_name;
                productHash['active_status'] = product.active_status;
                productHash['company_name'] = product.company_name;
                productHash['year_month'] = product.year_month;
                productHash['product_offer_percentage'] = product.product_offer_percentage;
                productHash['product_febric'] = product.product_febric;
                productHash['product_febric_id'] = product.product_febric_id;
                productHash['color'] = product.color.split(", ");
                productHash['saree_length'] = product.saree_length;
                productHash['blouse'] = product.blouse;
                productHash['blouse_length'] = product.blouse_length;
                productHash['weight'] = product.weight;
                productHash['youtube_link'] = product.youtube_link;
                productHash['delivery_charges'] = product.delivery_charges;
                productHash['fabric_care'] = product.fabric_care;
                productHash['bill_id_and_shop_id'] = product.bill_id+"@"+product.shop_id;

                const quantityArray = [];
                product.Quantity.forEach((quantity) => {
                    //console.log('---------------------------');
                    //console.log('Post:', quantityS.toJSON());
                    quantityArray.push(quantity.no_of_product);
                    if(quantity.size == "XS"){
                        productHash['quantityXs'] = quantity.no_of_product;
                        productHash['quantity_Xs_id'] = quantity.id;
                        productHash['quantityXs_buy_price'] = quantity.buy_price;
                        productHash['quantityXs_selling_price'] = quantity.sell_price;
                    }else if(quantity.size == "S"){
                        productHash['quantityS'] = quantity.no_of_product;
                        productHash['quantity_S_id'] = quantity.id;
                        productHash['quantityS_buy_price'] = quantity.buy_price;
                        productHash['quantityS_selling_price'] = quantity.sell_price;
                    }else if(quantity.size == "L"){
                        productHash['quantityL'] = quantity.no_of_product;
                        productHash['quantity_L_id'] = quantity.id;
                        productHash['quantityL_buy_price'] = quantity.buy_price;
                        productHash['quantityL_selling_price'] = quantity.sell_price;
                    }else if(quantity.size == "M"){
                        productHash['quantityM'] = quantity.no_of_product;
                        productHash['quantity_M_id'] = quantity.id;
                        productHash['quantityM_buy_price'] = quantity.buy_price;
                        productHash['quantityM_selling_price'] = quantity.sell_price;
                    }else if(quantity.size == "XL"){
                        productHash['quantityXl'] = quantity.no_of_product;
                        productHash['quantity_Xl_id'] = quantity.id;
                        productHash['quantityXl_buy_price'] = quantity.buy_price;
                        productHash['quantityXl_selling_price'] = quantity.sell_price;
                    }else if(quantity.size == "2XL"){
                        productHash['quantity2Xl'] = quantity.no_of_product;
                        productHash['quantity_2Xl_id'] = quantity.id;
                        productHash['quantity2Xl_buy_price'] = quantity.buy_price;
                        productHash['quantity2Xl_selling_price'] = quantity.sell_price;
                    }else{
                        productHash['quantity'] = quantity.no_of_product;
                        productHash['quantity_id'] = quantity.id;
                        productHash['quantity_buy_price'] = quantity.buy_price;
                        productHash['quantity_selling_price'] = quantity.sell_price;
                    }
                });
                let imageArray = [];
                let imageHash = {};
                product.Product_Image.forEach((productImage, key) => {
                    //productHash['images'+(key+1)] = productImage.image_name;
                    imageArray.push(productImage.image_name);
                    imageHash[productImage.image_name] = {id: productImage.id, product_id: productImage.product_id, primary: productImage.primary}
                })
                productHash['imageArray'] = imageArray;
                productHash['imageHash'] = imageHash;
            });
            
        })
        .catch((error) => {
         console.error('Error:', error);
        });
    }
    return res.status(200).send(productHash);
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

async function handalDeleteProductImage(req, res){
    let errorMessage = "";
    let errorMessage2 = "";
    try {
        productImageModel.findOne({
            where: {
                id: req.body.image_id, // Specify the condition to match (e.g., id = 1)
                product_id: req.body.product_id
            },
        })
        .then(images => {
            if(images.dataValues.primary === 1){
                errorMessage2 = ".\nPlease set Primary Image"
            }
            
            const deletedImages = productImageModel.destroy({
                where: {
                    id: req.body.image_id, 
                    product_id: req.body.product_id
                },
            }).then(images =>{
                if (images === 1) {
                    console.log('Image deleted successfully.');
                    errorMessage = "Image deleted successfully.";
                    const imagePath = '/Bapan/React/frontend_nomi/src/images/product/'+req.body.image;
                    fs.unlink(imagePath, (err) => {
                        if (err) {
                        console.error('Error deleting the image:', err);
                        return;
                        }
                    
                        console.log('Image deleted successfully.');
                    });
                } else {
                    console.log('Image not found.');
                    errorMessage = "Image not found.";
                }
            });
        })
    } catch (error) {
        console.error('Error deleting Image:', error);
        errorMessage = 'Error deleting Image:';
    }

    return res.status(200).send(errorMessage+" "+errorMessage2);
}

async function productAactiveInactive(req, res){
    let errorMessage = "";
    await ProductModel.update(
        {active_status: req.body.active_status}, 
        { where: { id: req.body.id } } 
    ).then((count) => {
        errorMessage = `Updated ${count} record(s).`;
    })
      .catch((error) => {
        errorMessage = 'Error occurred during update';
    });

    return res.status(200).send(errorMessage);
}

async function findProductImage(req, res){
    console.log("req.body.product_id", req.body.product_id);
    const productImageObj = await productImageModel.findAll({
        where: {
            product_id: req.body.product_id
        }, order: [
            ['primary', 'DESC']
        ]
    })
    return res.status(200).send(productImageObj);
}

async function setPrimaryImage(req, res){
    let errorMessage = "";
    await productImageModel.update(
        {primary: 0}, 
        { where: { product_id: req.body.product_id } } 
    ).then((count) => {
        if(count > 0){
            productImageModel.update(
                {primary: 1}, 
                { where: { id: req.body.id } } 
            ).then((count1) => {
                errorMessage = `Updated ${count1} record(s).`;
            })
        }else{
            errorMessage = `Error occurred during update`;
        }
    })
      .catch((error) => {
        errorMessage = 'Error occurred during update';
    });

    return res.status(200).send(errorMessage);
}

async function fetchItemTypeList(req, res) {
    let subCategoryArry = [];
  
    try {
        const category = await categoryModel.findOne({
            where: {
                category_name: {
                    [Op.like]: `%${req.body.items}%`
                }
            }
        });
  
        const subCategories = await subCategoryModel.findAll({
            where: {
                category_id: category.dataValues.id
            }
        });
  
        subCategories.forEach((obj) => {
            let inner_hash = {};
            inner_hash['id'] = obj.id;
            inner_hash['label'] = obj.sub_category_name;
            subCategoryArry.push(inner_hash);
        });
        return res.status(200).send(subCategoryArry);
    } catch (error) {
        console.error(error);
        return res.status(500).send('Error occurred');
    }
}

async function getItemsList(req, res){
    //console.log("getItemsList");
    //console.log(req.body);

    // Where condition with Active status
    let whereCluse = {
        active_status: 1
    }

    // Fabric Where candition
    if(req.body.fabric.length > 0){
        whereCluse['product_febric_id'] = {
            [Op.in]: req.body.fabric
        }
    }

    // Color Where candition
    if(req.body.color.length > 0){
        whereCluse[Op.or] = [];
        req.body.color.forEach((color) => {
            let inner_hash = {
                color: {
                    [Op.like]: `%${color}%`
                }
            }
            whereCluse[Op.or].push(inner_hash);
        });
    }
    
    let whereInclude = []
    // Image mmodel
    whereInclude.push({model: productImageModel, as: 'Product_Image'});

    // For category wise
    if(req.body.serchFor !=""){
        whereInclude.push({
            model: categoryModel, 
            as: 'Category',
            where: {
                category_name: {
                    [Op.like]: `%${req.body.serchFor}%`
                }
            }
        });
    }

    // Price Where candition
    let quantityTableWhereCon = {
        model: quantityModel,
        as: 'Quantity',
        where: {}
    }
    if(req.body.price.length > 0){
        
        quantityTableWhereCon['where'][Op.or]=[]
        
        req.body.price.forEach((priceRange) => {
            const priceArray = priceRange.split("-");
            let inner_hash = {
                sell_price: {
                    [Op.between]: [priceArray[0], priceArray[1]]
                }
            }
            quantityTableWhereCon['where'][Op.or].push(inner_hash)
        });
        // Include condition
        if (Object.keys(quantityTableWhereCon).length  > 1) {
            whereInclude.push(quantityTableWhereCon);
        }
    }else{
        whereInclude.push(quantityTableWhereCon);
    }

    // Type Where candition
    if(req.body.type.length > 0){
        const originalArray = req.body.type;
        const filteredArray = originalArray.filter(item => !!item);
        if(filteredArray.length > 0){
            whereCluse['sub_category_id'] = {
                [Op.in]: req.body.type
            }
        }
    }

    // Care instruction Where candition
    if(req.body.careInstruction.length > 0){
        whereCluse['fabric_care'] = {
            [Op.in]: req.body.careInstruction
        }
    }

    // Discount Where candition
    if(req.body.discount.length > 0){
        whereCluse['product_offer_percentage'] = {
            [Op.in]: req.body.discount
        }
    }
    
    const productArray = [];
    let itemsListArray = [];
    await ProductModel.findAll({
        where: whereCluse,
        attributes: ['id', 'product_name', 'product_offer_percentage', 'company_name'],
        include: whereInclude,
        order: [
            ['createdAt', 'DESC'],
            [{ model: productImageModel, as: 'Product_Image' }, 'primary', 'DESC']
        ]  
    })
    .then((products) => {
        //console.log(products);


        products.forEach((product) => {
            //console.log('User:', products);
            let inner_hash = {
                items_id: product.id,
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

                        newPercentage = Math.floor((((quantity.sell_price + offerPrice) - quantity.sell_price)/(quantity.sell_price + offerPrice))*100);
                    }
                    inner_hash['offerPrice'] = quantity.sell_price + offerPrice;
                    inner_hash['newPercentage'] = newPercentage;
                })
            }

            itemsListArray.push(inner_hash);
        });

    })
    return res.status(200).send(itemsListArray);
}

// FrontEnd
function findItemDetailsUsingId(id, group_id="") {
    let whereCluse = {}
    if(group_id ==""){
        whereCluse["id"] = id;
    }else{
        whereCluse["id"] = {
            [Op.notIn]: [id]
        }

        whereCluse["group_id"] = {
            [Op.eq]: group_id
        }
    }
   // console.log(whereCluse);
   /// return false;
    return ProductModel.findAll({
      where: whereCluse,
      include: [
        {
          model: quantityModel,
          as: 'Quantity'
        },
        {
          model: productImageModel,
          as: 'Product_Image'
        }
      ]
    });
}

async function getItemsDetails(req, res){
    const id = req.body.id;
    
    const productObj = await findItemDetailsUsingId(id);
    // console.log(productObj);



    const productArray = [];
    productObj.forEach((productObj) => {
        const inner_hash = {
            item_id: productObj.id,
            category_id: productObj.category_id,
            sub_category_id: productObj.sub_category_id,
            product_name: productObj.product_name,
            company_name: productObj.company_name,
            product_offer_percentage: productObj.product_offer_percentage,
            delivery_charges: productObj.delivery_charges,
            product_febric: productObj.product_febric,
            color: productObj.color,
            saree_length: productObj.saree_length,
            blouse: productObj.blouse,
            blouse_length: productObj.blouse_length,
            weight: productObj.weight,
            youtube_link: productObj.youtube_link,
            fabric_care: productObj.fabric_care,
            itemImageArray: [],
            quantity: [],
            group_id: productObj.group_id,
            occasion: productObj.occasion,
            productSize: []
        }
        
        productObj.Product_Image.forEach((imgObj) => {
            inner_hash["itemImageArray"].push(imgObj.image_name);
        })
        let productSize = [];
        productObj.Quantity.forEach((quantityObj) => {
            let offerPrice = 0;
            let newPercentage = 0;
            if (productObj.product_offer_percentage > 0){
                offerPrice = quantityObj.sell_price * productObj.product_offer_percentage/100;
                newPercentage = Math.floor((((quantityObj.sell_price + offerPrice) - quantityObj.sell_price)/(quantityObj.sell_price + offerPrice))*100);
            }
            const quantityHash = {
                no_of_product: quantityObj.no_of_product,
                size: quantityObj.size,
                sell_price: quantityObj.sell_price,
                offerPrice: quantityObj.sell_price + offerPrice,
                newPercentage: newPercentage
            }
            productSize.push(quantityObj.size);
            inner_hash["quantity"].push(quantityHash);
        })
        inner_hash["productSize"] = productSize;
        productArray.push(inner_hash);
    })
    // Handle the productObj as needed
    return res.status(200).send(productArray);
}

async function getSimilarProducts(req, res){
    // Where condition with Active status
    let whereCluse = {
        active_status: 1
    }
    let sub_category_id = req.body.sub_category_id;
    whereCluse[Op.or] = [];
    if(sub_category_id !=""){
        whereCluse[Op.or].push({
            sub_category_id:sub_category_id
        });
    }
    if(req.body.color != ""){
        req.body.color.split(", ").forEach((color) => {
            let inner_hash = {
                color: {
                    [Op.like]: `%${color}%`
                }
            }
            whereCluse[Op.or].push(inner_hash);
        });
    }
    
    let itemsListArray = [];
    await ProductModel.findAll({
        where: whereCluse,
        attributes: ['id', 'product_name', 'product_offer_percentage', 'company_name'],
        include: [{
            model: productImageModel,
            as: "Product_Image"
        },{
            model: quantityModel,
            as: 'Quantity'
          }],
        order: [
            ['createdAt', 'DESC'],
            [{ model: productImageModel, as: 'Product_Image' }, 'primary', 'DESC']
        ]  
    })
    .then((products) => {
        products.forEach((product) => {
            //console.log('User:', products);
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

                        newPercentage = Math.floor((((quantity.sell_price + offerPrice) - quantity.sell_price)/(quantity.sell_price + offerPrice))*100);
                    }
                    inner_hash['offerPrice'] = quantity.sell_price + offerPrice;
                    inner_hash['newPercentage'] = newPercentage;
                })
            }

            itemsListArray.push(inner_hash);
        });
    })
    return res.status(200).send(itemsListArray);
}

async function getSareeListForHomePage(req, res){
    try {
        let itemsListArray = [];
        let itemListHash = {};
        const groupedData = await ProductModel.findAll({
           // group: ['Product.sub_category_id'],
            include: [{
                model: productImageModel,
                as: "Product_Image"
            },{
                model: quantityModel,
                as: 'Quantity'
              },{
                model: categoryModel,
                as: 'Category'
              },{
                model: subCategoryModel,
                as: 'SubCategory'
              }],
            order: [
                ['updatedAt', 'DESC'],
                [{ model: productImageModel, as: 'Product_Image' }, 'primary', 'DESC']
            ]  
        }).then((products) => {
            products.forEach((product) => {
                console.log(product.category_id.toString() in itemListHash)
                if (product.category_id.toString() in itemListHash) {
                }else{
                    itemListHash[product.category_id] = [];
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
                        if(product.product_offer_percentage > 0){
                            offerPrice = quantity.sell_price * product.product_offer_percentage/100
                        }
                        inner_hash['offerPrice'] = quantity.sell_price + offerPrice;
                    })
                }

                inner_hash['category_name'] = product.Category.category_name;
                inner_hash['sub_category_id'] = product.SubCategory.id;
                inner_hash['sub_category_name'] = product.SubCategory.sub_category_name;
    
                itemListHash[product.category_id].push(inner_hash);
                itemsListArray.push(inner_hash)
            });
        })
    
        return res.status(200).send(itemListHash);
    } catch (error) {
        console.error('Error retrieving grouped data:', error);
        throw error;
    }
}
 
module.exports = {
    handalSaveProduct, handalAllProduct, handalFindProductById, handalDeleteProductById, handalUpdateGroupId, handalDeleteProductImage, productAactiveInactive, findProductImage, setPrimaryImage, fetchItemTypeList, getItemsList, getItemsDetails, getSimilarProducts, getSareeListForHomePage
}
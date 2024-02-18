//const {db} = require('../../database/connection');
const sequelize = require('../../database/connection');
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
const stockModel = require("../models/stockModel");

const Nodelogger = require("../loger/winstonlogger")
 



async function handalSaveProduct(req, res){
    Nodelogger.info("handalSaveProduct: "+path.basename(__filename));
    Nodelogger.info(req.body);
    try{
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
                        occasion: req.body.occasion.join(', '),
                        saree_length: req.body.saree_length,
                        blouse: req.body.blouse,
                        blouse_length: req.body.blouse_length,
                        weight: req.body.weight,
                        youtube_link: req.body.youtube_link,
                        fabric_care: req.body.fabric_care,
                        bill_id: bill_id,
                        shop_id: shop_id,
                        return_avaliable: req.body.return_avaliable,
                        material: req.body.material,
                        stone_type: req.body.stone_type
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
                                        req.body.quantity_selling_price,
                                        req.body.quantity_mrp_price
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
                                        req.body.quantityXs_selling_price,
                                        req.body.quantityXs_mrp_price
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
                                        req.body.quantityS_selling_price,
                                        req.body.quantityS_mrp_price
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
                                        req.body.quantityL_selling_price,
                                        req.body.quantityL_mrp_price
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
                                        req.body.quantityM_selling_price,
                                        req.body.quantityM_mrp_price
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
                                        req.body.quantityXl_selling_price,
                                        req.body.quantityXl_mrp_price
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
                                        req.body.quantity2Xl_selling_price,
                                        req.body.quantity2Xl_mrp_price
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
                const stockQuantityArray = [];

                if (req.body.quantity > 0){
                    quantityArray.push(
                        {
                            product_id: productId,
                            no_of_product: req.body.quantity,
                            size: "",
                            buy_price: req.body.quantity_buy_price,
                            sell_price: req.body.quantity_selling_price,
                            mrp_price: req.body.quantity_mrp_price
                        }
                    )

                    stockQuantityArray.push({
                        product_id: productId,
                        bill_id: bill_id,
                        no_of_product: req.body.quantity,
                        size: "",
                        buy_price: req.body.quantity_buy_price,
                        sell_price: req.body.quantity_selling_price,
                        status: "Complete",
                        mrp_price: req.body.quantity_mrp_price
                    });
                }
                if (req.body.quantityXs > 0){
                    quantityArray.push(
                        {
                            product_id: productId,
                            no_of_product: req.body.quantityXs,
                            size: "XS",
                            buy_price: req.body.quantityXs_buy_price,
                            sell_price: req.body.quantityXs_selling_price,
                            mrp_price: req.body.quantityXs_mrp_price
                        }
                    )

                    stockQuantityArray.push({
                        product_id: productId,
                        bill_id: bill_id,
                        no_of_product: req.body.quantityXs,
                        size: "XS",
                        buy_price: req.body.quantityXs_buy_price,
                        sell_price: req.body.quantityXs_selling_price,
                        status: "Complete",
                        mrp_price: req.body.quantityXs_mrp_price
                    });
                }
                if (req.body.quantityS > 0){
                    quantityArray.push(
                        {
                            product_id: productId,
                            no_of_product: req.body.quantityS,
                            size: "S",
                            buy_price: req.body.quantityS_buy_price,
                            sell_price: req.body.quantityS_selling_price,
                            mrp_price: req.body.quantityS_mrp_price
                        }
                    )

                    // Stock
                    stockQuantityArray.push({
                        product_id: productId,
                        bill_id: bill_id,
                        no_of_product: req.body.quantityS,
                        size: "S",
                        buy_price: req.body.quantityS_buy_price,
                        sell_price: req.body.quantityS_selling_price,
                        status: "Complete",
                        mrp_price: req.body.quantityS_mrp_price
                    });
                }
                if (req.body.quantityL > 0){
                    quantityArray.push(
                        {
                            product_id: productId,
                            no_of_product: req.body.quantityL,
                            size: "L",
                            buy_price: req.body.quantityL_buy_price,
                            sell_price: req.body.quantityL_selling_price,
                            mrp_price: req.body.quantityL_mrp_price
                        }
                    )

                    // Stock
                    stockQuantityArray.push({
                        product_id: productId,
                        bill_id: bill_id,
                        no_of_product: req.body.quantityL,
                        size: "L",
                        buy_price: req.body.quantityL_buy_price,
                        sell_price: req.body.quantityL_selling_price,
                        status: "Complete",
                        mrp_price: req.body.quantityL_mrp_price
                    });
                }
                if (req.body.quantityM > 0){
                    quantityArray.push(
                        {
                            product_id: productId,
                            no_of_product: req.body.quantityM,
                            size: "M",
                            buy_price: req.body.quantityM_buy_price,
                            sell_price: req.body.quantityM_selling_price,
                            mrp_price: req.body.quantityM_mrp_price
                        }
                    )

                    // Stock
                    stockQuantityArray.push({
                        product_id: productId,
                        bill_id: bill_id,
                        no_of_product: req.body.quantityM,
                        size: "M",
                        buy_price: req.body.quantityM_buy_price,
                        sell_price: req.body.quantityM_selling_price,
                        status: "Complete",
                        mrp_price: req.body.quantityM_mrp_price
                    });
                }
                if (req.body.quantityXl > 0){
                    quantityArray.push(
                        {
                            product_id: productId,
                            no_of_product: req.body.quantityXl,
                            size: "XL",
                            buy_price: req.body.quantityXl_buy_price,
                            sell_price: req.body.quantityXl_selling_price,
                            mrp_price: req.body.quantityXl_mrp_price
                        }
                    )

                    // Stock
                    stockQuantityArray.push({
                        product_id: productId,
                        bill_id: bill_id,
                        no_of_product: req.body.quantityXl,
                        size: "XL",
                        buy_price: req.body.quantityXl_buy_price,
                        sell_price: req.body.quantityXl_selling_price,
                        status: "Complete",
                        mrp_price: req.body.quantityXl_mrp_price
                    });
                }

                if (req.body.quantity2Xl > 0){
                    quantityArray.push(await createQuantityHash(productId, 
                                                        req.body.quantity2Xl,
                                                        size="2XL", 
                                                        req.body.quantity2Xl_buy_price, 
                                                        req.body.quantity2Xl_selling_price,
                                                        req.body.quantity2Xl_mrp_price
                                                        )
                                                    );

                    // Stock
                    stockQuantityArray.push({
                        product_id: productId,
                        bill_id: bill_id,
                        no_of_product: req.body.quantity2Xl,
                        size: "2XL",
                        buy_price: req.body.quantity2Xl_buy_price,
                        sell_price: req.body.quantity2Xl_selling_price,
                        status: "Complete",
                        mrp_price: req.body.quantity2Xl_mrp_price
                    });
                }

                if (req.body.quantity32 > 0){
                    quantityArray.push(await createQuantityHash(productId, 
                                                        req.body.quantity32,
                                                        size="32", 
                                                        req.body.quantity32_buy_price, 
                                                        req.body.quantity32_selling_price,
                                                        req.body.quantity32_mrp_price
                                                        )
                                                    );

                    // Stock
                    stockQuantityArray.push({
                        product_id: productId,
                        bill_id: bill_id,
                        no_of_product: req.body.quantity32,
                        size: "32",
                        buy_price: req.body.quantity32_buy_price,
                        sell_price: req.body.quantity32_selling_price,
                        status: "Complete",
                        mrp_price: req.body.quantity32_mrp_price
                    });
                }
                
                if (req.body.quantity34 > 0){
                    quantityArray.push(await createQuantityHash(productId, 
                                                        req.body.quantity34,
                                                        size="34", 
                                                        req.body.quantity34_buy_price, 
                                                        req.body.quantity34_selling_price,
                                                        req.body.quantity34_mrp_price
                                                        )
                                                    );

                    // Stock
                    stockQuantityArray.push({
                        product_id: productId,
                        bill_id: bill_id,
                        no_of_product: req.body.quantity34,
                        size: "34",
                        buy_price: req.body.quantity34_buy_price,
                        sell_price: req.body.quantity34_selling_price,
                        status: "Complete",
                        mrp_price: req.body.quantity34_mrp_price
                    });
                }
                
                if (req.body.quantity36 > 0){
                    quantityArray.push(await createQuantityHash(productId, 
                                                        req.body.quantity36,
                                                        size="36", 
                                                        req.body.quantity36_buy_price, 
                                                        req.body.quantity36_selling_price,
                                                        req.body.quantity36_mrp_price
                                                        )
                                                    );

                    // Stock
                    stockQuantityArray.push({
                        product_id: productId,
                        bill_id: bill_id,
                        no_of_product: req.body.quantity36,
                        size: "36",
                        buy_price: req.body.quantity36_buy_price,
                        sell_price: req.body.quantity36_selling_price,
                        status: "Complete",
                        mrp_price: req.body.quantity36_mrp_price
                    });
                }

                /*if(quantityArray.length == 0){
                    quantityArray.push(
                        {
                            product_id: productId,
                            no_of_product: 0,
                            size: "",
                            buy_price: 0,
                            sell_price: 0
                        }
                    )
                }*/

                //console.log(quantityArray);
                // stock insert
                stockModel.bulkCreate(stockQuantityArray);
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
                // /Bapan/React/frontend_nomi/src/images/product
                const imagePath = path.resolve('/home/nomimart/public_html/images/product/'+decodedImage.name);
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
        Nodelogger.info(" --------- handalSaveProduct Method End --------------------");
        return res.status(200).send("Save Successfully");
    } catch(error){
        Nodelogger.error("handalSaveProduct: "+path.basename(__filename));
        Nodelogger.error(error);
        return res.status(200).send("Error");
    }
}

async function createQuantityHash(id="", no_of_product=0, size="", buy_price=0, sell_price=0, mrp_price=0){
    Nodelogger.info("createQuantityHash: "+path.basename(__filename));
    Nodelogger.info("id: "+id+"no_of_product: "+no_of_product+"size: "+size+"buy_price: "+buy_price+"sell_price: "+sell_price);
    const inner_hash = {
        product_id: id,
        no_of_product: no_of_product,
        size: size,
        buy_price: buy_price,
        sell_price: sell_price,
        mrp_price: mrp_price
    }
    return inner_hash;
}

async function updateProductQuantity(id, updateHash){
    Nodelogger.info("updateProductQuantity: "+path.basename(__filename));
    Nodelogger.info("updateProductQuantity:"+ id +"=>"+ updateHash);
    try {
        await quantityModel.update(
            updateHash, 
            { where: { id: id } } 
        ).then((count) => {
            console.log(`Updated ${count} record(s).`);
        })
        .catch((error) => {
            console.error('Error occurred during update:', error);
        });
    } catch (error) {
        // Handle any errors here
        Nodelogger.error("updateProductQuantity: "+path.basename(__filename));
        Nodelogger.error(error);
    }
}

async function handalAllProduct(req, res) {
    Nodelogger.info("handalAllProduct: "+path.basename(__filename));
    Nodelogger.info(req.body);
    try {
        const whereClause = {};
  
        if (req.body.category_id !== "") {
            whereClause['category_id'] = req.body.category_id;
        }
  
        if (req.body.sub_category_id !== "") {
            whereClause['sub_category_id'] = req.body.sub_category_id;
        }
  
        if (req.body.active_status !== "") {
            whereClause['active_status'] = req.body.active_status;
        }
  
        const productArray = [];
  
        const products = await ProductModel.findAll({
            where: whereClause,
            include: [
                {
                    model: quantityModel,
                    as: 'Quantity',
                },
                {
                    model: categoryModel,
                    as: 'Category',
                },
                {
                    model: subCategoryModel,
                    as: 'SubCategory',
                },
                {
                    model: productImageModel,
                    as: 'Product_Image',
                }
            ],
            order: [['id', 'DESC']]
        });
  
        for (const product of products) {
            const {
                id,
                group_id,
                color,
                sub_category_id,
                active_status,
                Category: { category_name },
                SubCategory: { sub_category_name },
                youtube_link,
            } = product;
  
            const quantityArray = [];
  
            for (const quantity of product.Quantity) {
                quantityArray.push(quantity.no_of_product);
            }
  
            // Assuming getStock() is an asynchronous function
            const stockCount = await getStock(product.id);
  
            const innerProduct = {
                id,
                category_id: category_name,
                group_id,
                color,
                sub_category_id: sub_category_id,
                sub_category_desc: sub_category_name,
                no_of_product: quantityArray.reduce((sum, current) => sum + current, 0),
                quantity_xs: "",
                quantity_s: "",
                quantity_l: "",
                quantity_m: "",
                quantity_xl: "",
                quantity_2xl: "",
                stock: stockCount,
                active_status,
                youtube_link,
            };

            if(product.Product_Image !=undefined){
                let count = 0;
                for (const imgObj of product.Product_Image) {
                    if(count == 0 || imgObj.primary == 1){
                        innerProduct["product_img"] = imgObj.image_name;
                    }
                    count++;
                }
            }
  
            for (const quantity of product.Quantity) {
                const quantity_price = `${quantity.no_of_product} => ${quantity.buy_price} => ${quantity.sell_price}`;
  
                switch (quantity.size) {
                    case "XS":
                        innerProduct.quantity_xs = quantity_price;
                        break;
                    case "S":
                        innerProduct.quantity_s = quantity_price;
                        break;
                    case "L":
                        innerProduct.quantity_l = quantity_price;
                        break;
                    case "M":
                        innerProduct.quantity_m = quantity_price;
                        break;
                    case "XL":
                        innerProduct.quantity_xl = quantity_price;
                        break;
                    case "2XL":
                        innerProduct.quantity_2xl = quantity_price;
                        break;
                    default:
                        innerProduct.quantity = quantity_price;
                }
            }
            productArray.push(innerProduct);
        }
        return res.status(200).json(productArray);
    } catch (error) {
        Nodelogger.error("handalAllProduct: "+path.basename(__filename));
        Nodelogger.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}
  
async function getStock(product_id){
    Nodelogger.info("getStock: "+path.basename(__filename));
    Nodelogger.info("product_id: "+ product_id);
    try{
        const stockObj = await stockModel.findAll({
            where: {
                product_id: product_id,
                status: "Pending"
            },
        })
        return stockObj.length;
    }catch(error){
        Nodelogger.error("getStock");
        Nodelogger.error(error);
    }
}

async function handalFindProductById(req, res){
    Nodelogger.info("handalFindProductById: "+path.basename(__filename));
    Nodelogger.info(req.body);
    try {
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
            return_avaliable: "",
            quantity: "",
            quantity_id: "",
            quantity_buy_price: "",
            quantity_mrp_price: "",
            quantity_selling_price: "",
            quantityXs: "",
            quantity_Xs_id: "",
            quantityXs_buy_price: "",
            quantityXs_mrp_price: "",
            quantityXs_selling_price: "",
            quantityS: "",
            quantity_S_id: "",
            quantityS_buy_price: "",
            quantityS_mrp_price: "",
            quantityS_selling_price: "",
            quantityL: "",
            quantity_L_id: "",
            quantityL_buy_price: "",
            quantityL_mrp_price: "",
            quantityL_selling_price: "",
            quantityM: "",
            quantity_M_id: "",
            quantityM_buy_price: "",
            quantityM_mrp_price: "",
            quantityM_selling_price: "",
            quantityXl: "",
            quantity_Xl_id: "",
            quantityXl_buy_price: "",
            quantityXl_mrp_price: "",
            quantityXl_selling_price: "",
            quantity2Xl: "",
            quantity_2Xl_id: "",
            quantity2Xl_buy_price: "",
            quantity2Xl_mrp_price: "",
            quantity2Xl_selling_price: "",
            
            quantity32: "",
            quantity_32_id: "",
            quantity32_buy_price: "",
            quantity32_mrp_price: "",
            quantity32_selling_price: "",
            quantity34: "",
            quantity_34_id: "",
            quantity34_buy_price: "",
            quantity34_mrp_price: "",
            quantity34_selling_price: "",
            quantity36: "",
            quantity_36_id: "",
            quantity36_buy_price: "",
            quantity36_mrp_price: "",
            quantity36_selling_price: "",

            product_febric_id: "",
            product_febric: "",
            color: [],
            occassion: [],
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
            bill_id_and_shop_id: "",
            material: "",
            stone_type: ""
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
                let occasion = [];
                if(product.occasion != null){
                    occasion = product.occasion.split(', ');
                }

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
                    productHash['occasion'] = occasion;
                    productHash['saree_length'] = product.saree_length;
                    productHash['blouse'] = product.blouse;
                    productHash['blouse_length'] = product.blouse_length;
                    productHash['weight'] = product.weight;
                    productHash['youtube_link'] = product.youtube_link;
                    productHash['delivery_charges'] = product.delivery_charges;
                    productHash['return_avaliable'] = product.return_avaliable;
                    productHash['fabric_care'] = product.fabric_care;
                    productHash['bill_id_and_shop_id'] = product.bill_id+"@"+product.shop_id;
                    productHash['material'] = product.material;
                    productHash['stone_type'] = product.stone_type;

                    const quantityArray = [];
                    product.Quantity.forEach((quantity) => {
                        //console.log('---------------------------');
                        //console.log('Post:', quantityS.toJSON());
                        quantityArray.push(quantity.no_of_product);
                        if(quantity.size == "XS"){
                            productHash['quantityXs'] = quantity.no_of_product;
                            productHash['quantity_Xs_id'] = quantity.id;
                            productHash['quantityXs_buy_price'] = quantity.buy_price;
                            productHash['quantityXs_mrp_price'] = quantity.mrp_price;
                            productHash['quantityXs_selling_price'] = quantity.sell_price;
                        }else if(quantity.size == "S"){
                            productHash['quantityS'] = quantity.no_of_product;
                            productHash['quantity_S_id'] = quantity.id;
                            productHash['quantityS_buy_price'] = quantity.buy_price;
                            productHash['quantityS_mrp_price'] = quantity.mrp_price;
                            productHash['quantityS_selling_price'] = quantity.sell_price;
                        }else if(quantity.size == "L"){
                            productHash['quantityL'] = quantity.no_of_product;
                            productHash['quantity_L_id'] = quantity.id;
                            productHash['quantityL_buy_price'] = quantity.buy_price;
                            productHash['quantityL_mrp_price'] = quantity.mrp_price;
                            productHash['quantityL_selling_price'] = quantity.sell_price;
                        }else if(quantity.size == "M"){
                            productHash['quantityM'] = quantity.no_of_product;
                            productHash['quantity_M_id'] = quantity.id;
                            productHash['quantityM_buy_price'] = quantity.buy_price;
                            productHash['quantityM_mrp_price'] = quantity.mrp_price;
                            productHash['quantityM_selling_price'] = quantity.sell_price;
                        }else if(quantity.size == "XL"){
                            productHash['quantityXl'] = quantity.no_of_product;
                            productHash['quantity_Xl_id'] = quantity.id;
                            productHash['quantityXl_buy_price'] = quantity.buy_price;
                            productHash['quantityXl_mrp_price'] = quantity.mrp_price;
                            productHash['quantityXl_selling_price'] = quantity.sell_price;
                        }else if(quantity.size == "2XL"){
                            productHash['quantity2Xl'] = quantity.no_of_product;
                            productHash['quantity_2Xl_id'] = quantity.id;
                            productHash['quantity2Xl_buy_price'] = quantity.buy_price;
                            productHash['quantity2Xl_mrp_price'] = quantity.mrp_price;
                            productHash['quantity2Xl_selling_price'] = quantity.sell_price;
                        }else if(quantity.size == "32"){
                            productHash['quantity32'] = quantity.no_of_product;
                            productHash['quantity_32'] = quantity.id;
                            productHash['quantity32_buy_price'] = quantity.buy_price;
                            productHash['quantity32_mrp_price'] = quantity.mrp_price;
                            productHash['quantity32_selling_price'] = quantity.sell_price;
                        }else if(quantity.size == "34"){
                            productHash['quantity34'] = quantity.no_of_product;
                            productHash['quantity_34'] = quantity.id;
                            productHash['quantity34_buy_price'] = quantity.buy_price;
                            productHash['quantity34_mrp_price'] = quantity.mrp_price;
                            productHash['quantity34_selling_price'] = quantity.sell_price;
                        }else if(quantity.size == "36"){
                            productHash['quantity36'] = quantity.no_of_product;
                            productHash['quantity_36'] = quantity.id;
                            productHash['quantity36_buy_price'] = quantity.buy_price;
                            productHash['quantity36_mrp_price'] = quantity.mrp_price;
                            productHash['quantity36_selling_price'] = quantity.sell_price;
                        }else{
                            productHash['quantity'] = quantity.no_of_product;
                            productHash['quantity_id'] = quantity.id;
                            productHash['quantity_buy_price'] = quantity.buy_price;
                            productHash['quantity_mrp_price'] = quantity.mrp_price;
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
    } catch (error) {
        // Handle any errors here
        Nodelogger.error("handalFindProductById: "+path.basename(__filename));
        Nodelogger.error(error);
        return res.status(500).send(error);
    }
}

async function handalDeleteProductById(req, res){
    Nodelogger.info("handalDeleteProductById: "+path.basename(__filename));
    Nodelogger.info(req.body);
    try {
        const id = req.body.id;
        await ProductModel.update({ active_status: 0 }, {
            where: {
                id: req.body.id
            }
        });
        return res.status(200).send("Deleted Successfully");
    } catch (error) {
        // Handle any errors here
        Nodelogger.error("handalDeleteProductById");
        Nodelogger.error(error);
        return res.status(500).send(error);
    }
}

async function handalUpdateGroupId(req, res) {
    Nodelogger.info("handalUpdateGroupId: "+path.basename(__filename));
    Nodelogger.info(req.body);

    const product_id = req.body.product_id;
    const group_id = req.body.group_id;
    const sub_category_id = req.body.sub_category_id;
  
    try {
        // Find the product based on the provided group_id
        const product = await ProductModel.findOne({
            where: {
                group_id: group_id,
            },
            attributes: ['sub_category_id'],
        });
  
        if (!product) {
            return res.status(404).send({ message: "Product not found", msgFlag: "error" });
        }
  
        if (product.sub_category_id === sub_category_id) {
            // Update the product's group_id
            await ProductModel.update({ group_id: group_id }, {
                where: {
                    id: product_id,
                }
            });
  
            return res.status(200).send({ message: "Update Successfully", msgFlag: "success" });
        } else {
            return res.status(200).send({ message: "Sub-category mismatch", msgFlag: "error" });
        }
    } catch (error) {
        Nodelogger.error("handalUpdateGroupId: "+path.basename(__filename));
        Nodelogger.error(error);
        return res.status(500).send({ message: "Internal Server Error", msgFlag: "error" });
    }
}

async function handalCreateGroupID(req, res){
    Nodelogger.info("handalCreateGroupID: "+path.basename(__filename));
    Nodelogger.info(req.body);
    try {
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
    } catch (error) {
        Nodelogger.error("handalCreateGroupID: "+path.basename(__filename));
        Nodelogger.error(error);
        return res.status(500).send("Error");
    }
}

async function findProductSubCategory(product_ids){
    Nodelogger.info("findProductSubCategory: "+path.basename(__filename));
    Nodelogger.info("product_ids: "+ product_ids);
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
        Nodelogger.error("findProductSubCategory: "+path.basename(__filename));
        Nodelogger.error(error);
        return "Error"
    }
}

async function handalDeleteProductImage(req, res){
    Nodelogger.info("handalDeleteProductImage: "+path.basename(__filename));
    Nodelogger.info(req.body);
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
                    // /Bapan/React/frontend_nomi/src/images/product
                    const imagePath = '/home/nomimart/public_html/images/product/'+req.body.image;
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
        Nodelogger.error("handalDeleteProductImage: "+path.basename(__filename));
        Nodelogger.error(error);
        errorMessage = 'Error deleting Image:';
    }

    return res.status(200).send(errorMessage+" "+errorMessage2);
}

async function productAactiveInactive(req, res){
    Nodelogger.info("productAactiveInactive: "+path.basename(__filename));
    Nodelogger.info(req.body);
    try {
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
    } catch (error) {
        Nodelogger.error("productAactiveInactive: "+path.basename(__filename));
        Nodelogger.error(error);
        return res.status(200).send("Error occurred during update");
    }
}

async function findProductImage(req, res){
    Nodelogger.info("findProductImage: "+path.basename(__filename));
    Nodelogger.info(req.body);
    try {
        //console.log("req.body.product_id", req.body.product_id);
        const productImageObj = await productImageModel.findAll({
            where: {
                product_id: req.body.product_id
            }, order: [
                ['primary', 'DESC']
            ]
        })
        return res.status(200).send(productImageObj);
    } catch (error) {
        Nodelogger.error("findProductImage: "+path.basename(__filename));
        Nodelogger.error(error);
        return res.status(200).send({});
    }
}

async function setPrimaryImage(req, res){
    Nodelogger.info("setPrimaryImage: "+path.basename(__filename));
    Nodelogger.info(req.body);
    try {
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
    } catch (error) {
        Nodelogger.error("setPrimaryImage: "+path.basename(__filename));
        Nodelogger.error(error);
        return res.status(200).send("Error occurred during update");
    }
}

async function fetchItemTypeList(req, res) {
    Nodelogger.info("fetchItemTypeList: "+path.basename(__filename));
    Nodelogger.info(req.body);
    let subCategoryArry = [];
  
    try {
        const category = await categoryModel.findOne({
            where: {
                category_name: {
                    [Op.like]: `%${req.body.items}%`
                }
            }
        });
        let whereClase = {active_status: 1}
        if (category) {
            whereClase = {
                category_id: category.dataValues.id,
                active_status: 1
            }
        }
  
        const subCategories = await subCategoryModel.findAll({
            where: whereClase
        });
  
        subCategories.forEach((obj) => {
            let inner_hash = {};
            inner_hash['id'] = obj.id;
            inner_hash['label'] = obj.sub_category_name;
            subCategoryArry.push(inner_hash);
        });
        return res.status(200).send(subCategoryArry);
    } catch (error) {
        Nodelogger.error("fetchItemTypeList: "+path.basename(__filename));
        Nodelogger.error(error);
        return res.status(500).send('Error occurred');
    }
}

async function getItemsList(req, res){
    Nodelogger.info("getItemsList: "+path.basename(__filename));
    Nodelogger.info(req.body);

    try {
        let subCategories = await subCategoryModel.findAll();
        let subCategoriesNamesArray = subCategories.map((subCategory) => subCategory.sub_category_name);

        // Where condition with Active status
        let whereCluse = {
            active_status: 1
        }

        let globalSearchString = req.body.globalSearch;

        if(globalSearchString !=""){
            req.body.serchFor = "";
        }

        // Fabric Where candition
        if(req.body.fabric.length > 0){
            whereCluse['product_febric_id'] = {
                [Op.in]: req.body.fabric
            }
        }

        // Color Where candition
        if(req.body.color.length > 0 ){
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
        if(req.body.serchFor !="" || globalSearchString !=""){
            let categoryWhereString = req.body.serchFor;
            
            if(globalSearchString !=""){
                if(subCategoriesNamesArray.includes(globalSearchString)){
                    categoryWhereString = globalSearchString;
                }
            }
            
            whereInclude.push({
                model: categoryModel, 
                as: 'Category',
                where: {
                    category_name: {
                        [Op.like]: `%${categoryWhereString}%`
                    }
                }
            });
        }

        // Price Where candition
        let quantityTableWhereCon = {
            model: quantityModel,
            as: 'Quantity',
            where: {
                no_of_product: {
                    [Op.gt]: 0,
                }
            }
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

        if(globalSearchString !=""){
            whereCluse[Op.or]=[];

            whereCluse[Op.or].push({ product_name: { [Op.like]: `%${globalSearchString}%` } });
            whereCluse[Op.or].push({ company_name: { [Op.like]: `%${globalSearchString}%` }  });
            whereCluse[Op.or].push({ occasion: { [Op.like]: `%${globalSearchString}%` }  });
            whereCluse[Op.or].push({ product_febric: { [Op.like]: `%${globalSearchString}%` }  });
            whereCluse[Op.or].push({ fabric_care: { [Op.like]: `%${globalSearchString}%` }  });
            whereCluse[Op.or].push({ color: { [Op.like]: `%${globalSearchString}%` }  });
        }
        
        const productArray = [];
        let itemsListArray = [];
        await ProductModel.findAll({
            where: whereCluse,
            attributes: ['id', 'product_name', 'product_offer_percentage', 'company_name'],
            include: whereInclude,
        /* order: [
                ['createdAt', 'DESC'],
                [{ model: productImageModel, as: 'Product_Image' }, 'primary', 'DESC']
            ]  */
            order: sequelize.literal('RAND()')
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
    } catch(error){
        Nodelogger.error("getItemsList: "+path.basename(__filename));
        Nodelogger.error(error);
        return res.status(500).send([]);
    }
}

// FrontEnd
function findItemDetailsUsingId(id, group_id="") {
    Nodelogger.info("findItemDetailsUsingId: "+path.basename(__filename));
    Nodelogger.info("id: "+id+"group_id: "+group_id);
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
    Nodelogger.info("getItemsDetails: "+path.basename(__filename));
    Nodelogger.info(req.body);
    try {
        const id = req.body.id;
        const productObj = await findItemDetailsUsingId(id);
        const productArray = [];
        productObj.forEach((productObj) => {
            let type = "Single Kurti";
            if(productObj.sub_category_id == 24){
                type = "Kurta With Pent";
            }else if(productObj.sub_category_id == 11){
                type = "Kurta, Trouser/Pant & Dupatta Set";
            }else if(productObj.sub_category_id == 16){
                type = "Salwar, Trouser/Pant & Dupatta Set";
            }
            // For Category
            if(productObj.category_id == 3){
                type = productObj.company_name;
            }

            // For Category
            if(productObj.category_id == 8){
                type = productObj.company_name;
            }

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
                productSize: [],
                return_avaliable: productObj.return_avaliable,
                type: type,
                material: productObj.material,
                stone_type: productObj.stone_type
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
    } catch(error){
        Nodelogger.error("getItemsDetails: "+path.basename(__filename));
        Nodelogger.error(error);
        return res.status(500).send([]);
    }
}

async function getSimilarProducts(req, res){
    Nodelogger.info("getSimilarProducts: "+path.basename(__filename));
    Nodelogger.info(req.body);
    try {
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
                as: 'Quantity',
                where: {
                    no_of_product: {
                        [Op.gt]: 0,
                    }
                }
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
    } catch(error){
        Nodelogger.error("getSimilarProducts: "+path.basename(__filename));
        Nodelogger.error(error);
        return res.status(200).send([]);
    }
}

async function getSareeListForHomePage(req, res){
    Nodelogger.info("getSareeListForHomePage: "+path.basename(__filename));
    Nodelogger.info(req.body);
    try {
        let itemsListArray = [];
        let itemListHash = {};


        const categories = await ProductModel.findAll({
            attributes: ['category_id'],
            group: ['category_id'],
        });


        const productCounts = await ProductModel.findAll({
            attributes: [
                [sequelize.fn('COUNT', sequelize.col('Product.id')), 'productCount'], // Count the number of products and alias it as 'productCount'
            ],
            include: [
                {
                    model: subCategoryModel,
                    as: 'SubCategory',
                },
            ],
            group: ['SubCategory.id'], // Group by SubCategory.id
            raw: true, // Return plain JSON objects
        });


        const productCountHash = productCounts.reduce((hash, item) => ({ ...hash, [item['SubCategory.id']]: item.productCount }), {});

        for (const category of categories) {
            const categoryId = category.getDataValue('category_id');

            const groupedData = await ProductModel.findAll({
            // group: ['Product.sub_category_id'],
                where:{
                    active_status: 1,
                    category_id: categoryId
                },
                include: [{
                    model: productImageModel,
                    as: "Product_Image"
                },{
                    model: quantityModel,
                    as: 'Quantity',
                    where: {
                        no_of_product: {
                            [Op.gt]: 0,
                        }
                    }/*,
                    order: [['no_of_product', 'DESC']]*/
                },{
                    model: categoryModel,
                    as: 'Category'
                },{
                    model: subCategoryModel,
                    as: 'SubCategory'
                }],
                /*order: [
                    ['updatedAt', 'DESC'],
                    [{ model: productImageModel, as: 'Product_Image' }, 'primary', 'DESC']
                ]  */
                group: ['group_id'],
                order: sequelize.literal('RAND()'),
                limit: 15,
                
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
                        company_name: product.company_name,
                        more_color: productCountHash[product.SubCategory.id] -1
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
                            
                            //let offerPrice = 0;
                            let offerPrice = quantity.mrp_price;
                            if(product.product_offer_percentage > 0){
                                //offerPrice = quantity.sell_price * product.product_offer_percentage/100
                                offerPrice = quantity.mrp_price;
                            }
                            inner_hash['offerPrice'] = offerPrice;
                            // inner_hash['offerPrice'] = quantity.sell_price + offerPrice;

                            let newPercentage = 0;
                            if (product.product_offer_percentage > 0){
                                offerPrice = quantity.sell_price * product.product_offer_percentage/100;
                                newPercentage = Math.floor((((quantity.sell_price + offerPrice) - quantity.sell_price)/(quantity.sell_price + offerPrice))*100);
                            }
                            inner_hash['product_offer_percentage'] = newPercentage;
                        })
                    }

                    inner_hash['category_name'] = product.Category.category_name;
                    inner_hash['sub_category_id'] = product.SubCategory.id;
                    inner_hash['sub_category_name'] = product.SubCategory.sub_category_name;
        
                    itemListHash[product.category_id].push(inner_hash);
                    itemsListArray.push(inner_hash)
                });
            })
        }
    
        return res.status(200).send(itemListHash);
    } catch (error) {
        Nodelogger.error("getSareeListForHomePage: "+path.basename(__filename));
        Nodelogger.error(error);
        return res.status(500).send([]);
    }
}

async function allProductStock(req, res){
    Nodelogger.info("allProductStock: "+path.basename(__filename));
    Nodelogger.info(req.body);
    try{
        let stockArray = [];
        const stockObj = await stockModel.findAll({
            where: {
                product_id: req.body.product_id
            }, 
            order: [['status', 'DESC'],['createdAt', 'DESC']]
        }).then((stock) => {
            stock.forEach((obj) => {
                let inner_hash = {
                    id: obj.id,
                    product_id: obj.product_id,
                    no_of_product: obj.no_of_product,
                    buy_price: obj.buy_price,
                    sell_price: obj.sell_price,
                    size: obj.size,
                    status: obj.status
                }

                stockArray.push(inner_hash);
            })
        })
        return res.status(200).send(stockArray);
    }catch(error){
        Nodelogger.error("allProductStock: "+path.basename(__filename));
        Nodelogger.error(error);
        return res.status(500).send([]);
    }
}

async function saveProductStock(req, res){
    Nodelogger.info("saveProductStock: "+path.basename(__filename));
    Nodelogger.info(req.body);
    try{ 
        const quantityArray = [];
        if (req.body.quantity > 0){
            quantityArray.push(
                {
                    product_id: req.body.order_id,
                    bill_id: req.body.bill_id_and_shop_id.split("@")[0],
                    no_of_product: req.body.quantity,
                    size: "",
                    buy_price: req.body.quantity_buy_price,
                    mrp_price: req.body.quantity_mrp_price,
                    sell_price: req.body.quantity_selling_price
                }
            )
        }
        if (req.body.quantityXs > 0){
            quantityArray.push(
                {
                    product_id: req.body.order_id,
                    bill_id: req.body.bill_id_and_shop_id.split("@")[0],
                    no_of_product: req.body.quantityXs,
                    size: "XS",
                    buy_price: req.body.quantityXs_buy_price,
                    mrp_price: req.body.quantityXs_mrp_price,
                    sell_price: req.body.quantityXs_selling_price
                }
            )
        }
        if (req.body.quantityS > 0){
            quantityArray.push(
                {
                    product_id: req.body.order_id,
                    bill_id: req.body.bill_id_and_shop_id.split("@")[0],
                    no_of_product: req.body.quantityS,
                    size: "S",
                    buy_price: req.body.quantityS_buy_price,
                    mrp_price: req.body.quantityS_mrp_price,
                    sell_price: req.body.quantityS_selling_price
                }
            )
        }
        if (req.body.quantityL > 0){
            quantityArray.push(
                {
                    product_id: req.body.order_id,
                    bill_id: req.body.bill_id_and_shop_id.split("@")[0],
                    no_of_product: req.body.quantityL,
                    size: "L",
                    buy_price: req.body.quantityL_buy_price,
                    mrp_price: req.body.quantityL_mrp_price,
                    sell_price: req.body.quantityL_selling_price
                }
            )
        }
        if (req.body.quantityM > 0){
            quantityArray.push(
                {
                    product_id: req.body.order_id,
                    bill_id: req.body.bill_id_and_shop_id.split("@")[0],
                    no_of_product: req.body.quantityM,
                    size: "M",
                    buy_price: req.body.quantityM_buy_price,
                    mrp_price: req.body.quantityM_mrp_price,
                    sell_price: req.body.quantityM_selling_price
                }
            )
        }
        if (req.body.quantityXl > 0){
            quantityArray.push(
                {
                    product_id: req.body.order_id,
                    bill_id: req.body.bill_id_and_shop_id.split("@")[0],
                    no_of_product: req.body.quantityXl,
                    size: "XL",
                    buy_price: req.body.quantityXl_buy_price,
                    mrp_price: req.body.quantityXl_mrp_price,
                    sell_price: req.body.quantityXl_selling_price
                }
            )
        }

        if (req.body.quantity2Xl > 0){
            quantityArray.push(
                {
                    product_id: req.body.order_id,
                    bill_id: req.body.bill_id_and_shop_id.split("@")[0],
                    no_of_product: req.body.quantity2Xl,
                    size: "2XL",
                    buy_price: req.body.quantity2Xl_buy_price,
                    mrp_price: req.body.quantity2Xl_mrp_price,
                    sell_price: req.body.quantity2Xl_selling_price
                }
            )
        }

        if (req.body.quantity32 > 0){
            quantityArray.push(
                {
                    product_id: req.body.order_id,
                    bill_id: req.body.bill_id_and_shop_id.split("@")[0],
                    no_of_product: req.body.quantity32,
                    size: "32",
                    buy_price: req.body.quantity32_buy_price,
                    mrp_price: req.body.quantity32_mrp_price,
                    sell_price: req.body.quantity32_selling_price
                }
            )
        }

        if (req.body.quantity34 > 0){
            quantityArray.push(
                {
                    product_id: req.body.order_id,
                    bill_id: req.body.bill_id_and_shop_id.split("@")[0],
                    no_of_product: req.body.quantity34,
                    size: "34",
                    buy_price: req.body.quantity34_buy_price,
                    mrp_price: req.body.quantity34_mrp_price,
                    sell_price: req.body.quantity34_selling_price
                }
            )
        }

        if (req.body.quantity36 > 0){
            quantityArray.push(
                {
                    product_id: req.body.order_id,
                    bill_id: req.body.bill_id_and_shop_id.split("@")[0],
                    no_of_product: req.body.quantity36,
                    size: "36",
                    buy_price: req.body.quantity36_buy_price,
                    mrp_price: req.body.quantity36_mrp_price,
                    sell_price: req.body.quantity36_selling_price
                }
            )
        }

        //console.log(quantityArray);
        const stockObj = await stockModel.bulkCreate(quantityArray);
        let returnMessage =  "Insert Successfully";
        if(stockObj.length == 0){
            returnMessage = "Error"
        }

        return res.status(200).send(returnMessage);
    } catch(error){
        Nodelogger.error("saveProductStock: "+path.basename(__filename));
        Nodelogger.error(error);
        return res.status(500).send("Error");
    }
}

async function updateQuantity(req, res) {
    Nodelogger.info("updateQuantity: "+path.basename(__filename));
    Nodelogger.info(req.body);
    try {
        // Find the stock item
        const stockObj = await stockModel.findOne({
            where: {
                id: req.body.id,
                status: "Pending"
            },
        });

        if (!stockObj) {
            return res.status(200).json({ message: 'Stock item not found' });
        }
  
      // Try to find the existing quantityModel record
        const qObj = await quantityModel.findOne({
            where: {
                product_id: stockObj.product_id,
                size: stockObj.size,
            },
        });

        let quantityHash = {
            product_id: stockObj.product_id,
            no_of_product: stockObj.no_of_product,
            size: stockObj.size,
            buy_price: stockObj.buy_price,
            mrp_price: stockObj.mrp_price,
            sell_price: stockObj.sell_price
        }

        if (!qObj) {
            // If the quantityModel record does not exist, create a new one
            const inserQuantity = await quantityModel.create(quantityHash);
            if(inserQuantity.dataValues.id > 0){
                await updateStockStatus(req.body.id)
            }
        } else {
            //console.log("----", qObj.dataValues.no_of_product)
            quantityHash["no_of_product"] = quantityHash["no_of_product"] + qObj.dataValues.no_of_product;
        // If the quantityModel record exists, update it
            const updateQuantity = await quantityModel.update(
                quantityHash,
                {
                    where: {
                        product_id: stockObj.product_id,
                        size: stockObj.size,
                    },
                }
            );

            if(updateQuantity.length > 0){
                await updateStockStatus(req.body.id)
            }
        }
  
        // Send a success response
        return res.status(200).json({ message: 'Quantity updated successfully' });
    } catch (error) {
        // Handle any errors that occur during the database operations
        Nodelogger.error("updateQuantity: "+path.basename(__filename));
        Nodelogger.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

async function updateStockStatus(id){
    const updateQuantity = await stockModel.update(
        {status: "Complete"},
        {
            where: {
                id: id
            },
        }
    );
}


async function deleteProductStock(req, res) {
    Nodelogger.info("deleteProductStock: "+path.basename(__filename));
    Nodelogger.info(req.body);
    try {
        const deletedOrdersCount = await stockModel.destroy({
            where: {
                id: req.body.id,
            },
        });
  
        if (deletedOrdersCount === 0) {
            return res.status(404).json({ message: 'Record not found' });
        }
  
        return res.status(200).json({ message: 'Record deleted successfully' });
    } catch (error) {
        // Handle any errors that occur during the database operations
        Nodelogger.error("deleteProductStock: "+path.basename(__filename));
        Nodelogger.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}
  
  
  
 
module.exports = {
    handalSaveProduct, handalAllProduct, handalFindProductById, handalDeleteProductById, handalUpdateGroupId, handalCreateGroupID, handalDeleteProductImage, productAactiveInactive, findProductImage, setPrimaryImage, fetchItemTypeList, getItemsList, getItemsDetails, getSimilarProducts, getSareeListForHomePage, allProductStock, saveProductStock, updateQuantity, deleteProductStock
}
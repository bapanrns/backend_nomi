const {db} = require('../../database/connection');

const SubCategoryModel = require("../models/subCategoryModel");
const ProductFabricModel = require("../models/productFabricModel");


async function handalSaveProductFabric(req, res){
    //const { name } = req.body;
   // console.log(`Received name: ${name}`);
   // console.log(req.body);
    const returnMessage = "";
    if(req.body.id > 0){
        // Edit
        await ProductFabricModel.update({ sub_category_id: req.body.sub_category_id, product_fabric_name: req.body.product_fabric_name,  active_status: req.body.status }, {
            where: {
                id: req.body.id
            }
        });
        
    }else{
        // Add
        const sub_category = await ProductFabricModel.create({ sub_category_id: req.body.sub_category_id, product_fabric_name: req.body.product_fabric_name,  active_status: req.body.status });
    }

    return res.status(200).send("Save Successfully");
}

async function handalAllProductFabric(req, res){

    //SubCategoryModel.findAll({ include: [ CategoryModel ], order: [ [ CategoryModel, 'category_name' ] ] });


    const fabric = await ProductFabricModel.findAll({ order: [["product_fabric_name", "ASC"]] });
    //console.log("All users:", JSON.stringify(JSON.stringify, null, 2));
    return res.status(200).send(fabric);
}

async function handalFindProductFabricById(req, res){
    const id = req.body.id;
    const category = await ProductFabricModel.findByPk(id);
    //console.log("All users:", JSON.stringify(JSON.stringify, null, 2));
    return res.status(200).send(category);
}

async function handalDeleteProductFabricById(req, res){
    const id = req.body.id;
    await ProductFabricModel.update({ active_status: 0 }, {
        where: {
            id: req.body.id
        }
    });
    return res.status(200).send("Deleted Successfully");
}

async function fetchFabricForFontend(req, res){
    let fabricArray = [];
    await ProductFabricModel.findAll()
    .then((fabric) => {
        // Access the data from the three tables
        //console.log(products)
        fabric.forEach((product) => {
            let inner_hash = {};
            inner_hash['id'] = product.id;
            inner_hash['label'] = product.product_fabric_name;
            fabricArray.push(inner_hash);
        })
    })
    return res.status(200).send(fabricArray);
}
 
module.exports = {
    handalSaveProductFabric, handalAllProductFabric, handalFindProductFabricById, handalDeleteProductFabricById, fetchFabricForFontend
}
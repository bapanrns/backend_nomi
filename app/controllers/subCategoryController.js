const {db} = require('../../database/connection');

const SubCategoryModel = require("../models/subCategoryModel");
const CategoryModel = require("../models/categoryModel");
const { Op } = require("sequelize");


async function handalSaveSubCategory(req, res){
    //const { name } = req.body;
   // console.log(`Received name: ${name}`);
   // console.log(req.body);
    const returnMessage = "";
    if(req.body.id > 0){
        // Edit
        await SubCategoryModel.update({ category_id: req.body.category_id, sub_category_name: req.body.subCategory,  active_status: req.body.status }, {
            where: {
                id: req.body.id
            }
        });
        
    }else{
        // Add
        const sub_category = await SubCategoryModel.create({ category_id: req.body.category_id, sub_category_name: req.body.subCategory,  active_status: req.body.status});
    }

    return res.status(200).send("Save Successfully");
}

async function handalAllSubCategory(req, res){

    //SubCategoryModel.findAll({ include: [ CategoryModel ], order: [ [ CategoryModel, 'category_name' ] ] });


    const subCategory = await SubCategoryModel.findAll();
    //console.log("All users:", JSON.stringify(JSON.stringify, null, 2));
    return res.status(200).send(subCategory);
}

async function handalFindSubCategoryById(req, res){
    const id = req.body.id;
    const category = await SubCategoryModel.findByPk(id);
    //console.log("All users:", JSON.stringify(JSON.stringify, null, 2));
    return res.status(200).send(category);
}

async function handalDeleteSubCategoryById(req, res){
    const id = req.body.id;
    await SubCategoryModel.update({ active_status: 0 }, {
        where: {
            id: req.body.id
        }
    });
    return res.status(200).send("Deleted Successfully");
}

async function handalFindSubCategoryByCategoryId(req, res){
    const id = req.body.id;
    //const category = await SubCategoryModel.findByPk(id);


    const subCategory = await SubCategoryModel.findAll({
        where: {
          [Op.and]: [
            { category_id : id },
            { active_status: 1 }
          ]
        }
    });


    return res.status(200).send(subCategory);
}
 
module.exports = {
    handalSaveSubCategory, handalAllSubCategory, handalFindSubCategoryById, handalDeleteSubCategoryById, handalFindSubCategoryByCategoryId
}
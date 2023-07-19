const {db} = require('../../database/connection');

const SubCategoryModel = require("../models/subCategoryModel");
const CategoryModel = require("../models/categoryModel");
const { Op } = require("sequelize");


async function handalSaveSubCategory(req, res){
    //const { name } = req.body;
   // console.log(`Received name: ${name}`);
   // console.log(req.body);
    let returnMessage = "";
    const sub_category_name = req.body.subCategory
    const id = req.body.id
     // For insert
     let whereCluse = { 
        where: { sub_category_name }
    }
    // For Update
    if(id !== ""){
        whereCluse = {
            where: { sub_category_name, id: { [Op.notIn]: [id] } }
        }
    }
    
    const existingSubCat = await SubCategoryModel.findOne(whereCluse);
    if (existingSubCat) { 
        returnMessage = 'Sub-category already exists';
    }else{
        if(id > 0){
            // Edit
            const subCatObj = await SubCategoryModel.update({ category_id: req.body.category_id, sub_category_name: req.body.subCategory,  active_status: req.body.status }, {
                where: {
                    id: req.body.id
                }
            });
            if(subCatObj.length > 0){
                returnMessage = 'Sub-category update successfully';
            }
        }else{
            // Add
            const sub_category = await SubCategoryModel.create({ category_id: req.body.category_id, sub_category_name: req.body.subCategory,  active_status: req.body.status});

            if(sub_category.id > 0){
                returnMessage = 'Sub-category save successfully';
            }
        }
    }

    return res.status(200).send(returnMessage);
}

async function handalAllSubCategory(req, res){
    let whereCluse = {}
    if(req.body.category_id !="" && req.body.category_id != undefined){
        whereCluse['category_id'] = req.body.category_id;
    }
    
    const subCategoryArray = [];
    const subCategory = await SubCategoryModel.findAll({
            where: whereCluse,
            include: [
                {
                    model: CategoryModel,
                    as: 'Category'
                }
            ]
        }).then((category) => {
            category.forEach((obj) => {
                const inner_hash = {
                    id: obj['id'],
                    category_name: obj['Category']['category_name'],
                    sub_category_name: obj['sub_category_name'],
                    active_status: obj['active_status'],
                }
                subCategoryArray.push(inner_hash);
            })
        });
        
    return res.status(200).send(subCategoryArray);
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
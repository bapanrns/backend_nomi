const {db} = require('../../database/connection');

const CategoryModel = require("../models/categoryModel");


async function handalSaveCategory(req, res){
    let returnMessage = "";
    let category = null;
    const categoryHash = {
        category_name: req.body.category_name, 
        active_status: req.body.active_status
    }
    if(req.body.id > 0){
        // Edit
        category = await CategoryModel.update(categoryHash, {
            where: {
                id: req.body.id
            }
        });
        if(category.length > 0){
            returnMessage = "Update successfully";
        }
    }else{
        // Insert
        category = await CategoryModel.create(categoryHash);
        if(category.id > 0){
            returnMessage = "Insert successfully";
        }
    }
    
    return res.status(200).send(returnMessage);
}

async function handalAllCategory(req, res){
    const category = await CategoryModel.findAll();
    //console.log("All users:", JSON.stringify(JSON.stringify, null, 2));
    return res.status(200).send(category);
}

async function handalFindCategoryById(req, res){
    const id = req.body.id;
    const category = await CategoryModel.findByPk(id);
    //console.log("All users:", JSON.stringify(JSON.stringify, null, 2));
    return res.status(200).send(category);
}

async function getCategoryList(req, res){
    const category = await CategoryModel.findAll({
        where: {active_status: 1}
    });
    //console.log("All users:", JSON.stringify(JSON.stringify, null, 2));
    return res.status(200).send(category);
}

async function handalDeleteCategoryById(req, res){
    try {
        if(req.body.id > 0){
            const deletedBuyDetails = await CategoryModel.destroy({
                where: { 
                    id: req.body.id
                },
            });
            console.log(deletedBuyDetails);
            return res.status(200).send({success: true});
        }else{
            return res.status(200).send({success: false});
        }
    } catch (error) {
        console.error('Error deleting buy details:', error);
        return res.status(200).send({success: false});
    }
}
 
module.exports = {
    handalSaveCategory, handalAllCategory, handalFindCategoryById, getCategoryList, handalDeleteCategoryById
}
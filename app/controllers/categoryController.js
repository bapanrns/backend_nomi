const {db} = require('../../database/connection');

const CategoryModel = require("../models/categoryModel");


async function handalSaveCategory(req, res){
    //const { name } = req.body;
   // console.log(`Received name: ${name}`);
   // console.log(req.body);

    const jane = await CategoryModel.create({ category_name: req.body.name, active_status: req.body.status });
    console.log(jane.toJSON());
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
 
module.exports = {
    handalSaveCategory, handalAllCategory, handalFindCategoryById
}
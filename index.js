const express = require('express');
const {db} = require('./database/connection');
//const userRouter = require('./app/routers/user');
//const userRouter = require('./app/routers/user');
const router = require('./app/routers');
const bodyParser = require('body-parser');

const app = express();

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});


//const User = require("./app/models/userModels");
// This creates the table, dropping it first if it already existed
//User.sync({ force: true })

//const Address = require("./app/models/addressModel");
//Address.sync({ force: true })
const Category = require("./app/models/categoryModel");
//Category.sync({ force: true })

const SubCategory = require("./app/models/subCategoryModel");
//SubCategory.sync({ force: true })



//const productFabric = require("./app/models/productFabricModel");
//productFabric.sync({ force: true })

const Product = require("./app/models/productModel");
//Product.sync({ force: true })

const Quantity = require("./app/models/quantityModel");
//Quantity.sync({ force: true })

/* Relationship of Sub Category  and Product table */
Category.hasMany(Product,{
    foreignKey: 'category_id',
    as: 'Product'
});
Product.belongsTo(Category,{
    foreignKey: 'category_id',
    as: 'Category'
});

/* Relationship of Product and Quantity table */

Product.hasMany(Quantity,{
    foreignKey: 'product_id',
    as: 'Quantity'
});
Quantity.belongsTo(Product,{
    foreignKey: 'product_id',
    as: 'Product'
});

const productImageModel = require("./app/models/productImageModel");
//productImageModel.sync({ force: true })

// - This checks what is the current state of the table in the database (which columns it has, what are their data types, etc), and then performs the necessary changes in the table to make it match the model.
//User.sync({ alter: true })


// Set up the middleware to parse incoming requests
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

//app.use("/users", userRouter)
//app.use("/new_address", userRouter)

app.use("/api", router)

app.listen(8081, () => {
    console.log('Server started on port 8081');
  });
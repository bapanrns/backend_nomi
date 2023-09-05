const express = require('express');
const {db} = require('./database/connection');
//const userRouter = require('./app/routers/user');
//const userRouter = require('./app/routers/user');
const router = require('./app/routers');
const bodyParser = require('body-parser');

const cors = require('cors');

const app = express();

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});


// Allow requests from http://localhost:3000
const corsOptions = {
    origin: ['http://localhost:3000', 'http://192.168.1.5:3000', 'http://192.168.69.232:3000'],
    methods: ['GET', 'POST'], // Add any other methods you need to support
    allowedHeaders: ['Authorization', 'Content-Type'], // Add any other headers you want to allow
};
  
app.use(cors(corsOptions));

global.tGlobalSecretKey = 'nomiMart';


const User = require("./app/models/userModels");
// This creates the table, dropping it first if it already existed
//User.sync({ force: true })

const Address = require("./app/models/addressModel");
//Address.sync({ alter: true })
const Category = require("./app/models/categoryModel");
//Category.sync({ alter: true })

const SubCategory = require("./app/models/subCategoryModel");
//SubCategory.sync({ force: true })

Category.hasMany(SubCategory,{
    foreignKey: 'category_id',
    as: 'SubCategory'
});
SubCategory.belongsTo(Category,{
    foreignKey: 'category_id',
    as: 'Category'
});

//const productFabric = require("./app/models/productFabricModel");
//productFabric.sync({ force: true }) 

const Product = require("./app/models/productModel");
//Product.sync({ alter: true })

const Quantity = require("./app/models/quantityModel");
//Quantity.sync({ force: true })
//Quantity.sync({ alter: true })

/* Relationship of Sub Category  and Product table */
Category.hasMany(Product,{
    foreignKey: 'category_id',
    as: 'Product'
});
Product.belongsTo(Category,{
    foreignKey: 'category_id',
    as: 'Category'
});

/* Relationship of Sub Category  and Product table */
SubCategory.hasMany(Product,{
    foreignKey: 'sub_category_id',
    as: 'Product'
});
Product.belongsTo(SubCategory,{
    foreignKey: 'sub_category_id',
    as: 'SubCategory'
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
//productImageModel.sync({ alter: true })

/* Relationship of Product and Product Image table */

Product.hasMany(productImageModel,{
    foreignKey: 'product_id',
    as: 'Product_Image'
});
productImageModel.belongsTo(Product,{
    foreignKey: 'product_id',
    as: 'Product'
});

// - This checks what is the current state of the table in the database (which columns it has, what are their data types, etc), and then performs the necessary changes in the table to make it match the model.
//User.sync({ alter: true })

const GroupModal = require("./app/models/groupModal");
//GroupModal.sync({ force: true })


const ShopModal = require("./app/models/shopDetailsModal");
//ShopModal.sync({ force: true })

const BuyProductModal = require("./app/models/buyProductDetailsModal");
//BuyProductModal.sync({ force: true })
 
ShopModal.hasMany(BuyProductModal,{
    foreignKey: 'shop_id',
    as: 'Buy_Product_Details'
});
BuyProductModal.belongsTo(ShopModal,{
    foreignKey: 'shop_id',
    as: 'Shop_Details'
});


const PincodeModal = require("./app/models/pincodeModel");
//PincodeModal.sync({ force: true })

const NewPincodeModal = require("./app/models/newPincodeModel");
//NewPincodeModal.sync({ force: true })

const CartModal = require("./app/models/cartModels");
//CartModal.sync({ force: true })

Product.hasMany(CartModal,{
    foreignKey: 'product_id',
    as: 'Cart'
});
CartModal.belongsTo(Product,{
    foreignKey: 'product_id',
    as: 'Product'
});

const orderModels = require("./app/models/orderModels");
//orderModels.sync({ force: true })

Address.hasMany(orderModels,{
    foreignKey: 'delivery_address_id',
    as: 'Order'
});
orderModels.belongsTo(Address,{
    foreignKey: 'id',
    as: 'Address'
});

const orderItemModels = require("./app/models/orderItemModels");
//orderItemModels.sync({ force: true })
//orderItemModels.sync({ alter: true })

orderModels.hasMany(orderItemModels,{
    foreignKey: 'order_id',
    as: 'OrderItem'
});
orderItemModels.belongsTo(orderModels,{
    foreignKey: 'id',
    as: 'Order'
});

//CartModal.belongsTo(User, { foreignKey: 'user_id' }); // 'user_id' is the foreign key column in the Cart table
//CartModal.belongsTo(Product, { foreignKey: 'product_id' }); // 'product_id' is the foreign key column in the Cart table


const userAccountDetails = require("./app/models/userAccountDetails");
//userAccountDetails.sync({ force: true })

const stockModel = require("./app/models/stockModel");
//stockModel.sync({ force: true })
/*
Product.hasMany(stockModel,{
    foreignKey: 'product_id',
    as: 'Stock'
});
stockModel.belongsTo(Product,{
    foreignKey: 'id',
    as: 'Product'
});*/

// Set up the middleware to parse incoming requests
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

//app.use("/users", userRouter)
//app.use("/new_address", userRouter)

app.use("/api", router)

app.listen(8081, () => {
    console.log('Server started on port 8081');
  });
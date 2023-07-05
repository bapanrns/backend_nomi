const express = require('express');
const router = express.Router(); 

const bodyParser = require('body-parser');

const {handalSaveAddress, handalAllUesr} = require('../controllers/userController')
// Category Controller
const {handalSaveCategory, handalAllCategory, handalFindCategoryById} = require('../controllers/categoryController')
// Sub Category Controller
const {handalSaveSubCategory, handalAllSubCategory, handalFindSubCategoryById, handalDeleteSubCategoryById, handalFindSubCategoryByCategoryId} = require('../controllers/subCategoryController')
// Product Fabric Controller
const {handalSaveProductFabric, handalAllProductFabric, handalFindProductFabricById, handalDeleteProductFabricById} = require('../controllers/productFabricController')
// Product Controller
const {handalSaveProduct, handalAllProduct, handalFindProductById, handalDeleteProductById, handalUpdateGroupId, handalDeleteProductImage, productAactiveInactive, findProductImage, setPrimaryImage} = require('../controllers/productController')
// Buy Controller
const {SaveShopDetails, AllShopDetails, findShopDetailsByPK, deleteShopById, saveBuyProduct, AllBuyProductDetails, findBuyProductByPK, AllShopDetailsList } = require('../controllers/buyController')

const app = express();

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});


// Set up the middleware to parse incoming requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
/*
router.use("/users", userRouter)
router.use("/new_address", userRouter)*/
//router.use("/api", userRouter)

router.route("/new_address").post(handalSaveAddress);

router.route("/allUser").get(handalAllUesr);

// ------------------- Category -----------------
router.route("/categoryAdd").post(handalSaveCategory);
router.route("/AllCategory").post(handalAllCategory);
router.route("/categoryFindId").post(handalFindCategoryById);

// ------------------- Sub Category -----------------
router.route("/subCategoryAdd").post(handalSaveSubCategory);
router.route("/AllSubCategory").post(handalAllSubCategory);
router.route("/subCategoryFindId").post(handalFindSubCategoryById);
router.route("/deleteSubCategory").post(handalDeleteSubCategoryById);
router.route("/subCategoryFindCategoryId").post(handalFindSubCategoryByCategoryId);

// ------------------- Product Fabric -----------------
router.route("/productFabricAdd").post(handalSaveProductFabric);
router.route("/AllProductFabric").post(handalAllProductFabric);
router.route("/ProductFabricFindId").post(handalFindProductFabricById);
router.route("/deleteProductFabric").post(handalDeleteProductFabricById);

// ------------------- Product -----------------
router.route("/productAdd").post(handalSaveProduct);
router.route("/AllProduct").post(handalAllProduct);
router.route("/ProductFindById").post(handalFindProductById);
router.route("/deleteProduct").post(handalDeleteProductById);
router.route("/UpdateGroupID").post(handalUpdateGroupId);
router.route("/deleteProductImage").post(handalDeleteProductImage);
router.route("/productAactiveInactive").post(productAactiveInactive);
router.route("/findProductImage").post(findProductImage);
router.route("/setPrimaryImage").post(setPrimaryImage);

// -------------------- Shop -----------------------
router.route("/shopAdd").post(SaveShopDetails);
router.route("/allShop").post(AllShopDetails);
router.route("/allShopList").post(AllShopDetailsList);
router.route("/findShop").post(findShopDetailsByPK);
router.route("/deleteShop").post(deleteShopById);

// -------------------- Buy Products -----------------------
router.route("/saveBuyProduct").post(saveBuyProduct);
router.route("/allBuyProduct").post(AllBuyProductDetails);
router.route("/findBuyProductByPK").post(findBuyProductByPK);
//router.route("/deleteShop").post(deleteShopById);
module.exports = router;
const express = require('express');
const router = express.Router(); 

const checkAuth = require('../helper/checkAuthMiddleware'); // Adjust the path accordingly
const checkUserRole = require('../helper/checkUserRoleMiddleware');

const bodyParser = require('body-parser');

const {handalSaveAddress, handalAllUesr, saveUserRecord, loginUser, getAddress, getAddressById, deleteAddress, forgotPassword, setNewPassword} = require('../controllers/userController')
// Category Controller
const {handalSaveCategory, handalAllCategory, handalFindCategoryById, getCategoryList} = require('../controllers/categoryController')
// Sub Category Controller
const {handalSaveSubCategory, handalAllSubCategory, handalFindSubCategoryById, handalDeleteSubCategoryById, handalFindSubCategoryByCategoryId} = require('../controllers/subCategoryController')
// Product Fabric Controller
const {handalSaveProductFabric, handalAllProductFabric, handalFindProductFabricById, handalDeleteProductFabricById, fetchFabricForFontend} = require('../controllers/productFabricController')
// Product Controller
const {handalSaveProduct, handalAllProduct, handalFindProductById, handalDeleteProductById, handalUpdateGroupId, handalDeleteProductImage, productAactiveInactive, findProductImage, setPrimaryImage, fetchItemTypeList, getItemsList, getItemsDetails, getSimilarProducts, getSareeListForHomePage, allProductStock, saveProductStock, updateQuantity, deleteProductStock} = require('../controllers/productController')
// Buy Controller
const {SaveShopDetails, AllShopDetails, findShopDetailsByPK, deleteShopById, saveBuyProduct, AllBuyProductDetails, findBuyProductByPK, AllShopDetailsList } = require('../controllers/buyController')

const { getSameColorWiseItem } = require('../controllers/productImageController')

const { checkDeliveryCode } = require('../controllers/deliveryController')

const { getCartData, saveCartData, removeCartData, saveCartDataWhenLogin } = require('../controllers/cartController')

const {continueToBuy, checkProductAvailability, getOrderData, cancelOrderItem, returnOrderItem, allOrderDetails} = require('../controllers/orderController')

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

router.route("/new_address").post(checkAuth,handalSaveAddress);
router.route("/getAddress").post(checkAuth,getAddress);
router.route("/getAddressById").post(checkAuth,getAddressById);
router.route("/deleteAddress").post(checkAuth,deleteAddress);

router.route("/allUser").get(handalAllUesr);
router.route("/saveUserRecord").post(saveUserRecord);
router.route("/loginUser").post(loginUser);
router.route("/forgotPassword").post(forgotPassword);
router.route("/setNewPassword").post(setNewPassword);

// ------------------- Category -----------------
router.route("/categoryAdd").post(handalSaveCategory);
router.route("/AllCategory").post(handalAllCategory);
router.route("/categoryFindId").post(handalFindCategoryById);
router.route("/getCategoryList").post(getCategoryList);

// ------------------- Sub Category -----------------
router.route("/subCategoryAdd").post(checkAuth, checkUserRole(['adMin']), handalSaveSubCategory);
router.route("/AllSubCategory").post(handalAllSubCategory);
router.route("/subCategoryFindId").post(handalFindSubCategoryById);
router.route("/deleteSubCategory").post(handalDeleteSubCategoryById);
router.route("/subCategoryFindCategoryId").post(handalFindSubCategoryByCategoryId);

// ------------------- Product Fabric -----------------
router.route("/productFabricAdd").post(handalSaveProductFabric);
router.route("/AllProductFabric").post(handalAllProductFabric);
router.route("/ProductFabricFindId").post(handalFindProductFabricById);
router.route("/deleteProductFabric").post(handalDeleteProductFabricById);
router.route("/fetchFabric").post(fetchFabricForFontend);

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
router.route("/fetchItemTypeList").post(fetchItemTypeList)
router.route("/getItemsList").post(getItemsList)
router.route("/getItemsDetails").post(getItemsDetails)
router.route("/getSimilarProducts").post(getSimilarProducts)
router.route("/getSareeListForHomePage").post(getSareeListForHomePage)
router.route("/allProductStock").post(checkAuth, checkUserRole(['adMin']),allProductStock)
router.route("/saveProductStock").post(checkAuth, checkUserRole(['adMin']),saveProductStock)
router.route("/updateQuantity").post(checkAuth, checkUserRole(['adMin']),updateQuantity)
router.route("/deleteProductStock").post(checkAuth, checkUserRole(['adMin']),deleteProductStock)
// -------------------- Product Images ------------------------
router.route("/getSameColorWiseItem").post(getSameColorWiseItem);

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

// -------------------- Delivery -----------------------
router.route("/checkDeliveryCode").post(checkDeliveryCode);

// -------------------- Cart  ---------------------------

router.route("/getCartData").post(getCartData);
router.route("/saveCartData").post(checkAuth, saveCartData);
router.route("/removeCartData").post(checkAuth, removeCartData);
router.route("/saveCartDataWhenLogin").post(checkAuth, saveCartDataWhenLogin);

// -------------------- Order -------------------------------
router.route("/continueToBuy").post(checkAuth, continueToBuy);
router.route("/checkProductAvailability").post(checkProductAvailability)
router.route("/getOrderData").post(checkAuth, getOrderData)
router.route("/cancelOrderItem").post(checkAuth, cancelOrderItem)
router.route("/returnOrderItem").post(checkAuth, returnOrderItem)
router.route("/allOrderDetails").post( allOrderDetails)



module.exports = router;
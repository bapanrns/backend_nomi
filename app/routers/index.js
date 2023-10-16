const express = require('express');
const router = express.Router(); 

const checkAuth = require('../helper/checkAuthMiddleware'); // Adjust the path accordingly
const checkUserRole = require('../helper/checkUserRoleMiddleware');

const bodyParser = require('body-parser');

const {handalSaveAddress, handalAllUesr, saveUserRecord, loginUser, getAddress, getAddressById, deleteAddress, forgotPassword, setNewPassword, handleUserList} = require('../controllers/userController')
// Category Controller
const {handalSaveCategory, handalAllCategory, handalFindCategoryById, getCategoryList, handalDeleteCategoryById} = require('../controllers/categoryController')
// Sub Category Controller
const {handalSaveSubCategory, handalAllSubCategory, handalFindSubCategoryById, handalDeleteSubCategoryById, handalFindSubCategoryByCategoryId} = require('../controllers/subCategoryController')
// Product Fabric Controller
const {handalSaveProductFabric, handalAllProductFabric, handalFindProductFabricById, handalDeleteProductFabricById, fetchFabricForFontend} = require('../controllers/productFabricController')
// Product Controller
const {handalSaveProduct, handalAllProduct, handalFindProductById, handalDeleteProductById, handalUpdateGroupId, handalCreateGroupID, handalDeleteProductImage, productAactiveInactive, findProductImage, setPrimaryImage, fetchItemTypeList, getItemsList, getItemsDetails, getSimilarProducts, getSareeListForHomePage, getSareeListForHomePage1, allProductStock, saveProductStock, updateQuantity, deleteProductStock} = require('../controllers/productController')
// Buy Controller
const {SaveShopDetails, AllShopDetails, findShopDetailsByPK, deleteShopById, saveBuyProduct, AllBuyProductDetails, findBuyProductByPK, AllShopDetailsList, deleteBuyProductDetails } = require('../controllers/buyController')

const { getSameColorWiseItem } = require('../controllers/productImageController')

const { checkDeliveryCode, handalGetPinCode, deliveryBoyDataSave, findAlldeliveryBoy, handalAssignDeliveryBoy, handalGetDeliveryAddress } = require('../controllers/deliveryController')

const { getCartData, saveCartData, removeCartData, saveCartDataWhenLogin } = require('../controllers/cartController')

const {continueToBuy, checkProductAvailability, getOrderData, cancelOrderItem, returnOrderItem, allOrderDetails, handalUpdateOrderStatus} = require('../controllers/orderController')

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
router.route("/userList").post(checkAuth, checkUserRole(['adMin']), handleUserList);

// ------------------- Category -----------------
router.route("/categoryAdd").post(checkAuth, checkUserRole(['adMin']), handalSaveCategory);
router.route("/AllCategory").post(handalAllCategory);
router.route("/categoryFindId").post(handalFindCategoryById);
router.route("/getCategoryList").post(getCategoryList);
router.route("/deleteCategory").post(checkAuth, checkUserRole(['adMin']), handalDeleteCategoryById);

// ------------------- Sub Category -----------------
router.route("/subCategoryAdd").post(checkAuth, checkUserRole(['adMin']), handalSaveSubCategory);
router.route("/AllSubCategory").post(handalAllSubCategory);
router.route("/subCategoryFindId").post(handalFindSubCategoryById);
router.route("/deleteSubCategory").post(checkAuth, checkUserRole(['adMin']), handalDeleteSubCategoryById);
router.route("/subCategoryFindCategoryId").post(handalFindSubCategoryByCategoryId);

// ------------------- Product Fabric -----------------
router.route("/productFabricAdd").post(checkAuth, checkUserRole(['adMin']), handalSaveProductFabric);
router.route("/AllProductFabric").post(handalAllProductFabric);
router.route("/ProductFabricFindId").post(handalFindProductFabricById);
router.route("/deleteProductFabric").post(checkAuth, checkUserRole(['adMin']), handalDeleteProductFabricById);
router.route("/fetchFabric").post(fetchFabricForFontend);

// ------------------- Product -----------------
router.route("/productAdd").post(checkAuth, checkUserRole(['adMin']), handalSaveProduct);
router.route("/AllProduct").post(checkAuth, checkUserRole(['adMin']), handalAllProduct);
router.route("/ProductFindById").post(checkAuth, checkUserRole(['adMin']), handalFindProductById);
router.route("/deleteProduct").post(checkAuth, checkUserRole(['adMin']), handalDeleteProductById);
router.route("/createGroupID").post(checkAuth, checkUserRole(['adMin']), handalCreateGroupID);
router.route("/UpdateGroupID").post(checkAuth, checkUserRole(['adMin']), handalUpdateGroupId);
router.route("/deleteProductImage").post(checkAuth, checkUserRole(['adMin']), handalDeleteProductImage);
router.route("/productAactiveInactive").post(checkAuth, checkUserRole(['adMin']), productAactiveInactive);
router.route("/findProductImage").post(findProductImage);
router.route("/setPrimaryImage").post(checkAuth, checkUserRole(['adMin']), setPrimaryImage);
router.route("/fetchItemTypeList").post(fetchItemTypeList)
router.route("/getItemsList").post(getItemsList)
router.route("/getItemsDetails").post(getItemsDetails)
router.route("/getSimilarProducts").post(getSimilarProducts)
router.route("/getSareeListForHomePage").post(getSareeListForHomePage)
router.route("/getSareeListForHomePage1").get(getSareeListForHomePage1)
router.route("/allProductStock").post(checkAuth, checkUserRole(['adMin']), allProductStock)
router.route("/saveProductStock").post(checkAuth, checkUserRole(['adMin']), saveProductStock)
router.route("/updateQuantity").post(checkAuth, checkUserRole(['adMin']), updateQuantity)
router.route("/deleteProductStock").post(checkAuth, checkUserRole(['adMin']), deleteProductStock)
// -------------------- Product Images ------------------------
router.route("/getSameColorWiseItem").post(getSameColorWiseItem);

// -------------------- Shop -----------------------
router.route("/shopAdd").post(checkAuth, checkUserRole(['adMin']), SaveShopDetails);
router.route("/allShop").post(checkAuth, checkUserRole(['adMin']), AllShopDetails);
router.route("/allShopList").post(checkAuth, checkUserRole(['adMin']), AllShopDetailsList);
router.route("/findShop").post(checkAuth, checkUserRole(['adMin']), findShopDetailsByPK);
router.route("/deleteShopeName").post(checkAuth, checkUserRole(['adMin']), deleteShopById);

// -------------------- Buy Products -----------------------
router.route("/saveBuyProduct").post(checkAuth, checkUserRole(['adMin']), saveBuyProduct);
router.route("/allBuyProduct").post(checkAuth, checkUserRole(['adMin']), AllBuyProductDetails);
router.route("/findBuyProductByPK").post(checkAuth, checkUserRole(['adMin']), findBuyProductByPK);
router.route("/deleteBuyProductDetails").post(checkAuth, checkUserRole(['adMin']), deleteBuyProductDetails);
//router.route("/deleteShop").post(deleteShopById);

// -------------------- Delivery -----------------------
router.route("/checkDeliveryCode").post(checkDeliveryCode);
router.route("/getPinCode").post(handalGetPinCode);
router.route("/deliveryBoyDataSave").post(checkAuth, checkUserRole(['adMin']), deliveryBoyDataSave);
router.route("/alldeliveryBoy").post(checkAuth, checkUserRole(['adMin']), findAlldeliveryBoy)
router.route("/assignDeliveryBoy").post(checkAuth, checkUserRole(['adMin']), handalAssignDeliveryBoy)
router.route("/getDeliveryAddress").post(checkAuth, handalGetDeliveryAddress)

// -------------------- Cart  ---------------------------

router.route("/getCartData").post(checkAuth, getCartData);
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
router.route("/UpdateOrderStatus").post(checkAuth, checkUserRole(['adMin']),  handalUpdateOrderStatus)



module.exports = router;
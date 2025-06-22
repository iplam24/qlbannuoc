const express=require('express');
const upload = require('../middleware/upload');
const {getProducts,getTopSelling,checkUser
    ,getUserRoleController, register,getUserAPI
    ,getAllUsersAPI,addProductAPI,deleteProductAPI,getProductDetailAPI,placeOrderAPI,listAllOrders
    ,updateOrderStatus,addCartAPI,placeOrderFromCartAPI,listAllStatusAPI,getAllCartAPI,getUserIdAPI,getRevenueByDateAPI,
    getRevenueByMonthAPI,getRevenueByYearAPI,updateProductAPI,addShippingAddressAPI,getAllAdressShippingAPI,deleteAddressAPI,updateAvatarAPI
}=require('../controller/apiController');
const router =express.Router();


//========API SẢN PHẨM==========//
router.get("/sanpham",getProducts);//Lay ra toan bo danh sach san pham
router.get("/topluotban",getTopSelling);//Lay ra top luot ban
router.get("/getproductdetail/:id",getProductDetailAPI);
router.post('/themsanpham', upload.single('img'), addProductAPI);
router.patch('/products/:id', updateProductAPI);
router.delete('/products/:id', deleteProductAPI);




//=====API USER======//
router.get("/getuserrole/:ten_tai_khoan",getUserRoleController);
router.get("/getallusers",getAllUsersAPI);
router.post("/userinfor",getUserAPI);
router.post("/dangky",register);
router.post("/dangnhap",checkUser);
router.get("/userinforid/:userId",getUserIdAPI);
router.post("/addAddress",addShippingAddressAPI);
router.get("/diachi/:userId",getAllAdressShippingAPI);
router.post("/updateAvatar",upload.single('img'),updateAvatarAPI);

router.delete("/deleteAddress/:id",deleteAddressAPI);

//====API GIỎ HÀNG====//
router.post("/addCart",addCartAPI);
router.get("/getAllCarts/:userId",getAllCartAPI);



//======API ĐƠN HÀNG====//
router.get("/listallstatus",listAllStatusAPI);
router.post("/addOrderFromCart",placeOrderFromCartAPI);
router.get("/getAllorders",listAllOrders); //Lay ra list don hang
router.put("/updateOrder/:orderId/status",updateOrderStatus);
router.post("/dathang",placeOrderAPI);


//===========Thống kê doanh thu===///
router.get('/thongke/ngay/:date', getRevenueByDateAPI);
router.get('/thongke/thang/:year/:month', getRevenueByMonthAPI);
router.get('/thongke/nam/:year', getRevenueByYearAPI);

module.exports = router;
const connection = require('../config/connectDB');
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');
const {getAllProducts,getTopSellingProducts,checkUserExists,getUserRole, registerUser,checkUserExistDB, getUser,
  getAllUsers,addProduct,getproductDetail,createOrder, addOrderDetail,updateOrderStatusDB,getAllOrders,getOrderDetails,addToCart,placeOrderFromCart,getAllOrderStatus
,getAllCart,getUserInforId,updateProductWithImage,
  updateProductWithoutImage,
  deleteProduct,getAllAdressShipping,addShippingAddress,deleteAddress,updateAvatar
} = require('../services/CRUD-services');

const {getRevenueByDate, getRevenueByMonth, getRevenueByYear} = require('../services/thongke-doanhthu');
const jwt = require('jsonwebtoken');


//========Controller sản phẩm ======//
const getProducts = async(req,res) =>{
    try {
        const products = await getAllProducts();
        res.json(products);
      } catch (err) {
        res.status(500).json({ error: 'Có lỗi xảy ra khi truy vấn sản phẩm' });
}
}
const getTopSelling = async (req, res) => {
  try {
    const topSellingProducts = await getTopSellingProducts();
    res.json(topSellingProducts);
  } catch (err) {
    res.status(500).json({ error: 'Có lỗi xảy ra khi truy vấn sản phẩm bán chạy' });
  }
}
const addProductAPI = async (req, res) => {
  try {
    const { ten_san_pham, gia, luot_ban } = req.body;
    const img = req.file ? `/upload/${req.file.filename}` : '';

    await addProduct(ten_san_pham, gia, luot_ban, img);
    console.log(`${ten_san_pham} - thêm sản phẩm thành công!`);

    res.status(201).json({ success: true, message: 'Thêm sản phẩm thành công!' });
  } catch (error) {
    console.error('Lỗi khi thêm sản phẩm:', error);
    res.status(500).json({ success: false, message: 'Có lỗi xảy ra!' });
  }
};
const getProductDetailAPI = async (req, res) => {
  const { id } = req.params;
  console.log('Chi tiet san pham', id); 

  try {
    const detail = await getproductDetail(id);

    if (detail) {
      res.json(detail);
    } else {
      res.status(404).send('KO TIM THAY SAN PHAM CO ID NAY');
    }
  } catch (error) {
    console.error('LOI API:', error); 
    res.status(500).send('@@@@'); 
  }
}
const updateProductAPI = async (req, res) => {
  try {
    const { id } = req.params;
    const { ten_san_pham, gia, luot_ban } = req.body;

    const [oldData] = await getproductDetail(id);
    const oldImg = oldData?.img;

    let result;


    if (req.file) {
      const filename = req.file.filename;

      const oldPath = path.join(__dirname, '..', 'public', oldImg);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);

      const imgPath = `/upload/${filename}`;
      result = await updateProductWithImage(id, ten_san_pham, gia, luot_ban, imgPath);
    } else {
      result = await updateProductWithoutImage(id, ten_san_pham, gia, luot_ban);
    }

    res.json({ success: true, message: 'Sửa sản phẩm thành công!', result });
  } catch (err) {
    console.error('Lỗi API sửa sản phẩm:', err);
    res.status(500).json({ success: false, message: 'Sửa sản phẩm thất bại' });
  }
};
const deleteProductAPI = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Xoá sản phẩm");
    // Lấy ảnh để xoá file
    const [data] = await getproductDetail(id);
    const imgPath = path.join(__dirname, '..', 'public', data?.img);
    if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);

    // Xoá DB
    await deleteProduct(id);
    res.json({ success: true, message: 'Xoá sản phẩm thành công' });
  } catch (err) {
    console.error('Lỗi API xoá sản phẩm:', err);
    res.status(500).json({ success: false, message: 'Xoá sản phẩm thất bại' });
  }
};








//==============Controller user===========//
const checkUser = async (req, res) => {
  const { ten_tai_khoan, mat_khau } = req.body;
  try {
    const users = await getUser(ten_tai_khoan);
    if (!users || users.length === 0) {
      return res.status(401).json({ exists: false, message: 'Tài khoản không tồn tại' });
    }

    const match = await bcrypt.compare(mat_khau, users[0].mat_khau);
    if (match) {
      // Tạo payload chứa thông tin người dùng, ví dụ id và vai trò
      const payload = {
        id: users[0].id,
        ten_tai_khoan: users[0].ten_tai_khoan,
        id_vai_tro: users[0].id_vai_tro,
      };

      // Tạo token với secret key 
      const token = jwt.sign(payload, '@1234', { expiresIn: '1h' });

      console.log("TOKEN_>>>",token);
      res.json({
        exists: true,
        token, 
        userId: users[0].id,
        id_vai_tro: users[0].id_vai_tro  
      });
    } else {
      res.status(401).json({ exists: false, message: 'Mật khẩu không đúng' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Có lỗi xảy ra khi kiểm tra người dùng' });
  }
};
const getUserRoleController = async (req, res) => {
  const { ten_tai_khoan } = req.params; 
  try {
    const vai_tro = await getUserRole(ten_tai_khoan);

    if (vai_tro !== null) {

      res.json({ vai_tro }); 
    } else {
      res.status(404).json({ error: 'Tài khoản không tồn tại' }); 
    }
  } catch (err) {
    res.status(500).json({ error: 'Có lỗi xảy ra khi lấy vai trò người dùng' });
  }
};
//API LẤY USER DỰA VÀO ID
const getUserIdAPI=async(req,res)=>{
  const userId = req.params.userId;
  const user= await getUserInforId(userId);
  return res.status(201).json({user});
}

const register = async (req, res) => {
  console.log(req.body);
  let ten_tai_khoan = req.body.ten_tai_khoan;
  let ho_ten = req.body.ho_ten;
  const email = req.body.email;
  const so_dien_thoai= req.body.so_dien_thoai;
  const mat_khau = req.body.mat_khau;
  
  try {
    const userExists = await checkUserExistDB(ten_tai_khoan);
    if (userExists) {
      return res.status(400).json({ success: false, message: 'Tên đăng nhập đã tồn tại!' });
    }
    const hashedPassword = await bcrypt.hash(mat_khau, 10);
    await registerUser(ten_tai_khoan, hashedPassword,ho_ten,email,so_dien_thoai);
    console.log(ten_tai_khoan+" - đăng ký tài khoản thành công!");
    res.status(201).json({ success: true, message: 'Đăng ký thành công!' });
  } catch (err) {
    console.error('Lỗi khi đăng ký:', err);
    res.status(500).json({ success: false, message: 'Có lỗi xảy ra!' });
  }
};

const getUserAPI = async(req,res)=>{
  const ten_tai_khoan = req.body.ten_tai_khoan;
  try {
    const user = await getUser(ten_tai_khoan);
    res.status(200).json(user[0]);
  } catch (error) {
      console.error('Lỗi khi đăng ký:', error);
      res.status(500).json({ success: false, message: 'Có lỗi xảy ra!' });
  }
}
const getAllUsersAPI = async (req, res) => {
  try {
    const users = await getAllUsers();
    res.status(200).json(users); 
  } catch (error) {
    console.error('Lỗi khi gọi API:', error);
    res.status(500).json({ success: false, message: 'Không thể lấy danh sách người dùng!' });
  }
};
// Hàm thêm địa chỉ nhận hàng
const addShippingAddressAPI = async (req, res) => {
  try {
    const { id_nguoi_dung, dia_chi, so_dien_thoai, nguoi_nhan } = req.body;

    if (!id_nguoi_dung || !dia_chi || !nguoi_nhan) {
      return res.status(400).json({ message: 'Thiếu thông tin bắt buộc' });
    }
    const result = await addShippingAddress({
      id_nguoi_dung,
      dia_chi,
      so_dien_thoai,
      nguoi_nhan,
    });

    res.status(201).json({ message: 'Thêm địa chỉ thành công', id: result.insertId });
  } catch (err) {
    console.error('Lỗi khi thêm địa chỉ:', err);
    res.status(500).json({ message: 'Lỗi server khi thêm địa chỉ' });
  }
};

const getAllAdressShippingAPI = async (req, res) => {
  try {
    const userId = req.params.userId; 

    if (!userId) {
      return res.status(400).json({ message: 'Thiếu userId' });
    }

    const addresses = await getAllAdressShipping(userId);

    res.status(200).json({
      success: true,
      data: addresses,
      message: 'Lấy danh sách địa chỉ thành công',
    });
  } catch (err) {
    console.error('Lỗi khi lấy danh sách địa chỉ:', err);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi lấy địa chỉ',
    });
  }
};

const deleteAddressAPI = async (req, res) => {
  const addressId = req.params.id;

  try {
    if (!addressId) {
      return res.status(400).json({ success: false, message: 'Thiếu ID địa chỉ' });
    }

    const result = await deleteAddress(addressId); 

    if (result.affectedRows > 0) {
      return res.status(200).json({ success: true, message: 'Xoá địa chỉ thành công' });
    } else {
      return res.status(404).json({ success: false, message: 'Không tìm thấy địa chỉ để xoá' });
    }
  } catch (err) {
    console.error('Lỗi khi xoá địa chỉ:', err);
    return res.status(500).json({ success: false, message: 'Lỗi server khi xoá địa chỉ' });
  }
};




const updateAvatarAPI = async (req, res) => {
  const userId = req.body.userId;
  const file = req.file;
  const oldAvatarPath = req.body.oldAvatar;

  if (!userId || !file) {
    return res.status(400).json({ success: false, message: 'Thiếu userId hoặc avatar' });
  }

  const imagePath = `/upload/${file.filename}`;
  

  try {
    if (oldAvatarPath && oldAvatarPath !== '/upload/avatar2.png') {
      const fullOldPath = path.join(__dirname, '../public', oldAvatarPath);

      if (fs.existsSync(fullOldPath)) {
        fs.unlinkSync(fullOldPath);
        console.log('Đã xoá ảnh cũ thành công khi cập nhật avatar mới cho user: ' ,userId);
      } else {
        console.warn('File ảnh cũ không tồn tại:', fullOldPath);
      }
    }

    // ✅ Cập nhật database
    const result = await updateAvatar(imagePath, userId);

    if (result.affectedRows > 0) {
      return res.status(200).json({
        success: true,
        message: 'Avatar đã được cập nhật',
        img: imagePath
      });
    } else {
      return res.status(404).json({ success: false, message: 'Không tìm thấy user' });
    }
  } catch (error) {
    console.error('Lỗi update avatar:', error);
    return res.status(500).json({ success: false, message: 'Lỗi server khi cập nhật avatar' });
  }
};













//======Controller giỏ hàng=======////
const addCartAPI=async(req,res)=>{
const { userId, productId, quantity } = req.body;

  if (!userId || !productId) {
    return res.status(400).json({
      success: false,
      message: 'Thiếu thông tin userId hoặc productId'
    });
  }

  try {
    const result = await addToCart(userId, productId, quantity || 1);

    res.json({
      success: true,
      message: result.message
    });
  } catch (err) {
    console.error('Lỗi khi thêm vào giỏ hàng:', err.message);
    res.status(500).json({
      success: false,
      message: 'Lỗi hệ thống khi thêm vào giỏ hàng'
    });
  }
}
const getAllCartAPI = async (req, res) => {
  try {
    const userId = req.params.userId || req.body.userId || req.query.userId;

    if (!userId) {
      return res.status(400).json({ message: "Thiếu userId" });
    }

    const carts = await getAllCart(userId);

    return res.status(200).json({
      message: "Lấy giỏ hàng thành công",
      data: carts
    });
  } catch (error) {
    console.error("Lỗi:", error);
    return res.status(500).json({
      message: "Server bị lỗi rồi"
    });
  }
};





















//=======Controller đơn hàng =====///

const placeOrderFromCartAPI = async (req, res) => {
  const { userId, diaChiId, description } = req.body;

  if (!userId || !diaChiId) {
    return res.status(400).json({
      success: false,
      message: 'Thiếu userId hoặc diaChiId'
    });
  }

  try {
    const result = await placeOrderFromCart(userId, diaChiId, description || '');
    res.json({
      success: true,
      message: 'Đặt hàng từ giỏ thành công',
      orderId: result.orderId
    });
  } catch (err) {
    console.error('❗ Lỗi khi đặt hàng từ giỏ hàng:', err);
    res.status(500).json({
      success: false,
      message: err.message || 'Lỗi hệ thống khi đặt hàng'
    });
  }
};


const placeOrderAPI = async (req, res) => {
  const { userId, items, note } = req.body;
  
  if (!userId || !items || items.length === 0) {
    return res.status(400).json({ 
      success: false, 
      message: 'Thiếu thông tin đơn hàng' 
    });
  }

  try {
    // Tính tổng tiền
    let total = 0;
    const productUpdates = [];
    
    for (const item of items) {
      const product = await getproductDetail(item.productId);
      if (!product || product.length === 0) {
        return res.status(400).json({ 
          success: false, 
          message: `Sản phẩm ID ${item.productId} không tồn tại` 
        });
      }
      
      const price = product[0].gia;
      total += price * item.quantity;
      
      productUpdates.push({
        productId: item.productId,
        price: price,
        quantity: item.quantity
      });
    }

    // Tạo đơn hàng
    const orderId = await createOrder(userId, total, note);
    
    // Thêm chi tiết đơn hàng và cập nhật lượt bán
    for (const update of productUpdates) {
      await addOrderDetail(orderId, update.productId, update.quantity, update.price);
      await updateProductSales(update.productId, update.quantity);
    }
    console.log("Dat hang thanh cong");
    res.status(201).json({ 
      success: true, 
      message: 'Đặt hàng thành công', 
      orderId: orderId 
    });

  } catch (error) {
    console.error('Lỗi khi đặt hàng:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Lỗi hệ thống khi đặt hàng' 
    });
  }
};

const listAllOrders = async (req, res) => {
  try {
    // Lấy danh sách đơn hàng
    const orders = await getAllOrders();
    
    // Lấy chi tiết cho từng đơn hàng
    const ordersWithDetails = await Promise.all(
      orders.map(async (order) => {
        const details = await getOrderDetails(order.id);
        return { ...order, chi_tiet: details };
      })
    );

    res.json({
      success: true,
      data: ordersWithDetails
    });
  } catch (error) {
    console.error('Lỗi khi lấy danh sách đơn hàng:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi hệ thống khi lấy danh sách đơn hàng'
    });
  }
};

const listAllStatusAPI = async (req, res) => {
  try {
    const statuses = await getAllOrderStatus();
    res.json({
      success: true,
      data: statuses
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy danh sách trạng thái'
    });
  }
};
const updateOrderStatus = async (req, res) => {
  const { orderId } = req.params;
  const { statusId } = req.body;

  if (!statusId) {
    return res.status(400).json({
      success: false,
      message: 'Thiếu trạng thái cập nhật'
    });
  }

  try {
    await updateOrderStatusDB(orderId, statusId);

    res.json({
      success: true,
      message: 'Cập nhật trạng thái đơn hàng thành công'
    });
  } catch (err) {
    console.error('❗ Lỗi khi cập nhật trạng thái:', err.message);
    res.status(500).json({
      success: false,
      message: err.message || 'Lỗi hệ thống khi cập nhật trạng thái đơn hàng'
    });
  }
};



//===============Thống kê doanh thu =================//

//Doanh thu theo ngày
const getRevenueByDateAPI = async (req, res) => {
  try {
    const { date } = req.params; // Định dạng: YYYY-MM-DD
    const data = await getRevenueByDate(date);
    res.json({ success: true, data });
  } catch (err) {
    console.error('Lỗi API doanh thu theo ngày:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Lấy doanh thu theo tháng
const getRevenueByMonthAPI = async (req, res) => {
  try {
    const { month, year } = req.params;
    const data = await getRevenueByMonth(month, year);
    res.json({ success: true, data });
  } catch (err) {
    console.error('Lỗi API doanh thu theo tháng:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Lấy doanh thu theo năm
const getRevenueByYearAPI = async (req, res) => {
  try {
    const { year } = req.params;
    const data = await getRevenueByYear(year);
    res.json({ success: true, data });
  } catch (err) {
    console.error('Lỗi API doanh thu theo năm:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
//===============Sửa thông tin =================//
  
module.exports = {getProducts,getTopSelling,checkUser,getUserRoleController,register,getUserAPI,
  getAllUsersAPI,addProductAPI,getProductDetailAPI,placeOrderAPI,listAllOrders,updateOrderStatus,addCartAPI,
  placeOrderFromCartAPI,listAllStatusAPI,getAllCartAPI,getUserIdAPI,getRevenueByDateAPI,
  getRevenueByMonthAPI,getRevenueByYearAPI, updateProductAPI,deleteProductAPI,addShippingAddressAPI,getAllAdressShippingAPI,deleteAddressAPI,updateAvatarAPI
}


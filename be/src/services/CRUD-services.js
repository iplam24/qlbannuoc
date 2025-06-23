require('dotenv').config();
const connection =require('../config/connectDB');
const nodemailer = require('nodemailer');

//===============CRUD sản phẩm==============//

//Lấy ra toàn bộ danh sách sản phẩm
const getAllProducts = async () => {
      const [products] = await connection.promise().query('SELECT * FROM san_pham where da_xoa=0');
      return products;
};
//Lấy ra danh sách lượt bán của sản phẩm
const getTopSellingProducts = async () => {
  const [topSellingProducts] = await connection.promise().query(
    'SELECT * FROM san_pham WHERE da_xoa = 0 ORDER BY luot_ban DESC'
  );
  return topSellingProducts;
};


//Thêm sản phẩm
const addProduct = async (ten_san_pham, gia,luot_ban,img) => {
  try {
    const [result] = await connection.promise().query(
      'INSERT INTO san_pham (ten_san_pham, gia, luot_ban,img) VALUES (?, ?, ?,?)',
      [ten_san_pham, gia,luot_ban,img]
    );
    return result;
  } catch (err) {
    console.error('Lỗi khi thêm sản phẩm mới:', err);
    throw err;
  }
}
//:ấy ra chi tiết sản phẩm
const getproductDetail = async(id) =>{
  try {
    const detail = await connection.promise().query(
      'SELECT * FROM san_pham WHERE id = ?',[id]
    );
    return detail[0];
  } catch (error) {
    console.log(error);
  }
}
// Sửa sản phẩm KHÔNG thay ảnh
const updateProductWithoutImage = async (id, ten_san_pham, gia, luot_ban) => {
  try {
    const [result] = await connection.promise().query(
      'UPDATE san_pham SET ten_san_pham = ?, gia = ?, luot_ban = ? WHERE id = ?',
      [ten_san_pham, gia, luot_ban, id]
    );
    return result;
  } catch (err) {
    console.error('Lỗi khi sửa sản phẩm (không ảnh):', err);
    throw err;
  }
};

// Sửa sản phẩm CÓ thay ảnh
const updateProductWithImage = async (id, ten_san_pham, gia, luot_ban, img) => {
  try {
    const [result] = await connection.promise().query(
      'UPDATE san_pham SET ten_san_pham = ?, gia = ?, luot_ban = ?, img = ? WHERE id = ?',
      [ten_san_pham, gia, luot_ban, img, id]
    );
    return result;
  } catch (err) {
    console.error('Lỗi khi sửa sản phẩm (có ảnh):', err);
    throw err;
  }
};

// Xoá sản phẩm
const deleteProduct = async (id) => {
  try {
    const [result] = await connection.promise().query(
      'UPDATE san_pham SET da_xoa = 1 WHERE id = ?',
      [id]
    );
    return result;
  } catch (err) {
    console.error('Lỗi khi xoá mềm sản phẩm:', err);
    throw err;
  }
};




//============CRUD user================//

// Hàm kiểm tra tài khoản tồn tại trong DB (login)
const checkUserExists = async (tenTaiKhoan, matKhau) => {
  try {
    const [result] = await connection.promise().query(
      'SELECT * FROM nguoi_dung WHERE ten_tai_khoan = ? AND mat_khau = ? AND da_xoa = 0',
      [tenTaiKhoan, matKhau]
    );

    if (result.length > 0) {
      return {
        id: result[0].id,
        id_vai_tro: result[0].id_vai_tro
      };
    }

    return null; 
  } catch (err) {
    console.error('Lỗi khi kiểm tra tài khoản:', err);
    throw err;
  }
};

  //Lấy về user cụ thể
  const getUser = async (tenTaiKhoan) => {
    try {
      const [result] = await connection.promise().query(
        'SELECT * FROM nguoi_dung WHERE ten_tai_khoan = ? AND da_xoa=0',
        [tenTaiKhoan]
      );
      if (result.length > 0) {
        return result;
      }
      return null; 
    } catch (err) {
      console.error('Lỗi khi kiểm tra tài khoản:', err);
      throw err;
    }
  };

  //Lấy ra danh sách user
const getAllUsers = async () => {
  try {
    const [result] = await connection.promise().query(
      'SELECT * FROM nguoi_dung WHERE da_xoa = 0'
    );
    return result;
  } catch (error) {
    console.error('Lỗi khi lấy danh sách người dùng:', error);
    throw error;
  }
};

//Kiểm tra tên tài khoản đã tồn tại chưa(đăng ký)
const checkUserExistDB = async (tenTaiKhoan) => {
  try {
    const [result] = await connection.promise().query(
      'SELECT * FROM nguoi_dung WHERE ten_tai_khoan = ? AND da_xoa = 0',
      [tenTaiKhoan]
    );
    return result.length > 0;
  } catch (err) {
    console.error('Lỗi khi kiểm tra tài khoản:', err);
    throw err;
  }
};

//Lấy về vai trò của tài khoản
  const getUserRole = async (taikhoan) => {
    try {
      const query = 'SELECT * FROM nguoi_dung WHERE ten_tai_khoan = ? AND da_xoa = 0';
      const [rows] = await connection.promise().query(query, [taikhoan]);
  
      if (rows.length === 0) {
        console.log(`Không tìm thấy vai trò cho tài khoản ${taikhoan}`);
        return null; 
      }
  
      const role = rows[0].id_vai_tro; 
      console.log(`Vai trò của tài khoản ${taikhoan}: ${role}`);
      return role;
    } catch (err) {
      console.error("Lỗi khi lấy vai trò người dùng:", err);
      throw err;
    }
  };

//Lấy ra user dựa vào id
const getUserInforId=async(userid)=>{
  const [user] = await connection.promise().query(`SELECT * FROM nguoi_dung WHERE id =? AND da_xoa = 0`,[userid]);
  return user;
}
// Đăng ký tài khoản người dùng
const registerUser = async (tenTaiKhoan, matKhau,hoten,email,so_dien_thoai) => {
  try {
    const [result] = await connection.promise().query(
      'INSERT INTO nguoi_dung (ten_tai_khoan, mat_khau,ho_ten,email,so_dien_thoai, id_vai_tro) VALUES (?, ?, ?,?,?,?)',
      [tenTaiKhoan, matKhau,hoten,email,so_dien_thoai, 3] 
    );
    return result;
  } catch (err) {
    console.error('Lỗi khi thêm người dùng mới:', err);
    throw err;
  }
};

const addShippingAddress = async ({
  id_nguoi_dung,
  dia_chi,
  so_dien_thoai,
  nguoi_nhan,
}) => {
  try {
    const [result] = await connection.promise().query(
      `INSERT INTO dia_chi_nhan_hang (
        id_nguoi_dung, dia_chi, so_dien_thoai, nguoi_nhan
      ) VALUES (?, ?, ?, ?)`,
      [id_nguoi_dung, dia_chi, so_dien_thoai, nguoi_nhan]
    );
    return result;
  } catch (err) {
    console.error('Lỗi khi thêm địa chỉ nhận hàng:', err);
    throw err;
  }
};

const getAllAdressShipping= async(userId)=>{
    try {
        const [shippingAddress] = await connection.promise().query(`SELECT * FROM dia_chi_nhan_hang WHERE id_nguoi_dung = ? AND da_xoa = 0`,[userId]);
        return shippingAddress;
    } catch (error) {
      console.log("Lỗi khi lấy ra danh sách địa chỉ",error);
      throw err;
    }
}

const deleteAddress = async (addressId) => {
  try {
    const [result] = await connection.promise().query(
      `UPDATE dia_chi_nhan_hang SET da_xoa = 1 WHERE id = ?`, [addressId]
    );
    return result;
  } catch (error) {
    console.error('Lỗi khi xoá địa chỉ:', error);
    throw error;
  }
};

const updateAvatar = async (img, userId) => {
  try {
    const [result] = await connection
      .promise()
      .query(`UPDATE nguoi_dung SET img = ? WHERE id = ?`, [img, userId]);

    return result; 
  } catch (error) {
    console.error('Lỗi khi cập nhật avatar:', error);
    throw error;
  }
};



//===============CRUD giỏ hàng============////
const addToCart = async (userId, productId, quantity = 1) => {
  try {
    // Kiểm tra sản phẩm đã có trong giỏ chưa
    const [existingRows] = await connection.promise().query(
      'SELECT so_luong FROM gio_hang WHERE id_nguoi_dung = ? AND id_san_pham = ?',
      [userId, productId]
    );

    if (existingRows.length > 0) {
      // Nếu có rồi: cập nhật số lượng
      await connection.promise().query(
        'UPDATE gio_hang SET so_luong = so_luong + ? WHERE id_nguoi_dung = ? AND id_san_pham = ?',
        [quantity, userId, productId]
      );
    } else {
      // Nếu chưa có: thêm mới
      await connection.promise().query(
        'INSERT INTO gio_hang (id_nguoi_dung, id_san_pham, so_luong) VALUES (?, ?, ?)',
        [userId, productId, quantity]
      );
    }

    return { success: true, message: 'Thêm vào giỏ hàng thành công' };
  } catch (err) {
    console.error('Lỗi khi thêm vào giỏ hàng:', err.message);
    throw err;
  }
};
//=============lấy ra toàn bộ giỏ hàng của user===========//
const getAllCart = async (userId) => {
  try {
    const [carts] = await connection.promise().query(
      `SELECT gh.*, sp.ten_san_pham, sp.img, sp.gia
       FROM gio_hang gh
       JOIN san_pham sp ON gh.id_san_pham = sp.id
       WHERE gh.id_nguoi_dung = ?`,
      [userId]
    );
    return carts;
  } catch (err) {
    console.error("Lỗi lấy giỏ hàng: ", err);
    throw err; 
  }
};
















//===============CRUD Đơn hàng ================//
const placeOrderFromCart = async (userId, diaChiId, note = '') => {
  try {
    // 1. Lấy sản phẩm trong giỏ hàng
    const [cartItems] = await connection.promise().query(
      `SELECT gh.id_san_pham, gh.so_luong, sp.gia 
       FROM gio_hang gh
       JOIN san_pham sp ON gh.id_san_pham = sp.id
       WHERE gh.id_nguoi_dung = ?`,
      [userId]
    );

    if (cartItems.length === 0) {
      throw new Error('Giỏ hàng trống');
    }

    // 2. Tính tổng tiền
    const total = cartItems.reduce((sum, item) => {
      return sum + item.so_luong * item.gia;
    }, 0);

    // 3. Tạo đơn hàng (truyền thêm địa chỉ nhận hàng)
    const orderId = await createOrder(userId, total, note, diaChiId);

    // 4. Thêm chi tiết đơn hàng
    for (const item of cartItems) {
      await addOrderDetail(orderId, item.id_san_pham, item.so_luong, item.gia);
    }

    // 5. Xoá giỏ hàng sau khi đặt xong
    await connection.promise().query(
      'DELETE FROM gio_hang WHERE id_nguoi_dung = ?',
      [userId]
    );

    return {
      success: true,
      orderId,
      message: 'Đặt hàng thành công ó anh iuuu '
    };

  } catch (err) {
    console.error('❗ Lỗi khi đặt hàng từ giỏ hàng:', err);
    throw err;
  }
};


// Thêm đơn hàng mới
const createOrder = async (userId, total, note = '', diaChiId, statusId = 1) => {
  try {
    const [result] = await connection.promise().query(
      `INSERT INTO don_hang (id_nguoi_dung, tong_tien, id_trang_thai, ghi_chu, id_dia_chi_nhan_hang)
       VALUES (?, ?, ?, ?, ?)`,
      [userId, total, statusId, note, diaChiId]
    );

    return result.insertId; // Trả về id đơn hàng mới đóa anh yêu ơi 💘
  } catch (err) {
    console.error('💥 Lỗi khi tạo đơn hàng:', err);
    throw err;
  }
};


// Thêm chi tiết đơn hàng
const addOrderDetail = async (orderId, productId, quantity, price) => {
  try {
    await connection.promise().query(
      'INSERT INTO chi_tiet_don_hang (id_don_hang, id_san_pham, so_luong, gia_tai_thoi_diem_dat) VALUES (?, ?, ?, ?)',
      [orderId, productId, quantity, price]
    );
  } catch (err) {
    console.error('Lỗi khi thêm chi tiết đơn hàng:', err);
    throw err;
  }
};


//Lấy ra toàn bộ danh sách đơn hàng
//Lấy ra trạng thái đơn hàng

const getAllOrderStatus = async () => {
  try {
    const [orderStatus] = await connection.promise().query(
      `SELECT * FROM trang_thai_don_hang ORDER BY id`
    );
    return orderStatus;
  } catch (err) {
    console.error('❗ Lỗi khi lấy trạng thái đơn hàng:', err);
    throw err; // Cho controller gọi hàm này biết để xử lý tiếp
  }
};


const getAllOrders = async () => {
  try {
    const [orders] = await connection.promise().query(`
      SELECT 
        dh.id,
        dh.ngay_dat_hang,
        dh.tong_tien,
        tth.ten_trang_thai,
        nd.ho_ten AS ten_nguoi_dat,
        dcnh.nguoi_nhan,
        dcnh.so_dien_thoai AS sdt_nguoi_nhan,
        dcnh.dia_chi AS dia_chi_giao,
        dh.ghi_chu
      FROM don_hang dh
      JOIN nguoi_dung nd ON dh.id_nguoi_dung = nd.id
      JOIN trang_thai_don_hang tth ON dh.id_trang_thai = tth.id
      LEFT JOIN dia_chi_nhan_hang dcnh ON dh.id_dia_chi_nhan_hang = dcnh.id
      ORDER BY dh.ngay_dat_hang DESC
    `);
    return orders;
  } catch (err) {
    console.error('Lỗi khi lấy danh sách đơn hàng:', err);
    throw err;
  }
};
const getAllOrderuser = async (userId) => {
  try {
    const [orders] = await connection.promise().query(`
      SELECT 
        dh.id,
        dh.ngay_dat_hang,
        dh.tong_tien,
        tth.ten_trang_thai,
        nd.ho_ten AS ten_nguoi_dat,
        dcnh.nguoi_nhan,
        dcnh.so_dien_thoai AS sdt_nguoi_nhan,
        dcnh.dia_chi AS dia_chi_giao,
        dh.ghi_chu
      FROM don_hang dh
      JOIN nguoi_dung nd ON dh.id_nguoi_dung = nd.id
      JOIN trang_thai_don_hang tth ON dh.id_trang_thai = tth.id
      LEFT JOIN dia_chi_nhan_hang dcnh ON dh.id_dia_chi_nhan_hang = dcnh.id
      WHERE dh.id_nguoi_dung = ?
      ORDER BY dh.ngay_dat_hang DESC
    `, [userId]);
    
    return orders;
  } catch (err) {
    console.error('Lỗi khi lấy danh sách đơn hàng:', err);
    throw err;
  }
};



const getOrderDetails = async (orderId) => {
  try {
    const [details] = await connection.promise().query(`
      SELECT 
        sp.id AS id_san_pham,
        sp.ten_san_pham,
        sp.img,
        ctdh.so_luong,
        ctdh.gia_tai_thoi_diem_dat AS don_gia,
        (ctdh.so_luong * ctdh.gia_tai_thoi_diem_dat) AS thanh_tien
      FROM chi_tiet_don_hang ctdh
      JOIN san_pham sp ON ctdh.id_san_pham = sp.id
      WHERE ctdh.id_don_hang = ?
    `, [orderId]);

    return details;
  } catch (err) {
    console.error('💥 Lỗi khi lấy chi tiết đơn hàng:', err);
    throw err;
  }
};

//Cập nhật tổng tiền vào bảng thống kê doanh thu theo ngày
const updateRevenueStats = async (orderId) => {
  const [orderRows] = await connection.promise().query(
    `SELECT DATE(ngay_dat_hang) AS order_date, tong_tien 
     FROM don_hang 
     WHERE id = ? AND id_trang_thai = 4`,
    [orderId]
  );

  if (orderRows.length === 0) return;

  const { order_date, tong_tien } = orderRows[0];

  const [existingRows] = await connection.promise().query(
    'SELECT 1 FROM thong_ke_doanh_thu_ngay WHERE ngay = ?',
    [order_date]
  );

  if (existingRows.length > 0) {
    await connection.promise().query(
      `UPDATE thong_ke_doanh_thu_ngay 
       SET doanh_thu = doanh_thu + ?, 
           so_luong_don_hang_hoan_thanh = so_luong_don_hang_hoan_thanh + 1 
       WHERE ngay = ?`,
      [tong_tien, order_date]
    );
  } else {
    await connection.promise().query(
      `INSERT INTO thong_ke_doanh_thu_ngay (ngay, doanh_thu, so_luong_don_hang_hoan_thanh)
       VALUES (?, ?, 1)`,
      [order_date, tong_tien]
    );
  }
};

const updateProductSale = async(orderId)=>{
const [details] = await connection.promise().query(
    `SELECT id_san_pham, so_luong 
     FROM chi_tiet_don_hang 
     WHERE id_don_hang = ?`,
    [orderId]
  );

  for (const item of details) {
    await connection.promise().query(
      `UPDATE san_pham 
       SET luot_ban = luot_ban + ? 
       WHERE id = ?`,
      [item.so_luong, item.id_san_pham]
    );
  }
}


//Cập nhật trạng thái đơn hàng vào database
const updateOrderStatusDB = async (orderId, statusId) => {
  const [orderRows] = await connection.promise().query(
    'SELECT id FROM don_hang WHERE id = ?',
    [orderId]
  );

  if (orderRows.length === 0) {
    throw new Error('Đơn hàng không tồn tại');
  }

  await connection.promise().query(
    'UPDATE don_hang SET id_trang_thai = ? WHERE id = ?',
    [statusId, orderId]
  );

  if (parseInt(statusId) === 4) {
    await updateRevenueStats(orderId);
    await updateProductSale(orderId);
  }
};




module.exports = {getAllProducts,getTopSellingProducts,checkUserExists,getUserRole,registerUser,checkUserExistDB,getUser,
  getAllUsers,addProduct,getproductDetail,createOrder,addOrderDetail,updateRevenueStats,getAllOrders,getOrderDetails,updateOrderStatusDB,addToCart,
  placeOrderFromCart,getAllOrderStatus,getAllCart,getUserInforId,updateProductWithImage,
  updateProductWithoutImage,deleteProduct,addShippingAddress,getAllAdressShipping,deleteAddress,updateAvatar,getAllOrderuser
};
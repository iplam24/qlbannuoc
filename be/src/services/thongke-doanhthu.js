require('dotenv').config();
const connection =require('../config/connectDB');
const getRevenueByDate = async (date) => {
  try {
    const [result] = await connection.promise().query(
      'SELECT * FROM thong_ke_doanh_thu_ngay WHERE ngay = ?',
      [date]
    );
    return result;
  } catch (err) {
    console.error('Lỗi khi lấy doanh thu theo ngày:', err);
    throw err;
  }
};

const getRevenueByMonth = async (month, year) => {
  try {
    const [result] = await connection.promise().query(
      `SELECT 
        DATE(ngay) AS ngay,
        SUM(doanh_thu) AS doanh_thu,
        SUM(so_luong_don_hang_hoan_thanh) AS don
       FROM thong_ke_doanh_thu_ngay
       WHERE YEAR(ngay) = ? AND MONTH(ngay) = ?
       GROUP BY DATE(ngay)
       ORDER BY ngay`,
      [year, month]
    );
    return result;
  } catch (err) {
    console.error('Lỗi khi lấy doanh thu theo tháng:', err);
    throw err;
  }
};

const getRevenueByYear = async (year) => {
  try {
    const [result] = await connection.promise().query(
      `SELECT 
        MONTH(ngay) AS thang,
        SUM(doanh_thu) AS doanh_thu,
        SUM(so_luong_don_hang_hoan_thanh) AS don
       FROM thong_ke_doanh_thu_ngay
       WHERE YEAR(ngay) = ?
       GROUP BY MONTH(ngay)
       ORDER BY thang`,
      [year]
    );
    return result;
  } catch (err) {
    console.error('Lỗi khi lấy doanh thu theo năm:', err);
    throw err;
  }
};

//====Thông báo====//
const createNotification = async (id_nguoi_dung, tin_nhan) => {
  try {
    const [result] = await connection.promise().query(
      'INSERT INTO thong_bao (id_nguoi_dung, tin_nhan) VALUES (?, ?)',
      [id_nguoi_dung, tin_nhan]
    );
    return result.insertId;
  } catch (err) {
    console.error('Lỗi khi tạo thông báo:', err);
    throw err;
  }
};

const getNotificationsByUser = async (id_nguoi_dung) => {
  try {
    const [result] = await connection.promise().query(
      'SELECT * FROM thong_bao WHERE id_nguoi_dung = ? ORDER BY thoi_gian_tao DESC',
      [id_nguoi_dung]
    );
    return result;
  } catch (err) {
    console.error('Lỗi khi lấy thông báo:', err);
    throw err;
  }
};

const markNotificationAsRead = async (id) => {
  try {
    await connection.promise().query(
      'UPDATE thong_bao SET da_doc = 1 WHERE id = ?',
      [id]
    );
    return true;
  } catch (err) {
    console.error('Lỗi khi đánh dấu đã đọc:', err);
    throw err;
  }
};

module.exports={getRevenueByDate, getRevenueByMonth, getRevenueByYear,
   createNotification,
  getNotificationsByUser,
  markNotificationAsRead
}

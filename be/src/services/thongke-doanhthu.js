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
        DATE_FORMAT(ngay, '%Y-%m') AS thang,
        SUM(doanh_thu) AS tong_doanh_thu,
        SUM(so_luong_don_hang_hoan_thanh) AS tong_don_hang
       FROM thong_ke_doanh_thu_ngay
       WHERE YEAR(ngay) = ? AND MONTH(ngay) = ?
       GROUP BY thang`,
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
        YEAR(ngay) AS nam,
        SUM(doanh_thu) AS tong_doanh_thu,
        SUM(so_luong_don_hang_hoan_thanh) AS tong_don_hang
       FROM thong_ke_doanh_thu_ngay
       WHERE YEAR(ngay) = ?
       GROUP BY nam`,
      [year]
    );
    return result;
  } catch (err) {
    console.error('Lỗi khi lấy doanh thu theo năm:', err);
    throw err;
  }
};

module.exports={getRevenueByDate, getRevenueByMonth, getRevenueByYear}

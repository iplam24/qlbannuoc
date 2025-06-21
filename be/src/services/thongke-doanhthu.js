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


module.exports={getRevenueByDate, getRevenueByMonth, getRevenueByYear}

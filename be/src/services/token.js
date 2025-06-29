// src/controller/userController.js
const connection = require('../config/connectDB');

// Lưu push token cho người dùng
const savePushToken = async (req, res) => {
  const { userId } = req.params;
  const { token } = req.body;

  if (!userId || !token) {
    return res.status(400).json({ success: false, message: 'Thiếu userId hoặc token' });
  }

  try {
    const [result] = await connection.promise().query(
      'UPDATE nguoi_dung SET push_token = ? WHERE id = ?',
      [token, userId]
    );

    if (result.affectedRows > 0) {
      res.json({ success: true, message: 'Đã lưu push token' });
    } else {
      res.status(404).json({ success: false, message: 'Không tìm thấy người dùng' });
    }
  } catch (err) {
    console.error('Lỗi khi lưu push token:', err);
    res.status(500).json({ success: false, message: 'Lỗi server khi lưu push token' });
  }
};

module.exports = { savePushToken };

require('dotenv').config();
const {
  createNotification,
  getNotificationsByUser,
  markNotificationAsRead
} = require('../services/thongke-doanhthu');

const {sendPushNotification} = require('../config/pushNotication');

// === API TẠO THÔNG BÁO ===
const createNotificationAPI = async (req, res) => {
  const { id_nguoi_dung, tin_nhan } = req.body;

  if (!id_nguoi_dung || !tin_nhan) {
    return res.status(400).json({ success: false, message: 'Thiếu thông tin cần thiết' });
  }

  try {
    const insertId = await createNotification(id_nguoi_dung, tin_nhan);

    // 📨 Gửi thông báo đẩy (Push Notification)
    await sendPushNotification(id_nguoi_dung, tin_nhan);

    res.json({ success: true, message: 'Tạo thông báo thành công', id: insertId });
  } catch (err) {
    console.error('Lỗi khi tạo thông báo:', err);
    res.status(500).json({ success: false, message: 'Lỗi server khi tạo thông báo' });
  }
};
// === API LẤY DANH SÁCH THÔNG BÁO THEO NGƯỜI DÙNG ===
const getNotificationsAPI = async (req, res) => {
  const { userId } = req.params;

  try {
    const result = await getNotificationsByUser(userId);
    res.json({ success: true, data: result });
  } catch (err) {
    console.error('Lỗi khi lấy thông báo:', err);
    res.status(500).json({ success: false, message: 'Lỗi khi lấy thông báo' });
  }
};

// === API ĐÁNH DẤU ĐÃ ĐỌC ===
const markAsReadAPI = async (req, res) => {
  const { id } = req.params;

  try {
    await markNotificationAsRead(id);
    res.json({ success: true, message: 'Đã đánh dấu đã đọc' });
  } catch (err) {
    console.error('Lỗi khi đánh dấu đã đọc:', err);
    res.status(500).json({ success: false, message: 'Lỗi khi cập nhật trạng thái đọc' });
  }
};

module.exports = {
  createNotificationAPI,
  getNotificationsAPI,
  markAsReadAPI
};

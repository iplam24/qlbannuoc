const admin = require('firebase-admin');
const serviceAccount = require('./service-account.json'); 

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Hàm gửi notification với FCM token lấy từ DB
const sendPushNotificationFCM = async (userId, message) => {
  try {
    const [rows] = await db.promise().query(
      'SELECT push_token FROM nguoi_dung WHERE id = ?',
      [userId]
    );

    const fcmToken = rows[0]?.push_token;
    if (!fcmToken) {
      console.log('❌ Không có FCM token cho user:', userId);
      return;
    }

    const payload = {
      token: fcmToken,
      notification: {
        title: '🔔 Thông báo mới',
        body: message,
      },
    };

    const response = await admin.messaging().send(payload);
    console.log('✔️ Đã gửi thông báo qua FCM:', response);
  } catch (error) {
    console.error('Lỗi khi gửi push notification FCM:', error);
  }
};

module.exports = { sendPushNotificationFCM };

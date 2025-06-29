// utils/usePushToken.js
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '@env';

export const registerPushToken = async () => {
  try {
    // Kiểm tra quyền nhận thông báo
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status: requestedStatus } = await Notifications.requestPermissionsAsync();
      finalStatus = requestedStatus;
    }

    if (finalStatus !== 'granted') {
      console.log('❌ Không có quyền nhận thông báo đẩy');
      return;
    }

    // Lấy Expo Push Token
    const tokenData = await Notifications.getExpoPushTokenAsync();
    const pushToken = tokenData.data;
    if (!pushToken) {
      console.log('❌ Lấy push token thất bại');
      return;
    }

    // Lấy userId từ AsyncStorage
    const userId = await AsyncStorage.getItem('userId');
    if (!userId) {
      console.log('❌ Không tìm thấy userId trong AsyncStorage');
      return;
    }

    // Gửi token lên server
    const response = await fetch(`${API_URL}/user/token/${userId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: pushToken }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Lưu push token thất bại:', errorText);
    } else {
      console.log('✔️ Push token đã được lưu:', pushToken);
    }
  } catch (error) {
    console.error('❌ Lỗi trong registerPushToken:', error);
  }
};

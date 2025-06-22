import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Alert,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { API_URL } from '@env';
import { styles } from './InforScreencss';

const InforScreen = () => {
  const [hoTen, setHoTen] = useState('');
  const [sdt, setSDT] = useState('');
  const [email, setEmail] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    const fetchProfile = async () => {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) {
        Alert.alert('Lỗi', 'Không tìm thấy ID người dùng');
        return;
      }

      try {
        const response = await fetch(`${API_URL}/user/profile?id=${userId}`);
        const data = await response.json();

        setHoTen(data.name || '');
        setSDT(data.phone || '');
        setEmail(data.email || '');
      } catch (err) {
        console.error('Lỗi lấy thông tin:', err);
        Alert.alert('Lỗi', 'Không thể lấy thông tin cá nhân');
      }
    };

    fetchProfile();
  }, []);

  const handleSave = async () => {
    const userId = await AsyncStorage.getItem('userId');

    if (!hoTen.trim() || !sdt.trim()) {
      Alert.alert('Thiếu thông tin', 'Vui lòng điền đầy đủ');
      return;
    }

    // Kiểm tra số điện thoại hợp lệ
    if (!/^[0-9]{9,11}$/.test(sdt.trim())) {
      Alert.alert('Lỗi', 'Số điện thoại không hợp lệ');
      return;
    }

    const body = {
      id: userId,
      name: hoTen.trim(),
      phone: sdt.trim(),
    };

    try {
      const response = await fetch(`${API_URL}/user/update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const resData = await response.json();
      if (resData.success) {
        Alert.alert('✅ Thành công', 'Cập nhật thành công');
      } else {
        Alert.alert('❌ Lỗi', resData.message || 'Cập nhật thất bại');
      }
    } catch (err) {
      console.error('Lỗi cập nhật:', err);
      Alert.alert('Lỗi', 'Không thể cập nhật thông tin');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header */}
        <View style={styles.fixedHeader}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Thông tin cá nhân</Text>
        </View>



      {/* Form */}
      <TextInput
        style={styles.input}
        placeholder="Họ và tên"
        value={hoTen}
        onChangeText={setHoTen}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        editable={false}
      />
      <TextInput
        style={styles.input}
        placeholder="Số điện thoại"
        value={sdt}
        onChangeText={setSDT}
        keyboardType="phone-pad"
      />
      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Lưu thay đổi</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default InforScreen;

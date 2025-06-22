import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Alert,
  ScrollView,
  TouchableOpacity,
  Image,
  Modal,
  SafeAreaView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { API_URL } from '@env';
import { styles } from './InforScreencss';

const InforScreen = () => {
  const [hoTen, setHoTen] = useState('');
  const [sdt, setSDT] = useState('');
  const [email, setEmail] = useState('');
  const [avatar, setAvatar] = useState('');
  const [newAvatar, setNewAvatar] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [avatarModalVisible, setAvatarModalVisible] = useState(false);

  const navigation = useNavigation();

  useEffect(() => {
    const fetchProfile = async () => {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) {
        Alert.alert('Lỗi', 'Không tìm thấy ID người dùng');
        return;
      }

      try {
        const response = await fetch(`${API_URL}/userinforid/${userId}`);
        const data = await response.json();

        if (data.user && data.user.length > 0) {
          const userInfo = data.user[0];
          setHoTen(userInfo.ho_ten || '');
          setSDT(userInfo.so_dien_thoai || '');
          setEmail(userInfo.email || '');

          const avatarUri = userInfo.img
            ? (userInfo.img.startsWith('http') ? userInfo.img : `${API_URL}${userInfo.img}`)
            : null;

          setAvatar(avatarUri);
        } else {
          Alert.alert('Lỗi', 'Không tìm thấy thông tin người dùng');
        }
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
        setModalVisible(false);
      } else {
        Alert.alert('❌ Lỗi', resData.message || 'Cập nhật thất bại');
      }
    } catch (err) {
      console.error('Lỗi cập nhật:', err);
      Alert.alert('Lỗi', 'Không thể cập nhật thông tin');
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setNewAvatar(result.assets[0].uri);
      setAvatarModalVisible(true);
    }
  };

  const saveNewAvatar = async () => {
    const userId = await AsyncStorage.getItem('userId');
    if (!newAvatar || !userId) return;

    const form = new FormData();
    const filename = newAvatar.split('/').pop();
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : `image`;

    let oldAvatarPath = '';

    if (avatar) {
      if (avatar.startsWith(API_URL)) {
        oldAvatarPath = avatar.replace(API_URL, '');
      } else if (avatar.startsWith('/upload/')) {
        oldAvatarPath = avatar;
      }
    }

    form.append('img', {
      uri: newAvatar,
      name: filename,
      type: type,
    });
    form.append('userId', userId);
    form.append('oldAvatar', oldAvatarPath);

    try {
      const response = await fetch(`${API_URL}/updateAvatar`, {
        method: 'POST',
        body: form,
      });

      const resData = await response.json();
      if (resData.success) {
        setAvatar(`${API_URL}${resData.img}`);
        Alert.alert('Thành công', 'Cập nhật ảnh đại diện thành công');
      } else {
        Alert.alert('Lỗi', resData.message || 'Không thể cập nhật ảnh');
      }
    } catch (err) {
      console.error('Lỗi upload avatar:', err);
      Alert.alert('Lỗi', 'Không thể gửi ảnh lên server');
    }

    setNewAvatar('');
    setAvatarModalVisible(false);
  };


  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.fixedHeader}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Thông tin cá nhân</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.profileSection}>
          <Image source={avatar ? { uri: avatar } : require('../../../assets/avatar2.png')} style={styles.profileImage} />
          <View style={styles.profileDetails}>
            <Text style={styles.userName}>{hoTen}</Text>
            <Text style={styles.userEmail}>{email}</Text>
            <Text style={styles.userEmail}>{sdt}</Text>
          </View>
        </View>

        <View style={styles.optionsContainer}>
          <Text style={styles.optionsTitle}>Tuỳ chọn</Text>
          <TouchableOpacity style={styles.optionItem} onPress={() => setModalVisible(true)}>
            <Ionicons name="create-outline" size={20} color="#4a5568" />
            <Text style={styles.optionText}>Đổi thông tin cá nhân</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.optionItem} onPress={pickImage}>
            <Ionicons name="image-outline" size={20} color="#4a5568" />
            <Text style={styles.optionText}>Đổi ảnh đại diện</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.optionItem} onPress={() => navigation.navigate('AddressScreen')}>
            <Ionicons name="location-outline" size={20} color="#4a5568" />
            <Text style={styles.optionText}>Địa chỉ nhận hàng</Text>
          </TouchableOpacity>
        </View>

        <Modal visible={modalVisible} animationType="slide" transparent={true}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Cập nhật thông tin</Text>
              <TextInput
                style={styles.input}
                placeholder="Họ và tên"
                value={hoTen}
                onChangeText={setHoTen}
              />
              <TextInput
                style={styles.input}
                placeholder="email"
                value={email}
                onChangeText={setEmail}
              />
              <TextInput
                style={styles.input}
                placeholder="Số điện thoại"
                value={sdt}
                onChangeText={setSDT}
                keyboardType="phone-pad"
              />
              <View style={styles.modalButtonGroup}>
                <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                  <Text style={styles.saveButtonText}>Lưu</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.saveButton, { backgroundColor: '#aaa' }]}
                  onPress={() => setModalVisible(false)}>
                  <Text style={styles.saveButtonText}>Hủy</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        <Modal visible={avatarModalVisible} animationType="slide" transparent={true}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Xác nhận ảnh mới</Text>
              <Image source={{ uri: newAvatar }} style={styles.avatarPreview} />
              <View style={styles.modalButtonGroup}>
                <TouchableOpacity style={styles.saveButton} onPress={saveNewAvatar}>
                  <Text style={styles.saveButtonText}>Lưu</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.saveButton, { backgroundColor: '#aaa' }]}
                  onPress={() => {
                    setNewAvatar('');
                    setAvatarModalVisible(false);
                  }}>
                  <Text style={styles.saveButtonText}>Hủy</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
};

export default InforScreen;

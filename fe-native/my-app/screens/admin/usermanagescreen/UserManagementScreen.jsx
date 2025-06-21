import React, { useEffect, useState } from 'react';
import {
    View, Text, TouchableOpacity, ScrollView, Modal, TextInput, Image, Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { API_URL } from '@env';
import { styles } from './UserManagementScreenCss'; // Giữ nguyên style
import { fetchData } from '../../../utils/fetchData';
import AdminFooter from '../../../components/AdminFooter';
import * as ImagePicker from 'expo-image-picker';

const DEFAULT_AVATAR = require('../../../assets/avatar2.png');

export default function UserManagementScreen() {
    const [users, setUsers] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [formData, setFormData] = useState({
        ten_tai_khoan: '',
        mat_khau: '',
        ho_ten: '',
        email: '',
        so_dien_thoai: '',
        dia_chi: '',
        img: null,
        id_vai_tro: null,
    });
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredUsers, setFilteredUsers] = useState([]);

    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        const filtered = users.filter(user =>
            (user.ho_ten && user.ho_ten.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (user.ten_tai_khoan && user.ten_tai_khoan.toLowerCase().includes(searchTerm.toLowerCase()))
        );
        setFilteredUsers(filtered);
    }, [searchTerm, users]);

    const fetchUsers = async () => {
        const data = await fetchData(`${API_URL}/getallusers`);
        if (data) {
            setUsers(data);
            setFilteredUsers(data);
        }
    };

    const handleEdit = (user) => {
        setEditingUser(user);
        setFormData({
            ten_tai_khoan: user.ten_tai_khoan || '',
            mat_khau: '', // Không hiển thị mật khẩu cũ
            ho_ten: user.ho_ten || '',
            email: user.email || '',
            so_dien_thoai: user.so_dien_thoai || '',
            dia_chi: user.dia_chi || '',
            img: user.img || null,
            id_vai_tro: user.id_vai_tro || null,
        });
        setModalVisible(true);
    };

    const handleDelete = async (id) => {
        Alert.alert(
            'Xác nhận',
            'Bạn có chắc chắn muốn xóa người dùng này?',
            [
                { text: 'Hủy', style: 'cancel' },
                {
                    text: 'Xóa',
                    onPress: async () => {
                        const res = await fetch(`${API_URL}/users/${id}`, { method: 'DELETE' });
                        if (res.ok) {
                            fetchUsers();
                        } else {
                            Alert.alert('Lỗi', 'Không xóa được người dùng');
                        }
                    },
                },
            ]
        );
    };

    const handleSave = async () => {
        if (!formData.ten_tai_khoan || !formData.ho_ten) {
            Alert.alert('Lỗi', 'Tên tài khoản và họ tên là bắt buộc');
            return;
        }

        const method = editingUser ? 'PUT' : 'POST';
        const url = editingUser ? `${API_URL}/users/${editingUser.id}` : `${API_URL}/users`;
        const body = { ...formData };
        if (!formData.mat_khau && editingUser) {
            delete body.mat_khau; // Không gửi mật khẩu nếu không thay đổi khi sửa
        }

        const res = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });

        if (res.ok) {
            fetchUsers();
            setModalVisible(false);
            setFormData({ ten_tai_khoan: '', mat_khau: '', ho_ten: '', email: '', so_dien_thoai: '', dia_chi: '', img: null, id_vai_tro: null });
            setEditingUser(null);
        } else {
            const errorData = await res.json();
            Alert.alert('Lỗi', errorData.message || 'Không lưu được người dùng');
        }
    };

    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Cần cấp quyền', 'Ứng dụng cần quyền truy cập thư viện ảnh');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled && result.assets && result.assets[0]) {
            setFormData({ ...formData, img: result.assets[0].uri });
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Quản lý người dùng 👤</Text>

            <TextInput
                placeholder="Tìm kiếm người dùng..."
                style={styles.searchInput}
                value={searchTerm}
                onChangeText={setSearchTerm}
            />

            <TouchableOpacity
                style={styles.addButton}
                onPress={() => {
                    setEditingUser(null);
                    setFormData({ ten_tai_khoan: '', mat_khau: '', ho_ten: '', email: '', so_dien_thoai: '', dia_chi: '', img: null, id_vai_tro: null });
                    setModalVisible(true);
                }}
            >
                <Ionicons name="add-circle-outline" size={24} color="white" />
                <Text style={styles.addText}>Thêm người dùng</Text>
            </TouchableOpacity>

            <ScrollView>
                {filteredUsers.map((user) => (
                    <View key={user.id} style={styles.card}>
                        <Image
                            source={user.img ? (user.img.startsWith('http') ? { uri: user.img } : { uri: `${API_URL}${user.img}` }) : DEFAULT_AVATAR}
                            style={{ width: 60, height: 60, borderRadius: 8, marginRight: 10 }}
                        />
                        <View style={{ flex: 1 }}>
                            <Text style={styles.name}>{user.ho_ten || 'Chưa có tên'}</Text>
                            <Text style={styles.price}>{user.ten_tai_khoan || 'Chưa có tài khoản'}</Text>
                            <Text style={styles.price}>{user.email || 'Chưa có email'}</Text>
                        </View>
                        <TouchableOpacity onPress={() => handleEdit(user)} style={styles.iconBtn}>
                            <Ionicons name="create-outline" size={22} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => handleDelete(user.id)} style={styles.iconBtn}>
                            <Ionicons name="trash-outline" size={22} color="red" />
                        </TouchableOpacity>
                    </View>
                ))}
            </ScrollView>
            <AdminFooter />

            <Modal visible={modalVisible} animationType="slide" transparent>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>
                            {editingUser ? 'Sửa người dùng' : 'Thêm người dùng'}
                        </Text>

                        <TouchableOpacity onPress={pickImage} style={styles.selectImageBtn}>
                            <Text style={styles.selectImageText}>Chọn ảnh đại diện</Text>
                        </TouchableOpacity>

                        <Image
                            source={formData.img ? (formData.img.startsWith('http') ? { uri: formData.img } : { uri: `${API_URL}${formData.img}` }) : DEFAULT_AVATAR}
                            style={styles.selectedImage}
                        />

                        <TextInput
                            placeholder="Tên tài khoản"
                            style={styles.input}
                            value={formData.ten_tai_khoan}
                            onChangeText={(text) => setFormData({ ...formData, ten_tai_khoan: text })}
                        />
                        <TextInput
                            placeholder="Mật khẩu"
                            style={styles.input}
                            value={formData.mat_khau}
                            onChangeText={(text) => setFormData({ ...formData, mat_khau: text })}
                            secureTextEntry
                        />
                        <TextInput
                            placeholder="Họ tên"
                            style={styles.input}
                            value={formData.ho_ten}
                            onChangeText={(text) => setFormData({ ...formData, ho_ten: text })}
                        />
                        <TextInput
                            placeholder="Email"
                            style={styles.input}
                            value={formData.email}
                            onChangeText={(text) => setFormData({ ...formData, email: text })}
                            keyboardType="email-address"
                        />
                        <TextInput
                            placeholder="Số điện thoại"
                            style={styles.input}
                            value={formData.so_dien_thoai}
                            onChangeText={(text) => setFormData({ ...formData, so_dien_thoai: text })}
                            keyboardType="phone-pad"
                        />
                        <TextInput
                            placeholder="Địa chỉ"
                            style={styles.input}
                            value={formData.dia_chi}
                            onChangeText={(text) => setFormData({ ...formData, dia_chi: text })}
                            multiline
                        />
                        {/* Thêm các input khác cho thông tin người dùng nếu cần */}

                        <View style={styles.modalActions}>
                            <TouchableOpacity
                                style={styles.cancelBtn}
                                onPress={() => {
                                    setModalVisible(false);
                                    setEditingUser(null);
                                    setFormData({ ten_tai_khoan: '', mat_khau: '', ho_ten: '', email: '', so_dien_thoai: '', dia_chi: '', img: null, id_vai_tro: null });
                                }}
                            >
                                <Text style={styles.cancelText}>Hủy</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
                                <Text style={styles.saveText}>Lưu</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}
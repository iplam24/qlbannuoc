import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    TextInput,
    Alert,
    Modal,
    SafeAreaView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { API_URL } from '@env';
import axios from 'axios';
import { styles } from '../editscreen/InforScreencss';
import { useNavigation } from '@react-navigation/native';

const AddressScreen = () => {
    const [addresses, setAddresses] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentAddress, setCurrentAddress] = useState(null);
    const [nguoiNhan, setNguoiNhan] = useState('');
    const [diaChi, setDiaChi] = useState('');
    const [soDienThoai, setSoDienThoai] = useState('');
    const [userId, setUserId] = useState(null);

    const navigation = useNavigation();

    useEffect(() => {
        const getUserIdAndFetch = async () => {
            const uid = await AsyncStorage.getItem('userId');
            setUserId(uid);
            fetchAddresses(uid);
        };
        getUserIdAndFetch();
    }, []);

    const fetchAddresses = async (uid) => {
        try {
            const res = await axios.get(`${API_URL}/diachi/${uid}`);
            if (res.data.success) {
                setAddresses(res.data.data);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleSaveAddress = async () => {
        if (!nguoiNhan || !diaChi || !soDienThoai) {
            Alert.alert('Thiếu thông tin', 'Vui lòng nhập đầy đủ thông tin');
            return;
        }

        if (!/^\d{9,11}$/.test(soDienThoai)) {
            Alert.alert('Lỗi', 'Số điện thoại không hợp lệ');
            return;
        }

        const body = {
            id_nguoi_dung: userId,
            dia_chi: diaChi.trim(),
            so_dien_thoai: soDienThoai.trim(),
            nguoi_nhan: nguoiNhan.trim(),
        };

        try {
            if (editMode && currentAddress) {
                body.id = currentAddress.id;
                await axios.post(`${API_URL}/updateAddress`, body);
            } else {
                const res = await axios.post(`${API_URL}/addAddress`, body);
                if (res.data?.id) {
                    Alert.alert('Thành công', 'Đã thêm địa chỉ mới!');
                } else {
                    Alert.alert('Lỗi', 'Không thể thêm địa chỉ');
                }
            }

            fetchAddresses(userId);
            resetModal();
        } catch (err) {
            console.error(err);
            Alert.alert('Lỗi', 'Không thể lưu địa chỉ');
        }
    };

    const resetModal = () => {
        setModalVisible(false);
        setEditMode(false);
        setCurrentAddress(null);
        setNguoiNhan('');
        setDiaChi('');
        setSoDienThoai('');
    };

    const handleDelete = (id) => {
        Alert.alert(
            'Xác nhận',
            'Bạn chắc chắn muốn xoá địa chỉ này chứ? ',
            [
                { text: 'Huỷ', style: 'cancel' },
                {
                    text: 'Xoá',
                    onPress: async () => {
                        try {
                            await axios.delete(`${API_URL}/deleteAddress/${id}`);
                            fetchAddresses(userId);
                            Alert.alert("Xoá thành công", "Xoá thành công địa chỉ!");
                        } catch (err) {
                            Alert.alert('Lỗi', 'Không thể xoá địa chỉ');
                        }
                    },
                    style: 'destructive'
                }
            ]
        );
    };


    const renderItem = ({ item }) => (
        <View style={{ padding: 16, backgroundColor: '#fff', borderRadius: 8, marginBottom: 10 }}>
            <Text style={{ fontWeight: 'bold' }}>{item.nguoi_nhan}</Text>
            <Text>{item.dia_chi}</Text>
            <Text>{item.so_dien_thoai}</Text>
            <View style={{ flexDirection: 'row', marginTop: 10 }}>
                <TouchableOpacity
                    onPress={() => {
                        setCurrentAddress(item);
                        setNguoiNhan(item.nguoi_nhan);
                        setDiaChi(item.dia_chi);
                        setSoDienThoai(item.so_dien_thoai);
                        setEditMode(true);
                        setModalVisible(true);
                    }}
                    style={{ marginRight: 10 }}>
                    <Ionicons name="create-outline" size={20} color="#4a5568" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDelete(item.id)}>
                    <Ionicons name="trash-outline" size={20} color="red" />
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.fixedHeader}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Địa chỉ nhận hàng</Text>
            </View>

            <FlatList
                style={{ marginTop: 50 }}
                data={addresses}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderItem}
                contentContainerStyle={{ padding: 16 }}
                ListEmptyComponent={<Text>Chưa có địa chỉ nào</Text>}
                ListFooterComponent={
                    <TouchableOpacity
                        onPress={() => setModalVisible(true)}
                        style={{
                            backgroundColor: '#1f6f8b',
                            padding: 14,
                            borderRadius: 10,
                            marginTop: 20,
                            alignItems: 'center',
                        }}
                    >
                        <Text style={{ color: '#fff', fontWeight: 'bold' }}>+ Thêm địa chỉ mới</Text>
                    </TouchableOpacity>
                }
            />

            {/* Modal thêm/sửa địa chỉ */}
            <Modal visible={modalVisible} animationType="slide">
                <SafeAreaView style={{ flex: 1, padding: 16 }}>
                    <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>
                        {editMode ? 'Cập nhật địa chỉ' : 'Thêm địa chỉ mới'}
                    </Text>
                    <TextInput
                        placeholder="Người nhận"
                        value={nguoiNhan}
                        onChangeText={setNguoiNhan}
                        style={{ borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 10, borderRadius: 8 }}
                    />
                    <TextInput
                        placeholder="Địa chỉ"
                        value={diaChi}
                        onChangeText={setDiaChi}
                        style={{ borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 10, borderRadius: 8 }}
                    />
                    <TextInput
                        placeholder="Số điện thoại"
                        value={soDienThoai}
                        onChangeText={setSoDienThoai}
                        keyboardType="phone-pad"
                        style={{ borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 8 }}
                    />

                    <TouchableOpacity
                        onPress={handleSaveAddress}
                        style={{ backgroundColor: '#1f6f8b', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 20 }}
                    >
                        <Text style={{ color: '#fff' }}>{editMode ? 'Cập nhật' : 'Thêm địa chỉ'}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={resetModal}
                        style={{ alignItems: 'center', marginTop: 10 }}
                    >
                        <Text style={{ color: '#1f6f8b' }}>Huỷ</Text>
                    </TouchableOpacity>
                </SafeAreaView>
            </Modal>
        </SafeAreaView>
    );
};

export default AddressScreen;

import React, { useEffect, useState } from 'react';
import {
    View, Text, FlatList, TouchableOpacity, Image, SafeAreaView,
    StatusBar, Platform, Alert, Modal, ScrollView, TextInput
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { API_URL } from '@env';
import { styles } from '../homescreen/HomeScreenCss';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchData } from '../../../utils/fetchData';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import axios from 'axios';
import { Picker } from '@react-native-picker/picker';

export default function CartScreen({ navigation }) {
    const [cartItems, setCartItems] = useState([]);
    const [userId, setUserId] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [description, setDescription] = useState('');
    const [addressList, setAddressList] = useState([]);
    const [selectedAddressId, setSelectedAddressId] = useState(null);
    const [addAddressModalVisible, setAddAddressModalVisible] = useState(false);
    const [newDiaChi, setNewDiaChi] = useState('');
    const [newSoDienThoai, setNewSoDienThoai] = useState('');
    const [newNguoiNhan, setNewNguoiNhan] = useState('');

    useEffect(() => {
        const getUserId = async () => {
            try {
                const storedId = await AsyncStorage.getItem('userId');
                if (storedId) {
                    setUserId(storedId);
                    fetchCart(storedId);
                }
            } catch (e) {
                console.error('Lỗi lấy userId: ', e);
            }
        };
        getUserId();
    }, []);

    const fetchCart = async (uid) => {
        const data = await fetchData(`${API_URL}/getAllCarts/${uid}`);
        setCartItems(data?.data || []);
    };

    const fetchAddressList = async (uid) => {
        try {
            const res = await fetch(`${API_URL}/diachi/${uid}`);
            const json = await res.json();
            if (json.success) {
                setAddressList(json.data);
                if (json.data.length > 0) setSelectedAddressId(json.data[0].id);
            }
        } catch (err) {
            console.error('Lỗi lấy địa chỉ:', err);
        }
    };

    const handleOpenModal = () => {
        if (cartItems.length === 0) {
            Alert.alert('Giỏ hàng trống', 'Bạn thêm sản phẩm rồi đặt nha!');
        } else {
            fetchAddressList(userId);
            setModalVisible(true);
        }
    };

    const handleOrder = async () => {
        if (!selectedAddressId) {
            Alert.alert('Chọn địa chỉ', 'Vui lòng chọn địa chỉ giao hàng!');
            return;
        }
        try {
            const res = await axios.post(`${API_URL}/addOrderFromCart`, {
                userId,
                description,
                diaChiId: selectedAddressId
            });
            if (res.data.success) {
                Alert.alert('Đặt hàng thành công', 'Cảm ơn bạn đã mua hàng!');
                setCartItems([]);
                setDescription('');
                setModalVisible(false);
            } else {
                Alert.alert('Lỗi', res.data.message || 'Đặt hàng thất bại!');
            }
        } catch (err) {
            console.error('Lỗi đặt hàng:', err);
            Alert.alert('Server lỗi');
        }
    };

    const renderItem = ({ item }) => (
        <View style={{
            flexDirection: 'row', alignItems: 'center', marginBottom: 10,
            padding: 10, borderWidth: 1, borderColor: '#ddd', borderRadius: 8
        }}>
            <Image source={{ uri: `${API_URL}${item.img}` }} style={{ width: 50, height: 50, borderRadius: 8, marginRight: 10 }} />
            <View style={{ flex: 1 }}>
                <Text style={styles.drinkName}>{item.ten_san_pham}</Text>
                <Text style={styles.drinkSub}>Số lượng: {item.so_luong}</Text>
                <Text style={styles.drinkSub}>Giá: {item.gia}</Text>
                <Text style={styles.drinkSub}>Thành tiền: {item.gia * item.so_luong}</Text>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={[
            styles.container,
            { paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 }
        ]}>
            <Header />
            <Text style={styles.sectionTitle}>Giỏ hàng</Text>

            <FlatList
                data={cartItems}
                keyExtractor={(item, index) => item.id + '-' + index}
                renderItem={renderItem}
                ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 20 }}>Giỏ hàng trống</Text>}
                contentContainerStyle={{ paddingBottom: 100 }}
                ListFooterComponent={() => (
                    <View style={{ alignItems: 'flex-end', padding: 10 }}>
                        <Text style={{ fontWeight: 'bold', fontSize: 16 }}>
                            Tổng giỏ hàng: {cartItems.reduce((sum, item) => sum + item.gia * item.so_luong, 0).toLocaleString()} đ
                        </Text>
                    </View>
                )}
            />

            <TouchableOpacity
                style={{
                    backgroundColor: '#1f6f8b', padding: 15, borderRadius: 20,
                    margin: 16, alignItems: 'center',
                }}
                onPress={handleOpenModal}
            >
                <Text style={{ color: '#fff', fontSize: 16 }}>Đặt hàng</Text>
            </TouchableOpacity>

            <Modal visible={modalVisible} animationType="slide" onRequestClose={() => setModalVisible(false)}>
                <SafeAreaView style={{ flex: 1, padding: 16 }}>
                    <ScrollView>
                        <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>Xác nhận đặt hàng</Text>

                        <Text style={{ fontWeight: 'bold', marginBottom: 5 }}>Địa chỉ giao hàng:</Text>
                        <Picker
                            selectedValue={selectedAddressId}
                            onValueChange={(value) => setSelectedAddressId(value)}
                        >
                            {addressList.length === 0 ? (
                                <Picker.Item
                                    label="Không có địa chỉ nhận hàng. Vui lòng thêm địa chỉ nhận hàng mới!"
                                    value={null}
                                />
                            ) : (
                                addressList.map(addr => (
                                    <Picker.Item
                                        key={addr.id}
                                        label={`${addr.nguoi_nhan} - ${addr.dia_chi} - ${addr.so_dien_thoai}`}
                                        value={addr.id}
                                    />
                                ))
                            )}
                        </Picker>

                        <TouchableOpacity onPress={() => setAddAddressModalVisible(true)}>
                            <Text style={{ color: '#1f6f8b', marginVertical: 10 }}>+ Thêm địa chỉ nhận hàng</Text>
                        </TouchableOpacity>


                        {cartItems.map((item, index) => (
                            <View key={index} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                                <Image source={{ uri: `${API_URL}${item.img}` }} style={{ width: 50, height: 50, borderRadius: 8, marginRight: 10 }} />
                                <View>
                                    <Text>{item.ten_san_pham} - Số lượng: {item.so_luong}</Text>
                                    <Text>Thành tiền: {(item.so_luong * item.gia).toLocaleString()} đ</Text>
                                </View>
                            </View>
                        ))}

                        <TextInput
                            placeholder="Lưu ý của bạn"
                            value={description}
                            onChangeText={setDescription}
                            multiline
                            numberOfLines={3}
                            style={{
                                borderWidth: 1, borderColor: '#ccc', padding: 10,
                                marginVertical: 10, borderRadius: 8, textAlignVertical: 'top'
                            }}
                        />

                        <TouchableOpacity
                            style={{
                                backgroundColor: '#1f6f8b', padding: 15, borderRadius: 20,
                                alignItems: 'center', marginTop: 10
                            }}
                            onPress={handleOrder}
                        >
                            <Text style={{ color: '#fff', fontSize: 16 }}>Xác nhận đặt hàng</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={{ padding: 15, alignItems: 'center', marginTop: 10 }}
                            onPress={() => setModalVisible(false)}
                        >
                            <Text style={{ color: '#1f6f8b', fontSize: 16 }}>Huỷ</Text>
                        </TouchableOpacity>
                    </ScrollView>
                </SafeAreaView>
            </Modal>
            <Modal visible={addAddressModalVisible} animationType="slide">
                <SafeAreaView style={{ flex: 1, padding: 16 }}>
                    <ScrollView>
                        <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>Thêm địa chỉ mới</Text>

                        <TextInput
                            placeholder="Người nhận"
                            value={newNguoiNhan}
                            onChangeText={setNewNguoiNhan}
                            style={{ borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 10, borderRadius: 8 }}
                        />
                        <TextInput
                            placeholder="Địa chỉ"
                            value={newDiaChi}
                            onChangeText={setNewDiaChi}
                            style={{ borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 10, borderRadius: 8 }}
                        />
                        <TextInput
                            placeholder="Số điện thoại"
                            value={newSoDienThoai}
                            onChangeText={setNewSoDienThoai}
                            keyboardType="phone-pad"
                            style={{ borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 8 }}
                        />

                        <TouchableOpacity
                            style={{ backgroundColor: '#1f6f8b', padding: 15, borderRadius: 20, alignItems: 'center', marginTop: 20 }}
                            onPress={async () => {
                                if (!newNguoiNhan || !newDiaChi) {
                                    Alert.alert('Thiếu thông tin', 'Vui lòng nhập đầy đủ tên người nhận và địa chỉ');
                                    return;
                                }

                                try {
                                    const res = await axios.post(`${API_URL}/addAddress`, {
                                        id_nguoi_dung: userId,
                                        dia_chi: newDiaChi,
                                        so_dien_thoai: newSoDienThoai,
                                        nguoi_nhan: newNguoiNhan,
                                    });

                                    if (res.data?.id) {
                                        Alert.alert('Thành công', 'Đã thêm địa chỉ mới!');
                                        setAddAddressModalVisible(false);
                                        setNewDiaChi('');
                                        setNewSoDienThoai('');
                                        setNewNguoiNhan('');
                                        fetchAddressList(userId);
                                    }
                                } catch (error) {
                                    Alert.alert('Lỗi', 'Không thể thêm địa chỉ');
                                    console.error(error);
                                }
                            }}
                        >
                            <Text style={{ color: '#fff' }}>Thêm địa chỉ</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={{ padding: 15, alignItems: 'center', marginTop: 10 }}
                            onPress={() => setAddAddressModalVisible(false)}
                        >
                            <Text style={{ color: '#1f6f8b' }}>Huỷ</Text>
                        </TouchableOpacity>
                    </ScrollView>
                </SafeAreaView>
            </Modal>


            <Footer />
        </SafeAreaView>
    );
}

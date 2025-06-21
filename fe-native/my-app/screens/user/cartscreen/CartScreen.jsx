import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    Image,
    SafeAreaView,
    StatusBar,
    Platform,
    Alert,
    Modal,
    ScrollView,
    TextInput
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { API_URL } from '@env';
import { styles } from '../homescreen/HomeScreenCss';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchData } from '../../../utils/fetchData';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import axios from 'axios';

export default function CartScreen({ navigation }) {
    const [cartItems, setCartItems] = useState([]);
    const [userId, setUserId] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [description, setDescription] = useState('');
    const [userInfo, setUserInfo] = useState({
        ho_ten: '',
        so_dien_thoai: '',
        dia_chi: ''
    });

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
    const fetchUserInfo = async (uid) => {
        try {
            const res = await fetchData(`${API_URL}/userinforid/${uid}`);
            if (res && res.user && res.user[0]) {
                setUserInfo(res.user[0]);
            } else {
                console.warn('Không lấy được thông tin user');
            }
        } catch (err) {
            console.error('Lỗi lấy thông tin user: ', err);
        }
    };


    const fetchCart = async (uid) => {
        const data = await fetchData(`${API_URL}/getAllCarts/${uid}`);
        if (data && data.data) {
            setCartItems(data.data);
        } else {
            setCartItems([]);
        }
    };

    const handleOpenModal = () => {
        if (cartItems.length === 0) {
            Alert.alert('Giỏ hàng trống ', 'Bạn thêm sản phẩm rồi đặt nha!');
        } else {
            fetchUserInfo(userId);
            setModalVisible(true);
        }
    };

    const handleOrder = async () => {
        try {
            const res = await axios.post(`${API_URL}/addOrderFromCart`, {
                userId,
                description,
                items: cartItems
            });

            if (res.data.success) {
                Alert.alert('Đặt hàng thành công ', 'Cảm ơn bạn đã mua hàng!');
                setCartItems([]);
                setDescription('');
                setModalVisible(false);
            } else {
                Alert.alert('Lỗi rồi', res.data.message || 'Đặt hàng thất bại!');
            }
        } catch (err) {
            console.error('Lỗi đặt hàng: ', err);
            Alert.alert('Server lỗi rồi');
        }
    };

    const renderItem = ({ item }) => (
        <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 10,
            padding: 10,
            borderWidth: 1,
            borderColor: '#ddd',
            borderRadius: 8
        }}>
            <Image
                source={{ uri: `${API_URL}${item.img}` }}
                style={{ width: 50, height: 50, borderRadius: 8, marginRight: 10 }}
            />
            <View style={{ flex: 1 }}>
                <Text style={styles.drinkName}>{item.ten_san_pham}</Text>
                <Text style={styles.drinkSub}>Số lượng: {item.so_luong}</Text>
                <Text style={styles.drinkSub}>Giá: {item.gia}</Text>
                <Text style={styles.drinkSub}>Thành tiền: {item.gia * item.so_luong}</Text>
            </View>
            <View>
                <TouchableOpacity onPress={() => handleUpdateQuantity(item.id)} style={{ marginBottom: 5 }}>
                    <Text style={{ color: '#1f6f8b' }}>Sửa</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleRemoveItem(item.id)}>
                    <Text style={{ color: 'red' }}>Xoá</Text>
                </TouchableOpacity>
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
                    backgroundColor: '#1f6f8b',
                    padding: 15,
                    borderRadius: 20,
                    margin: 16,
                    alignItems: 'center',
                }}
                onPress={handleOpenModal}
            >
                <Text style={{ color: '#fff', fontSize: 16 }}>Đặt hàng</Text>
            </TouchableOpacity>

            <Modal
                visible={modalVisible}
                animationType="slide"
                onRequestClose={() => setModalVisible(false)}
            >
                <SafeAreaView style={{ flex: 1, padding: 16 }}>
                    <ScrollView>
                        <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>Xác nhận đặt hàng</Text>
                        <View style={{ marginBottom: 10 }}>
                            <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Thông tin người nhận:</Text>
                            <Text>Tên: {userInfo.ho_ten}</Text>
                            <Text>SĐT: {userInfo.so_dien_thoai}</Text>
                            <Text>Địa chỉ: {userInfo.dia_chi}</Text>
                        </View>

                        {cartItems.map((item, index) => (
                            <View
                                key={index}
                                style={{ marginBottom: 10, flexDirection: 'row', alignItems: 'center' }}
                            >
                                <Image
                                    source={{ uri: `${API_URL}${item.img}` }}
                                    style={{ width: 50, height: 50, borderRadius: 8, marginRight: 10 }}
                                />
                                <View>
                                    <Text>{item.ten_san_pham} - Số lượng: {item.so_luong}</Text>
                                    <Text>
                                        Thành tiền: {(item.so_luong * item.gia).toLocaleString()} đ
                                    </Text>
                                </View>
                            </View>
                        ))}


                        <View style={{ marginTop: 10, alignItems: 'flex-end', paddingRight: 10 }}>
                            <Text style={{ fontWeight: 'bold', fontSize: 16 }}>
                                Tổng giỏ hàng: {cartItems.reduce((sum, item) => sum + item.so_luong * item.gia, 0).toLocaleString()} đ
                            </Text>
                        </View>


                        <TextInput
                            placeholder="Lưu ý của bạn"
                            value={description}
                            onChangeText={setDescription}
                            multiline
                            numberOfLines={3}
                            style={{
                                borderWidth: 1,
                                borderColor: '#ccc',
                                padding: 10,
                                marginVertical: 10,
                                borderRadius: 8,
                                textAlignVertical: 'top'
                            }}
                        />

                        <TouchableOpacity
                            style={{
                                backgroundColor: '#1f6f8b',
                                padding: 15,
                                borderRadius: 20,
                                alignItems: 'center',
                                marginTop: 10
                            }}
                            onPress={handleOrder}
                        >
                            <Text style={{ color: '#fff', fontSize: 16 }}>Xác nhận đặt hàng</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={{
                                padding: 15,
                                alignItems: 'center',
                                marginTop: 10
                            }}
                            onPress={() => setModalVisible(false)}
                        >
                            <Text style={{ color: '#1f6f8b', fontSize: 16 }}>Huỷ</Text>
                        </TouchableOpacity>
                    </ScrollView>
                </SafeAreaView>
            </Modal>

            <Footer />
        </SafeAreaView>
    );
}

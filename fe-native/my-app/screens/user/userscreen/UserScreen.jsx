import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    SafeAreaView,
    ScrollView,
    Animated,
    Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { styles } from './UserScreenCss';
import { API_URL } from '@env';
const DEFAULT_AVATAR = require('../../../assets/avatar2.png');
export default function UserScreen({ navigation }) {
    const [user, setUser] = useState(null);
    const [opacity] = useState(new Animated.Value(0));

    // Load thông tin người dùng từ API
    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const username = await AsyncStorage.getItem('username');
                if (!username) {
                    Alert.alert('Lỗi', 'Không tìm thấy thông tin đăng nhập!');
                    return;
                }

                const response = await fetch(`${API_URL}/userinfor`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ ten_tai_khoan: username }),
                });

                const data = await response.json();

                if (data && data.ten_tai_khoan) {
                    setUser({
                        name: data.ho_ten || data.ten_tai_khoan,
                        email: data.email || 'Không có email',
                        avatar: data.img ? (data.img.startsWith('http') ? { uri: data.img } : { uri: `${API_URL}${data.img}` }) : DEFAULT_AVATAR,
                    });
                } else {
                    Alert.alert('Lỗi', 'Không lấy được thông tin người dùng!');
                }
            } catch (error) {
                console.error('Lỗi khi gọi API:', error);
                Alert.alert('Lỗi', 'Không thể kết nối đến máy chủ!');
            }
        };

        fetchUserInfo();

        Animated.timing(opacity, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
        }).start();
    }, []);

    const dangxuat = async () => {
        Alert.alert(
            "Xác nhận đăng xuất",
            "Bạn có chắc chắn muốn đăng xuất?",
            [
                { text: "Hủy", style: "cancel" },
                {
                    text: "Đồng ý",
                    onPress: async () => {
                        try {
                            await AsyncStorage.clear();
                            navigation.navigate("Home");
                        } catch (error) {
                            console.error("Lỗi khi đăng xuất:", error);
                        }
                    }
                }
            ]
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.fixedHeader}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Thông tin cá nhân</Text>
            </View>

            <ScrollView style={styles.scrollView}>
                {/* Section người dùng */}
                {user && (
                    <Animated.View style={[styles.profileSection, { opacity }]}>
                        <Image source={user.avatar} style={styles.profileImage} />
                        <View style={styles.profileDetails}>
                            <Text style={styles.userName}>{user.name}</Text>
                            <Text style={styles.userEmail}>{user.email}</Text>
                        </View>
                    </Animated.View>
                )}

                {/* Tùy chọn tài khoản */}
                <View style={styles.optionsContainer}>
                    <Text style={styles.optionsTitle}>Tài khoản</Text>
                    <TouchableOpacity style={styles.optionItem}>
                        <Ionicons name="settings-outline" size={22} color="#4a5568" />
                        <Text style={styles.optionText}>Cài đặt tài khoản</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.optionItem}>
                        <Ionicons name="notifications-outline" size={22} color="#4a5568" />
                        <Text style={styles.optionText}>Thông báo</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.optionItem}>
                        <Ionicons name="lock-closed-outline" size={22} color="#4a5568" />
                        <Text style={styles.optionText}>Bảo mật</Text>
                    </TouchableOpacity>
                </View>

                {/* Tùy chọn đơn hàng */}
                <View style={styles.optionsContainer}>
                    <Text style={styles.optionsTitle}>Đơn hàng</Text>
                    <TouchableOpacity style={styles.optionItem}>
                        <Ionicons name="cart-outline" size={22} color="#4a5568" />
                        <Text style={styles.optionText}>Lịch sử đơn hàng</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.optionItem}>
                        <Ionicons name="heart-outline" size={22} color="#4a5568" />
                        <Text style={styles.optionText}>Sản phẩm yêu thích</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.optionItem}>
                        <Ionicons name="star-outline" size={22} color="#4a5568" />
                        <Text style={styles.optionText}>Đánh giá của tôi</Text>
                    </TouchableOpacity>
                </View>

                {/* Khác */}
                <View style={styles.optionsContainer}>
                    <Text style={styles.optionsTitle}>Khác</Text>
                    <TouchableOpacity style={styles.optionItem}>
                        <Ionicons name="help-circle-outline" size={22} color="#4a5568" />
                        <Text style={styles.optionText}>Trung tâm trợ giúp</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.optionItem} onPress={dangxuat}>
                        <Ionicons name="log-out-outline" size={22} color="#e53e3e" />
                        <Text style={[styles.optionText, { color: '#e53e3e' }]}>Đăng xuất</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

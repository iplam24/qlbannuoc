import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, Alert, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { styles } from './SignupScreenCss';
import { API_URL } from '@env';

export default function SignupScreen({ navigation }) {
    const [username, setUsername] = useState('');
    const [hoTen, setHoTen] = useState('');
    const [email, setEmail] = useState('');
    const [sdt, setSDT] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Hàm kiểm tra định dạng tên tài khoản và mật khẩu
    const validateInput = () => {
        const normalizedUsername = username.trim().toLowerCase();

        // Kiểm tra nếu người dùng chưa nhập đầy đủ thông tin
        if (!normalizedUsername || !password || !confirmPassword) {
            Alert.alert('Lỗi', 'Vui lòng điền đầy đủ thông tin.');
            return false;
        }

        const usernameRegex = /^[a-zA-Z0-9]{4,12}$/;
        if (!usernameRegex.test(normalizedUsername)) {
            Alert.alert('Lỗi', 'Tên tài khoản phải từ 4 đến 12 ký tự và không chứa ký tự đặc biệt.');
            return false;
        }

        if (password.length < 6) {
            Alert.alert('Lỗi', 'Mật khẩu phải có ít nhất 6 ký tự.');
            return false;
        }

        // Kiểm tra nếu mật khẩu không khớp
        if (password !== confirmPassword) {
            Alert.alert('Lỗi', 'Mật khẩu không trùng khớp.');
            return false;
        }

        return true;
    };

    const handleRegister = async () => {
        if (!validateInput()) {
            return;
        }

        try {
            // Gửi yêu cầu đăng ký tới API
            const response = await fetch(`${API_URL}/dangky`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ten_tai_khoan: username.trim().toLowerCase(),
                    ho_ten: hoTen.trim(),
                    email: email.trim().toLowerCase(),
                    so_dien_thoai: sdt.trim(),
                    mat_khau: password
                }),
            });

            const data = await response.json();

            if (data.success) {
                Alert.alert('Thành công', 'Đăng ký thành công!', [
                    { text: 'Đăng nhập ngay', onPress: () => navigation.navigate('Login') },
                ]);
            } else {
                Alert.alert('Thất bại', data.message || 'Có lỗi xảy ra khi đăng ký!');
            }
        } catch (error) {
            console.error('Lỗi API:', error);
            Alert.alert('Lỗi mạng', error.message || 'Không thể kết nối tới máy chủ!');
        }
    };

    return (

        <SafeAreaView style={styles.container}>
            <ScrollView>
                <View style={styles.loginContainer}>
                    <TouchableOpacity style={styles.goBackButton} onPress={() => navigation.goBack()}>
                        <Ionicons name="arrow-back" size={24} color="#333" />
                    </TouchableOpacity>
                    <Ionicons name="person-add-outline" size={90} color="#1f6f8b" style={styles.userIcon} />
                    <Text style={styles.title}>Đăng ký tài khoản</Text>

                    <TextInput
                        style={styles.input}
                        placeholder="Tên tài khoản"
                        value={username}
                        onChangeText={setUsername}
                        placeholderTextColor="#888"
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Họ và tên"
                        value={hoTen}
                        onChangeText={setHoTen}
                        placeholderTextColor="#888"
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Email"
                        value={email}
                        onChangeText={setEmail}
                        placeholderTextColor="#888"
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Số điện thoại"
                        value={sdt}
                        onChangeText={setSDT}
                        placeholderTextColor="#888"
                    />

                    {/* Mật khẩu */}
                    <View style={styles.passwordContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder="Mật khẩu"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry={!showPassword}
                            placeholderTextColor="#888"
                        />
                        <TouchableOpacity
                            style={styles.showPasswordButton}
                            onPress={() => setShowPassword(!showPassword)}
                        >
                            <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={22} color="#888" />
                        </TouchableOpacity>
                    </View>

                    {/* Xác nhận mật khẩu */}
                    <View style={styles.passwordContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder="Xác nhận mật khẩu"
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            secureTextEntry={!showConfirmPassword}
                            placeholderTextColor="#888"
                        />
                        <TouchableOpacity
                            style={styles.showPasswordButton}
                            onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                            <Ionicons name={showConfirmPassword ? 'eye-off' : 'eye'} size={22} color="#888" />
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity style={styles.loginButton} onPress={handleRegister}>
                        <Text style={styles.loginButtonText}>Đăng ký</Text>
                    </TouchableOpacity>

                    <View style={styles.signUpContainer}>
                        <Text style={styles.signUpText}>Đã có tài khoản?</Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                            <Text style={styles.signUpLink}> Đăng nhập ngay.</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.copyrightContainer}>
                    <Text style={styles.copyright}>© 2025 VNUA Tea & Cafe</Text>
                </View>
            </ScrollView >
        </SafeAreaView>

    );
}

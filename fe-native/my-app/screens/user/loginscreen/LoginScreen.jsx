import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '@env';
import { styles } from './loginScreencss';
import { registerPushToken } from '../../../components/RegisterPushToken';

export default function LoginScreen({ navigation }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isPasswordSaved, setIsPasswordSaved] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (username.trim() === '' || password.trim() === '') {
            Alert.alert('Lỗi', 'Vui lòng điền đầy đủ thông tin!');
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(`${API_URL}/dangnhap`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ten_tai_khoan: username, mat_khau: password }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Response Error:', errorText);
                throw new Error('Không thể kết nối đến máy chủ hoặc sai thông tin');
            }

            const data = await response.json();

            if (data.exists && data.token && data.userId) {
                await AsyncStorage.setItem('token', data.token);
                await AsyncStorage.setItem('userId', data.userId.toString());

                let roleData;
                try {
                    const roleResponse = await fetch(`${API_URL}/getuserrole/${username}`, { method: 'GET' });
                    if (!roleResponse.ok) {
                        const errorText = await roleResponse.text();
                        console.error('Lỗi khi lấy vai trò:', errorText);
                        throw new Error('Không thể lấy vai trò người dùng');
                    }
                    roleData = await roleResponse.json();
                    await AsyncStorage.setItem('role', roleData.vai_tro.toString());
                } catch (roleError) {
                    console.warn('Warning: Lấy vai trò thất bại, set role mặc định là 3 (người dùng)');
                    roleData = { vai_tro: 3 };
                    await AsyncStorage.setItem('role', '3');
                }

                await AsyncStorage.setItem('username', username);

                if (isPasswordSaved) {
                    await AsyncStorage.setItem('password', password);
                } else {
                    await AsyncStorage.removeItem('password');
                }

                try {
                    //  await registerPushToken();
                } catch (pushError) {
                    console.warn('Lỗi khi gửi push token:', pushError);
                }

                Alert.alert('Thành công', 'Đăng nhập thành công!');
                if (roleData.vai_tro === 1) {
                    navigation.replace('AdminHome');
                } else {
                    navigation.replace('Home');
                }


            } else {
                Alert.alert('Thất bại', 'Tên đăng nhập hoặc mật khẩu không đúng!');
            }
        } catch (error) {
            console.error('Lỗi API:', error);
            Alert.alert('Lỗi mạng', error.message || 'Không thể kết nối tới máy chủ!');
        } finally {
            setLoading(false);
        }
    };


    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.loginContainer}>
                <TouchableOpacity style={styles.goBackButton} onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>

                <Ionicons name="person-circle-outline" size={90} color="#1f6f8b" style={styles.userIcon} />
                <Text style={styles.title}>Đăng nhập</Text>

                <TextInput
                    style={styles.input}
                    placeholder="Tên đăng nhập"
                    value={username}
                    onChangeText={setUsername}
                    placeholderTextColor="#888"
                    autoCapitalize="none"
                />

                <View style={styles.passwordContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Mật khẩu"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry={!showPassword}
                        placeholderTextColor="#888"
                    />
                    <TouchableOpacity style={styles.showPasswordButton} onPress={() => setShowPassword(!showPassword)}>
                        <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={22} color="#888" />
                    </TouchableOpacity>
                </View>

                <TouchableOpacity
                    style={styles.forgotPasswordContainer}
                    onPress={() => Alert.alert('💡 Gợi ý', 'Quên mật khẩu rồi đó anh 😢')}
                >
                    <Text style={styles.forgotPasswordText}>Quên mật khẩu?</Text>
                </TouchableOpacity>

                <View style={styles.rememberMeContainer}>
                    <TouchableOpacity
                        onPress={() => setIsPasswordSaved(prev => !prev)}
                        style={[styles.checkbox, isPasswordSaved && { backgroundColor: '#1f6f8b' }]}
                    >
                        {isPasswordSaved && <Ionicons name="checkmark" size={18} color="#fff" />}
                    </TouchableOpacity>
                    <Text style={styles.rememberMeLabel}>Nhớ mật khẩu</Text>
                </View>

                <TouchableOpacity style={styles.loginButton} onPress={handleLogin} disabled={loading}>
                    {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.loginButtonText}>Đăng nhập</Text>}
                </TouchableOpacity>

                <View style={styles.signUpContainer}>
                    <Text style={styles.signUpText}>Chưa có tài khoản?</Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Sign')}>
                        <Text style={styles.signUpLink}> Đăng ký ngay.</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.copyrightContainer}>
                <Text style={styles.copyright}>© 2025 Nhóm 6 - VNUA Tea & Cafe</Text>
            </View>
        </SafeAreaView>
    );
}

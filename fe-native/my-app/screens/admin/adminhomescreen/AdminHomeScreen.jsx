import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    SafeAreaView,
    ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AdminHeader from '../../../components/AdminHeader';
import AdminFooter from '../../../components/AdminFooter';
import { styles } from './AdminHomeCss';

export default function AdminHomeScreen() {
    const navigation = useNavigation();

    return (
        <SafeAreaView style={styles.container}>
            <AdminHeader />

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Text style={styles.title}>Trang quản trị Admin 👑</Text>

                <TouchableOpacity
                    style={styles.card}
                    onPress={() => navigation.navigate('ProductManage')}
                >
                    <Ionicons name="cube-outline" size={40} color="#1f6f8b" />
                    <Text style={styles.cardText}>Quản lý sản phẩm</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.card}
                    onPress={() => navigation.navigate('OrderManage')}
                >
                    <Ionicons name="receipt-outline" size={40} color="#1f6f8b" />
                    <Text style={styles.cardText}>Quản lý đơn hàng</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.card}
                    onPress={() => navigation.navigate('UserManage')}
                >
                    <Ionicons name="people-outline" size={40} color="#1f6f8b" />
                    <Text style={styles.cardText}>Quản lý người dùng</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.card}
                    onPress={() => navigation.navigate('UserManage')}
                >
                    <Ionicons name="gift-outline" size={40} color="#1f6f8b" />
                    <Text style={styles.cardText}>Ưu đãi</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.card}
                    onPress={() => navigation.navigate('Statistics')}
                >
                    <Ionicons name="bar-chart-outline" size={40} color="#1f6f8b" />
                    <Text style={styles.cardText}>Xem thống kê</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.backBtn}
                    onPress={() => navigation.navigate('Home')}
                >
                    <Ionicons name="arrow-back-outline" size={20} color="#fff" />
                    <Text style={styles.backText}>Quay về trang khách hàng</Text>
                </TouchableOpacity>
            </ScrollView>

            <AdminFooter />
        </SafeAreaView>
    );
}

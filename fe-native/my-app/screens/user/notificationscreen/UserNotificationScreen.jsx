import React, { useEffect, useState } from 'react';
import {
    View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { API_URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

export default function UserNotificationScreen() {
    const [notifications, setNotifications] = useState([]);
    const navigation = useNavigation();

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            const userId = await AsyncStorage.getItem('userId');
            if (!userId) return Alert.alert('Lỗi', 'Không tìm thấy userId!');
            const res = await fetch(`${API_URL}/thongbao/${userId}`);
            const json = await res.json();
            if (json.success) {
                setNotifications(json.data);
            } else {
                setNotifications([]);
            }
        } catch (err) {
            console.error('Lỗi:', err);
            Alert.alert('Lỗi', 'Không thể tải thông báo');
        }
    };

    const markAsRead = async (id) => {
        try {
            await fetch(`${API_URL}/thongbao/${id}/read`, { method: 'PUT' });
            fetchNotifications();
        } catch (err) {
            console.error('Lỗi khi cập nhật:', err);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back-outline" size={24} color="#1f6f8b" />
                </TouchableOpacity>
                <Text style={styles.title}>Thông báo</Text>
                <TouchableOpacity onPress={() => navigation.navigate('Home')}>
                    <Ionicons name="home-outline" size={24} color="#1f6f8b" />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollArea}>
                {notifications.length > 0 ? (
                    notifications.map((noti) => (
                        <TouchableOpacity
                            key={noti.id}
                            style={[styles.card, noti.da_doc && styles.readCard]}
                            onPress={() => {
                                if (!noti.da_doc) markAsRead(noti.id);
                            }}
                        >
                            <Text style={[styles.message, noti.da_doc && styles.readText]}>
                                {noti.tin_nhan}
                            </Text>
                            <Text style={styles.time}>
                                {new Date(noti.thoi_gian_tao).toLocaleString()}
                            </Text>
                        </TouchableOpacity>
                    ))
                ) : (
                    <Text style={styles.empty}>Chưa có thông báo nào </Text>
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { marginTop: 70, flex: 1, backgroundColor: '#fff' },
    header: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        paddingVertical: 12,
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 0.6,
        borderBottomColor: '#ccc',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1f6f8b',
    },
    scrollArea: {
        padding: 16,
        paddingBottom: 30,
    },
    card: {
        padding: 14,
        borderRadius: 10,
        marginVertical: 8,
        backgroundColor: '#fffbea',
        borderLeftWidth: 4,
        borderColor: '#facc15',
        shadowColor: '#ccc',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 3,
        elevation: 2,
    },
    readCard: {
        backgroundColor: '#f0f0f0',
        borderLeftColor: '#ccc',
    },
    message: {
        fontSize: 16,
        color: '#1f2937',
        fontWeight: '600',
    },
    readText: {
        fontWeight: 'normal',
        color: '#6b7280',
    },
    time: {
        fontSize: 12,
        color: '#6b7280',
        marginTop: 6,
    },
    empty: {
        textAlign: 'center',
        marginTop: 30,
        color: '#888',
        fontSize: 15,
    },
});

import React, { useEffect, useState } from 'react';
import {
    View, Text, TouchableOpacity, ScrollView, StyleSheet, Alert, Modal, TextInput
} from 'react-native';
import { API_URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import AdminFooter from '../../../components/AdminFooter';

export default function NotificationScreen() {
    const [notifications, setNotifications] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [newMessage, setNewMessage] = useState('');

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
            Alert.alert('Lỗi', 'Không thể tải danh sách thông báo');
        }
    };

    const markAsRead = async (id) => {
        try {
            const res = await fetch(`${API_URL}/thongbao/${id}/read`, { method: 'PUT' });
            if (res.ok) fetchNotifications();
        } catch (err) {
            console.error('Lỗi khi cập nhật:', err);
        }
    };

    const addNotification = async () => {
        const userId = await AsyncStorage.getItem('userId');
        if (!newMessage.trim()) {
            Alert.alert('Vui lòng nhập nội dung thông báo');
            return;
        }

        try {
            const res = await fetch(`${API_URL}/thongbao`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id_nguoi_dung: userId, tin_nhan: newMessage }),
            });

            if (res.ok) {
                setModalVisible(false);
                setNewMessage('');
                fetchNotifications();
                Alert.alert('✔️', 'Đã thêm thông báo!');
            } else {
                Alert.alert('Lỗi', 'Không thêm được thông báo');
            }
        } catch (err) {
            Alert.alert('Lỗi', 'Không thể gửi thông báo');
        }
    };

    const deleteNotification = async (id) => {
        try {
            const res = await fetch(`${API_URL}/thongbao/${id}`, { method: 'DELETE' });
            if (res.ok) {
                fetchNotifications();
            } else {
                Alert.alert('Lỗi', 'Không xoá được thông báo');
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>🔔 Danh sách thông báo</Text>

            <View style={styles.topBar}>
                <TouchableOpacity style={styles.topButton} onPress={() => setModalVisible(true)}>
                    <Ionicons name="add-circle-outline" size={20} color="#2563eb" />
                    <Text style={styles.topButtonText}>Thêm</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.topButton} onPress={fetchNotifications}>
                    <Ionicons name="refresh-outline" size={20} color="#16a34a" />
                    <Text style={styles.topButtonText}>Làm mới</Text>
                </TouchableOpacity>
            </View>

            <ScrollView>
                {notifications.length > 0 ? (
                    notifications.map((noti) => (
                        <TouchableOpacity
                            key={noti.id}
                            style={[styles.card, noti.da_doc && styles.readCard]}
                            onPress={() => {
                                if (!noti.da_doc) markAsRead(noti.id);
                            }}
                        >
                            <View style={styles.cardRow}>
                                <Text style={[styles.message, noti.da_doc && styles.readText]}>
                                    {noti.tin_nhan}
                                </Text>
                                <TouchableOpacity onPress={() => deleteNotification(noti.id)}>
                                    <Ionicons name="trash-outline" size={20} color="red" />
                                </TouchableOpacity>
                            </View>
                            <Text style={styles.time}>
                                {new Date(noti.created_at).toLocaleString()}
                            </Text>
                        </TouchableOpacity>
                    ))
                ) : (
                    <Text style={{ textAlign: 'center', marginTop: 20 }}>Không có thông báo nào</Text>
                )}
            </ScrollView>

            {/* Modal thêm thông báo */}
            <Modal visible={modalVisible} animationType="slide" transparent>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Thêm thông báo mới</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Nhập nội dung..."
                            value={newMessage}
                            onChangeText={setNewMessage}
                            multiline
                        />
                        <View style={styles.modalActions}>
                            <TouchableOpacity style={styles.cancelBtn} onPress={() => setModalVisible(false)}>
                                <Text style={styles.cancelText}>Hủy</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.saveBtn} onPress={addNotification}>
                                <Text style={styles.saveText}>Gửi</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            <AdminFooter />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, backgroundColor: '#fff' },
    title: { fontSize: 20, fontWeight: 'bold', textAlign: 'center', color: '#1f6f8b' },
    topBar: { flexDirection: 'row', justifyContent: 'flex-end', marginVertical: 10 },
    topButton: { flexDirection: 'row', alignItems: 'center', marginLeft: 15 },
    topButtonText: { marginLeft: 4, color: '#333', fontSize: 14 },
    card: {
        padding: 12, borderRadius: 10, marginVertical: 8,
        backgroundColor: '#fffbea', borderColor: '#facc15', borderWidth: 1
    },
    readCard: { backgroundColor: '#f1f1f1', borderColor: '#ccc' },
    message: { fontSize: 16, color: '#111', fontWeight: 'bold', flex: 1 },
    readText: { fontWeight: 'normal', color: '#888' },
    time: { fontSize: 12, marginTop: 6, color: '#666' },
    cardRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },

    modalContainer: {
        flex: 1, justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.4)',
        padding: 20
    },
    modalContent: {
        backgroundColor: '#fff', borderRadius: 12, padding: 20
    },
    modalTitle: {
        fontSize: 18, fontWeight: 'bold', marginBottom: 12, textAlign: 'center'
    },
    input: {
        height: 100, borderColor: '#ccc', borderWidth: 1, borderRadius: 8,
        padding: 10, textAlignVertical: 'top'
    },
    modalActions: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 12 },
    cancelBtn: { marginRight: 15 },
    cancelText: { color: '#888' },
    saveBtn: { backgroundColor: '#2563eb', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 6 },
    saveText: { color: '#fff', fontWeight: 'bold' },
});

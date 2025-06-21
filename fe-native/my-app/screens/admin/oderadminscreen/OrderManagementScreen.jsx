import React, { useEffect, useState } from 'react';
import {
  View, Text, TouchableOpacity, ScrollView, Modal, TextInput, Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { API_URL } from '@env';
import { styles } from './OrderAdminScreen';
import AdminFooter from '../../../components/AdminFooter';
import { Picker } from '@react-native-picker/picker';

// Hàm fetch chuẩn hóa
const fetchDataSafe = async (url) => {
  try {
    const res = await fetch(url);
    const json = await res.json();
    if (json && Array.isArray(json.data)) {
      return json.data;
    } else if (Array.isArray(json)) {
      return json;
    } else {
      console.warn('Dữ liệu trả về không phải mảng:', json);
      return [];
    }
  } catch (err) {
    console.error('Lỗi fetch dữ liệu:', err);
    return [];
  }
};

export default function OrderManagementScreen() {
  const [orders, setOrders] = useState([]);
  const [statusList, setStatusList] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [formData, setFormData] = useState({
    id_trang_thai: null,
    ghi_chu: '',
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredOrders, setFilteredOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
    fetchStatuses();
  }, []);

  useEffect(() => {
    const filtered = orders.filter(order =>
      order.ten_nguoi_dat?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredOrders(filtered);
  }, [searchTerm, orders]);

  const fetchOrders = async () => {
    const data = await fetchDataSafe(`${API_URL}/getAllorders`);
    setOrders(data);
    setFilteredOrders(data);
  };

  const fetchStatuses = async () => {
    const data = await fetchDataSafe(`${API_URL}/listallstatus`);
    setStatusList(data);
  };

  const handleEdit = (order) => {
    setEditingOrder(order);
    setFormData({
      id_trang_thai: order.id_trang_thai,
      ghi_chu: order.ghi_chu || ''
    });
    setModalVisible(true);
  };

  const handleDelete = async (id) => {
    const res = await fetch(`${API_URL}/donhang/${id}`, { method: 'DELETE' });
    if (res.ok) {
      fetchOrders();
    } else {
      Alert.alert('Lỗi', 'Không xoá được đơn hàng');
    }
  };

  const handleSave = async () => {
    if (!editingOrder) {
      Alert.alert('Lỗi', 'Không tìm thấy đơn hàng cần sửa!');
      return;
    }
    try {
      const res = await fetch(`${API_URL}/updateOrder/${editingOrder.id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          statusId: formData.id_trang_thai
        }),
      });

      if (res.ok) {
        Alert.alert('Thành công', 'Đã cập nhật trạng thái đơn hàng!');
        await fetchOrders();
        setModalVisible(false);
        setEditingOrder(null);
      } else {
        const data = await res.json();
        Alert.alert('Lỗi', data.message || 'Cập nhật thất bại');
      }
    } catch (err) {
      console.error('Lỗi gọi API:', err);
      Alert.alert('Lỗi hệ thống', 'Không thể kết nối server');
    }
  };


  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleString();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Quản lý đơn hàng 📦</Text>

      <TextInput
        placeholder="Tìm kiếm theo tên khách hàng..."
        style={styles.searchInput}
        value={searchTerm}
        onChangeText={setSearchTerm}
      />

      <ScrollView>
        {Array.isArray(filteredOrders) && filteredOrders.length > 0 ? (
          filteredOrders.map((order) => (
            <View key={order.id} style={styles.card}>
              <View style={{ flex: 1 }}>
                <Text style={styles.name}>Order #{order.id} - {order.ten_nguoi_dat}</Text>
                <Text>Ngày đặt: {formatDate(order.ngay_dat_hang)}</Text>
                <Text>SĐT: {order.so_dien_thoai}</Text>
                <Text>Địa chỉ: {order.dia_chi || 'Không có'}</Text>
                <Text>Trạng thái: {order.ten_trang_thai}</Text>
                <Text>Ghi chú: {order.ghi_chu || 'Không có'}</Text>
                <Text style={{ fontWeight: 'bold', marginTop: 6 }}>Chi tiết đơn hàng:</Text>
                {order.chi_tiet && Array.isArray(order.chi_tiet) && order.chi_tiet.map((item, idx) => (
                  <View key={idx} style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 2 }}>
                    <Text>- {item.ten_san_pham} x{item.so_luong}</Text>
                    <Text>{parseInt(item.thanh_tien).toLocaleString()} đ</Text>
                  </View>
                ))}
                <Text style={{ marginTop: 6, fontWeight: 'bold', color: '#d6336c' }}>
                  Tổng tiền: {parseInt(order.tong_tien).toLocaleString()} đ
                </Text>
              </View>

              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                {order.ten_trang_thai !== 'Hoàn thành' && (
                  <>
                    <TouchableOpacity onPress={() => handleEdit(order)} style={styles.iconBtn}>
                      <Ionicons name="create-outline" size={22} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleDelete(order.id)} style={styles.iconBtn}>
                      <Ionicons name="trash-outline" size={22} color="red" />
                    </TouchableOpacity>
                  </>
                )}
              </View>

            </View>
          ))
        ) : (
          <Text style={{ textAlign: 'center', marginTop: 20 }}>Không có đơn hàng nào </Text>
        )}
      </ScrollView>

      <AdminFooter />

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Sửa trạng thái đơn hàng #{editingOrder?.id}</Text>

            <Picker
              selectedValue={formData.id_trang_thai}
              onValueChange={(itemValue) =>
                setFormData({ ...formData, id_trang_thai: itemValue })
              }
              style={styles.input}
            >
              {statusList.map((status) => (
                <Picker.Item
                  key={status.id}
                  label={status.ten_trang_thai}
                  value={status.id}
                />
              ))}
            </Picker>


            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => {
                  setModalVisible(false);
                  setEditingOrder(null);
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

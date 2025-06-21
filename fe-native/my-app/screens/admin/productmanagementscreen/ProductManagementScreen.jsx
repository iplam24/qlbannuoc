import React, { useEffect, useState } from 'react';
import {
  View, Text, TouchableOpacity, ScrollView, Modal, TextInput, Image, Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { API_URL } from '@env';
import * as ImagePicker from 'expo-image-picker';
import { styles } from './ProductManagementScreenCss';
import { fetchData } from '../../../utils/fetchData';
import AdminFooter from '../../../components/AdminFooter';

export default function ProductManagementScreen() {
  const [products, setProducts] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    ten_san_pham: '',
    gia: '',
    luot_ban: '',
    img: ''
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    fetchSanPham();
  }, []);

  useEffect(() => {
    const filtered = products.filter(product =>
      product.ten_san_pham.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [searchTerm, products]);

  const fetchSanPham = async () => {
    const data = await fetchData(`${API_URL}/sanpham`);
    if (data) {
      setProducts(data);
      setFilteredProducts(data);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      ten_san_pham: product.ten_san_pham,
      gia: product.gia.toString(),
      luot_ban: product.luot_ban.toString(),
      img: product.img
    });
    setModalVisible(true);
  };

  const handleDelete = async (id) => {
    const res = await fetch(`${API_URL}/sanpham/${id}`, { method: 'DELETE' });
    if (res.ok) {
      fetchSanPham();
    } else {
      Alert.alert('Lỗi', 'Không xoá được sản phẩm');
    }
  };

  const handleSave = async () => {
    const method = editingProduct ? 'PUT' : 'POST';
    const url = editingProduct ? `${API_URL}/sanpham/${editingProduct.id}` : `${API_URL}/themsanpham`;

    const form = new FormData();
    form.append('ten_san_pham', formData.ten_san_pham);
    form.append('gia', formData.gia);
    form.append('luot_ban', formData.luot_ban);

    if (formData.img && !formData.img.startsWith('http')) {
      const filename = formData.img.split('/').pop();
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : `image`;
      form.append('img', {
        uri: formData.img,
        name: filename,
        type: type
      });
    }

    try {
      const res = await fetch(url, {
        method,
        // KHÔNG SET CONTENT-TYPE, để fetch tự thêm boundary nha anh
        body: form,
      });

      if (res.ok) {
        await fetchSanPham();
        setModalVisible(false);
        setFormData({ ten_san_pham: '', gia: '', luot_ban: '', img: '' });
        setEditingProduct(null);
      } else {
        Alert.alert('Lỗi', 'Không lưu được sản phẩm');
      }
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể kết nối tới server');
    }
  };


  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Cần cấp quyền', 'Ứng dụng cần quyền truy cập thư viện ảnh');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setFormData({ ...formData, img: result.assets[0].uri });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Quản lý sản phẩm 🛍️</Text>

      <TextInput
        placeholder="Tìm kiếm sản phẩm..."
        style={styles.searchInput}
        value={searchTerm}
        onChangeText={setSearchTerm}
      />

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => {
          setEditingProduct(null);
          setFormData({ ten_san_pham: '', gia: '', luot_ban: '', img: '' });
          setModalVisible(true);
        }}
      >
        <Ionicons name="add-circle-outline" size={24} color="white" />
        <Text style={styles.addText}>Thêm sản phẩm</Text>
      </TouchableOpacity>

      <ScrollView>
        {filteredProducts.map((product) => (
          <View key={product.id} style={styles.card}>
            <Image
              source={{ uri: product.img.startsWith('http') ? product.img : `${API_URL}${product.img}` }}
              style={{ width: 60, height: 60, borderRadius: 8, marginRight: 10 }}
            />
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{product.ten_san_pham}</Text>
              <Text style={styles.price}>
                {parseInt(product.gia).toLocaleString()} VNĐ • {product.luot_ban} lượt bán
              </Text>
            </View>
            <TouchableOpacity onPress={() => handleEdit(product)} style={styles.iconBtn}>
              <Ionicons name="create-outline" size={22} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleDelete(product.id)} style={styles.iconBtn}>
              <Ionicons name="trash-outline" size={22} color="red" />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      <AdminFooter />

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {editingProduct ? 'Sửa sản phẩm' : 'Thêm sản phẩm'}
            </Text>

            <TextInput
              placeholder="Tên sản phẩm"
              style={styles.input}
              value={formData.ten_san_pham}
              onChangeText={(text) => setFormData({ ...formData, ten_san_pham: text })}
            />
            <TextInput
              placeholder="Giá"
              keyboardType="numeric"
              style={styles.input}
              value={formData.gia}
              onChangeText={(text) => setFormData({ ...formData, gia: text })}
            />
            <TextInput
              placeholder="Lượt bán"
              keyboardType="numeric"
              style={styles.input}
              value={formData.luot_ban}
              onChangeText={(text) => setFormData({ ...formData, luot_ban: text })}
            />

            <TouchableOpacity onPress={pickImage} style={styles.selectImageBtn}>
              <Text style={styles.selectImageText}>Chọn ảnh</Text>
            </TouchableOpacity>

            {formData.img ? (
              <Image source={{ uri: formData.img }} style={styles.selectedImage} />
            ) : (
              <Text style={styles.noImageText}>Chưa có ảnh</Text>
            )}

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => {
                  setModalVisible(false);
                  setEditingProduct(null);
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

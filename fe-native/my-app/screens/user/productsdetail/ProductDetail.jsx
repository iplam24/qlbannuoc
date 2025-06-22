import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity } from 'react-native';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { styles } from './ProductDetailCss';
import { API_URL } from '@env';
import { fetchData } from '../../../utils/fetchData';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ProductDetail() {
  const navigation = useNavigation();
  const route = useRoute();
  const { productId } = route.params;
  const [product, setProduct] = useState(null);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProductDetail = async () => {
      try {
        setLoading(true);

        // Lấy chi tiết sản phẩm
        const data = await fetchData(`${API_URL}/getproductdetail/${productId}`);

        if (!data || !Array.isArray(data) || data.length === 0) {
          throw new Error('Không có dữ liệu sản phẩm');
        }

        const productData = data[0];
        const productWithFullImg = {
          ...productData,
          img: productData.img && productData.img.startsWith('http') ? productData.img : `${API_URL}${productData.img}`,
          gia: Number(productData.gia) || 0,
          luot_ban: Number(productData.luot_ban) || 0,
        };

        setProduct(productWithFullImg);

        // Lấy sản phẩm tương tự
        const similarDataRaw = await fetchData(`${API_URL}/sanpham`);
        if (!similarDataRaw) {
          throw new Error('Lỗi khi lấy sản phẩm tương tự');
        }

        const similarData = similarDataRaw.map(item => ({
          ...item,
          img: item.img && item.img.startsWith('http') ? item.img : `${API_URL}${item.img}`,
          gia: Number(item.gia) || 0,
        }));

        setSimilarProducts(similarData);
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu:', error.message || error);
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProductDetail();
    }
  }, [productId]);

  return (
    <View style={{ flex: 1 }}>
      {/* Nút quay lại */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('Home')} style={styles.goBackButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
          <Text style={styles.goBackText}>Quay lại</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        {loading ? (
          <Text style={styles.loading}>Đang tải thông tin sản phẩm...</Text>
        ) : product ? (
          <View style={styles.productCard}>
            <Image source={{ uri: product.img }} style={styles.productImage} resizeMode="contain" />
            <Text style={styles.productName}>{product.ten_san_pham}</Text>
            <Text style={styles.productPrice}>
              💰 {product.gia.toLocaleString()} <Text style={styles.vnd}>VNĐ</Text>
            </Text>
            <Text style={styles.productDescription}>{product.mo_ta}</Text>

            <View style={styles.ratingContainer}>
              <Text style={styles.ratingText}>Lượt bán: </Text>
              <Text style={styles.ratingStars}>{Math.round(product.luot_ban)}</Text>
            </View>

            <Text style={styles.similarTitle}>Sản phẩm tương tự:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {similarProducts.length > 0 ? (
                similarProducts.map((item, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.similarProductCard}
                    onPress={() => navigation.push('ProductDetail', { productId: item.id })}
                  >
                    <Image source={{ uri: item.img }} style={styles.similarProductImage} resizeMode="contain" />
                    <Text style={styles.similarProductName}>{item.ten_san_pham}</Text>
                    <Text style={styles.similarProductPrice}>
                      {item.gia.toLocaleString()} <Text style={styles.vnd}>VNĐ</Text>
                    </Text>
                  </TouchableOpacity>
                ))
              ) : (
                <Text style={{ marginLeft: 10 }}>Không có sản phẩm tương tự.</Text>
              )}
            </ScrollView>
          </View>
        ) : (
          <Text style={styles.loading}>Không tìm thấy sản phẩm.</Text>
        )}
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.button} onPress={() => alert('Chat ngay')}>
          <FontAwesome name="wechat" size={20} color="white" />
          <Text style={styles.buttonText}>Chat ngay</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={async () => {
            try {
              const userId = await AsyncStorage.getItem('userId');
              if (!userId) {
                alert('⚠ Bạn chưa đăng nhập!');
                return;
              }

              const response = await fetch(`${API_URL}/addCart`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                  userId: parseInt(userId),
                  productId: product.id,
                  quantity: 1
                })
              });

              const data = await response.json();

              if (data.success) {
                alert('🛒 Đã thêm vào giỏ hàng thành công!');
              } else {
                alert(`⚠ ${data.message || 'Không thêm được vào giỏ hàng'}`);
              }
            } catch (err) {
              console.error('❗ Lỗi thêm giỏ hàng:', err);
              alert('🚫 Lỗi hệ thống khi thêm vào giỏ hàng!');
            }
          }}
        >
          <FontAwesome name="cart-plus" size={20} color="white" />
          <Text style={styles.buttonText}>Giỏ hàng</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

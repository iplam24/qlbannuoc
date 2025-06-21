import React, { useState, useEffect, useCallback } from 'react';
import { API_URL } from '@env';
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    Image,
    SafeAreaView,
    Platform,
    StatusBar,
    TextInput, // Import TextInput
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import { styles } from './HomeScreenCss';
import { fetchData } from '../../../utils/fetchData';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

export default function HomeScreen() {
    const [drinks, setDrinks] = useState([]);
    const [featured, setFeatured] = useState([]);
    const [role, setRole] = useState(null);
    const [searchTerm, setSearchTerm] = useState(''); // State cho tìm kiếm
    const navigation = useNavigation();

    // Hàm tìm kiếm
    const handleSearch = useCallback(() => {
        if (searchTerm.trim()) {
            navigation.navigate('AllProducts', { searchTerm });
        }
    }, [searchTerm, navigation]);

    useEffect(() => {
        fetchData(`${API_URL}/sanpham`).then((data) => {
            if (data) {
                setDrinks(data);
            }
        });

        fetchData(`${API_URL}/topluotban`).then((data) => {
            if (data) {
                setFeatured(data);
            }
        });

        console.log(API_URL);
    }, []);

    useFocusEffect(
        useCallback(() => {
            const getRole = async () => {
                try {
                    const storedRole = await AsyncStorage.getItem('role');
                    if (storedRole !== null) {
                        setRole(parseInt(storedRole));
                    }
                } catch (e) {
                    console.error('Lỗi khi lấy role từ AsyncStorage: ', e);
                }
            };

            getRole();
        }, [])
    );

    return (
        <SafeAreaView style={[styles.container, { flex: 1, backgroundColor: '#f4f4f4', paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 }]}>
            <Header />
            <ScrollView>
                {/* Thanh tìm kiếm */}
                <View style={styles.searchContainer}>
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Tìm kiếm sản phẩm..."
                        value={searchTerm}
                        onChangeText={setSearchTerm}
                        onSubmitEditing={handleSearch} // Gọi tìm kiếm khi nhấn Enter
                        returnKeyType="search" // Hiển thị nút "Tìm" trên bàn phím
                    />
                    <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
                        <Ionicons name="search" size={24} color="#fff" />
                    </TouchableOpacity>
                </View>

                {/* Nút đến trang Admin */}
                {role === 1 && (
                    <TouchableOpacity
                        style={{
                            backgroundColor: '#1f6f8b',
                            padding: 12,
                            borderRadius: 10,
                            margin: 16,
                            alignItems: 'center',
                        }}
                        onPress={() => navigation.navigate('AdminHome')}
                    >
                        <Text style={{ color: 'white', fontSize: 16 }}>
                            🔐 Chức năng của quản trị viên
                        </Text>
                    </TouchableOpacity>
                )}

                {/* Phần bán chạy */}
                <View style={{ marginTop: 10 }}>
                    <Text style={styles.sectionTitle}>Bán chạy</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ paddingBottom: 20 }}>
                        {featured.slice(0, 5).map((item, index) => (
                            <TouchableOpacity
                                key={index}
                                style={styles.featuredCardItem}
                                onPress={() => navigation.navigate('ProductDetail', { productId: item.id })}
                            >
                                <Image source={{ uri: `${API_URL}${item.img}` }} style={styles.featuredImage} />
                                <TouchableOpacity style={styles.heartButton}>
                                    <Ionicons name="heart-outline" size={20} color="white" />
                                </TouchableOpacity>
                                <View style={styles.featuredTextContainer}>
                                    <Text style={styles.featuredTitle}>{item.ten_san_pham}</Text>
                                    <Text style={styles.drinkSub}>
                                        ⭐ {item.gia?.toLocaleString()} <Text style={styles.vnd}>VNĐ</Text> • {item.luot_ban} đã bán
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                {/* Danh sách sản phẩm */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Sản phẩm 💖</Text>
                        <TouchableOpacity onPress={() => navigation.navigate('AllProducts')}>
                            <Text style={styles.seeAll}>Xem tất cả</Text>
                        </TouchableOpacity>
                    </View>

                    {drinks.slice(0, 6).map((drink, idx) => (
                        <TouchableOpacity
                            key={idx}
                            style={styles.drinkCard}
                            onPress={() => navigation.navigate('ProductDetail', { productId: drink.id })
                            }
                        >
                            <Image source={{ uri: `${API_URL}${drink.img}` }} style={styles.drinkImage} />
                            <View style={styles.drinkInfo}>
                                <Text style={styles.drinkName}>{drink.ten_san_pham}</Text>
                                <Text style={styles.drinkSub}>
                                    ⭐ {drink.gia?.toLocaleString()} <Text style={styles.vnd}>VNĐ</Text> • {drink.luot_ban} đã bán
                                </Text>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>
            <Footer />
        </SafeAreaView>
    );
}

import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, SafeAreaView, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './AllProductsCss';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import { fetchData } from '../../../utils/fetchData';
import { API_URL } from '@env';
import { useNavigation } from '@react-navigation/native';

export default function AllProducts({ route }) {
    const [drinks, setDrinks] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredDrinks, setFilteredDrinks] = useState([]);
    const navigation = useNavigation();

    // Fetch drinks
    const fetchDrinks = useCallback(async () => {
        const data = await fetchData(`${API_URL}/sanpham`);
        if (data) {
            setDrinks(data);
        }
    }, []);

    useEffect(() => {
        fetchDrinks();
    }, [fetchDrinks]);

    // Filter drinks whenever searchTerm or drinks change
    useEffect(() => {
        const filtered = drinks.filter(drink =>
            drink.ten_san_pham.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredDrinks(filtered);
    }, [searchTerm, drinks]);

    // Get searchTerm from HomeScreen
    useEffect(() => {
        if (route.params?.searchTerm) {
            setSearchTerm(route.params.searchTerm);
        }
    }, [route.params?.searchTerm]);

    const handleSearch = () => {
        // You might want to navigate back to AllProducts with the search term
        // navigation.navigate('AllProducts', { searchTerm });  // Removed this line
    };

    return (
        <SafeAreaView style={styles.container}>
            <Header />
            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Tìm kiếm sản phẩm..."
                    value={searchTerm}
                    onChangeText={setSearchTerm}
                    onSubmitEditing={handleSearch}
                    returnKeyType="search"
                />
            </View>
            <ScrollView>
                {/* Danh sách tất cả sản phẩm */}
                <View style={styles.section}>
                    {filteredDrinks.map((drink, idx) => (
                        <TouchableOpacity
                            key={idx}
                            style={styles.drinkCard}
                            onPress={() => navigation.navigate('ProductDetail', { productId: drink.id })}
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


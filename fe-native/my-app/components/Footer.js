import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native'; 
import AsyncStorage from '@react-native-async-storage/async-storage'; 

const Footer = () => {
  const navigation = useNavigation(); 
 
  const tabuser = async () => {
    const username = await AsyncStorage.getItem('username'); // Lấy username từ AsyncStorage
    if (username) {
      console.log(username); 
      navigation.navigate("User"); 
    } else {
      console.log(username);
      navigation.navigate("Login"); 
    }
  };
  
  const tabhome = () => {
    navigation.navigate("Home"); 
  };

  return (
    <View style={styles.footer}>
      <TouchableOpacity style={styles.footerItem} onPress={tabhome}>
        <Ionicons name="home-outline" size={22} color="#1f6f8b" />
        <Text style={styles.footerLabel}>Trang chủ</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.footerItem}>
        <Ionicons name="gift-outline" size={22} color="#1f6f8b" />
        <Text style={styles.footerLabel}>Ưu đãi</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.footerItem} onPress={()=>{
        navigation.navigate('Cart');
      }}>
        <Ionicons name="cart-outline" size={22} color="#1f6f8b" />
        <Text style={styles.footerLabel}>Giỏ hàng</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.footerItem} onPress={tabuser}>
        <Ionicons name="person-outline" size={22} color="#1f6f8b" />
        <Text style={styles.footerLabel}>Tôi</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderRadius: 25,
    borderColor: '#e0e0e0',
    position: 'relative',
    height: 80,
  },
  footerItem: {
    alignItems: 'center',
  },
  footerLabel: {
    fontSize: 12,
    color: '#1f6f8b',
  },
});

export default Footer;

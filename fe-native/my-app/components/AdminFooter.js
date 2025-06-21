import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useNavigation } from '@react-navigation/native'; 
import AsyncStorage from '@react-native-async-storage/async-storage'; 

const AdminFooter = () => {
  const navigation = useNavigation(); 
  return (
    <View style={styles.footer}>
      <TouchableOpacity style={styles.footerItem} onPress={()=>{
        navigation.navigate('AdminHome');
      }}>
        <Ionicons name="home-outline" size={22} color="#1f6f8b" />
        <Text style={styles.footerLabel}>Home</Text>
      </TouchableOpacity>
    <TouchableOpacity style={styles.footerItem} onPress={()=>{
        navigation.navigate("ProductManage");
      }}>
        <Ionicons name="cube-outline" size={22} color="#1f6f8b" />
        <Text style={styles.footerLabel}>Sản phẩm</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.footerItem}onPress={()=>{
        navigation.navigate("OrderManage");
      }}>
        <Ionicons name="cart-outline" size={22} color="#1f6f8b" />
        <Text style={styles.footerLabel}>Đơn hàng</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.footerItem} onPress={()=>{
        navigation.navigate("UserManage");
      }}>
        <Ionicons name="people-outline" size={22} color="#1f6f8b" />
        <Text style={styles.footerLabel}>Người dùng</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.footerItem} >
        <Ionicons name="gift-outline" size={22} color="#1f6f8b" />
        <Text style={styles.footerLabel}>Ưu đãi</Text>
      </TouchableOpacity>
          <TouchableOpacity style={styles.footerItem} onPress={()=>{

      }}>
        <Ionicons name="bar-chart-outline" size={22} color="#1f6f8b" />
        <Text style={styles.footerLabel}>Thống kê</Text>
      </TouchableOpacity>
       <TouchableOpacity style={styles.footerItem} onPress={()=>{

      }}>
        <Ionicons name="settings-outline" size={22} color="#1f6f8b" />
        <Text style={styles.footerLabel}>Cài đặt</Text>
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

export default AdminFooter;

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native'; // thêm dòng này

const Header = () => {
  const navigation = useNavigation(); // hook điều hướng

  return (
    <View style={styles.header}>
      <Text style={styles.title}>VNUA MILK TEA & COFFE 🍹</Text>

      {/* Khi ấn vào thông báo thì chuyển màn hình */}
      <TouchableOpacity onPress={() => navigation.navigate('UserNotification')}>
        <Ionicons name="notifications-outline" size={24} color="#2e2f2f" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f6f8b',
  },
});

export default Header;

// components/Header.js
import React from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView } from 'react-native'; // Import ScrollView
import { Ionicons } from '@expo/vector-icons';

const Header = () => {
  return (
    <View>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>VNUA MILK TEA & COFFE 🍹</Text>
        <Ionicons name="notifications-outline" size={24} color="#2e2f2f" />
      </View> 
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
  
  categories: {
    marginTop: 16,
    marginBottom:5
  },
  categoryBadge: {
    backgroundColor: '#e0e0e0',
    borderRadius: 20,
    padding: 8,
    marginRight: 10,
  },
  categoryText: {
    fontSize: 14,
    color: '#333',
  },
});

export default Header;

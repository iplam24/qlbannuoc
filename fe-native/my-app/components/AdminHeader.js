// components/AdminHeader.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function AdminHeader() {
    return (
        <View style={styles.container}>
            <Ionicons name="construct-outline" size={24} color="#fff" />
            <Text style={styles.title}>Quản trị hệ thống</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1f6f8b',
        padding: 16,
        justifyContent: 'center',
    },
    title: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 10,
    },
});

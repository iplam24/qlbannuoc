import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

import LoginScreen from './screens/user/loginscreen/LoginScreen';
import UserScreen from './screens/user/userscreen/UserScreen';
import HomeScreen from './screens/user/homescreen/HomeScreen';
import SignupScreen from './screens/user/signupscsreen/SignupScreen';
import AllProducts from './screens/admin/allproducts/AllProducts';
import ProductDetail from './screens/user/productsdetail/ProductDetail';
import AdminHomeScreen from './screens/admin/adminhomescreen/AdminHomeScreen';
import ProductManagementScreen from './screens/admin/productmanagementscreen/ProductManagementScreen';
import UserManagementScreen from './screens/admin/usermanagescreen/UserManagementScreen';
import OrderManagementScreen from './screens/admin/oderadminscreen/OrderManagementScreen';
import CartScreen from './screens/user/cartscreen/CartScreen';
import StatisticsScreen from './screens/admin/statisticsscreen/StatisticsScreen';
import InforScreen from './screens/user/editscreen/InforScreen';
import AddressScreen from './screens/user/addressscreen/AddressScreen';
import OrderScreen from './screens/user/orderscreen/OrderScreen';
import NotificationAdminScreen from './screens/admin/noticationscreen/NotificationAdminScreen';
import UserNotificationScreen from './screens/user/notificationscreen/UserNotificationScreen';
const Stack = createNativeStackNavigator();

export default function App() {
  const [initialScreen, setInitialScreen] = useState<string | null>(null);

useEffect(() => {
  const checkLogin = async () => {
    const role = await AsyncStorage.getItem('role');
    if (role === '1') {
      setInitialScreen('AdminHome');
    } else if (role === '2') {
      setInitialScreen('Staff');
    } else if (role === '3') {
      setInitialScreen('Home');
    } else {
      setInitialScreen('Home');
    }
  };
  checkLogin();
}, []);


  if (!initialScreen) return null;

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={initialScreen} screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Sign" component={SignupScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="User" component={UserScreen} />
        <Stack.Screen name="Cart" component={CartScreen}/>
        <Stack.Screen name="AllProducts" component={AllProducts} />
        <Stack.Screen name="ProductDetail" component={ProductDetail} />
        <Stack.Screen name="AdminHome" component={AdminHomeScreen} />
        <Stack.Screen name="ProductManage" component={ProductManagementScreen} />
        <Stack.Screen name="UserManage" component={UserManagementScreen} />
        <Stack.Screen name="OrderManage" component={OrderManagementScreen} />
        <Stack.Screen name="Statistics" component={StatisticsScreen} />
        <Stack.Screen name="InforScreen" component={InforScreen} />
        <Stack.Screen name="AddressScreen" component={AddressScreen} />
        <Stack.Screen name="OrderScreen" component={OrderScreen} />
        <Stack.Screen name="Notification" component={NotificationAdminScreen}/>
        <Stack.Screen name="UserNotification" component={UserNotificationScreen}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

import * as React from 'react';
import { Image } from "react-native";
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import 'react-native-gesture-handler';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Provider } from 'react-redux';
import { store } from '../redux/store';
import Toast from 'react-native-toast-message';
import LoginScreen from "../screens/login/LoginScreen";
import HomeScreen from "../screens/home/HomeScreen";
import SettingsScreen from "../screens/settings/SettingsScreen";
import ProfileScreen from "../screens/profile/ProfileScreen";
import HoSoKhamScreen from "../screens/common/HoSoKhamScreen"
import HoSoKhamAddScreen from "../screens/common/add/HoSoKhamAddScreen"
import SiteListScreen from "../screens/site/list/SiteListScreen"
import AppointmentServiceScreen from "../screens/service/list/AppointmentServiceScreen"
import AppointmentServiceDetailScreen from "../screens/service/detail/AppointmentServiceDetailScreen"
import BookingOfflineScreen from "../screens/booking/offline/BookingOfflineScreen"
import PaymentAppointmentScreen from "../screens/booking/payment/PaymentAppointmentScreen"

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();

function HomeTabs() {
    return (
        <Tab.Navigator screenOptions={{ headerShown: false }}>
            <Tab.Screen name="HomeScreen" component={HomeScreen} options={{
                tabBarIcon: () => (
                    <Image
                        style={{ width: 24, height: 24, }}
                        source={require('../images/ic_home.png')} resizeMode="stretch" />
                )
            }} />
            <Tab.Screen name="SettingsScreen" component={SettingsScreen} options={{
                tabBarIcon: () => (
                    <Image
                        style={{ width: 24, height: 24, }}
                        source={require('../images/ic_setting.png')} resizeMode="stretch" />
                )
            }} />
            <Tab.Screen name="ProfileScreen" component={ProfileScreen} options={{
                tabBarIcon: () => (
                    <Image
                        style={{ width: 24, height: 24, }}
                        source={require('../images/ic_user.png')} resizeMode="stretch" />
                )
            }} />
        </Tab.Navigator>
    );
}

export default function AppNavigator() {
    return (
        <Provider store={store}>
            <NavigationContainer>
                <Stack.Navigator initialRouteName='HomeTabs' screenOptions={{ headerShown: false }}>
                    <Stack.Screen name="LoginScreen" component={LoginScreen} />
                    <Stack.Screen name="HomeTabs" component={HomeTabs} />
                    <Stack.Screen name="HoSoKhamScreen" component={HoSoKhamScreen} />
                    <Stack.Screen name="HoSoKhamAddScreen" component={HoSoKhamAddScreen} />
                    <Stack.Screen name="SiteListScreen" component={SiteListScreen} />
                    <Stack.Screen name="AppointmentServiceScreen" component={AppointmentServiceScreen} />
                    <Stack.Screen name="AppointmentServiceDetailScreen" component={AppointmentServiceDetailScreen} />
                    <Stack.Screen name="BookingOfflineScreen" component={BookingOfflineScreen} />
                    <Stack.Screen name="PaymentAppointmentScreen" component={PaymentAppointmentScreen} />
                </Stack.Navigator>
            </NavigationContainer>
            {/* bắt buộc Toast phải nằm dưới NavigationContainer */}
            <Toast />
        </Provider>
    );
}
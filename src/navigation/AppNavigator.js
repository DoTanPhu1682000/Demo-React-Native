import * as React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, SafeAreaView, Dimensions, ScrollView, Image, FlatList, StatusBar, ImageBackground } from "react-native";
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
import HenKhamScreen from "../screens/lichhen/HenKhamScreen";
import ProfileScreen from "../screens/profile/ProfileScreen";
import HoSoKhamScreen from "../screens/common/HoSoKhamScreen"
import HoSoKhamAddScreen from "../screens/common/add/HoSoKhamAddScreen"
import SiteListScreen from "../screens/site/list/SiteListScreen"
import AppointmentServiceScreen from "../screens/service/list/AppointmentServiceScreen"
import AppointmentServiceDetailScreen from "../screens/service/detail/AppointmentServiceDetailScreen"
import BookingOfflineScreen from "../screens/booking/offline/BookingOfflineScreen"
import PaymentAppointmentScreen from "../screens/booking/payment/PaymentAppointmentScreen"
import WebViewScreen from "../screens/common/webView/WebViewScreen"
import colors from '../configs/colors/colors'
import stylesBase from '../configs/styles/styles'

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();

function HomeTabs() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false, // Ẩn tiêu đề
                tabBarIcon: ({ focused }) => {
                    let iconName;
                    let iconColor;
                    let labelColor;

                    if (route.name === 'Trang chủ') {
                        iconName = focused ? require('../images/ic_home_active.png') : require('../images/ic_home.png');
                        iconColor = focused ? colors.primary : colors.ink200;
                        labelColor = focused ? colors.primary : colors.ink200;
                    } else if (route.name === 'Lịch hẹn') {
                        iconName = focused ? require('../images/ic_lich_hen_tab_active.png') : require('../images/ic_lich_hen_tab.png');
                        iconColor = focused ? colors.primary : colors.ink200;
                        labelColor = focused ? colors.primary : colors.ink200;
                    } else if (route.name === 'Thông báo') {
                        iconName = focused ? require('../images/ic_noti_active.png') : require('../images/ic_noti.png');
                        iconColor = focused ? colors.primary : colors.ink200;
                        labelColor = focused ? colors.primary : colors.ink200;
                    }

                    return (
                        <Image
                            source={iconName}
                            style={{ width: 20, height: 20, tintColor: iconColor, marginTop: 4 }}
                            resizeMode="stretch"
                        />
                    );
                },
                tabBarLabel: ({ focused }) => {
                    let labelColor;

                    if (route.name === 'Trang chủ') {
                        labelColor = focused ? colors.primary : colors.ink200;
                    } else if (route.name === 'Lịch hẹn') {
                        labelColor = focused ? colors.primary : colors.ink200;
                    } else if (route.name === 'Thông báo') {
                        labelColor = focused ? colors.primary : colors.ink200;
                    }

                    return (
                        <Text style={[stylesBase.P3Strong, { color: labelColor }]}>{route.name}</Text>
                    );
                },
            })}
        >
            <Tab.Screen name="Trang chủ" component={HomeScreen} />
            <Tab.Screen name="Lịch hẹn" component={HenKhamScreen} />
            <Tab.Screen name="Thông báo" component={ProfileScreen} />
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
                    <Stack.Screen name="WebViewScreen" component={WebViewScreen} />
                </Stack.Navigator>
            </NavigationContainer>
            {/* bắt buộc Toast phải nằm dưới NavigationContainer */}
            <Toast />
        </Provider>
    );
}
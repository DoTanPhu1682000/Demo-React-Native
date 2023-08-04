import * as React from 'react';
import { Image } from "react-native";
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import 'react-native-gesture-handler';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Provider } from 'react-redux';
import { store } from '../redux/store';
import LoginScreen from "../screens/login/LoginScreen";
import HomeScreen from "../screens/home/HomeScreen";
import SettingsScreen from "../screens/settings/SettingsScreen";
import ProfileScreen from "../screens/profile/ProfileScreen";
import HoSoKhamScreen from "../screens/common/HoSoKhamScreen"
import HoSoKhamAddScreen from "../screens/common/add/HoSoKhamAddScreen"

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

// Drawer
// const HomeDrawer = () => {
//     return (
//         <Drawer.Navigator initialRouteName='HomeScreen' screenOptions={{ headerShown: false }}>
//             <Drawer.Screen name="HomeScreen" component={HomeScreen} />
//             <Drawer.Screen name="SettingsScreen" component={SettingsScreen} />
//             <Drawer.Screen name="ProfileScreen" component={ProfileScreen} />
//         </Drawer.Navigator>
//     );
// }

export default function AppNavigator() {
    return (
        <Provider store={store}>
            <NavigationContainer>
                <Stack.Navigator initialRouteName='LoginScreen' screenOptions={{ headerShown: false }}>
                    <Stack.Screen name="LoginScreen" component={LoginScreen} />
                    <Stack.Screen name="HomeTabs" component={HomeTabs} />
                    <Stack.Screen name="HoSoKhamScreen" component={HoSoKhamScreen} />
                    <Stack.Screen name="HoSoKhamAddScreen" component={HoSoKhamAddScreen} />
                </Stack.Navigator>
            </NavigationContainer>
        </Provider>
    );
}
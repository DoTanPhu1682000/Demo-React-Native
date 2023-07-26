import React, { Component } from "react";
import { StyleSheet, Text, View, Button, TouchableOpacity, TextInput, SafeAreaView, Dimensions, ImageBackground, Image } from "react-native";
import { useDispatch, useSelector } from 'react-redux';

export default ProfileScreen = ({ navigation }) => {
    const info = useSelector((state) => state.personalInfo)
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={{ width: '100%', height: '8%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <TouchableOpacity
                    style={{ height: '100%', aspectRatio: 1.5, alignItems: 'center', flexDirection: 'row', marginStart: 12 }}
                    onPress={() => {
                        navigation.openDrawer()
                    }}>
                    <Image
                        style={{ width: 30, height: 30, }}
                        source={require('../images/ic_menu.png')} resizeMode="stretch" />
                </TouchableOpacity>

                <TouchableOpacity
                    style={{ height: '100%', aspectRatio: 1.5, alignItems: 'center', flexDirection: 'row', justifyContent: 'flex-end', marginEnd: 12 }}
                    onPress={() => {
                        navigation.navigate('SettingsScreen')
                    }}>
                    <Image
                        style={{ width: 30, height: 30, }}
                        source={require('../images/ic_setting.png')} resizeMode="stretch" />
                </TouchableOpacity>
            </View>

            <View style={styles.container}>
                <Text style={{ fontSize: 24 }}>Profile</Text>
                <Text>Email: {info.email}</Text>
                <Text>Score: {info.score}</Text>
                <Text>Address: {info.address}</Text>
                <Text>Id: {info.id}</Text>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center"
    }
});
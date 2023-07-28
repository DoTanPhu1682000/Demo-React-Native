import React, { Component, useState, useEffect } from "react";
import { StyleSheet, Text, View, Button, TouchableOpacity, TextInput, SafeAreaView, Dimensions, ImageBackground, Image } from "react-native";
import { useDispatch, useSelector } from 'react-redux';
import { getRefreshToken } from '../redux/actions/updateAction'

export default ProfileScreen = ({ navigation }) => {
    const dispatch = useDispatch();
    const refreshToken = useSelector((state) => state.refreshTokenReducer.refresh_token)
    const info = useSelector((state) => state.infoReducer)

    const handlerRefreshToken = () => {
        dispatch(getRefreshToken())
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={{ width: '100%', height: '6%', flexDirection: 'row', backgroundColor: "#FFFFFF", alignItems: 'center', justifyContent: 'space-between' }}>
                <TouchableOpacity
                    style={{ height: '100%', aspectRatio: 1.5, alignItems: 'center', flexDirection: 'row', marginStart: 12 }}
                    onPress={() => {
                        navigation.openDrawer()
                    }}>
                    <Image
                        style={{ width: 24, height: 24, }}
                        source={require('../images/ic_menu.png')} resizeMode="stretch" />
                </TouchableOpacity>

                <TouchableOpacity
                    style={{ height: '100%', aspectRatio: 1.5, alignItems: 'center', flexDirection: 'row', justifyContent: 'flex-end', marginEnd: 12 }}
                    onPress={() => {
                        navigation.navigate('SettingsScreen')
                    }}>
                    <Image
                        style={{ width: 24, height: 24, }}
                        source={require('../images/ic_setting.png')} resizeMode="stretch" />
                </TouchableOpacity>
            </View>

            <View style={styles.container}>
                <Text style={{ fontSize: 24 }}>Profile</Text>
                <Text>Email: {info.email}</Text>

                <TouchableOpacity
                    style={{ width: 200, height: 40, borderWidth: 1, borderRadius: 12, marginTop: 24, justifyContent: 'center', alignItems: 'center', backgroundColor: '#4D8D6E' }}
                    onPress={() => handlerRefreshToken()}>
                    <Text style={{ color: '#FFFFFF' }}>Refresh Token</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#EEEEEE",
        alignItems: "center",
        justifyContent: "center"
    }
});
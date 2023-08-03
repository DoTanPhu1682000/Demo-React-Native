import React, { Component, useState, useEffect } from "react";
import { StyleSheet, Text, View, TouchableOpacity, TextInput, SafeAreaView, Dimensions, ScrollView, Image, FlatList } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from 'react-redux';
import { updateEmail, getAccessToken } from '../../redux/actions/updateAction'
import * as Constants from "../../api/AppApiHelper";
import axios from "axios";

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default HomeScreen = () => {
    const navigation = useNavigation()
    const [email, onChangeEmail] = React.useState("")
    const info = useSelector((state) => state.infoReducer)
    const dispatch = useDispatch()
    const [response, setResponse] = useState('')

    useEffect(() => {
        console.log("Mới vào màn hình")

        return () => {
            console.log("Hủy màn hình này")
        }
    }, [])

    const login = () => {
        dispatch(getAccessToken(navigation, '0356709238', '123456'))
    }

    const navigateToHoSoKhamScreen = () => {
        navigation.navigate('HoSoKhamScreen')
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={{ width: '100%', height: '6%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#FFFFFF' }}>
                <TouchableOpacity
                    style={{ height: '100%', aspectRatio: 1.5, alignItems: 'center', flexDirection: 'row', marginStart: 12 }}>
                    <Image
                        style={{ width: 24, height: 24, }}
                        source={require('../../images/ic_menu.png')} resizeMode="stretch" />
                </TouchableOpacity>

                <TouchableOpacity
                    style={{ height: '100%', aspectRatio: 1.5, alignItems: 'center', flexDirection: 'row', justifyContent: 'flex-end', marginEnd: 12 }}
                    onPress={() => {
                        navigation.navigate('SettingsScreen')
                    }}>
                    <Image
                        style={{ width: 24, height: 24, }}
                        source={require('../../images/ic_setting.png')} resizeMode="stretch" />
                </TouchableOpacity>
            </View>

            <View style={{ flex: 1, backgroundColor: "#EEEEEE", alignItems: "center", justifyContent: "center" }}>
                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                    <TouchableOpacity
                        style={{ flex: 1, height: 80, flexDirection: 'row', borderRadius: 8, marginTop: 16, marginStart: 16, marginEnd: 16, backgroundColor: '#F68E1E', alignItems: "center", justifyContent: "space-between" }}
                        onPress={() => navigateToHoSoKhamScreen()}>
                        <Text style={{ color: '#FFFFFF', width: 48, marginStart: 10 }}>Tư vấn Online</Text>
                        <Image
                            style={{ width: 48, height: 48, marginEnd: 10 }}
                            source={require('../../images/ic_home_dat_lich_online.png')} resizeMode="stretch" />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={{ flex: 1, height: 80, flexDirection: 'row', borderRadius: 8, marginTop: 16, marginEnd: 16, backgroundColor: '#F68E1E', alignItems: "center", justifyContent: "space-between" }}
                        onPress={() => navigateToHoSoKhamScreen()}>
                        <Text style={{ color: '#FFFFFF', width: 60, marginStart: 10 }}>Đặt lịch tại CSYT</Text>
                        <Image
                            style={{ width: 48, height: 48, marginEnd: 10 }}
                            source={require('../../images/ic_home_dat_lich_offline.png')} resizeMode="stretch" />
                    </TouchableOpacity>
                </View>

                <Text style={{ fontSize: 24 }}>Home</Text>
                <Text>Email: {info.email}</Text>
                <TextInput
                    style={{ width: '80%', height: 40, fontSize: 16, margin: 12, borderWidth: 1, padding: 10, borderRadius: 8 }}
                    autoCapitalize="none"
                    onChangeText={onChangeEmail}
                    value={email} />

                <TouchableOpacity
                    style={{ width: 200, height: 40, borderWidth: 1, borderRadius: 12, marginTop: 24, justifyContent: 'center', alignItems: 'center', backgroundColor: '#4D8D6E' }}
                    onPress={() => dispatch(updateEmail(email))}>
                    <Text style={{ color: '#FFFFFF' }}>Cập nhật</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={{ width: 200, height: 40, borderWidth: 1, borderRadius: 12, marginTop: 24, justifyContent: 'center', alignItems: 'center', backgroundColor: '#4D8D6E' }}
                    onPress={() => login()}>
                    <Text style={{ color: '#FFFFFF' }}>Login</Text>
                </TouchableOpacity>

                <ScrollView style={{ width: windowWidth - 60, height: 20, borderWidth: 1, margin: 30 }}>
                    <Text style={{ fontSize: 12, color: '#1F2D3D' }}>{response}</Text>
                </ScrollView>
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
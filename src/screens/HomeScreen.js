import React, { Component, useState, useEffect } from "react";
import { StyleSheet, Text, View, TouchableOpacity, TextInput, SafeAreaView, Dimensions, ScrollView, Image, FlatList } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from 'react-redux';
import { updateEmail } from '../redux/actions/updateAction'
import * as Constants from "../api/AppApiHelper";
import axios from "axios";

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default HomeScreen = () => {
    const navigation = useNavigation()
    const [email, onChangeEmail] = React.useState("")
    const info = useSelector((state) => state.personalInfo)
    const dispatch = useDispatch()
    const [response, setResponse] = useState('')

    useEffect(() => {
        console.log("Mới vào màn hình")

        return () => {
            console.log("Hủy màn hình này")
        }
    }, [])

    // Call API Movies
    const callGetURL = async () => {
        try {
            const res = await axios.get(`${Constants.URL_MOVIES}`)
            console.log(res.data)
            setResponse(JSON.stringify(res.data))
        } catch (error) {
            setResponse(JSON.stringify(error.message))
        }
    }

    // Call API 365 Medihome
    const data = {
        username: '0392719775',
        password: '123456',
        grant_type: 'password'
    }

    const login = async () => {
        try {
            const res = await axios.post(`${Constants.URL}/${Constants.LOGIN}`, data, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': 'Basic bWVkaWhvbWU6bWVkaWhvbWVAMTIzNEAjJA=='
                }
            })
            console.log(res.data)
            setResponse(JSON.stringify(res.data))
        } catch (error) {
            setResponse(JSON.stringify(error.message))
        }
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={{ width: '100%', height: '8%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#FFA500' }}>
                <TouchableOpacity
                    style={{ height: '100%', aspectRatio: 1.5, alignItems: 'center', flexDirection: 'row', marginStart: 12 }}>
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

                <TouchableOpacity
                    style={{ width: 200, height: 40, borderWidth: 1, borderRadius: 12, marginTop: 24, justifyContent: 'center', alignItems: 'center', backgroundColor: '#4D8D6E' }}
                    onPress={() => callGetURL()}>
                    <Text style={{ color: '#FFFFFF' }}>Get Api Movies</Text>
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
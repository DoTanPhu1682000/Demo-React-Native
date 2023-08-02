import React, { Component, useState, useEffect } from "react";
import { StyleSheet, Text, View, TouchableOpacity, TextInput, SafeAreaView, Dimensions, ScrollView, Image, FlatList } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from 'react-redux';
import { getPatientRecord } from '../../redux/actions/updateAction'

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default HoSoKhamScreen = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const patientRecord = useSelector((state) => state.patientRecordReducer)

    useEffect(() => {
        console.log("Create HoSoKhamScreen")

        return () => {
            console.log("Destroy HoSoKhamScreen")
        }
    }, [])

    const handlergetPatientRecord = () => {
        dispatch(getPatientRecord())
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            {/* TaskBar */}
            <View style={{ width: '100%', height: '6%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#FFFFFF' }}>
                <TouchableOpacity
                    style={{ height: '100%', aspectRatio: 1.5, alignItems: 'center', flexDirection: 'row', marginStart: 12 }}
                    onPress={() => {
                        navigation.goBack()
                    }}>
                    <Image
                        style={{ width: 24, height: 24, }}
                        source={require('../../images/ic_back.png')} resizeMode="stretch" />
                </TouchableOpacity>

                <Text style={{ color: '#1F2D3D', fontSize: 16 }}>Chọn hồ sơ</Text>

                <TouchableOpacity
                    style={{ height: '100%', aspectRatio: 1.5, alignItems: 'center', flexDirection: 'row', justifyContent: 'flex-end', marginEnd: 12 }}>
                    <Image
                        style={{ width: 24, height: 24 }}
                        source={require('../../images/ic_sos.png')} resizeMode="stretch" />
                </TouchableOpacity>
            </View>

            <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
                <TouchableOpacity
                    style={{ width: 200, height: 40, borderWidth: 1, borderRadius: 12, marginTop: 24, justifyContent: 'center', alignItems: 'center', backgroundColor: '#4D8D6E' }}
                    onPress={() => handlergetPatientRecord()}>
                    <Text style={{ color: '#FFFFFF' }}>getPatientRecord</Text>
                </TouchableOpacity>

                <FlatList
                    data={patientRecord}
                    style={{ width: '100%', margin: 16, backgroundColor: '#FFFFFF' }}
                    renderItem={({ item }) => (
                        <View>
                            <Text style={{ color: '#1F2D3D' }}>ID: {item.patient_address}</Text>
                            <Text>ID: </Text>
                        </View>
                    )}
                    keyExtractor={(item) => item.id.toString()} />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    }
});
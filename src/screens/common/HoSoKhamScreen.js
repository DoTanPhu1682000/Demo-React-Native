import React, { Component, useState, useEffect } from "react";
import { StyleSheet, Text, View, TouchableOpacity, TextInput, SafeAreaView, Dimensions, ScrollView, Image, FlatList } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from 'react-redux';
import { getPatientRecord } from '../../redux/actions/updateAction'
import formatDate from '../../utils/CalendarUtil'

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default HoSoKhamScreen = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const patientRecord = useSelector((state) => state.patientRecordReducer.patientRecord)

    useEffect(() => {
        console.log("Create HoSoKhamScreen")

        return () => {
            console.log("Destroy HoSoKhamScreen")
        }
    }, [])

    const handlergetPatientRecord = async () => {
        await dispatch(getPatientRecord())
    }

    const renderItem = ({ item }) => {
        const formattedDOB = formatDate(item.patient_record.patient_dob);

        return (
            <View>
                <TouchableOpacity style={{ flexDirection: 'row', marginBottom: 16, backgroundColor: '#FFFFFF', borderRadius: 8 }}>
                    <Image
                        style={{ width: 60, height: 60, margin: 12, }}
                        source={require('../../images/img_user.png')} resizeMode="stretch" />

                    <View style={{ justifyContent: 'center', }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={{ color: '#1F2D3D', fontSize: 16 }}>{item.patient_record.patient_name}</Text>
                            {item.patient_record.default_record === true ? (
                                <Image
                                    style={{ width: 16, height: 16, justifyContent: 'center', marginStart: 12 }}
                                    source={require('../../images/ic_default_record.png')} resizeMode="stretch" />
                            ) : null}
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            {item.patient_record.patient_gender === true ? (
                                <Text style={{ color: '#5A6B81', fontSize: 14 }}>Nam - </Text>
                            ) : (
                                <Text style={{ color: '#5A6B81', fontSize: 14 }}>Nữ - </Text>
                            )}
                            <Text style={{ color: '#5A6B81', fontSize: 14 }}>{formattedDOB}</Text>
                        </View>
                    </View>
                </TouchableOpacity>
            </View>
        );
    };

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

            <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: '#F2F4F9' }}>
                <TouchableOpacity
                    style={{ width: 200, height: 40, borderWidth: 1, borderRadius: 12, marginTop: 24, justifyContent: 'center', alignItems: 'center', backgroundColor: '#4D8D6E' }}
                    onPress={() => handlergetPatientRecord()}>
                    <Text style={{ color: '#FFFFFF' }}>getPatientRecord</Text>
                </TouchableOpacity>
                <FlatList
                    data={patientRecord}
                    style={{ width: windowWidth - 32, marginTop: 16 }}
                    renderItem={renderItem}
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
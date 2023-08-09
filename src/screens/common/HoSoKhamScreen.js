import React, { Component, useState, useEffect } from "react";
import { StyleSheet, Text, View, TouchableOpacity, TextInput, SafeAreaView, Dimensions, ScrollView, Image, FlatList, StatusBar } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from 'react-redux';
import { getPatientRecord } from '../../redux/actions/updateAction'
import { formatDate } from '../../utils/CalendarUtil'
import colors from '../../configs/colors/colors'
import stylesBase from '../../configs/styles/styles'

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default HoSoKhamScreen = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const patientRecord = useSelector((state) => state.patientRecordReducer.patientRecord)

    useEffect(() => {
        console.log("Create HoSoKhamScreen")
        dispatch(getPatientRecord())

        return () => {
            console.log("Destroy HoSoKhamScreen")
        }
    }, [])

    const navigateToHoSoKhamAddScreen = () => {
        // Điều hướng đến màn hình HomeScreen
        navigation.navigate('HoSoKhamAddScreen')
    }

    const renderItem = ({ item }) => {
        const formattedDOB = formatDate(item.patient_record.patient_dob);

        return (
            <View>
                <StatusBar barStyle="dark-content" backgroundColor={colors.white} />
                <TouchableOpacity style={{ flexDirection: 'row', marginBottom: 16, backgroundColor: colors.white, borderRadius: 8 }}>
                    <Image
                        style={{ width: 60, height: 60, margin: 12, }}
                        source={require('../../images/img_user.png')} resizeMode="stretch" />

                    <View style={{ justifyContent: 'center', }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={[stylesBase.H5Strong, { color: colors.ink500 }]}>{item.patient_record.patient_name}</Text>
                            {item.patient_record.default_record === true ? (
                                <Image
                                    style={{ width: 16, height: 16, justifyContent: 'center', marginStart: 12 }}
                                    source={require('../../images/ic_default_record.png')} resizeMode="stretch" />
                            ) : null}
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            {item.patient_record.patient_gender === true ? (
                                <Text style={[stylesBase.P1, { color: colors.ink400 }]}>Nam - </Text>
                            ) : (
                                <Text style={[stylesBase.P1, { color: colors.ink400 }]}>Nữ - </Text>
                            )}
                            <Text style={[stylesBase.P1, { color: colors.ink400 }]}>{formattedDOB}</Text>
                        </View>
                    </View>
                </TouchableOpacity>
            </View>
        );
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
            {/* TaskBar */}
            <View style={{ width: '100%', height: '6%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: colors.white }}>
                <TouchableOpacity
                    style={{ height: '100%', aspectRatio: 1.5, alignItems: 'center', flexDirection: 'row', marginStart: 12 }}
                    onPress={() => {
                        navigation.goBack()
                    }}>
                    <Image
                        style={{ width: 24, height: 24, }}
                        source={require('../../images/ic_back.png')} resizeMode="stretch" />
                </TouchableOpacity>

                <Text style={[stylesBase.H5Strong, { color: colors.ink500 }]}>Chọn hồ sơ</Text>

                <TouchableOpacity
                    style={{ height: '100%', aspectRatio: 1.5, alignItems: 'center', flexDirection: 'row', justifyContent: 'flex-end', marginEnd: 12 }}>
                    <Image
                        style={{ width: 24, height: 24 }}
                        source={require('../../images/ic_sos.png')} resizeMode="stretch" />
                </TouchableOpacity>
            </View>

            <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: '#F2F4F9' }}>
                <FlatList
                    data={patientRecord}
                    style={{ width: windowWidth - 32, marginTop: 16 }}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id.toString()} />
            </View>

            <TouchableOpacity style={{ position: 'absolute', bottom: 20, right: 16 }}
                onPress={navigateToHoSoKhamAddScreen}>
                <Image
                    style={{ width: 64, height: 64, }}
                    source={require('../../images/ic_add_user_patient_record.png')} resizeMode="stretch" />
            </TouchableOpacity>
        </SafeAreaView>
    );
}
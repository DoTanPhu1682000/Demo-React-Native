import React, { Component, useState, useEffect, useRef } from "react";
import { StyleSheet, Text, View, TouchableOpacity, TextInput, SafeAreaView, Dimensions, ScrollView, Image, FlatList, StatusBar } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedItemAppointmentService } from '../../../redux/actions/updateAction'
import colors from '../../../configs/colors/colors'
import stylesBase from '../../../configs/styles/styles'

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default AppointmentServiceDetailScreen = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const itemAppointmentService = useSelector((state) => state.itemAppointmentServiceReducer.selectedItemAppointmentService)
    const itemPatientRecord = useSelector((state) => state.itemPatientRecordReducer.selectedItemPatientRecord)
    const itemSite = useSelector((state) => state.itemSiteReducer.selectedItemSite)

    useEffect(() => {
        console.log("Create AppointmentServiceDetailScreen")

        return () => {
            console.log("Destroy AppointmentServiceDetailScreen")
        }
    }, [])

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.white }}>
            <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
            {/* TaskBar */}
            <View style={{ width: '100%', height: '6%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: colors.primary }}>
                <TouchableOpacity
                    style={{ height: '100%', aspectRatio: 1.5, alignItems: 'center', flexDirection: 'row', marginStart: 12 }}
                    onPress={() => {
                        navigation.goBack()
                    }}>
                    <Image
                        style={{ width: 24, height: 24, }}
                        source={require('../../../images/ic_back_white.png')} resizeMode="stretch" />
                </TouchableOpacity>

                <Text style={[stylesBase.H5Strong, { color: colors.white }]}>Chi tiết dịch vụ</Text>

                <TouchableOpacity
                    style={{ height: '100%', aspectRatio: 1.5, alignItems: 'center', flexDirection: 'row', justifyContent: 'flex-end', marginEnd: 12 }}>
                    <Image
                        style={{ width: 24, height: 24 }}
                        source={require('../../../images/ic_sos.png')} resizeMode="stretch" />
                </TouchableOpacity>
            </View>

            <View style={{ height: '30%', backgroundColor: colors.primary }}>
                <View style={{ marginTop: 80, flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.white, borderTopStartRadius: 20, borderTopEndRadius: 20 }}>
                    <Text numberOfLines={2} style={[stylesBase.P1Strong, { color: colors.ink500, marginStart: 20, marginEnd: 20 }]}>{itemAppointmentService.name}</Text>
                </View>
                <View style={{ alignItems: 'center', top: -210 }}>
                    <View style={{ position: 'absolute', borderRadius: 12, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.sLine }}>
                        <Image
                            style={{ width: 60, height: 60, margin: 20 }}
                            source={require('../../../images/ic_handle_heart.png')} resizeMode="stretch" />
                    </View>
                </View>
            </View>

            <ScrollView>
                <View style={{ width: windowWidth - 32, marginStart: 16, height: 1, backgroundColor: colors.sLine, }} />
                <View style={{ flex: 1, margin: 16 }}>
                    <Text style={[stylesBase.H4Strong, { color: colors.ink500 }]}>Mô tả</Text>
                    <Text style={[stylesBase.P1, { color: colors.ink500, marginTop: 8 }]}>{itemAppointmentService.description}</Text>
                </View>
            </ScrollView>

            {/* Button Lưu lại */}
            <View style={{ backgroundColor: colors.white, }}>
                <TouchableOpacity
                    style={{ width: windowWidth - 32, marginTop: 12, marginStart: 16, alignItems: 'center', backgroundColor: colors.primary, borderRadius: 12 }}>
                    <Text style={[stylesBase.H5, { color: colors.white, paddingTop: 12, paddingBottom: 12 }]}>Đặt lịch</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView >
    );
}
import React, { Component, useState, useEffect } from "react";
import { StyleSheet, Text, View, TouchableOpacity, TextInput, SafeAreaView, Dimensions, ScrollView, Image, FlatList, StatusBar } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedItemPatientRecord } from '../../../redux/actions/updateAction'
import { formatDate } from '../../../utils/CalendarUtil'
import colors from '../../../configs/colors/colors'
import stylesBase from '../../../configs/styles/styles'
import ConfirmationBottomSheet from '../../../component/ConfirmationBottomSheet'

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default HoSoKhamDetailScreen = () => {
    // Hooks and State
    const route = useRoute();
    const navigation = useNavigation();
    const dispatch = useDispatch();

    // Redux Selectors
    const itemPatientRecord = useSelector((state) => state.itemPatientRecordReducer.selectedItemPatientRecord)

    useEffect(() => {
        console.log("Create HoSoKhamDetailScreen")
        console.log(itemPatientRecord);

        return () => {
            console.log("Destroy HoSoKhamDetailScreen")
        }
    }, [])

    const formattedDate = formatDate(itemPatientRecord.patient_record.patient_dob);

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.sBackground }}>
            <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
            {/* TaskBar */}
            <View style={{ width: '100%', height: '6%', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: colors.primary, paddingStart: 16, paddingEnd: 16, paddingTop: 8, paddingBottom: 8 }}>
                <TouchableOpacity style={{ position: 'absolute', left: 16 }}
                    onPress={() => {
                        navigation.goBack()
                    }}>
                    <Image
                        style={{ width: 24, height: 24, tintColor: colors.white }}
                        source={require('../../../images/ic_back.png')} resizeMode="stretch" />
                </TouchableOpacity>
                <Text style={[stylesBase.H5Strong, { color: colors.white }]}>Chọn hồ sơ</Text>
                <View
                    style={{
                        position: "absolute", right: 0, flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.20)', borderRadius: 14,
                        paddingStart: 10, paddingEnd: 10, paddingTop: 5, paddingBottom: 5, marginEnd: 16
                    }}>
                    <TouchableOpacity>
                        <Image
                            style={{ width: 16, height: 16, tintColor: colors.white }}
                            source={require('../../../images/ic_more_horizontal.png')} resizeMode="stretch" />
                    </TouchableOpacity>

                    <View style={{ width: 1, height: 16, backgroundColor: colors.white, marginStart: 10, marginEnd: 10 }} />

                    <TouchableOpacity>
                        <Image
                            style={{ width: 16, height: 16, }}
                            source={require('../../../images/ic_close_momo.png')} resizeMode="stretch" />
                    </TouchableOpacity>
                </View>
            </View>

            <View style={{ margin: 16, padding: 12, backgroundColor: colors.white, borderRadius: 8 }}>
                {/* Thông tin cá nhân */}
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Image
                        style={{ width: 20, height: 20, }}
                        source={require('../../../images/ic_user_booking.png')} resizeMode="stretch" />
                    <View style={{ flex: 1 }}>
                        <Text style={[stylesBase.H5Strong, { color: colors.ink500, marginStart: 8 }]}>Thông tin cá nhân</Text>
                    </View>
                    <View style={{ justifyContent: 'flex-end', paddingVertical: 4, paddingHorizontal: 8, borderRadius: 4, backgroundColor: colors.green100 }}>
                        <Text style={[stylesBase.P2, { color: colors.green500 }]}>Hồ sơ chính</Text>
                    </View>
                </View>

                <View style={{ width: '100%', height: 1, backgroundColor: colors.sLine, marginVertical: 12 }} />

                <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                    <Text style={[stylesBase.H5, { color: colors.ink400 }]}>Họ và tên:</Text>
                    <Text style={[stylesBase.H5, { color: colors.ink500, marginStart: 2, flex: 1 }]}>{itemPatientRecord.patient_record.patient_name}</Text>
                </View>

                <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 12 }}>
                    <Text style={[stylesBase.H5, { color: colors.ink400 }]}>Mã số:</Text>
                    <Text style={[stylesBase.H5, { color: colors.ink500, marginStart: 2, flex: 1 }]}>{itemPatientRecord.patient_record.code}</Text>
                </View>

                <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 12 }}>
                    <Text style={[stylesBase.H5, { color: colors.ink400 }]}>Ngày sinh:</Text>
                    <Text style={[stylesBase.H5, { color: colors.ink500, marginStart: 2, flex: 1 }]}>{formattedDate}</Text>
                </View>

                {itemPatientRecord.patient_record.patient_gender
                    ?
                    <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 12 }}>
                        <Text style={[stylesBase.H5, { color: colors.ink400 }]}>Giới tính:</Text>
                        <Text style={[stylesBase.H5, { color: colors.ink500, marginStart: 2, flex: 1 }]}>Nam</Text>
                    </View>
                    :
                    <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 12 }}>
                        <Text style={[stylesBase.H5, { color: colors.ink400 }]}>Giới tính:</Text>
                        <Text style={[stylesBase.H5, { color: colors.ink500, marginStart: 2, flex: 1 }]}>Nữ</Text>
                    </View>
                }

                <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 12 }}>
                    <Text style={[stylesBase.H5, { color: colors.ink400 }]}>Email:</Text>
                    <Text style={[stylesBase.H5, { color: colors.ink500, marginStart: 2, flex: 1 }]}>{itemPatientRecord.patient_record.patient_email}</Text>
                </View>

                <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 12 }}>
                    <Text style={[stylesBase.H5, { color: colors.ink400 }]}>Số điện thoại:</Text>
                    <Text style={[stylesBase.H5, { color: colors.ink500, marginStart: 2, flex: 1 }]}>{itemPatientRecord.patient_record.patient_phone_number}</Text>
                </View>

                <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 12 }}>
                    <Text style={[stylesBase.H5, { color: colors.ink400 }]}>Địa chỉ:</Text>
                    <Text style={[stylesBase.H5, { color: colors.ink500, marginStart: 2, flex: 1 }]}>{itemPatientRecord.patient_record.patient_address}</Text>
                </View>

                {itemPatientRecord.patient_record.patient_ethic === "25"
                    ?
                    <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 12 }}>
                        <Text style={[stylesBase.H5, { color: colors.ink400 }]}>Quốc tịch:</Text>
                        <Text style={[stylesBase.H5, { color: colors.ink500, marginStart: 2, flex: 1 }]}>Việt Nam</Text>
                    </View>
                    :
                    <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 12 }}>
                        <Text style={[stylesBase.H5, { color: colors.ink400 }]}>Quốc tịch:</Text>
                        <Text style={[stylesBase.H5, { color: colors.ink500, marginStart: 2, flex: 1 }]}>Nước ngoài</Text>
                    </View>
                }

                <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 12 }}>
                    <Text style={[stylesBase.H5, { color: colors.ink400 }]}>Chiều cao:</Text>
                    <Text style={[stylesBase.H5, { color: colors.ink500, marginStart: 2, flex: 1 }]}>{itemPatientRecord.patient_record.patient_height}</Text>
                </View>

                <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 12 }}>
                    <Text style={[stylesBase.H5, { color: colors.ink400 }]}>Cân nặng:</Text>
                    <Text style={[stylesBase.H5, { color: colors.ink500, marginStart: 2, flex: 1 }]}>{itemPatientRecord.patient_record.patient_weight}</Text>
                </View>

                <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 12 }}>
                    <Text style={[stylesBase.H5, { color: colors.ink400 }]}>BMI:</Text>
                    <Text style={[stylesBase.H5, { color: colors.ink500, marginStart: 2, flex: 1 }]}>{itemPatientRecord.patient_record.patient_bmi}</Text>
                </View>
            </View>

            {/* Button Chỉnh sửa */}
            <View style={{ position: 'absolute', bottom: 0, width: "100%", backgroundColor: colors.white }}>
                <TouchableOpacity
                    style={{ marginHorizontal: 16, marginVertical: 12, alignItems: 'center', backgroundColor: colors.primary, borderRadius: 8 }}>
                    <Text style={[stylesBase.H5, { color: colors.white, paddingVertical: 12 }]}>Chỉnh sửa</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}
import React, { Component, useState, useEffect, useRef } from "react";
import { StyleSheet, Text, View, TouchableOpacity, TextInput, SafeAreaView, Dimensions, ScrollView, Image, FlatList, StatusBar } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useDispatch, useSelector } from 'react-redux';
import { checkAppointmentExisted, createAppointment, order } from '../../../redux/actions/updateAction'
import { formatDate, formatISODateToServerDate, formatMilisecondsToTime } from '../../../utils/CalendarUtil'
import { format } from 'date-fns';
import DateTimePicker from '@react-native-community/datetimepicker';
import BaseDialog from '../../../component/BaseDialog'
import colors from '../../../configs/colors/colors'
import stylesBase from '../../../configs/styles/styles'

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default PaymentAppointmentScreen = () => {
    // Hooks and State
    const route = useRoute();
    const { dataCalculateFee, selectedNote, formattedSelectedDate } = route.params;
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const [isDialogVisible, setDialogVisible] = useState(false);

    // Redux Selectors
    const itemAppointmentService = useSelector((state) => state.itemAppointmentServiceReducer.selectedItemAppointmentService)
    const itemPatientRecord = useSelector((state) => state.itemPatientRecordReducer.selectedItemPatientRecord)
    const itemSite = useSelector((state) => state.itemSiteReducer.selectedItemSite)
    const itemDoctor = useSelector((state) => state.itemDoctorReducer.selectedItemDoctor)
    const itemDoctorTimeTable = useSelector((state) => state.itemDoctorTimeTableReducer.selectedItemDoctorTimeTable)

    useEffect(() => {
        console.log("Create PaymentAppointmentScreen")

        return () => {
            console.log("Destroy PaymentAppointmentScreen")
        }
    }, [])

    const inputDoctorTimeTable = itemDoctorTimeTable.period_start_time
    const formattedDoctorTimeTable = format(new Date(inputDoctorTimeTable), "HH:mm - E, dd/MM/yyyy");

    let formattedAmountActualFee = '0đ';
    let formattedAmountTotalFee = '0đ';
    let formattedAmountDiscount = '0đ';
    let formattedAmountOtherFee = '0đ';

    if (dataCalculateFee) {
        formattedAmountActualFee = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(dataCalculateFee.actual_fee);
        formattedAmountTotalFee = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(dataCalculateFee.total_fee);
        formattedAmountDiscount = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(dataCalculateFee.discount);
        formattedAmountOtherFee = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(dataCalculateFee.other_fee);
    }

    const showDialog = () => {
        setDialogVisible(true);
    };

    const closeDialog = () => {
        setDialogVisible(false);
    };

    const isVietnam = itemPatientRecord === null || itemPatientRecord.patient_record.patient_ethic !== "55";

    const handlePaymentMethod = async () => {
        checkAppointmentExisted(itemPatientRecord.patient_record, itemSite, itemAppointmentService, itemDoctor, formattedSelectedDate, selectedNote.trim(), itemDoctorTimeTable, null, null)
            .then(async (response) => {
                if (response !== null) {
                    console.log("==> Không có lịch khám nào");
                    createAppointment(itemPatientRecord.patient_record, itemSite, itemAppointmentService, itemDoctor, formattedSelectedDate, selectedNote.trim(), itemDoctorTimeTable, null, null)
                        .then(async (response) => {
                            if (response !== null) {
                                const formattedDate = formatDate(response.appointment_date);
                                order(itemPatientRecord.patient_record, itemSite, itemAppointmentService, response.key, dataCalculateFee, formattedDate, isVietnam)
                                    .then(async (response) => {
                                        if (response !== null) {
                                            console.log("==> order thành công");
                                        }
                                    })
                                    .catch((error) => {
                                        console.log('==> Error order:', error);
                                    });
                            }
                        })
                        .catch((error) => {
                            console.log('==> Error createAppointment:', error);
                        });
                }
            })
            .catch((error) => {
                showDialog();
            });
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.sBackground }}>
            <StatusBar barStyle="dark-content" backgroundColor={colors.white} />
            {/* TaskBar */}
            <View style={{ width: '100%', height: '6%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: colors.white }}>
                <TouchableOpacity
                    style={{ height: '100%', aspectRatio: 1.5, alignItems: 'center', flexDirection: 'row', marginStart: 12 }}
                    onPress={() => {
                        navigation.pop(1)
                    }}>
                    <Image
                        style={{ width: 24, height: 24, }}
                        source={require('../../../images/ic_back.png')} resizeMode="stretch" />
                </TouchableOpacity>

                <Text style={[stylesBase.H5Strong, { color: colors.ink500 }]}>Kiểm tra</Text>

                <TouchableOpacity
                    style={{ height: '100%', aspectRatio: 1.5, alignItems: 'center', flexDirection: 'row', justifyContent: 'flex-end', marginEnd: 12 }}>
                    <Image
                        style={{ width: 24, height: 24 }}
                        source={require('../../../images/ic_sos.png')} resizeMode="stretch" />
                </TouchableOpacity>
            </View>

            <ScrollView>
                {/* Thông tin khách hàng */}
                <View style={{ backgroundColor: colors.white, margin: 16, padding: 12, borderRadius: 8, shadowColor: 'rgba(228, 233, 242, 0.30)', shadowOpacity: 0.25, }}>
                    <View style={{ flex: 1 }}>
                        <Text style={[stylesBase.H5Strong, { color: colors.ink500 }]}>Thông tin khách hàng</Text>
                        <View style={{ width: '100%', height: 1, backgroundColor: colors.sLine, marginTop: 12 }} />
                        <View style={{ flexDirection: 'row', marginTop: 12 }}>
                            <Text style={[stylesBase.P1, { color: colors.ink400 }]}>Họ và tên</Text>
                            <View style={{ flex: 1, alignItems: 'flex-end', marginLeft: 12 }}>
                                <Text numberOfLines={1} ellipsizeMode="tail" style={[stylesBase.P1Strong, { color: colors.ink500 }]}>{itemPatientRecord.patient_record.patient_name}</Text>
                            </View>
                        </View>
                        <View style={{ flexDirection: 'row', marginTop: 12 }}>
                            <Text style={[stylesBase.P1, { color: colors.ink400 }]}>Số điện thoại</Text>
                            <View style={{ flex: 1, alignItems: 'flex-end', marginLeft: 12 }}>
                                <Text numberOfLines={1} ellipsizeMode="tail" style={[stylesBase.P1Strong, { color: colors.ink500 }]}>{itemPatientRecord.patient_record.patient_phone_number}</Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Chi tiết */}
                <View style={{ backgroundColor: colors.white, marginStart: 16, marginEnd: 16, padding: 12, borderRadius: 8, shadowColor: 'rgba(228, 233, 242, 0.30)', shadowOpacity: 0.25, }}>
                    <View style={{ flex: 1 }}>
                        <Text style={[stylesBase.H5Strong, { color: colors.ink500 }]}>Chi tiết</Text>
                        <View style={{ width: '100%', height: 1, backgroundColor: colors.sLine, marginTop: 12 }} />
                        <View style={{ flexDirection: 'row', marginTop: 12 }}>
                            <Text style={[stylesBase.P1, { color: colors.ink400 }]}>Bác sĩ</Text>
                            <View style={{ flex: 1, alignItems: 'flex-end', marginLeft: 12 }}>
                                <Text numberOfLines={1} ellipsizeMode="tail" style={[stylesBase.P1Strong, { color: colors.ink500 }]}>{itemDoctor.doctor_name}</Text>
                            </View>
                        </View>
                        <View style={{ flexDirection: 'row', marginTop: 12 }}>
                            <Text style={[stylesBase.P1, { color: colors.ink400 }]}>Dịch vụ</Text>
                            <View style={{ flex: 1, alignItems: 'flex-end', marginLeft: 12 }}>
                                <Text numberOfLines={1} ellipsizeMode="tail" style={[stylesBase.P1Strong, { color: colors.ink500 }]}>{itemAppointmentService.name}</Text>
                            </View>
                        </View>
                        <View style={{ flexDirection: 'row', marginTop: 12 }}>
                            <Text style={[stylesBase.P1, { color: colors.ink400 }]}>Thời gian</Text>
                            <View style={{ flex: 1, alignItems: 'flex-end', marginLeft: 12 }}>
                                <Text numberOfLines={1} ellipsizeMode="tail" style={[stylesBase.P1Strong, { color: colors.ink500 }]}>{formattedDoctorTimeTable}</Text>
                            </View>
                        </View>
                        <View style={{ flexDirection: 'row', marginTop: 12 }}>
                            <Text style={[stylesBase.P1, { color: colors.ink400 }]}>Phí tư vấn</Text>
                            <View style={{ flex: 1, alignItems: 'flex-end', marginLeft: 12 }}>
                                <Text numberOfLines={1} ellipsizeMode="tail" style={[stylesBase.H5Strong, { color: colors.primary }]}>{formattedAmountTotalFee}</Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Triệu chứng */}
                <View style={{ backgroundColor: colors.white, margin: 16, padding: 12, borderRadius: 8, shadowColor: 'rgba(228, 233, 242, 0.30)', shadowOpacity: 0.25, }}>
                    <View style={{ flex: 1 }}>
                        <Text style={[stylesBase.H5Strong, { color: colors.ink500 }]}>Triệu chứng</Text>
                        <View style={{ width: '100%', height: 1, backgroundColor: colors.sLine, marginTop: 12 }} />
                        <Text numberOfLines={3} ellipsizeMode="tail" style={[stylesBase.P1Strong, { color: colors.ink500 }]}>{selectedNote}</Text>
                    </View>
                </View>

                {/* Phương thức thanh toán */}
                <View style={{ backgroundColor: colors.white, marginStart: 16, marginEnd: 16, padding: 12, borderRadius: 8, borderWidth: 1, borderColor: colors.red500, shadowColor: 'rgba(228, 233, 242, 0.30)', shadowOpacity: 0.25, }}>
                    <View style={{ flex: 1 }}>
                        <Text style={[stylesBase.H5Strong, { color: colors.ink500 }]}>Phương thức thanh toán</Text>
                        <View style={{ width: '100%', height: 1, backgroundColor: colors.sLine, marginTop: 12 }} />
                        <TouchableOpacity style={{ flexDirection: 'row', marginTop: 12 }}>
                            <Image
                                style={{ width: 28, height: 28 }}
                                source={require('../../../images/ic_momo_payment.png')} resizeMode="stretch" />
                            <Text style={[stylesBase.P1Strong, { color: colors.ink500, marginStart: 12 }]}>Thanh toán qua MoMo</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Số tiền giao dịch */}
                <View style={{ backgroundColor: colors.white, margin: 16, padding: 12, borderRadius: 8, shadowColor: 'rgba(228, 233, 242, 0.30)', shadowOpacity: 0.25, }}>
                    <View style={{ flex: 1 }}>
                        <Text style={[stylesBase.H5Strong, { color: colors.ink500 }]}>Số tiền giao dịch</Text>
                        <View style={{ width: '100%', height: 1, backgroundColor: colors.sLine, marginTop: 12 }} />
                        <View style={{ flexDirection: 'row', marginTop: 12 }}>
                            <Text style={[stylesBase.P1, { color: colors.ink400 }]}>Tạm tính</Text>
                            <View style={{ flex: 1, alignItems: 'flex-end', marginLeft: 12 }}>
                                <Text numberOfLines={1} ellipsizeMode="tail" style={[stylesBase.P1Strong, { color: colors.ink500 }]}>{formattedAmountTotalFee}</Text>
                            </View>
                        </View>
                        <View style={{ flexDirection: 'row', marginTop: 12 }}>
                            <Text style={[stylesBase.P1, { color: colors.ink400 }]}>Khuyến mại</Text>
                            <View style={{ flex: 1, alignItems: 'flex-end', marginLeft: 12 }}>
                                <Text numberOfLines={1} ellipsizeMode="tail" style={[stylesBase.P1Strong, { color: colors.ink500 }]}>{formattedAmountDiscount}</Text>
                            </View>
                        </View>
                        <View style={{ flexDirection: 'row', marginTop: 12 }}>
                            <Text style={[stylesBase.P1, { color: colors.ink400 }]}>Phí giao dịch</Text>
                            <View style={{ flex: 1, alignItems: 'flex-end', marginLeft: 12 }}>
                                <Text numberOfLines={1} ellipsizeMode="tail" style={[stylesBase.P1Strong, { color: colors.ink500 }]}>{formattedAmountOtherFee}</Text>
                            </View>
                        </View>
                        <View style={{ width: '100%', height: 1, backgroundColor: colors.sLine, marginTop: 12 }} />
                        <View style={{ flexDirection: 'row', marginTop: 12 }}>
                            <Text style={[stylesBase.P1, { color: colors.ink500 }]}>Tổng tiền</Text>
                            <View style={{ flex: 1, alignItems: 'flex-end', marginLeft: 12 }}>
                                <Text numberOfLines={1} ellipsizeMode="tail" style={[stylesBase.H5Strong, { color: colors.primary }]}>{formattedAmountActualFee}</Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Điều khoản và chính sách */}
                <View style={{ backgroundColor: colors.white, marginStart: 16, marginEnd: 16, marginBottom: 20, padding: 12, borderRadius: 8, shadowColor: 'rgba(228, 233, 242, 0.30)', shadowOpacity: 0.25, }}>
                    <View style={{ flex: 1, flexDirection: 'row' }}>
                        <Image
                            style={{ width: 28, height: 28 }}
                            source={require('../../../images/ic_default_record.png')} resizeMode="stretch" />
                        <View style={{ flex: 1, marginStart: 12 }}>
                            <Text style={[stylesBase.P2Strong, { color: colors.ink500 }]}>Tôi đã đọc và đồng ý với các</Text>
                            <Text style={[stylesBase.P2Strong, { color: colors.primaryB500 }]}>Điều khoản giao dịch và chính sách của ứng dụng</Text>
                        </View>
                    </View>
                </View>
            </ScrollView>

            {/* Button Lưu lại */}
            <View style={{ flexDirection: 'row', backgroundColor: colors.white, paddingStart: 16, paddingEnd: 16, paddingTop: 8, paddingBottom: 8 }}>
                <View style={{ flex: 1 }}>
                    <Text style={[stylesBase.P1, { color: colors.ink500 }]}>Tổng tiền</Text>
                    <Text style={[stylesBase.H3Strong, { color: colors.primary }]}>{formattedAmountActualFee}</Text>
                </View>
                <TouchableOpacity
                    style={{ flex: 1, backgroundColor: colors.primary, marginStart: 12, borderRadius: 8, alignItems: 'center', justifyContent: 'center' }}
                    onPress={() => handlePaymentMethod()}>
                    <Text style={[stylesBase.H5, { color: colors.white }]}>Thanh toán</Text>
                </TouchableOpacity>
            </View>

            <BaseDialog
                visible={isDialogVisible}
                title="Thông báo"
                content="Lịch khám đã tồn tại với hồ sơ này, vui lòng hủy hoặc hoàn thành trước khi đặt lịch mới"
                confirmText="Đóng"
                onClose={closeDialog}
            />
        </SafeAreaView>
    );
}
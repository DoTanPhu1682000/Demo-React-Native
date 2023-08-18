import React, { Component, useState, useEffect, useRef } from "react";
import { StyleSheet, Text, View, TouchableOpacity, TextInput, SafeAreaView, Dimensions, ScrollView, Image, FlatList, StatusBar } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from 'react-redux';
import { getDoctorList, getDoctorListDatLich } from '../../../redux/actions/updateAction'
import { formatISODateToServerDate } from '../../../utils/CalendarUtil'
import { format } from 'date-fns';
import DateTimePicker from '@react-native-community/datetimepicker';
import colors from '../../../configs/colors/colors'
import stylesBase from '../../../configs/styles/styles'

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default BookingOfflineScreen = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const [refreshing, setRefreshing] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const [dataListDoctor, setDataListDoctor] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const doctorList = useSelector((state) => state.doctorReducer.doctorList)
    const itemAppointmentService = useSelector((state) => state.itemAppointmentServiceReducer.selectedItemAppointmentService)
    const itemPatientRecord = useSelector((state) => state.itemPatientRecordReducer.selectedItemPatientRecord)
    const itemSite = useSelector((state) => state.itemSiteReducer.selectedItemSite)

    useEffect(() => {
        console.log("Create BookingOfflineScreen")
        const unsubscribe = navigation.addListener('focus', () => {
            refreshData();
        });

        return () => {
            console.log("Destroy BookingOfflineScreen")
            unsubscribe();
        }
    }, [])

    const handleTest = async () => {
        console.log(itemPatientRecord);
        console.log(itemSite);
        console.log(itemAppointmentService);
    };

    const refreshData = async () => {
        setRefreshing(true);

        // kiểm tra xem là vi or en
        const isVietnam = itemPatientRecord === null || itemPatientRecord.patient_record.patient_ethic !== "55";
        // chuyển ngày sinh
        const formattedSelectedDate = formatISODateToServerDate(selectedDate)

        const response = await getDoctorListDatLich(false, itemSite.code, itemAppointmentService.supported_specialization, formattedSelectedDate, itemAppointmentService.code, isVietnam, 0, 50, (action) => {
            dispatch(action);
        });
        console.log("==> response:", response);
        console.log("==> response.content_page:", response.content_page);
        setDataListDoctor(response.content_page)
        setCurrentPage(0);
        setRefreshing(false);
    };

    const loadMoreData = async () => {
        if (!loadingMore && currentPage < doctorList.total_page - 1) {
            console.log("==> loadMoreData");
            setLoadingMore(true);
            const nextPage = currentPage + 1;
            const response = await getDoctorListDatLich(false, itemSite.code, itemAppointmentService.supported_specialization, formattedSelectedDate, itemAppointmentService.code, isVietnam, nextPage, 50, (action) => {
                dispatch(action);
            });
            setCurrentPage(nextPage);
            setDataList((prevDataList) => [...prevDataList, ...response.content_page]);
            console.log(" ==> dataListDoctor:", [...dataList, ...response.content_page]);
            setLoadingMore(false);
        }
    };

    const formattedDate = format(selectedDate, 'dd/MM/yyyy');

    const handleDateChange = (event, date) => {
        setShowDatePicker(false);
        if (date !== undefined) {
            setSelectedDate(date);
        }
    };

    const keyExtractor = (item, index) => `${item.id}_${index}`;

    const renderItem = ({ item }) => {
        return (
            <View style={{ backgroundColor: colors.white, marginBottom: 12 }}>
                <TouchableOpacity
                    style={{ width: 120, borderWidth: 1, borderColor: colors.primary, borderRadius: 8, alignItems: 'center', marginEnd: 12 }}>
                    <Image
                        style={{ width: 64, height: 64, marginStart: 20, marginEnd: 20, marginTop: 12 }}
                        source={require('../../../images/ic_avatar_doctor.png')}
                        resizeMode="stretch" />
                    <Text numberOfLines={1} ellipsizeMode="tail" style={[stylesBase.P2, { color: colors.ink500, marginTop: 8, marginBottom: 12 }]}>{item.doctor_name}</Text>
                </TouchableOpacity>
            </View >
        );
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.sBackground }}>
            <StatusBar barStyle="dark-content" backgroundColor={colors.white} />
            {/* TaskBar */}
            <View style={{ width: '100%', height: '6%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: colors.white }}>
                <TouchableOpacity
                    style={{ height: '100%', aspectRatio: 1.5, alignItems: 'center', flexDirection: 'row', marginStart: 12 }}
                    onPress={() => {
                        navigation.pop(4)
                    }}>
                    <Image
                        style={{ width: 24, height: 24, }}
                        source={require('../../../images/ic_back.png')} resizeMode="stretch" />
                </TouchableOpacity>

                <Text style={[stylesBase.H5Strong, { color: colors.ink500 }]}>Đặt lịch tư vấn</Text>

                <TouchableOpacity
                    onPress={() => handleTest()}
                    style={{ height: '100%', aspectRatio: 1.5, alignItems: 'center', flexDirection: 'row', justifyContent: 'flex-end', marginEnd: 12 }}>
                    <Image
                        style={{ width: 24, height: 24 }}
                        source={require('../../../images/ic_sos.png')} resizeMode="stretch" />
                </TouchableOpacity>
            </View>

            <ScrollView>
                {/* Hồ sơ */}
                <View style={{ backgroundColor: colors.white, marginTop: 8 }}>
                    <View style={{ margin: 16 }}>
                        <View style={{ flexDirection: 'row', justifyContent: "space-between", alignItems: 'center' }}>
                            <Text style={[stylesBase.H4Strong, { color: colors.ink500 }]}>Hồ sơ</Text>
                            <TouchableOpacity>
                                <Text style={[stylesBase.P1, { color: colors.primaryB500 }]}>Thay hồ sơ</Text>
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity style={{ flexDirection: 'row', marginTop: 12 }}>
                            <Image
                                style={{ width: 28, height: 28 }}
                                source={require('../../../images/ic_user_booking.png')} resizeMode="stretch" />
                            <View style={{ marginStart: 12 }}>
                                <Text style={[stylesBase.H5Strong, { color: colors.ink500 }]}>Đỗ Tấn Phú</Text>
                                <View style={{ flexDirection: 'row' }}>
                                    <Text style={[stylesBase.P1, { color: colors.ink400 }]}>Nam</Text>
                                    <Text style={[stylesBase.P1, { color: colors.ink400 }]}> - </Text>
                                    <Text style={[stylesBase.P1, { color: colors.ink400 }]}>16/08/2000</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Thẻ bảo hiểm y tế */}
                <View style={{ backgroundColor: colors.white, marginTop: 12 }}>
                    <View style={{ margin: 16 }}>
                        <View style={{ flexDirection: 'row', justifyContent: "space-between", alignItems: 'center' }}>
                            <Text style={[stylesBase.H4Strong, { color: colors.ink500 }]}>Thẻ bảo hiểm y tế</Text>
                        </View>
                        <TouchableOpacity style={{ flexDirection: 'row', marginTop: 12 }}>
                            <Image
                                style={{ width: 28, height: 28 }}
                                source={require('../../../images/ic_bhyt.png')} resizeMode="stretch" />
                            <View style={{ marginStart: 12 }}>
                                <Text style={[stylesBase.H5Strong, { color: colors.ink500 }]}>Nhập thẻ bảo hiểm y tế</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Cơ sở y tế */}
                <View style={{ backgroundColor: colors.white, marginTop: 12 }}>
                    <View style={{ margin: 16 }}>
                        <View style={{ flexDirection: 'row', justifyContent: "space-between", alignItems: 'center' }}>
                            <Text style={[stylesBase.H4Strong, { color: colors.ink500 }]}>Cơ sở y tế</Text>
                            <TouchableOpacity>
                                <Text style={[stylesBase.P1, { color: colors.primaryB500 }]}>Thay đổi</Text>
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity style={{ flexDirection: 'row', marginTop: 12 }}>
                            <Image
                                style={{ width: 28, height: 28 }}
                                source={require('../../../images/ic_location_csyt.png')} resizeMode="stretch" />
                            <View style={{ marginStart: 12 }}>
                                <Text numberOfLines={1} style={[stylesBase.H5Strong, { color: colors.ink500 }]}>PK Đa khoa Dr.Binh</Text>
                                <Text numberOfLines={2} style={[stylesBase.P1, { color: colors.ink400 }]}>11,13,15 Trần Xuân Soạn, Hai Bà Trưng, Thanh Nhàn, Hà Nội</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Dịch vụ */}
                <View style={{ backgroundColor: colors.white, marginTop: 12 }}>
                    <View style={{ margin: 16 }}>
                        <View style={{ flexDirection: 'row', justifyContent: "space-between", alignItems: 'center' }}>
                            <Text style={[stylesBase.H4Strong, { color: colors.ink500 }]}>Dịch vụ</Text>
                            <TouchableOpacity>
                                <Text style={[stylesBase.P1, { color: colors.primaryB500 }]}>Thay đổi</Text>
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity style={{ flexDirection: 'row', marginTop: 12 }}>
                            <Image
                                style={{ width: 28, height: 28 }}
                                source={require('../../../images/ic_handle_heart.png')} resizeMode="stretch" />
                            <View style={{ marginStart: 12 }}>
                                <Text numberOfLines={1} style={[stylesBase.H5Strong, { color: colors.ink500 }]}>Tư vấn sức khỏe chung</Text>
                                <Text numberOfLines={2} style={[stylesBase.P1, { color: colors.ink400 }]}>Tư vấn sức khỏe tổng quan cùng Bác sĩ - Chuyên viên nội tiết tổng quát qua Video Call</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Chọn ngày thực hiện dịch vụ */}
                <View style={{ backgroundColor: colors.white, marginTop: 12 }}>
                    <View style={{ margin: 16 }}>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={[stylesBase.H4Strong, { color: colors.ink500 }]}>Chọn ngày thực hiện dịch vụ</Text>
                        </View>
                        <TouchableOpacity
                            style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderRadius: 8, borderWidth: 1, borderColor: colors.sLine, marginTop: 16, paddingBottom: 16, paddingTop: 16, paddingStart: 16, paddingEnd: 8 }}
                            onPress={() => setShowDatePicker(true)}>
                            <Text style={[stylesBase.H5Strong, { color: colors.ink500 }]}>{formattedDate}</Text>
                            <Image
                                style={{ width: 24, height: 24, }}
                                source={require('../../../images/ic_calendar.png')} resizeMode="stretch" />
                        </TouchableOpacity>
                        {showDatePicker && (
                            <DateTimePicker
                                value={selectedDate}
                                mode="date"
                                maximumDate={new Date()}
                                display="default"
                                onChange={handleDateChange} />
                        )}
                    </View>
                </View>

                {/* Doctor */}
                <View style={{ flex: 1, marginTop: 12, backgroundColor: colors.white }}>
                    <View style={{ flexDirection: 'row', justifyContent: "space-between", margin: 16, alignItems: 'center' }}>
                        <Text numberOfLines={1} style={[stylesBase.H4Strong, { color: colors.ink500 }]}>Bác sĩ</Text>
                        <View style={{ flex: 1, marginLeft: 8, alignItems: 'flex-end' }}>
                            <Text numberOfLines={1} style={[stylesBase.P1, { color: colors.primary, textAlign: 'right' }]}>Bs. Nguyễn Mai Ngọc</Text>
                        </View>
                    </View>

                    <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: colors.white, }}>
                        {dataListDoctor && (
                            <FlatList
                                data={dataListDoctor}
                                horizontal
                                style={{ width: windowWidth - 32 }}
                                renderItem={renderItem}
                                keyExtractor={keyExtractor}
                                onRefresh={refreshData}
                                refreshing={refreshing}
                                onEndReached={loadMoreData}
                                onEndReachedThreshold={0.1}
                            />
                        )}
                    </View>
                </View>

                {/* Dịch vụ */}
                <View style={{ backgroundColor: colors.white, marginTop: 12 }}>
                    <View style={{ margin: 16 }}>
                        <View style={{ flexDirection: 'row', justifyContent: "space-between", alignItems: 'center' }}>
                            <Text style={[stylesBase.H4Strong, { color: colors.ink500 }]}>Dịch vụ</Text>
                            <TouchableOpacity>
                                <Text style={[stylesBase.P1, { color: colors.primaryB500 }]}>Thay đổi</Text>
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity style={{ flexDirection: 'row', marginTop: 12 }}>
                            <Image
                                style={{ width: 28, height: 28 }}
                                source={require('../../../images/ic_handle_heart.png')} resizeMode="stretch" />
                            <View style={{ marginStart: 12 }}>
                                <Text numberOfLines={1} style={[stylesBase.H5Strong, { color: colors.ink500 }]}>Tư vấn sức khỏe chung</Text>
                                <Text numberOfLines={2} style={[stylesBase.P1, { color: colors.ink400 }]}>Tư vấn sức khỏe tổng quan cùng Bác sĩ - Chuyên viên nội tiết tổng quát qua Video Call</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
}
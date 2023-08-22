import React, { Component, useState, useEffect, useRef } from "react";
import { StyleSheet, Text, View, TouchableOpacity, TextInput, SafeAreaView, Dimensions, ScrollView, Image, FlatList, StatusBar } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from 'react-redux';
import { getDoctorList, getDoctorListDatLich, getDoctorTimeTable } from '../../../redux/actions/updateAction'
import { formatISODateToServerDate } from '../../../utils/CalendarUtil'
import { format } from 'date-fns';
import DateTimePicker from '@react-native-community/datetimepicker';
import colors from '../../../configs/colors/colors'
import stylesBase from '../../../configs/styles/styles'

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default BookingOfflineScreen = () => {
    // Hooks and State
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const [dataListDoctor, setDataListDoctor] = useState([]);
    const [dataListDoctorTimeTable, setDataListDoctorTimeTable] = useState([]);
    const [selectedDoctorIndex, setSelectedDoctorIndex] = useState(null);
    const [selectedDoctorTimeTableIndex, setSelectedDoctorTimeTableIndex] = useState(null);

    // Redux Selectors
    const doctorList = useSelector((state) => state.doctorReducer.doctorList)
    const doctorTimeTable = useSelector((state) => state.doctorTimeTableReducer.doctorTimeTable)
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

        const isVietnam = itemPatientRecord === null || itemPatientRecord.patient_record.patient_ethic !== "55";
        const formattedSelectedDate = formatISODateToServerDate(selectedDate)

        const response = await getDoctorListDatLich(false, itemSite.code, itemAppointmentService.supported_specialization, formattedSelectedDate, itemAppointmentService.code, isVietnam, 0, 50, (action) => {
            dispatch(action);
        });
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
            loadDoctorListByDate(date); // Thay đổi này sẽ gọi hàm tải danh sách bác sĩ lại khi ngày thay đổi
        }
    };

    const loadDoctorListByDate = async (selectedDate) => {
        setRefreshing(true);

        const isVietnam = itemPatientRecord === null || itemPatientRecord.patient_record.patient_ethic !== "55";
        const formattedSelectedDate = formatISODateToServerDate(selectedDate);
        await console.log("==> formattedSelectedDate:", formattedSelectedDate);

        const response = await getDoctorListDatLich(false, itemSite.code, itemAppointmentService.supported_specialization, formattedSelectedDate, itemAppointmentService.code, isVietnam, 0, 50, (action) => {
            dispatch(action);
        });

        setDataListDoctor(response.content_page);
        setCurrentPage(0);
        setRefreshing(false);
    };

    const fetchDoctorTimeTable = async (doctorCode) => {
        try {
            const formattedSelectedDate = formatISODateToServerDate(selectedDate);

            const response = await getDoctorTimeTable(doctorCode, formattedSelectedDate, (action) => {
                dispatch(action);
            });
            setDataListDoctorTimeTable(response.time_table_period)
        } catch (error) {
            console.error('Error fetching doctor time table:', error);
        }
    };

    const handleItemDoctorPress = (index) => {
        setSelectedDoctorIndex(index);

        // Lấy mã bác sĩ từ dataListDoctor tương ứng với index
        const selectedDoctorCode = dataListDoctor[index]?.doctor_code;

        // Gọi hàm fetchDoctorTimeTable để cập nhật dữ liệu giờ khám mong muốn
        if (selectedDoctorCode) {
            fetchDoctorTimeTable(selectedDoctorCode);
        }
    };

    const keyExtractor = (item, index) => `${item.id}_${index}`;

    const renderItem = ({ item, index }) => {
        const isSelected = index === selectedDoctorIndex;

        return (
            <View style={{ backgroundColor: colors.white, marginBottom: 12 }}>
                <TouchableOpacity
                    style={[styles.itemContainer, isSelected && styles.selectedItem,]}
                    onPress={() => handleItemDoctorPress(index)}>
                    <Image
                        style={{ width: 64, height: 64, marginStart: 20, marginEnd: 20, marginTop: 12 }}
                        source={require('../../../images/ic_avatar_doctor.png')}
                        resizeMode="stretch" />
                    <Text numberOfLines={1} ellipsizeMode="tail" style={[stylesBase.P2, { color: colors.ink500, marginTop: 8, marginBottom: 12 }]}>{item.doctor_name}</Text>
                </TouchableOpacity>
            </View >
        );
    };

    // ------------------------------------------------------------------[ DoctorTimeTable ]--------------------------------------------------------------------------- \\
    const handleItemDoctorTimeTablePress = (item) => {
        setSelectedDoctorTimeTableIndex(item);
        console.log("==> item", item);
    };

    const keyExtractorDoctorTimeTable = (item, index) => `${item.id}_${index}`;

    const renderDoctorTimeTable = ({ item, index }) => {
        const isSelected = item === selectedDoctorTimeTableIndex;

        return (
            <View style={{ backgroundColor: colors.white, marginBottom: 12 }}>
                <TouchableOpacity
                    style={[styles.itemTimeTableContainer, isSelected && styles.selectedItemTimeTable,]}
                    onPress={() => handleItemDoctorTimeTablePress(item)}>
                    {isSelected
                        ? <Text style={[stylesBase.H5, { color: colors.white }]}>{item.period_start_time}</Text>
                        : <Text style={[stylesBase.H5, { color: colors.ink500 }]}>{item.period_start_time}</Text>}
                </TouchableOpacity>
            </View >
        );
    };
    // ---------------------------------------------------------------------------------------------------------------------------------------------------------------- \\

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
                                minimumDate={new Date()}
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

                    <TouchableOpacity
                        style={{ marginStart: 16, marginEnd: 16, marginBottom: 16, marginTop: 8, backgroundColor: colors.primary100, alignItems: 'center', borderRadius: 4, paddingTop: 8, paddingBottom: 8 }}>
                        <Text style={[stylesBase.P1, { color: colors.primary }]}>Xem tất cả</Text>
                    </TouchableOpacity>
                </View>

                {/* Giờ khám mong muốn */}
                <View style={{ backgroundColor: colors.white, marginTop: 12 }}>
                    <View style={{ margin: 16 }}>
                        <Text style={[stylesBase.H4Strong, { color: colors.ink500 }]}>Giờ khám mong muốn</Text>
                        <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: colors.white, marginTop: 16 }}>
                            {dataListDoctorTimeTable && (
                                <FlatList
                                    data={dataListDoctorTimeTable}
                                    horizontal
                                    style={{ width: windowWidth - 32 }}
                                    renderItem={renderDoctorTimeTable}
                                    keyExtractor={keyExtractorDoctorTimeTable}
                                />
                            )}
                        </View>
                    </View>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    itemContainer: {
        width: 120,
        alignItems: 'center',
        marginEnd: 12,
    },
    selectedItem: {
        borderWidth: 1,
        borderRadius: 8,
        borderColor: colors.primary,
    },
    itemTimeTableContainer: {
        paddingTop: 8,
        paddingBottom: 8,
        paddingStart: 28,
        paddingEnd: 28,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.sLine,
        borderRadius: 8,
        marginEnd: 12,
    },
    selectedItemTimeTable: {
        backgroundColor: colors.primary,
    },
});
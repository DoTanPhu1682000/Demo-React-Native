import React, { Component, useState, useEffect, useRef } from "react";
import { StyleSheet, Text, View, TouchableOpacity, TextInput, SafeAreaView, Dimensions, ScrollView, Image, FlatList, StatusBar } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from 'react-redux';
import { getDoctorListDatLich, getDoctorTimeTable, setSelectedItemDoctor, setSelectedItemDoctorTimeTable, calculateFee, checkAppointmentExisted, createAppointment, order } from '../../../redux/actions/updateAction'
import { formatDate, formatISODateToServerDate, formatMilisecondsToTime } from '../../../utils/CalendarUtil'
import { format } from 'date-fns';
import DateTimePicker from '@react-native-community/datetimepicker';
import BaseDialog from '../../../component/BaseDialog'
import ConfirmationBottomSheet from '../../../component/ConfirmationBottomSheet'
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
    const [dataCalculateFee, setDataCalculateFee] = useState();
    const [dataCreateAppointment, setDataCreateAppointment] = useState();
    const [selectedDoctorIndex, setSelectedDoctorIndex] = useState(null);
    const [selectedDoctorTimeTableIndex, setSelectedDoctorTimeTableIndex] = useState(null);
    const [selectedNote, setSelectedNote] = useState('');
    const [isDialogVisible, setDialogVisible] = useState(false);

    // Redux Selectors
    const doctorList = useSelector((state) => state.doctorReducer.doctorList)
    const itemAppointmentService = useSelector((state) => state.itemAppointmentServiceReducer.selectedItemAppointmentService)
    const itemPatientRecord = useSelector((state) => state.itemPatientRecordReducer.selectedItemPatientRecord)
    const itemSite = useSelector((state) => state.itemSiteReducer.selectedItemSite)
    const itemDoctor = useSelector((state) => state.itemDoctorReducer.selectedItemDoctor)
    const itemDoctorTimeTable = useSelector((state) => state.itemDoctorTimeTableReducer.selectedItemDoctorTimeTable)

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

    const handleTest = () => {
        console.log(itemPatientRecord.patient_record);
        console.log(itemSite);
        console.log(itemAppointmentService);
        console.log(itemDoctor);
        console.log(itemDoctorTimeTable);
    };

    const isVietnam = itemPatientRecord === null || itemPatientRecord.patient_record.patient_ethic !== "55";
    const formattedSelectedDate = formatISODateToServerDate(selectedDate)

    const refreshData = async () => {
        setRefreshing(true);

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
            setDataListDoctor((prevDataList) => [...prevDataList, ...response.content_page]);
            console.log(" ==> dataListDoctor:", [...dataList, ...response.content_page]);
            setLoadingMore(false);
        }
    };

    useEffect(() => {
        console.log("dataListDoctor has changed:", dataListDoctor);
        // Chọn bác sĩ đầu tiên
        if (dataListDoctor.length > 0) {
            handleItemDoctorPress(0, formattedSelectedDate);
        }
    }, [dataListDoctor]);

    let formattedAmount = '0đ'; // Mặc định là 0đ

    if (dataCalculateFee && dataCalculateFee.actual_fee) {
        formattedAmount = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(dataCalculateFee.actual_fee);
    }

    const handlePatienRecordChange = async () => {
        navigation.navigate('HoSoKhamScreen', { fromBookingOfflineScreen: true });
    }

    const handleSiteChange = async () => {
        navigation.navigate('SiteListScreen', { fromBookingOfflineScreen: true });
    }

    const handleAppointmentServiceChange = async () => {
        navigation.navigate('AppointmentServiceScreen', { fromBookingOfflineScreen: true });
    }

    const showDialog = () => {
        setDialogVisible(true);
    };

    const closeDialog = () => {
        setDialogVisible(false);
    };

    const handleDatLich = () => {
        // nếu như người dùng chưa chọn thời gian thì sẽ hiện lên thông báo
        if (dataCalculateFee === null) {
            console.log('==> Error: dataCalculateFee is null.');
            return;
        }

        // nếu số tiền thanh toán > 0 thì kiểm tra Hồ sơ khám có tồn lại Lịch khám nào không, nếu ok thì chuyển sang trang thanh toán
        // ngược lại: tạo lịch khám và tạo Order
        if (dataCalculateFee.actual_fee > 0) {
            checkAppointmentExisted(itemPatientRecord.patient_record, itemSite, itemAppointmentService, itemDoctor, formattedSelectedDate, selectedNote.trim(), itemDoctorTimeTable, null, null)
                .then(async (response) => {
                    if (response !== null) {
                        console.log("==> checkAppointmentExisted:", response);
                    }
                })
                .catch((error) => {
                    console.log('==> Error checkAppointmentExisted:', error);
                    showDialog();
                });
        } else {
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
    }

    // ------------------------------------------------------------------[ Date ]--------------------------------------------------------------------------- \\
    const inputPatientRecordDob = itemPatientRecord.patient_record.patient_dob
    const formattedPatientRecordDob = format(new Date(inputPatientRecordDob), 'dd/MM/yyyy');

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

        const formattedSelectedDate = formatISODateToServerDate(selectedDate);
        console.log("==> formattedSelectedDate:", formattedSelectedDate);

        const response = await getDoctorListDatLich(false, itemSite.code, itemAppointmentService.supported_specialization, formattedSelectedDate, itemAppointmentService.code, isVietnam, 0, 50, (action) => {
            dispatch(action);
        });

        setDataListDoctor(response.content_page);
        setCurrentPage(0);
        setRefreshing(false);
    };

    // ------------------------------------------------------------------[ Doctor ]------------------------------------------------------------------------- \\
    const handleItemDoctorPress = async (index, selectedDate) => {
        setSelectedDoctorIndex(index);

        // lưu bác sĩ đã chọn
        await dispatch(setSelectedItemDoctor(dataListDoctor[index]))

        // Đặt lại giá trị của dataCalculateFee thành null để xóa số tiền
        setDataCalculateFee(null);

        // Lấy mã bác sĩ từ dataListDoctor tương ứng với index
        const selectedDoctorCode = dataListDoctor[index]?.doctor_code;

        // Gọi hàm fetchDoctorTimeTable để cập nhật dữ liệu giờ khám mong muốn
        if (selectedDoctorCode) {
            fetchDoctorTimeTable(selectedDoctorCode, selectedDate);
        }
    };

    const fetchDoctorTimeTable = async (doctorCode, selectedDate) => {
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

    const keyExtractor = (item, index) => `${item.id}_${index}`;

    const renderItem = ({ item, index }) => {
        const isSelected = index === selectedDoctorIndex;

        return (
            <View style={{ backgroundColor: colors.white, marginBottom: 12 }}>
                <TouchableOpacity
                    style={[styles.itemContainer, isSelected && styles.selectedItem,]}
                    onPress={() => handleItemDoctorPress(index, selectedDate)}>
                    <Image
                        style={{ width: 64, height: 64, marginStart: 20, marginEnd: 20, marginTop: 12 }}
                        source={require('../../../images/ic_avatar_doctor.png')}
                        resizeMode="stretch" />
                    <Text numberOfLines={1} ellipsizeMode="tail" style={[stylesBase.P2, { color: colors.ink500, marginTop: 8, marginBottom: 12 }]}>{item.doctor_name}</Text>
                </TouchableOpacity>
            </View >
        );
    };

    // ------------------------------------------------------------------[ DoctorTimeTable ]---------------------------------------------------------------- \\
    const handleItemDoctorTimeTablePress = async (item) => {
        setSelectedDoctorTimeTableIndex(item);

        // lưu doctorTimeTable đã chọn
        await dispatch(setSelectedItemDoctorTimeTable(item))

        calculateFee(itemPatientRecord.patient_record, itemSite, itemAppointmentService, itemDoctor, formattedSelectedDate, selectedNote.trim(), item, null, null, isVietnam)
            .then(async (response) => {
                if (response !== null) {
                    setDataCalculateFee(response)
                }
            })
            .catch((error) => {
                console.log('==> Error calculateFee:', error);
            });
    };

    const keyExtractorDoctorTimeTable = (item, index) => `${item.id}_${index}`;

    const renderDoctorTimeTable = ({ item, index }) => {
        const isSelected = item === selectedDoctorTimeTableIndex;

        const miliseconds = item.period_start_time
        const formattedTime = formatMilisecondsToTime(miliseconds);

        return (
            <View style={{ backgroundColor: colors.white, marginBottom: 12 }}>
                <TouchableOpacity
                    style={[styles.itemTimeTableContainer, isSelected && styles.selectedItemTimeTable,]}
                    onPress={() => handleItemDoctorTimeTablePress(item)}>
                    {isSelected
                        ? <Text style={[stylesBase.H5, { color: colors.white }]}>{formattedTime}</Text>
                        : <Text style={[stylesBase.H5, { color: colors.ink500 }]}>{formattedTime}</Text>}
                </TouchableOpacity>
            </View >
        );
    };
    // ----------------------------------------------------------------------------------------------------------------------------------------------------- \\

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
                <View style={{ backgroundColor: colors.white, marginTop: 8, padding: 16 }}>
                    <View style={{ flex: 1 }}>
                        <View style={{ flexDirection: 'row', justifyContent: "space-between", alignItems: 'center' }}>
                            <Text style={[stylesBase.H4Strong, { color: colors.ink500 }]}>Hồ sơ</Text>
                            <TouchableOpacity
                                onPress={() => handlePatienRecordChange()}>
                                <Text style={[stylesBase.P1, { color: colors.primaryB500 }]}>Thay hồ sơ</Text>
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity style={{ flexDirection: 'row', marginTop: 12 }}>
                            <Image
                                style={{ width: 28, height: 28 }}
                                source={require('../../../images/ic_user_booking.png')} resizeMode="stretch" />
                            <View style={{ flex: 1, marginStart: 12 }}>
                                <Text style={[stylesBase.H5Strong, { color: colors.ink500 }]}>{itemPatientRecord.patient_record.patient_name}</Text>
                                <View style={{ flexDirection: 'row' }}>
                                    {itemPatientRecord.patient_record.patient_gender
                                        ? <Text style={[stylesBase.P1, { color: colors.ink400 }]}>Nam</Text>
                                        : <Text style={[stylesBase.P1, { color: colors.ink400 }]}>Nữ</Text>
                                    }
                                    <Text style={[stylesBase.P1, { color: colors.ink400 }]}> - </Text>
                                    <Text style={[stylesBase.P1, { color: colors.ink400 }]}>{formattedPatientRecordDob}</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Thẻ bảo hiểm y tế */}
                <View style={{ backgroundColor: colors.white, marginTop: 12, padding: 16 }}>
                    <View style={{ flex: 1 }}>
                        <View style={{ flexDirection: 'row', justifyContent: "space-between", alignItems: 'center' }}>
                            <Text style={[stylesBase.H4Strong, { color: colors.ink500 }]}>Thẻ bảo hiểm y tế</Text>
                        </View>
                        <TouchableOpacity style={{ flexDirection: 'row', marginTop: 12 }}>
                            <Image
                                style={{ width: 28, height: 28 }}
                                source={require('../../../images/ic_bhyt.png')} resizeMode="stretch" />
                            <View style={{ flex: 1, marginStart: 12 }}>
                                <Text style={[stylesBase.H5Strong, { color: colors.ink500 }]}>Nhập thẻ bảo hiểm y tế</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Cơ sở y tế */}
                <View style={{ backgroundColor: colors.white, marginTop: 12, padding: 16 }}>
                    <View style={{ flex: 1 }}>
                        <View style={{ flexDirection: 'row', justifyContent: "space-between", alignItems: 'center' }}>
                            <Text style={[stylesBase.H4Strong, { color: colors.ink500 }]}>Cơ sở y tế</Text>
                            <TouchableOpacity
                                onPress={() => handleSiteChange()}>
                                <Text style={[stylesBase.P1, { color: colors.primaryB500 }]}>Thay đổi</Text>
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity style={{ flexDirection: 'row', marginTop: 12 }}>
                            <Image
                                style={{ width: 28, height: 28 }}
                                source={require('../../../images/ic_location_csyt.png')} resizeMode="stretch" />
                            <View style={{ flex: 1, marginStart: 12 }}>
                                <Text style={[stylesBase.H5Strong, { color: colors.ink500, }]}>{itemSite.name}</Text>
                                <Text numberOfLines={2} style={[stylesBase.P1, { color: colors.ink400 }]}>{itemSite.address}</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Dịch vụ */}
                <View style={{ backgroundColor: colors.white, marginTop: 12, padding: 16 }}>
                    <View style={{ flex: 1 }}>
                        <View style={{ flexDirection: 'row', justifyContent: "space-between", alignItems: 'center' }}>
                            <Text style={[stylesBase.H4Strong, { color: colors.ink500 }]}>Dịch vụ</Text>
                            <TouchableOpacity
                                onPress={() => handleAppointmentServiceChange()}>
                                <Text style={[stylesBase.P1, { color: colors.primaryB500 }]}>Thay đổi</Text>
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity style={{ flexDirection: 'row', marginTop: 12 }}>
                            <Image
                                style={{ width: 28, height: 28 }}
                                source={require('../../../images/ic_handle_heart.png')} resizeMode="stretch" />
                            {itemAppointmentService
                                ?
                                <View style={{ flex: 1, marginStart: 12 }}>
                                    <Text style={[stylesBase.H5Strong, { color: colors.ink500 }]}>{itemAppointmentService.name}</Text>
                                    <Text numberOfLines={2} style={[stylesBase.P1, { color: colors.ink400 }]}>{itemAppointmentService.description}</Text>
                                </View>
                                :
                                <View style={{ flex: 1, marginStart: 12 }}>
                                    <Text style={[stylesBase.H5Strong, { color: colors.ink500 }]}>--</Text>
                                </View>
                            }
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Chọn ngày thực hiện dịch vụ */}
                <View style={{ backgroundColor: colors.white, marginTop: 12, padding: 16 }}>
                    <View style={{ flex: 1 }}>
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
                <View style={{ backgroundColor: colors.white, marginTop: 12, padding: 16 }}>
                    <View style={{ flex: 1 }}>
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

                {/* Khuyến mại */}
                <View style={{ backgroundColor: colors.white, marginTop: 12, padding: 16 }}>
                    <View style={{ flex: 1 }}>
                        <Text style={[stylesBase.H4Strong, { color: colors.ink500 }]}>Khuyến mại</Text>
                        <TouchableOpacity style={{ flexDirection: 'row', marginTop: 12, borderWidth: 1, borderColor: colors.sLine, borderRadius: 8, alignItems: 'center' }}>
                            <Image
                                style={{ width: 28, height: 28, marginStart: 12, marginEnd: 8, marginTop: 12, marginBottom: 12 }}
                                source={require('../../../images/ic_promo_code.png')} resizeMode="stretch" />
                            <Text numberOfLines={1} style={[stylesBase.P1Strong, { color: colors.ink500 }]}>Mã khuyến mại</Text>
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 'auto', marginEnd: 12 }}>
                                <Text numberOfLines={1} style={[stylesBase.P1, { color: colors.primaryB500, paddingVertical: 4, paddingHorizontal: 8, maxWidth: 100 }]}>HGB1254</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Triệu chứng* */}
                <View style={{ backgroundColor: colors.white, marginTop: 12, marginBottom: 20 }}>
                    <View style={{ margin: 16 }}>
                        <Text style={[stylesBase.H4Strong, { color: colors.ink500 }]}>Triệu chứng</Text>
                        <TextInput
                            style={[stylesBase.H5, { marginTop: 12, color: colors.ink500, backgroundColor: colors.ink100, borderRadius: 8, paddingVertical: 4, paddingHorizontal: 8, }]}
                            autoCapitalize='none'
                            placeholder="Nhập triệu chứng của bạn ( 1000 ký tự )"
                            placeholderTextColor={colors.ink200}
                            multiline={true}
                            maxLength={1000}
                            numberOfLines={2}
                            onChangeText={setSelectedNote}
                            value={selectedNote} />
                    </View>
                </View>
            </ScrollView>

            {/* Button Lưu lại */}
            <View style={{ flexDirection: 'row', backgroundColor: colors.white, paddingStart: 16, paddingEnd: 16, paddingTop: 8, paddingBottom: 8 }}>
                <View style={{ flex: 1 }}>
                    <Text style={[stylesBase.P1, { color: colors.ink500 }]}>Tổng tiền</Text>
                    <Text style={[stylesBase.H3Strong, { color: colors.primary }]}>{formattedAmount}</Text>
                </View>
                <TouchableOpacity
                    style={{ flex: 1, backgroundColor: colors.primary, marginStart: 12, borderRadius: 8, alignItems: 'center', justifyContent: 'center' }}
                    onPress={() => handleDatLich()}>
                    <Text style={[stylesBase.H5, { color: colors.white }]}>Đặt lịch</Text>
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
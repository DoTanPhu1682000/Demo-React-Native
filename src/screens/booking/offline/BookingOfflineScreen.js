import React, { Component, useState, useEffect, useRef } from "react";
import { StyleSheet, Text, View, TouchableOpacity, TextInput, SafeAreaView, Dimensions, ScrollView, Image, FlatList, StatusBar } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from 'react-redux';
import { getSiteList, setSelectedItemSite } from '../../../redux/actions/updateAction'
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
    const [dataList, setDataList] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const siteList = useSelector((state) => state.siteReducer.siteList)
    const itemAppointmentService = useSelector((state) => state.itemAppointmentServiceReducer.selectedItemAppointmentService)
    const itemPatientRecord = useSelector((state) => state.itemPatientRecordReducer.selectedItemPatientRecord)
    const itemSite = useSelector((state) => state.itemSiteReducer.selectedItemSite)

    useEffect(() => {
        console.log("Create BookingOfflineScreen")
        // const unsubscribe = navigation.addListener('focus', () => {
        //     refreshData();
        // });

        return () => {
            console.log("Destroy BookingOfflineScreen")
            // unsubscribe();
        }
    }, [])

    // const fetchData = async (page, searchText) => {
    //     const response = await getSiteList(-1, searchText, page, (action) => {
    //         dispatch(action);
    //     });
    //     return response.content_page;
    // };

    // const refreshData = async () => {
    //     setRefreshing(true);
    //     const newData = await fetchData(0, selectedSearch);
    //     setDataList(newData);
    //     setCurrentPage(0);
    //     setRefreshing(false);
    // };

    // const loadMoreData = async () => {
    //     if (!loadingMore && currentPage < siteList.total_page - 1) {
    //         console.log("==> loadMoreData");
    //         setLoadingMore(true);
    //         const nextPage = currentPage + 1;
    //         const newData = await fetchData(nextPage, selectedSearch);
    //         setCurrentPage(nextPage);
    //         setDataList((prevDataList) => [...prevDataList, ...newData]);
    //         console.log(" ==> dataList:", [...dataList, ...newData]);
    //         setLoadingMore(false);
    //     }
    // };

    // const keyExtractor = (item, index) => `${item.id}_${index}`;

    // const renderItem = ({ item }) => {
    //     const avatarLink = item.avatar && item.avatar.length > 0 ? item.avatar[0].link : null
    //     const defaultAvatarSource = require('../../../images/ic_hospital_location.png')
    //     // Kiểm tra xem avatarLink có giá trị hợp lệ hay không
    //     const imageSource = avatarLink ? { uri: avatarLink } : defaultAvatarSource;

    //     return (
    //         <View>
    //             <View style={{ flexDirection: 'row', marginBottom: 16, backgroundColor: colors.white, borderRadius: 8 }}>
    //                 <TouchableOpacity
    //                     style={{ flexDirection: 'row', flex: 1 }}
    //                     onPress={() => handlePressItem(item)}>
    //                     <Image
    //                         style={{ width: 64, height: 64, margin: 12, }}
    //                         source={imageSource}
    //                         resizeMode="stretch"
    //                         onError={(error) => {
    //                             // console.error('Error loading image:', error.nativeEvent.error);
    //                             // Thay thế ảnh bị lỗi bằng ảnh mặc định trong dataList
    //                             const newDataList = dataList.map(dataItem => {
    //                                 if (dataItem.id === item.id) {
    //                                     return { ...dataItem, avatar: [defaultAvatarSource] };
    //                                 }
    //                                 return dataItem;
    //                             });
    //                             setDataList(newDataList);
    //                         }}
    //                     />
    //                     <View style={{ flex: 1, width: '100%', marginTop: 12, marginBottom: 12 }}>
    //                         <Text numberOfLines={2} style={[stylesBase.H5, { color: colors.ink500, marginEnd: 12 }]}>{item.name}</Text>
    //                         <View style={{ flexDirection: 'row' }}>
    //                             <Image
    //                                 style={{ width: 16, height: 16, marginTop: 2, marginEnd: 4 }}
    //                                 source={require('../../../images/ic_pin.png')} resizeMode="stretch" />
    //                             <Text numberOfLines={2} style={[stylesBase.P1, { color: colors.ink400, flex: 1, marginEnd: 12, lineHeight: 18 }]}>{item.address}</Text>
    //                         </View>
    //                     </View>
    //                 </TouchableOpacity>
    //             </View >
    //         </View >
    //     );
    // };

    const formattedDate = format(selectedDate, 'dd/MM/yyyy');

    const handleDateChange = (event, date) => {
        setShowDatePicker(false);
        if (date !== undefined) {
            setSelectedDate(date);
        }
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

            {/* <View style={{ flex: 1, backgroundColor: colors.sBackground }}>
                <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: colors.sBackground, }}>
                    {siteList && siteList.content_page && (
                        <FlatList
                            data={dataList}
                            style={{ width: windowWidth - 32, marginTop: 16 }}
                            renderItem={renderItem}
                            keyExtractor={keyExtractor}
                            onRefresh={refreshData}
                            refreshing={refreshing}
                            onEndReached={loadMoreData}
                            onEndReachedThreshold={0.1}
                        />
                    )}
                </View>
            </View> */}
        </SafeAreaView>
    );
}
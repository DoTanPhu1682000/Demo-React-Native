import React, { Component, useState, useEffect } from "react";
import { StyleSheet, Text, View, TouchableOpacity, TextInput, SafeAreaView, Dimensions, ScrollView, Image, FlatList, StatusBar, ImageBackground } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useDispatch, useSelector } from 'react-redux';
import { getMyAppointment } from '../../redux/actions/updateAction'
import colors from '../../configs/colors/colors'
import stylesBase from '../../configs/styles/styles'

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default HenKhamScreen = () => {
    // Hooks and State
    const route = useRoute();
    const navigation = useNavigation()
    const dispatch = useDispatch()
    const [refreshing, setRefreshing] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const [dataList, setDataList] = useState([]);
    const [dataListHenKham, setDataListHenKham] = useState([]);

    useEffect(() => {
        console.log("Create HenKhamScreen")
        const unsubscribe = navigation.addListener('focus', () => {
            refreshData();
        });

        return () => {
            console.log("Destroy HenKhamScreen")
            unsubscribe();
        }
    }, [])

    const refreshData = async () => {
        setRefreshing(true);
        getMyAppointment(0)
            .then(async (response) => {
                if (response !== null) {
                    setDataList(response.content_page);
                    setDataListHenKham(response)
                }
            })
        setCurrentPage(0);
        setRefreshing(false);
    };

    const loadMoreData = async () => {
        if (!loadingMore && currentPage < dataListHenKham.total_page - 1) {
            console.log("==> loadMoreData");
            setLoadingMore(true);
            const nextPage = currentPage + 1;
            getMyAppointment(nextPage)
                .then(async (response) => {
                    if (response !== null) {
                        setDataList((prevDataList) => [...prevDataList, ...response.content_page]);
                        console.log(" ==> dataList:", [...dataList, ...response.content_page]);
                    }
                })
            setCurrentPage(nextPage);
            setLoadingMore(false);
        }
    };

    const handleOpenDetail = async (item) => {
        navigation.navigate('HenKhamDetailScreen', { item: item });
    }

    // ------------------------------------------------------------------[ HenKham ]------------------------------------------------------------------- \\
    const keyExtractor = (item, index) => `${item.id}_${index}`;

    const renderItem = ({ item }) => {
        const unpaid = !item.payment_status && item.status === "PENDING"
        const timestamp = item.time_table_period.period_start_time
        const date = new Date(timestamp);

        // Định dạng thời gian
        const options = {
            hour: 'numeric',
            minute: 'numeric',
            weekday: 'short', // Ngày trong tuần (Ví dụ: Mon)
            day: '2-digit',   // Ngày trong tháng (Ví dụ: 09)
            month: '2-digit', // Tháng (Ví dụ: 08)
            year: 'numeric',  // Năm (Ví dụ: 2023)
        };

        const formattedDate = new Intl.DateTimeFormat('vi-VN', options).format(date);

        let statusStyle;
        let textStyle;

        switch (item.status) {
            case 'PENDING':
                statusStyle = styles.pending;
                textStyle = styles.textPending;
                break;
            case 'IN_PROGRESS':
                statusStyle = styles.inProgress;
                textStyle = styles.textInProgress;
                break;
            case 'COMPLETED':
                statusStyle = styles.completed;
                textStyle = styles.textCompleted;
                break;
            case 'CANCELLED':
                statusStyle = styles.cancelled;
                textStyle = styles.textCancelled;
                break;
            default:
                statusStyle = styles.default;
                break;
        }

        return (
            <View>
                <TouchableOpacity
                    style={{ backgroundColor: colors.white, borderRadius: 8, padding: 12, marginBottom: 16, alignItems: 'center', justifyContent: 'space-between' }}
                    onPress={() => handleOpenDetail(item)}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                        <Image
                            style={{ width: 20, height: 20 }}
                            source={require('../../images/ic_qr_lich_hen.png')} resizeMode="stretch" />
                        <View style={{ flex: 1 }}>
                            <Text numberOfLines={1} ellipsizeMode="tail" style={[stylesBase.H5Strong, { color: colors.ink500, marginStart: 8, marginEnd: 8 }]}>{item.patient_record.patient_name}</Text>
                        </View>
                        <View style={[styles.card, statusStyle]}>
                            <Text style={[stylesBase.P2Strong, textStyle]}>
                                {item.status === 'PENDING' ? 'Chờ khám' : item.status === 'IN_PROGRESS' ? 'Đang khám' : item.status === 'COMPLETED' ? 'Hoàn thành' : 'Đã hủy'}
                            </Text>
                        </View>
                    </View>
                    <View style={{ width: '100%', height: 1, backgroundColor: colors.sLine, marginTop: 12, marginBottom: 12 }}></View>
                    {unpaid ?
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Image
                                style={{ width: 20, height: 20 }}
                                source={require('../../images//ic_slash_circle_red.png')} resizeMode="stretch" />
                            <View style={{ flex: 1 }}>
                                <Text numberOfLines={1} ellipsizeMode="tail"
                                    style={[stylesBase.P1, { color: colors.red500, marginStart: 8, marginEnd: 8 }]}>Chờ thanh toán</Text>
                            </View>
                        </View>
                        :
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Image
                                style={{ width: 20, height: 20 }}
                                source={require('../../images/ic_hospital_lich_hen.png')} resizeMode="stretch" />
                            <View style={{ flex: 1 }}>
                                <Text numberOfLines={1} ellipsizeMode="tail"
                                    style={[stylesBase.P1, { color: colors.ink400, marginStart: 8, marginEnd: 8 }]}>{item.site_name}</Text>
                            </View>
                        </View>
                    }
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 12 }}>
                        <Image
                            style={{ width: 20, height: 20 }}
                            source={require('../../images/ic_calendar.png')} resizeMode="stretch" />
                        <View style={{ flex: 1 }}>
                            <Text numberOfLines={1} ellipsizeMode="tail"
                                style={[stylesBase.P1, { color: colors.ink400, marginStart: 8, marginEnd: 8 }]}>{formattedDate}</Text>
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 12 }}>
                        <Image
                            style={{ width: 20, height: 20 }}
                            source={require('../../images/ic_doctor_lich_hen.png')} resizeMode="stretch" />
                        <View style={{ flex: 1 }}>
                            <Text numberOfLines={1} ellipsizeMode="tail"
                                style={[stylesBase.P1, { color: colors.ink400, marginStart: 8, marginEnd: 8 }]}>{item.doctor.doctor_name}</Text>
                        </View>
                    </View>
                </TouchableOpacity>
            </View>
        );
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.sBackground }}>
            <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
            {/* TaskBar */}
            <View style={{ width: '100%', height: '6%', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: colors.primary, paddingStart: 16, paddingEnd: 16, paddingTop: 8, paddingBottom: 8 }}>
                <Text style={[stylesBase.H5Strong, { color: colors.white }]}>Lịch hẹn tư vấn</Text>
                <View
                    style={{
                        position: "absolute", right: 0, flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.20)', borderRadius: 14,
                        paddingStart: 10, paddingEnd: 10, paddingTop: 5, paddingBottom: 5, marginEnd: 16
                    }}>
                    <TouchableOpacity>
                        <Image
                            style={{ width: 16, height: 16, tintColor: colors.white }}
                            source={require('../../images/ic_more_horizontal.png')} resizeMode="stretch" />
                    </TouchableOpacity>

                    <View style={{ width: 1, height: 16, backgroundColor: colors.white, marginStart: 10, marginEnd: 10 }} />

                    <TouchableOpacity>
                        <Image
                            style={{ width: 16, height: 16, }}
                            source={require('../../images/ic_close_momo.png')} resizeMode="stretch" />
                    </TouchableOpacity>
                </View>
            </View>

            <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: colors.sBackground }}>
                {dataList && (
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
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    card: {
        width: 90, alignItems: 'center', borderRadius: 20, paddingStart: 8, paddingEnd: 8, backgroundColor: colors.primaryB100
    },
    pending: {
        backgroundColor: colors.green100,
    },
    inProgress: {
        backgroundColor: colors.primary100,
    },
    completed: {
        backgroundColor: colors.ink100,
    },
    cancelled: {
        backgroundColor: colors.red100,
    },
    textPending: {
        color: "#388E3C"
    },
    textInProgress: {
        color: "#FFA000"
    },
    textCompleted: {
        color: "#616161"
    },
    textCancelled: {
        color: "#D32F2F"
    },
    default: {
        backgroundColor: colors.primaryB500,
    },
});
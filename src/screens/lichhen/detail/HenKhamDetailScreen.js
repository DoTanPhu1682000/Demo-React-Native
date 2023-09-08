import React, { Component, useState, useEffect } from "react";
import { StyleSheet, Text, View, TouchableOpacity, TextInput, SafeAreaView, Dimensions, ScrollView, Image, FlatList, StatusBar, ActivityIndicator } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useDispatch, useSelector } from 'react-redux';
import { getAppointment, getAppointmentRating, createAppointmentRating } from '../../../redux/actions/updateAction'
import { formatDate } from '../../../utils/CalendarUtil'
import BaseDialog from '../../../component/BaseDialog'
import colors from '../../../configs/colors/colors'
import stylesBase from '../../../configs/styles/styles'

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default HenKhamDetailScreen = ({ route }) => {
    // Hooks and State
    const { item } = route.params;
    const navigation = useNavigation()
    const dispatch = useDispatch()
    const [isLoading, setIsLoading] = useState(true);
    const [dataListHenKham, setDataListHenKham] = useState([]);
    const [selectedRating, setSelectedRating] = useState();
    const [isVisibleSend, setIsVisibleSend] = useState(true);
    const [isVisibleRating, setIsVisibleRating] = useState(false);
    const [selectedNote, setSelectedNote] = useState("");
    const [isDialogVisible, setDialogVisible] = useState(false);

    useEffect(() => {
        console.log("Create HenKhamDetailScreen")

        getAppointment(item.id)
            .then(async (response) => {
                if (response !== null) {
                    setDataListHenKham(response);
                    setIsLoading(false);

                    // Chỉ hiển thị Rating khi đã Hoàn thành
                    if (response.status === "COMPLETED") {
                        getAppointmentRating(response.id)
                            .then(async (responseAppointmentRating) => {
                                // Điều kiện hiển thị Đánh giá: Không quá 2 ngày sau khi khám, chưa từng đánh giá trước đó
                                let isReviewExpired = true;
                                if (response !== null && response.appointment_date) {
                                    const timeNow = new Date().getTime();
                                    const timeSet = new Date(response.appointment_date).getTime();

                                    // Tính số ngày từ ngày hẹn khám đến ngày hiện tại
                                    // Nếu số ngày nhỏ hơn 2 thì hiển thị Đánh giá
                                    const day = (timeNow - timeSet) / (24 * 60 * 60 * 1000);

                                    isReviewExpired = day < 0 || day > 2;
                                }

                                // Quá hạn và chưa đánh giá (lớn hơn 2 ngày)
                                if (isReviewExpired && responseAppointmentRating.point === 0) {
                                    setIsVisibleRating(false) //ẩn button đánh giá
                                    setIsVisibleSend(false) //ẩn bSend
                                    return
                                }

                                // Trong thời hạn và nhỏ hơn 2 này
                                if (responseAppointmentRating.point > 0) { // Đã đánh giá rồi (và nhỏ hơn 2 ngày)
                                    setIsVisibleRating(false)
                                    setIsVisibleSend(false)
                                } else { // Chưa đánh giá (và nhỏ hơn 2 ngày)
                                    setIsVisibleRating(true)
                                    setIsVisibleSend(false)
                                }
                            })
                        setIsLoading(false); // Dữ liệu đã tải xong
                    }
                }
            })

        return () => {
            console.log("Destroy HenKhamDetailScreen")
        }
    }, [])

    const handleRating = (value) => {
        setSelectedRating(value);
    };

    const handleSendRating = () => {
        createAppointmentRating(item.id, selectedRating, selectedNote.trim())
            .then(async (response) => {
                if (response !== null) {
                    showDialog();
                }
            })
    };

    const showDialog = () => {
        setDialogVisible(true);
        setIsVisibleRating(false)
    };

    const closeDialog = () => {
        setDialogVisible(false);
    };

    const unpaid = !dataListHenKham.payment_status && dataListHenKham.status === "PENDING"

    const formattedDOB = formatDate(item.patient_record.patient_dob);

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
                <Text style={[stylesBase.H5Strong, { color: colors.white }]}>Chi tiết lịch hẹn</Text>
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

            {isLoading ? ( // Nếu đang tải dữ liệu
                <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
                    {/* Hiển thị vòng tròn tải dữ liệu ở đây */}
                    <ActivityIndicator size="large" color={colors.primary} />
                </View>
            ) : ( // Nếu dữ liệu đã tải xong
                <View style={{ flex: 1 }}>
                    <View style={{ flex: 1, alignItems: "center", backgroundColor: colors.sBackground }}>
                        <ScrollView>
                            {/* PatienRecord */}
                            <View style={{ flexDirection: 'row', width: windowWidth - 32, marginTop: 16, marginBottom: 16, borderRadius: 8, padding: 12, backgroundColor: colors.white }}>
                                <Image
                                    style={{ width: 60, height: 60 }}
                                    source={require('../../../images/img_user.png')} resizeMode="stretch" />
                                <View style={{ justifyContent: 'center', marginStart: 12 }}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <Text style={[stylesBase.H5Strong, { color: colors.ink500 }]}>{item.patient_record.patient_name}</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row' }}>
                                        {item.patient_record.patient_gender === true
                                            ? (<Text style={[stylesBase.P1, { color: colors.ink400 }]}>Nam - </Text>)
                                            : (<Text style={[stylesBase.P1, { color: colors.ink400 }]}>Nữ - </Text>)}
                                        <Text style={[stylesBase.P1, { color: colors.ink400 }]}>{formattedDOB}</Text>
                                    </View>
                                </View>
                            </View>

                            {/* HenKhamDetail */}
                            <View style={{ width: windowWidth - 32, backgroundColor: colors.white, borderRadius: 8, padding: 12, marginBottom: 16, alignItems: 'center' }}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <Image
                                            style={{ width: 20, height: 20 }}
                                            source={require('../../../images/ic_qr_lich_hen.png')} resizeMode="stretch" />
                                        <Text style={[stylesBase.H5Strong, { color: colors.ink500, marginStart: 8, marginEnd: 8 }]}>Chi tiết lịch hẹn</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row-reverse', alignItems: 'center' }}>
                                        <View style={[styles.card, statusStyle]}>
                                            <Text style={[stylesBase.P2Strong, textStyle]}>
                                                {item.status === 'PENDING' ? 'Chờ khám' : item.status === 'IN_PROGRESS' ? 'Đang khám' : item.status === 'COMPLETED' ? 'Hoàn thành' : 'Đã hủy'}
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                                <View style={{ width: '100%', height: 1, backgroundColor: colors.sLine, marginTop: 12, marginBottom: 12 }}></View>
                                {unpaid ?
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <Image
                                            style={{ width: 20, height: 20 }}
                                            source={require('../../../images//ic_slash_circle_red.png')} resizeMode="stretch" />
                                        <View style={{ flex: 1 }}>
                                            <Text numberOfLines={1} ellipsizeMode="tail"
                                                style={[stylesBase.P1, { color: colors.red500, marginStart: 8, marginEnd: 8 }]}>Chờ thanh toán</Text>
                                        </View>
                                    </View>
                                    :
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <Image
                                            style={{ width: 20, height: 20 }}
                                            source={require('../../../images/ic_hospital_lich_hen.png')} resizeMode="stretch" />
                                        <View style={{ flex: 1 }}>
                                            <Text numberOfLines={1} ellipsizeMode="tail"
                                                style={[stylesBase.P1, { color: colors.ink400, marginStart: 8, marginEnd: 8 }]}>{item.site_name}</Text>
                                        </View>
                                    </View>
                                }
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 12 }}>
                                    <Image
                                        style={{ width: 20, height: 20 }}
                                        source={require('../../../images/ic_calendar.png')} resizeMode="stretch" />
                                    <View style={{ flex: 1 }}>
                                        <Text numberOfLines={1} ellipsizeMode="tail"
                                            style={[stylesBase.P1, { color: colors.ink400, marginStart: 8, marginEnd: 8 }]}>{formattedDate}</Text>
                                    </View>
                                </View>
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 12 }}>
                                    <Image
                                        style={{ width: 20, height: 20 }}
                                        source={require('../../../images/ic_shopping_bag.png')} resizeMode="stretch" />
                                    <View style={{ flex: 1 }}>
                                        {item.appointment_used_services[0] ? (
                                            <Text
                                                numberOfLines={1} ellipsizeMode="tail"
                                                style={[stylesBase.P1, { color: colors.ink400, marginStart: 8, marginEnd: 8 }]}>
                                                {item.appointment_used_services[0].name}
                                            </Text>
                                        ) : (
                                            <Text style={[stylesBase.P1, { color: colors.ink400, marginStart: 8, marginEnd: 8 }]}>
                                                Mặc định
                                            </Text>
                                        )}
                                    </View>
                                </View>
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 12 }}>
                                    <Image
                                        style={{ width: 20, height: 20 }}
                                        source={require('../../../images/ic_doctor_lich_hen.png')} resizeMode="stretch" />
                                    <View style={{ flex: 1 }}>
                                        <Text
                                            numberOfLines={1} ellipsizeMode="tail"
                                            style={[stylesBase.P1, { color: colors.ink400, marginStart: 8, marginEnd: 8 }]}>{item.doctor.doctor_name}
                                        </Text>
                                    </View>
                                </View>
                            </View>

                            {/* Đánh giá */}
                            <View style={{ width: windowWidth - 32, backgroundColor: colors.white, borderRadius: 8, padding: 12, marginBottom: 16 }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between ' }}>
                                    <Image
                                        style={{ width: 20, height: 20 }}
                                        source={require('../../../images/ic_like.png')} resizeMode="stretch" />
                                    <View style={{ flex: 1 }}>
                                        <Text style={[stylesBase.H5Strong, { color: colors.ink500, marginStart: 8, marginEnd: 8 }]}>Đánh giá</Text>
                                    </View>
                                    <Image
                                        style={{ width: 24, height: 24 }}
                                        source={require('../../../images/ic_info.png')} resizeMode="stretch" />
                                </View>
                                <Text style={[stylesBase.P1, { color: colors.ink400 }]}>Đánh giá chỉ cho phép sau trong vòng 48 giờ sau khi khám hoàn thành</Text>
                                <View style={{ width: '100%', height: 1, backgroundColor: colors.sLine, marginTop: 12, marginBottom: 12 }} />
                                <View style={{ alignItems: 'center', marginBottom: 12 }}>
                                    <Text style={[stylesBase.P1, { color: colors.ink400 }]}>Bạn hài lòng về chất lượng dịch vụ</Text>
                                </View>
                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                    {[1, 2, 3, 4, 5].map((value) => (
                                        <TouchableOpacity key={value} onPress={() => handleRating(value)}>
                                            <Image
                                                source={
                                                    value <= selectedRating
                                                        ? require('../../../images/ic_star_active.png')
                                                        : require('../../../images/ic_star.png')
                                                }
                                                style={{ width: 48, height: 48 }}
                                            />
                                        </TouchableOpacity>
                                    ))}
                                </View>
                                <TextInput
                                    style={[stylesBase.H5, { marginTop: 12, color: colors.ink500, backgroundColor: colors.ink100, borderRadius: 8, paddingVertical: 4, paddingHorizontal: 8, }]}
                                    autoCapitalize='none'
                                    placeholder="Nhập đánh giá của bạn"
                                    placeholderTextColor={colors.ink200}
                                    multiline={true}
                                    maxLength={1000}
                                    numberOfLines={2}
                                    onChangeText={setSelectedNote}
                                    value={selectedNote} />
                            </View>

                            {/* Gửi đánh giá */}
                            {isVisibleRating && (
                                <TouchableOpacity
                                    style={{ width: windowWidth - 32, marginBottom: 12, alignItems: 'center', backgroundColor: colors.ink100, borderRadius: 8 }}
                                    onPress={() => handleSendRating()}>
                                    <Text style={[stylesBase.H5, { color: colors.ink300, paddingTop: 12, paddingBottom: 12 }]}>Gửi đánh giá</Text>
                                </TouchableOpacity>
                            )}
                        </ScrollView>
                    </View>

                    {/* Button Lưu lại */}
                    {isVisibleSend && (
                        <View style={{ backgroundColor: colors.white }}>
                            {unpaid ? (
                                <View style={{ flexDirection: 'row', width: windowWidth - 32, marginStart: 16, marginTop: 12, marginBottom: 12 }}>
                                    <TouchableOpacity
                                        style={{ flex: 1, alignItems: 'center', backgroundColor: "#FFF2E3", borderRadius: 8 }}>
                                        <Text style={[stylesBase.H5, { color: colors.primary, paddingTop: 12, paddingBottom: 12 }]}>Hủy lịch hẹn</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={{ flex: 1, alignItems: 'center', backgroundColor: colors.primary, borderRadius: 8, marginStart: 12 }}>
                                        <Text style={[stylesBase.H5, { color: colors.white, paddingTop: 12, paddingBottom: 12 }]}>Thanh toán</Text>
                                    </TouchableOpacity>
                                </View>
                            ) : (
                                <TouchableOpacity
                                    style={{ width: windowWidth - 32, marginTop: 12, marginBottom: 12, marginStart: 16, alignItems: 'center', backgroundColor: colors.primary, borderRadius: 8 }}>
                                    <Text style={[stylesBase.H5, { color: colors.white, paddingTop: 12, paddingBottom: 12 }]}>Hủy lịch hẹn</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    )}
                </View>
            )}
            <BaseDialog
                visible={isDialogVisible}
                title="Đánh giá thành công"
                content="Cảm ơn bạn đã đánh giá dịch vụ của chúng tôi Mọi thắc mắc vui lòng liên hệ tới tổng đài 1900xxx"
                confirmText="Đóng"
                onClose={closeDialog}
            />
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
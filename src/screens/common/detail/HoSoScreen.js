import React, { Component, useState, useEffect } from "react";
import { StyleSheet, Text, View, TouchableOpacity, TextInput, SafeAreaView, Dimensions, ScrollView, Image, FlatList, StatusBar } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useDispatch, useSelector } from 'react-redux';
import { getPatientRecord, getPatientRecordDefault, setSelectedItemPatientRecord } from '../../../redux/actions/updateAction'
import { formatDate } from '../../../utils/CalendarUtil'
import colors from '../../../configs/colors/colors'
import stylesBase from '../../../configs/styles/styles'
import ConfirmationBottomSheet from '../../../component/ConfirmationBottomSheet'

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default HoSoScreen = () => {
    const route = useRoute();
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const patientRecord = useSelector((state) => state.patientRecordReducer.patientRecord)
    const [refreshing, setRefreshing] = useState(false);
    const [isConfirmationVisible, setIsConfirmationVisible] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    useEffect(() => {
        console.log("Create HoSoScreen")
        // Lắng nghe sự kiện focus để tự động refresh dữ liệu
        const unsubscribe = navigation.addListener('focus', () => {
            refreshData();
        });

        return () => {
            console.log("Destroy HoSoScreen")
            unsubscribe();
        }
    }, [])

    const refreshData = async () => {
        setRefreshing(true);
        await dispatch(getPatientRecord()); // Gọi API để cập nhật dữ liệu
        setRefreshing(false);
    };

    const handleItemPatientRecord = async (item) => {
        await dispatch(setSelectedItemPatientRecord(item));

        navigation.navigate('HoSoKhamDetailScreen');
    };

    const handleItemPress = (item) => {
        setSelectedItem(item);
        setIsConfirmationVisible(true);
    };

    const handleConfirm = async () => {
        if (selectedItem) {
            // Gọi API với selectedItem ở đây
            await dispatch(getPatientRecordDefault(selectedItem.patient_record.code))
            await refreshData();

            // Đóng ConfirmationBottomSheet
            setIsConfirmationVisible(false);
            setSelectedItem(null);
        }
    };

    const handleCancel = () => {
        // Đóng ConfirmationBottomSheet
        setIsConfirmationVisible(false);
        setSelectedItem(null);
    };

    const navigateToHoSoKhamAddScreen = () => {
        navigation.navigate('HoSoKhamAddScreen', { fromHoSoScreen: true })
    }

    const renderItem = ({ item }) => {
        const formattedDOB = formatDate(item.patient_record.patient_dob);

        return (
            <View>
                <View style={{ flexDirection: 'row', marginBottom: 16, backgroundColor: colors.white, borderRadius: 8 }}>
                    <TouchableOpacity
                        style={{ flexDirection: 'row', flex: 1 }}
                        onPress={() => handleItemPatientRecord(item)}>
                        <Image
                            style={{ width: 60, height: 60, margin: 12, }}
                            source={require('../../../images/img_user.png')} resizeMode="stretch" />
                        <View style={{ justifyContent: 'center', }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={[stylesBase.H5Strong, { color: colors.ink500 }]}>{item.patient_record.patient_name}</Text>
                                {item.patient_record.default_record === true ?
                                    <Image
                                        style={{ width: 16, height: 16, justifyContent: 'center', marginStart: 12 }}
                                        source={require('../../../images/ic_default_record.png')} resizeMode="stretch" />
                                    : null
                                }
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

                    <TouchableOpacity
                        style={{ position: 'absolute', right: 0 }}
                        onPress={() => handleItemPress(item)}>
                        {item.patient_record.default_record === false ?
                            <Image
                                style={{ width: 20, height: 20, margin: 12, }}
                                source={require('../../../images/ic_more_horizontal.png')} resizeMode="stretch" />
                            : null
                        }
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
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

            <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: colors.sBackground }}>
                <FlatList
                    data={patientRecord}
                    style={{ width: windowWidth - 32, marginTop: 16 }}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id.toString()}
                    onRefresh={refreshData} // Gọi lại API khi kéo xuống để refresh
                    refreshing={refreshing} // Trạng thái của refresh indicator
                />
            </View>

            <TouchableOpacity style={{ position: 'absolute', bottom: 20, right: 16 }}
                onPress={navigateToHoSoKhamAddScreen}>
                <Image
                    style={{ width: 64, height: 64, }}
                    source={require('../../../images/ic_add_user_patient_record.png')} resizeMode="stretch" />
            </TouchableOpacity>

            <ConfirmationBottomSheet
                isVisible={isConfirmationVisible}
                onConfirm={handleConfirm}
                onCancel={handleCancel}
                title="Yêu cầu xác nhận"
                message="Bạn muốn thiết lập hồ sơ khám này là hồ sơ chính không ?"
                confirmText="Đồng ý"
                cancelText="Hủy" />
        </SafeAreaView>
    );
}
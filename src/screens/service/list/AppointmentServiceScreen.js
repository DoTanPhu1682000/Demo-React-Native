import React, { Component, useState, useEffect, useRef } from "react";
import { StyleSheet, Text, View, TouchableOpacity, TextInput, SafeAreaView, Dimensions, ScrollView, Image, FlatList, StatusBar } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from 'react-redux';
import { getAppointmentService, setSelectedItemAppointmentService } from '../../../redux/actions/updateAction'
import colors from '../../../configs/colors/colors'
import stylesBase from '../../../configs/styles/styles'

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default AppointmentServiceScreen = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const [refreshing, setRefreshing] = useState(false);
    const [selectedSearch, setSelectedSearch] = useState("");
    const [dataList, setDataList] = useState([]);
    const appointmentServiceList = useSelector((state) => state.appointmentServiceReducer.appointmentServiceList)
    const itemPatientRecord = useSelector((state) => state.itemPatientRecordReducer.selectedItemPatientRecord)
    const itemSite = useSelector((state) => state.itemSiteReducer.selectedItemSite)

    useEffect(() => {
        console.log("Create AppointmentServiceScreen")
        const unsubscribe = navigation.addListener('focus', () => {
            refreshData();
        });

        return () => {
            console.log("Destroy AppointmentServiceScreen")
            unsubscribe();
        }
    }, [])

    const refreshData = async () => {
        setRefreshing(true);
        const isVietnam = itemPatientRecord === null || itemPatientRecord.patient_record.patient_ethic !== "55";
        const response = await getAppointmentService(isVietnam, false, itemSite.code, (action) => {
            dispatch(action);
        });
        setDataList(response)
        setRefreshing(false);
    };

    const timerRef = useRef(null);

    const performSearchDelayed = async (text) => {
        setSelectedSearch(text)

        clearTimeout(timerRef.current);

        timerRef.current = setTimeout(() => performSearch(text), 1000)
    };

    const performSearch = async (text) => {
        const filteredResults = appointmentServiceList.filter(item =>
            item.name.toLowerCase().includes(text.toLowerCase()) || item.description.toLowerCase().includes(text.toLowerCase())
        );
        console.log("==> filteredResults:", filteredResults);
        setDataList(filteredResults);
    };

    const handlePressItem = async (item) => {
        await dispatch(setSelectedItemAppointmentService(item));
        navigation.navigate('BookingOfflineScreen')
    };

    const handlePressDetail = async (item) => {
        await dispatch(setSelectedItemAppointmentService(item));
        navigation.navigate('AppointmentServiceDetailScreen')
    };

    const renderItem = ({ item }) => {
        return (
            <View>
                <View style={{ flexDirection: 'row', marginBottom: 16, backgroundColor: colors.white, borderRadius: 8 }}>
                    <TouchableOpacity
                        style={{ flexDirection: 'row', flex: 1 }}
                        onPress={() => handlePressItem(item)}>
                        <View style={{ flex: 1, margin: 12 }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <Text numberOfLines={2} style={[stylesBase.P1Strong, { color: colors.ink500, flex: 1 }]}>{item.name}</Text>
                                <TouchableOpacity
                                    onPress={() => handlePressDetail(item)}>
                                    <Text style={[stylesBase.P1, { color: colors.primaryB500, flex: 1 }]}>Chi tiết</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{ flexDirection: 'row', marginTop: 8, marginBottom: 8, alignItems: 'center' }}>
                                <Image
                                    style={{ width: 32, height: 32, marginEnd: 12 }}
                                    source={require('../../../images/ic_handle_heart.png')}
                                    resizeMode="stretch" />
                                <Text numberOfLines={2} style={[stylesBase.P1, { color: colors.ink400, flex: 1, lineHeight: 18 }]}>{item.description}</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                </View >
            </View >
        );
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <StatusBar barStyle="dark-content" backgroundColor={colors.white} />
            {/* TaskBar */}
            <View style={{ width: '100%', height: '6%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: colors.white }}>
                <TouchableOpacity
                    style={{ height: '100%', aspectRatio: 1.5, alignItems: 'center', flexDirection: 'row', marginStart: 12 }}
                    onPress={() => {
                        navigation.pop(3)
                    }}>
                    <Image
                        style={{ width: 24, height: 24, }}
                        source={require('../../../images/ic_back.png')} resizeMode="stretch" />
                </TouchableOpacity>

                <Text style={[stylesBase.H5Strong, { color: colors.ink500 }]}>Dịch vụ</Text>

                <TouchableOpacity
                    style={{ height: '100%', aspectRatio: 1.5, alignItems: 'center', flexDirection: 'row', justifyContent: 'flex-end', marginEnd: 12 }}>
                    <Image
                        style={{ width: 24, height: 24 }}
                        source={require('../../../images/ic_sos.png')} resizeMode="stretch" />
                </TouchableOpacity>
            </View>

            <View style={{ backgroundColor: colors.white }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', color: colors.ink500, backgroundColor: colors.ink100, borderRadius: 8, marginTop: 8, marginBottom: 8, marginStart: 16, marginEnd: 16 }}>
                    <Image
                        style={{ width: 16, height: 16, marginStart: 8, marginEnd: 8 }}
                        source={require('../../../images/ic_search.png')} resizeMode="stretch" />
                    <TextInput
                        style={[stylesBase.P1, { flex: 1, marginEnd: 8 }]}
                        autoCapitalize='none'
                        placeholder="Nhập nội dung cần tìm"
                        placeholderTextColor={colors.ink200}
                        onChangeText={performSearchDelayed}
                        value={selectedSearch} />
                </View>
            </View>

            <View style={{ flex: 1, backgroundColor: colors.sBackground }}>
                <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: colors.sBackground, }}>
                    {appointmentServiceList && (
                        <FlatList
                            data={dataList}
                            style={{ width: windowWidth - 32, marginTop: 16 }}
                            renderItem={renderItem}
                            keyExtractor={(item) => item.id.toString()}
                            onRefresh={refreshData}
                            refreshing={refreshing}
                        />
                    )}
                </View>
            </View>
        </SafeAreaView>
    );
}
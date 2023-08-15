import React, { Component, useState, useEffect } from "react";
import { StyleSheet, Text, View, TouchableOpacity, TextInput, SafeAreaView, Dimensions, ScrollView, Image, FlatList, StatusBar } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from 'react-redux';
import { getSiteList } from '../../../redux/actions/updateAction'
import colors from '../../../configs/colors/colors'
import stylesBase from '../../../configs/styles/styles'

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default SiteListScreen = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const [refreshing, setRefreshing] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const [dataList, setDataList] = useState([]);
    const siteList = useSelector((state) => state.siteReducer.siteList)
    const itemPatientRecord = useSelector((state) => state.itemPatientRecordReducer.selectedItemPatientRecord)

    useEffect(() => {
        console.log("Create SiteListScreen")
        // Lắng nghe sự kiện focus để tự động refresh dữ liệu
        const unsubscribe = navigation.addListener('focus', () => {
            refreshData();
        });

        return () => {
            console.log("Destroy SiteListScreen")
            unsubscribe();
        }
    }, [])

    const refreshData = async () => {
        setRefreshing(true);
        setCurrentPage(0); // Reset trang hiện tại
        const response = await getSiteList(-1, '', 0, (action) => {
            dispatch(action)
        })
        setDataList(response.content_page); // Cập nhật toàn bộ danh sách dữ liệu mới
        setRefreshing(false);
    };

    const loadMoreData = async () => {
        if (!loadingMore && currentPage < siteList.total_page - 1) {
            setLoadingMore(true);
            const nextPage = currentPage + 1;
            const response = await getSiteList(-1, '', nextPage, (action) => {
                dispatch(action)
            })
            setCurrentPage(nextPage);

            // Thêm dữ liệu mới vào danh sách hiện có
            setDataList((prevDataList) => [...prevDataList, ...response.content_page]);
            console.log(" ==> dataList:", [...dataList, ...response.content_page]);

            setLoadingMore(false);
        }
    };

    const keyExtractor = (item, index) => `${item.id}_${index}`;

    const renderItem = ({ item }) => {
        const avatarLink = item.avatar && item.avatar.length > 0 ? item.avatar[0].link : null;

        return (
            <View>
                <View style={{ flexDirection: 'row', marginBottom: 16, backgroundColor: colors.white, borderRadius: 8 }}>
                    <TouchableOpacity style={{ flexDirection: 'row', flex: 1 }}>
                        <Image
                            style={{ width: 64, height: 64, margin: 12, }}
                            source={avatarLink ? { uri: avatarLink } : require('../../../images/ic_hospital_location.png')}
                            resizeMode="stretch" />
                        <View style={{ flex: 1, width: '100%', marginTop: 12, marginBottom: 12 }}>
                            <Text numberOfLines={2} style={[stylesBase.H5, { color: colors.ink500, marginEnd: 12 }]}>{item.name}</Text>
                            <View style={{ flexDirection: 'row' }}>
                                <Image
                                    style={{ width: 16, height: 16, marginTop: 5, marginEnd: 4 }}
                                    source={require('../../../images/ic_pin.png')} resizeMode="stretch" />
                                <Text numberOfLines={2} style={[stylesBase.P1, { color: colors.ink400, flex: 1, marginEnd: 12, lineHeight: 18 }]}>{item.address}</Text>
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
                        navigation.goBack()
                    }}>
                    <Image
                        style={{ width: 24, height: 24, }}
                        source={require('../../../images/ic_back.png')} resizeMode="stretch" />
                </TouchableOpacity>

                <Text style={[stylesBase.H5Strong, { color: colors.ink500 }]}>Cơ sở y tế</Text>

                <TouchableOpacity
                    style={{ height: '100%', aspectRatio: 1.5, alignItems: 'center', flexDirection: 'row', justifyContent: 'flex-end', marginEnd: 12 }}>
                    <Image
                        style={{ width: 24, height: 24 }}
                        source={require('../../../images/ic_sos.png')} resizeMode="stretch" />
                </TouchableOpacity>
            </View>

            <View style={{ flex: 1, backgroundColor: colors.sBackground }}>
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
            </View>
        </SafeAreaView>
    );
}
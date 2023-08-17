import React, { Component, useState, useEffect, useRef } from "react";
import { StyleSheet, Text, View, TouchableOpacity, TextInput, SafeAreaView, Dimensions, ScrollView, Image, FlatList, StatusBar } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from 'react-redux';
import { getSiteList, setSelectedItemSite } from '../../../redux/actions/updateAction'
import colors from '../../../configs/colors/colors'
import stylesBase from '../../../configs/styles/styles'

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default SiteListScreen = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const [refreshing, setRefreshing] = useState(false);
    const [selectedSearch, setSelectedSearch] = useState("");
    const [loadingMore, setLoadingMore] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const [dataList, setDataList] = useState([]);
    const siteList = useSelector((state) => state.siteReducer.siteList)

    useEffect(() => {
        console.log("Create SiteListScreen")
        const unsubscribe = navigation.addListener('focus', () => {
            refreshData();
        });

        return () => {
            console.log("Destroy SiteListScreen")
            unsubscribe();
        }
    }, [])

    const fetchData = async (page, searchText) => {
        const response = await getSiteList(-1, searchText, page, (action) => {
            dispatch(action);
        });
        return response.content_page;
    };

    const refreshData = async () => {
        setRefreshing(true);
        const newData = await fetchData(0, selectedSearch);
        setDataList(newData);
        setCurrentPage(0);
        setRefreshing(false);
    };

    const loadMoreData = async () => {
        if (!loadingMore && currentPage < siteList.total_page - 1) {
            console.log("==> loadMoreData");
            setLoadingMore(true);
            const nextPage = currentPage + 1;
            const newData = await fetchData(nextPage, selectedSearch);
            setCurrentPage(nextPage);
            setDataList((prevDataList) => [...prevDataList, ...newData]);
            console.log(" ==> dataList:", [...dataList, ...newData]);
            setLoadingMore(false);
        }
    };

    const timerRef = useRef(null);

    const performSearchDelayed = async (text) => {
        setSelectedSearch(text)

        clearTimeout(timerRef.current);

        timerRef.current = setTimeout(() => performSearch(text), 2000)
    };

    const performSearch = async (text) => {
        // Thực hiện tìm kiếm và cập nhật dữ liệu
        const newData = await fetchData(0, text);
        setDataList(newData);
        setCurrentPage(0);
    };

    const handlePressItem = async (item) => {
        await dispatch(setSelectedItemSite(item));
        navigation.navigate('AppointmentServiceScreen')
    };

    const keyExtractor = (item, index) => `${item.id}_${index}`;

    const renderItem = ({ item }) => {
        const avatarLink = item.avatar && item.avatar.length > 0 ? item.avatar[0].link : null
        const defaultAvatarSource = require('../../../images/ic_hospital_location.png')
        // Kiểm tra xem avatarLink có giá trị hợp lệ hay không
        const imageSource = avatarLink ? { uri: avatarLink } : defaultAvatarSource;

        return (
            <View>
                <View style={{ flexDirection: 'row', marginBottom: 16, backgroundColor: colors.white, borderRadius: 8 }}>
                    <TouchableOpacity
                        style={{ flexDirection: 'row', flex: 1 }}
                        onPress={() => handlePressItem(item)}>
                        <Image
                            style={{ width: 64, height: 64, margin: 12, }}
                            source={imageSource}
                            resizeMode="stretch"
                            onError={(error) => {
                                // console.error('Error loading image:', error.nativeEvent.error);
                                // Thay thế ảnh bị lỗi bằng ảnh mặc định trong dataList
                                const newDataList = dataList.map(dataItem => {
                                    if (dataItem.id === item.id) {
                                        return { ...dataItem, avatar: [defaultAvatarSource] };
                                    }
                                    return dataItem;
                                });
                                setDataList(newDataList);
                            }}
                        />
                        <View style={{ flex: 1, width: '100%', marginTop: 12, marginBottom: 12 }}>
                            <Text numberOfLines={2} style={[stylesBase.H5, { color: colors.ink500, marginEnd: 12 }]}>{item.name}</Text>
                            <View style={{ flexDirection: 'row' }}>
                                <Image
                                    style={{ width: 16, height: 16, marginTop: 2, marginEnd: 4 }}
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
                        navigation.pop(2)
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
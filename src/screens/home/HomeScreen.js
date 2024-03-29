import React, { Component, useState, useEffect } from "react";
import { StyleSheet, Text, View, TouchableOpacity, TextInput, SafeAreaView, Dimensions, ScrollView, Image, FlatList, StatusBar, ImageBackground } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useDispatch, useSelector } from 'react-redux';
import { login, getRefreshToken, getHomeNews, getCommonList } from '../../redux/actions/updateAction'
import Toast from 'react-native-toast-message';
import Swiper from 'react-native-swiper';
import colors from '../../configs/colors/colors'
import stylesBase from '../../configs/styles/styles'

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default HomeScreen = () => {
    // Hooks and State
    const navigation = useNavigation()
    const dispatch = useDispatch()
    const [refreshing, setRefreshing] = useState(false);
    const [dataListNews, setDataListNews] = useState([]);
    const [dataListPromotionNews, setDataListPromotionNews] = useState([]);
    const [dataListDrBinhPackage, setDataListDrBinhPackage] = useState([]);
    const [dataListBanner, setDataListBanner] = useState([]);
    const [dataListCommon, setDataListCommon] = useState([]);

    // Redux Selectors


    useEffect(() => {
        console.log("Create HomeScreen")

        getHomeNews()
            .then(async (response) => {
                if (response !== null) {
                    setDataListNews(response.news)
                    setDataListPromotionNews(response["promotion-news"])
                    setDataListDrBinhPackage(response["drbinh-package"])
                    setDataListBanner(response.banner)
                }
            })

        getCommonList()
            .then(async (response) => {
                if (response !== null) {
                    setDataListCommon(response)
                }
            })

        return () => {
            console.log("Destroy HomeScreen")
        }
    }, [])

    const callLogin = () => {
        login('0356709123', '123456')
    }

    const refresh = () => {
        getRefreshToken()
    }

    const handleShowToast = () => {
        Toast.show({
            type: 'success', // Loại toast (success, error, info)
            text1: 'Lưu thành công',
            visibilityTime: 3000,
            autoHide: true,
            position: 'bottom',
            bottomOffset: 60,
        });
    }

    const handleDatLich = () => {
        navigation.navigate('HoSoKhamScreen')
    }

    const handleLichHen = () => {
        navigation.navigate('Lịch hẹn')
    }

    const handleHoSo = () => {
        navigation.navigate('Hồ sơ')
    }

    const handleOpenNews = () => {
        const showAllNewsItem = dataListCommon.find(item => item.key === 'SHOW_ALL_NEWS');

        if (showAllNewsItem) {
            navigation.navigate('WebViewScreen', { url: showAllNewsItem.article_link, title: showAllNewsItem.article_link });
        }
    }

    const handleOpenPromotionNews = () => {
        const showAllNewsItem = dataListCommon.find(item => item.key === 'SHOW_ALL_PROMOTION_NEWS');

        if (showAllNewsItem) {
            navigation.navigate('WebViewScreen', { url: showAllNewsItem.article_link, title: showAllNewsItem.article_link });
        }
    }

    const handleOpenDrBinhPackage = () => {
        const showAllNewsItem = dataListCommon.find(item => item.key === 'SHOW_ALL_DRBINH_PACKAGE');

        if (showAllNewsItem) {
            navigation.navigate('WebViewScreen', { url: showAllNewsItem.article_link, title: showAllNewsItem.article_link });
        }
    }

    const handlePressHomeNews = (index) => {
        navigation.navigate('WebViewScreen', { url: dataListNews[index].article_link, title: dataListNews[index].title });
    }

    const handlePressPromotionNews = (index) => {
        navigation.navigate('WebViewScreen', { url: dataListPromotionNews[index].article_link, title: dataListPromotionNews[index].title });
    }

    const handlePressDrBinhPackage = (index) => {
        navigation.navigate('WebViewScreen', { url: dataListDrBinhPackage[index].article_link, title: dataListDrBinhPackage[index].title });
    }

    // ------------------------------------------------------------------[ HomeNews ]------------------------------------------------------------------- \\
    const keyExtractor = (item, index) => `${item.id}_${index}`;

    const renderItem = ({ item, index }) => {
        const imageLink = item.image_link && item.image_link.length > 0 ? item.image_link : null
        const defaultAvatarSource = require('../../images/img_placeholder_default.png')
        // Kiểm tra xem imageLink có giá trị hợp lệ hay không
        const imageSource = imageLink ? { uri: imageLink } : defaultAvatarSource;

        // Xác định phong cách cho mục hiện tại
        const itemStyle = index === 0 ? { marginRight: 16 } : index === dataListNews.length - 1 ? { marginLeft: 16 } : { marginHorizontal: 8 };

        return (
            <TouchableOpacity
                style={{ ...itemStyle, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.sLine, borderRadius: 8, padding: 8 }}
                onPress={() => handlePressHomeNews(index)}>
                <Image
                    style={{ width: 250, height: 134, borderRadius: 8 }}
                    source={imageSource}
                    resizeMode="stretch"
                    onError={(error) => {
                        // Thay thế ảnh bị lỗi bằng ảnh mặc định trong dataListNews
                        const newDataList = dataListNews.map(dataItem => {
                            if (dataItem.id === item.id) {
                                return { ...dataItem, image_link: defaultAvatarSource.uri };
                            }
                            return dataItem;
                        });
                        setDataListNews(newDataList);
                    }}
                />
                <Text numberOfLines={2} ellipsizeMode="tail" style={[stylesBase.P1Strong, { color: colors.ink500, marginTop: 12, width: 250 }]}>{item.title}</Text>
            </TouchableOpacity >
        );
    };

    // ------------------------------------------------------------------[ PromotionNews ]------------------------------------------------------------------- \\
    const keyExtractorPromotionNews = (item, index) => `${item.id}_${index}`;

    const renderItemPromotionNews = ({ item, index }) => {
        const imageLink = item.image_link && item.image_link.length > 0 ? item.image_link : null
        const defaultAvatarSource = require('../../images/img_placeholder_default.png')
        // Kiểm tra xem imageLink có giá trị hợp lệ hay không
        const imageSource = imageLink ? { uri: imageLink } : defaultAvatarSource;

        // Xác định phong cách cho mục hiện tại
        const itemStyle = index === 0 ? { marginRight: 16 } : index === dataListPromotionNews.length - 1 ? { marginLeft: 16 } : { marginHorizontal: 8 };

        return (
            <TouchableOpacity
                style={{ ...itemStyle, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.sLine, borderRadius: 8, padding: 8 }}
                onPress={() => handlePressPromotionNews(index)}>
                <Image
                    style={{ width: 250, height: 134, borderRadius: 8 }}
                    source={imageSource}
                    resizeMode="stretch"
                    onError={(error) => {
                        // Thay thế ảnh bị lỗi bằng ảnh mặc định trong dataListPromotionNews
                        const newDataList = dataListPromotionNews.map(dataItem => {
                            if (dataItem.id === item.id) {
                                return { ...dataItem, image_link: defaultAvatarSource.uri };
                            }
                            return dataItem;
                        });
                        setDataListPromotionNews(newDataList);
                    }}
                />
                <Text numberOfLines={2} ellipsizeMode="tail" style={[stylesBase.P1Strong, { color: colors.ink500, marginTop: 12, width: 250 }]}>{item.title}</Text>
            </TouchableOpacity >
        );
    };

    // ------------------------------------------------------------------[ DrBinhPackage ]------------------------------------------------------------------- \\
    const keyExtractorDrBinhPackage = (item, index) => `${item.id}_${index}`;

    const renderItemDrBinhPackage = ({ item, index }) => {
        const imageLink = item.image_link && item.image_link.length > 0 ? item.image_link : null
        const defaultAvatarSource = require('../../images/img_placeholder_default.png')
        // Kiểm tra xem imageLink có giá trị hợp lệ hay không
        const imageSource = imageLink ? { uri: imageLink } : defaultAvatarSource;

        // Xác định phong cách cho mục hiện tại
        const itemStyle = index === 0 ? { marginRight: 16 } : index === dataListDrBinhPackage.length - 1 ? { marginLeft: 16 } : { marginHorizontal: 8 };

        return (
            <TouchableOpacity
                style={{ ...itemStyle, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.sLine, borderRadius: 8, padding: 8 }}
                onPress={() => handlePressDrBinhPackage(index)}>
                <Image
                    style={{ width: 250, height: 134, borderRadius: 8 }}
                    source={imageSource}
                    resizeMode="stretch"
                    onError={(error) => {
                        // Thay thế ảnh bị lỗi bằng ảnh mặc định trong dataListDrBinhPackage
                        const newDataList = dataListDrBinhPackage.map(dataItem => {
                            if (dataItem.id === item.id) {
                                return { ...dataItem, image_link: defaultAvatarSource.uri };
                            }
                            return dataItem;
                        });
                        setDataListPromotionNews(newDataList);
                    }}
                />
                <Text numberOfLines={2} ellipsizeMode="tail" style={[stylesBase.P1Strong, { color: colors.ink500, marginTop: 12, width: 250 }]}>{item.title}</Text>
            </TouchableOpacity >
        );
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.sBackground }}>
            <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
            {/* TaskBar */}
            <View style={{ width: '100%', height: '6%', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', backgroundColor: colors.primary }}>
                <View
                    style={{
                        flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.20)', borderRadius: 14, marginTop: 8, marginBottom: 8,
                        marginStart: 16, marginEnd: 16, paddingStart: 10, paddingEnd: 10, paddingTop: 5, paddingBottom: 5
                    }}>
                    <TouchableOpacity
                        style={{ height: '100%', alignItems: 'center', flexDirection: 'row', justifyContent: 'flex-end' }}>
                        <Image
                            style={{ width: 16, height: 16, tintColor: colors.white }}
                            source={require('../../images/ic_more_horizontal.png')} resizeMode="stretch" />
                    </TouchableOpacity>

                    <View style={{ width: 1, height: 16, backgroundColor: colors.white, marginStart: 10, marginEnd: 10 }} />

                    <TouchableOpacity
                        style={{ height: '100%', alignItems: 'center', flexDirection: 'row', justifyContent: 'flex-end' }}>
                        <Image
                            style={{ width: 16, height: 16, }}
                            source={require('../../images/ic_close_momo.png')} resizeMode="stretch" />
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView>
                <View style={{ flex: 1, backgroundColor: colors.sBackground, marginTop: 16, marginBottom: 16 }}>
                    <View style={{ backgroundColor: colors.white }}>

                        {/* Banner */}
                        <View style={{ flex: 1 }}>
                            <View style={{ height: 110, margin: 16, borderRadius: 8, overflow: 'hidden' }}>
                                <Swiper
                                    autoplay
                                    loop
                                    autoplayTimeout={3}
                                    dotStyle={{ backgroundColor: colors.ink200 }}
                                    activeDotStyle={{ backgroundColor: colors.primary }}
                                >
                                    {dataListBanner.map((banner, index) => (
                                        <View key={index} style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                            <Image source={{ uri: banner.link }} style={{ width: windowWidth - 32, height: 110 }} resizeMode="stretch" />
                                        </View>
                                    ))}
                                </Swiper>
                            </View>
                        </View>

                        <View style={{ flexDirection: 'row', margin: 16 }}>
                            {/* Đặt lịch */}
                            <TouchableOpacity
                                style={{ flex: 1, height: 174, marginEnd: 16, borderRadius: 8 }}
                                onPress={() => handleDatLich()}>
                                <ImageBackground
                                    style={{ flex: 1 }}
                                    source={require('../../images/img_background_booking.png')} resizeMode="stretch">
                                    <Text style={[stylesBase.H5Strong, { color: colors.white, marginStart: 12, marginTop: 8, marginBottom: 4 }]}>Đặt lịch khám</Text>
                                    <View
                                        style={{ flexDirection: 'row', marginStart: 12, backgroundColor: '#FFB280', maxWidth: 70, alignItems: 'center', borderRadius: 4, paddingStart: 4, paddingEnd: 4 }}>
                                        <Text style={[stylesBase.P2, { color: colors.white }]}>Đặt ngay </Text>
                                        <Image
                                            style={{ width: 10, height: 10, tintColor: colors.white }}
                                            source={require('../../images/ic_arrow_right.png')} resizeMode="stretch" />
                                    </View>
                                    <View style={{ flex: 1, alignItems: 'flex-end', marginTop: 10 }}>
                                        <Image
                                            style={{ width: 102, height: 107 }}
                                            source={require('../../images/ic_booking.png')} resizeMode="stretch" />
                                    </View>
                                </ImageBackground>
                            </TouchableOpacity>

                            <View style={{ flex: 1 }}>
                                {/* Lịch hẹn */}
                                <TouchableOpacity
                                    style={{ flex: 1, height: 81, borderRadius: 8, marginBottom: 16 }}
                                    onPress={() => handleLichHen()}>
                                    <ImageBackground
                                        style={{ flex: 1, flexDirection: 'row' }}
                                        source={require('../../images/img_background_lich_hen.png')} resizeMode="stretch">
                                        <View>
                                            <Text style={[stylesBase.H5Strong, { color: colors.white, marginStart: 12, marginTop: 8, marginBottom: 4 }]}>Lịch hẹn</Text>
                                            <View
                                                style={{ flexDirection: 'row', marginStart: 12, backgroundColor: '#F39A9A', maxWidth: 60, alignItems: 'center', borderRadius: 4, paddingStart: 4, paddingEnd: 4 }}>
                                                <Text style={[stylesBase.P2, { color: colors.white }]}>Chi tiết </Text>
                                                <Image
                                                    style={{ width: 10, height: 10, tintColor: colors.white }}
                                                    source={require('../../images/ic_arrow_right.png')} resizeMode="stretch" />
                                            </View>
                                        </View>
                                        <View style={{ position: 'absolute', right: 0, bottom: 0 }}>
                                            <Image
                                                style={{ width: 67, height: 56 }}
                                                source={require('../../images/ic_lich_hen.png')} resizeMode="stretch" />
                                        </View>
                                    </ImageBackground>
                                </TouchableOpacity>

                                {/* Hồ sơ */}
                                <TouchableOpacity
                                    style={{ flex: 1, height: 81, borderRadius: 8 }}
                                    onPress={() => handleHoSo()}>
                                    <ImageBackground
                                        style={{ flex: 1, flexDirection: 'row' }}
                                        source={require('../../images/img_background_patient_record.png')} resizeMode="stretch">
                                        <View>
                                            <Text style={[stylesBase.H5Strong, { color: colors.white, marginStart: 12, marginTop: 8, marginBottom: 4 }]}>Hồ sơ</Text>
                                            <View
                                                style={{ flexDirection: 'row', marginStart: 12, backgroundColor: '#82B3F4', maxWidth: 60, alignItems: 'center', borderRadius: 4, paddingStart: 4, paddingEnd: 4 }}>
                                                <Text style={[stylesBase.P2, { color: colors.white }]}>Chi tiết </Text>
                                                <Image
                                                    style={{ width: 10, height: 10, tintColor: colors.white }}
                                                    source={require('../../images/ic_arrow_right.png')} resizeMode="stretch" />
                                            </View>
                                        </View>
                                        <View style={{ position: 'absolute', right: 0, bottom: 0 }}>
                                            <Image
                                                style={{ width: 62, height: 57 }}
                                                source={require('../../images/ic_ho_so.png')} resizeMode="stretch" />
                                        </View>
                                    </ImageBackground>
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View style={{ alignItems: 'center' }}>
                            <TouchableOpacity
                                style={{ width: 200, height: 40, borderWidth: 1, borderRadius: 12, marginTop: 24, justifyContent: 'center', alignItems: 'center', backgroundColor: '#4D8D6E' }}
                                onPress={() => callLogin()}>
                                <Text style={{ color: '#FFFFFF' }}>Login</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={{ width: 200, height: 40, borderWidth: 1, borderRadius: 12, marginTop: 24, justifyContent: 'center', alignItems: 'center', backgroundColor: '#4D8D6E' }}
                                onPress={() => refresh()}>
                                <Text style={{ color: '#FFFFFF' }}>refresh</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={{ width: 200, height: 40, borderWidth: 1, borderRadius: 12, marginTop: 24, marginBottom: 40, justifyContent: 'center', alignItems: 'center', backgroundColor: '#4D8D6E' }}
                                onPress={() => handleShowToast()}>
                                <Text style={{ color: '#FFFFFF' }}>show Toast</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Tin tức */}
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginStart: 16, marginEnd: 16 }}>
                            <Text style={[stylesBase.H4Strong, { color: colors.ink500 }]}>Tin tức</Text>
                            <TouchableOpacity
                                onPress={() => handleOpenNews()}>
                                <Text style={[stylesBase.P1, { color: colors.primaryB500 }]}>Xem thêm</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: colors.white, margin: 16 }}>
                            {dataListNews && (
                                <FlatList
                                    data={dataListNews}
                                    horizontal
                                    renderItem={renderItem}
                                    keyExtractor={keyExtractor}
                                />
                            )}
                        </View>

                        {/* Giới thiệu */}
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginStart: 16, marginEnd: 16 }}>
                            <Text style={[stylesBase.H4Strong, { color: colors.ink500 }]}>Giới thiệu</Text>
                            <TouchableOpacity
                                onPress={() => handleOpenPromotionNews()}>
                                <Text style={[stylesBase.P1, { color: colors.primaryB500 }]}>Xem thêm</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: colors.white, margin: 16 }}>
                            {dataListPromotionNews && (
                                <FlatList
                                    data={dataListPromotionNews}
                                    horizontal
                                    renderItem={renderItemPromotionNews}
                                    keyExtractor={keyExtractorPromotionNews}
                                />
                            )}
                        </View>

                        {/* Mạng lưới cơ sở y tế */}
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginStart: 16, marginEnd: 16 }}>
                            <Text style={[stylesBase.H4Strong, { color: colors.ink500 }]}>Mạng lưới cơ sở y tế</Text>
                            <TouchableOpacity
                                onPress={() => handleOpenDrBinhPackage()}>
                                <Text style={[stylesBase.P1, { color: colors.primaryB500 }]}>Xem thêm</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: colors.white, margin: 16 }}>
                            {dataListDrBinhPackage && (
                                <FlatList
                                    data={dataListDrBinhPackage}
                                    horizontal
                                    renderItem={renderItemDrBinhPackage}
                                    keyExtractor={keyExtractorDrBinhPackage}
                                />
                            )}
                        </View>

                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
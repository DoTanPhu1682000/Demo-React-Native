import React, { Component, useState, useEffect } from "react";
import { StyleSheet, Text, View, TouchableOpacity, TextInput, SafeAreaView, Dimensions, ScrollView, Image, FlatList, StatusBar } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useDispatch, useSelector } from 'react-redux';
import { updateEmail, login, getRefreshToken, getHomeNews } from '../../redux/actions/updateAction'
import Toast from 'react-native-toast-message';
import colors from '../../configs/colors/colors'
import stylesBase from '../../configs/styles/styles'

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default HomeScreen = () => {
    // Hooks and State
    const navigation = useNavigation()
    const dispatch = useDispatch()
    const [email, onChangeEmail] = React.useState("")
    const [refreshing, setRefreshing] = useState(false);
    const [dataListNews, setDataListNews] = useState([]);

    // Redux Selectors
    const info = useSelector((state) => state.infoReducer)

    useEffect(() => {
        console.log("Create HomeScreen")
        const unsubscribe = navigation.addListener('focus', () => {
            refreshData();
        });

        return () => {
            console.log("Destroy HomeScreen")
            unsubscribe();
        }
    }, [])

    const refreshData = async () => {
        setRefreshing(true);

        await getHomeNews()
            .then(async (response) => {
                if (response !== null) {
                    setDataListNews(response)
                }
            })

        setRefreshing(false);
    };

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
            visibilityTime: 2000,
            autoHide: true,
            position: 'bottom',
            bottomOffset: 60,
        });
    }

    const navigateToHoSoKhamScreen = () => {
        navigation.navigate('HoSoKhamScreen')
    }

    // ------------------------------------------------------------------[ HomeNews ]------------------------------------------------------------------- \\
    const keyExtractor = (item, index) => `${item.id}_${index}`;

    const renderItem = ({ item, index }) => {
        const imageLink = item.image_link && item.image_link.length > 0 ? item.image_link : null
        const defaultAvatarSource = require('../../images/img_placeholder_default.png')
        // Kiểm tra xem imageLink có giá trị hợp lệ hay không
        const imageSource = imageLink ? { uri: imageLink } : defaultAvatarSource;

        return (
            <View style={{ backgroundColor: colors.white, borderWidth: 1, borderColor: colors.sLine, borderRadius: 8, marginEnd: 16, padding: 8 }}>
                <Image
                    style={{ width: 250, height: 134 }}
                    source={imageSource}
                    resizeMode="stretch"
                    // onError={(error) => {
                    //     // console.error('Error loading image:', error.nativeEvent.error);
                    //     // Thay thế ảnh bị lỗi bằng ảnh mặc định trong dataListNews
                    //     const newDataList = dataListNews.map(dataItem => {
                    //         if (dataItem.id === item.id) {
                    //             return { ...dataItem, image_link: defaultAvatarSource.uri };
                    //         }
                    //         return dataItem;
                    //     });
                    //     setDataListNews(newDataList);
                    // }}
                />
                <Text style={[stylesBase.P2, { color: colors.ink500, marginTop: 12 }]}>{item.title}</Text>
            </View >
        );
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.sBackground }}>
            <StatusBar barStyle="dark-content" backgroundColor={colors.white} />
            {/* TaskBar */}
            <View style={{ width: '100%', height: '6%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: colors.white }}>
                <TouchableOpacity
                    style={{ height: '100%', aspectRatio: 1.5, alignItems: 'center', flexDirection: 'row', marginStart: 12 }}>
                    <Image
                        style={{ width: 24, height: 24, }}
                        source={require('../../images/ic_menu.png')} resizeMode="stretch" />
                </TouchableOpacity>

                <TouchableOpacity
                    style={{ height: '100%', aspectRatio: 1.5, alignItems: 'center', flexDirection: 'row', justifyContent: 'flex-end', marginEnd: 12 }}
                    onPress={() => {
                        navigation.navigate('SettingsScreen')
                    }}>
                    <Image
                        style={{ width: 24, height: 24, }}
                        source={require('../../images/ic_setting.png')} resizeMode="stretch" />
                </TouchableOpacity>
            </View>

            <ScrollView>
                <View style={{ flex: 1, backgroundColor: colors.sBackground, alignItems: "center" }}>
                    <View style={{ flexDirection: 'row', margin: 16 }}>
                        <TouchableOpacity
                            style={{ flex: 1, height: 80, flexDirection: 'row', paddingStart: 10, paddingEnd: 10, borderRadius: 8, backgroundColor: colors.primary, alignItems: "center", justifyContent: "space-between" }}
                            onPress={() => navigateToHoSoKhamScreen()}>
                            <Text style={[stylesBase.H5Strong, { color: colors.white, width: 54 }]}>Tư vấn Online</Text>
                            <Image
                                style={{ width: 48, height: 48 }}
                                source={require('../../images/ic_home_dat_lich_online.png')} resizeMode="stretch" />
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={{ flex: 1, height: 80, flexDirection: 'row', paddingStart: 10, paddingEnd: 10, borderRadius: 8, backgroundColor: colors.primary, alignItems: "center", justifyContent: "space-between", marginStart: 16 }}
                            onPress={() => navigateToHoSoKhamScreen()}>
                            <Text style={[stylesBase.H5Strong, { color: colors.white, width: 68 }]}>Đặt lịch tại CSYT</Text>
                            <Image
                                style={{ width: 48, height: 48 }}
                                source={require('../../images/ic_home_dat_lich_offline.png')} resizeMode="stretch" />
                        </TouchableOpacity>
                    </View>

                    <Text>Email: {info.email}</Text>
                    <TextInput
                        style={{ width: '80%', height: 40, fontSize: 16, margin: 12, borderWidth: 1, padding: 10, borderRadius: 8 }}
                        autoCapitalize="none"
                        onChangeText={onChangeEmail}
                        value={email} />

                    <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: colors.white, marginTop: 16, padding: 16 }}>
                        {dataListNews && (
                            <FlatList
                                data={dataListNews.news}
                                horizontal
                                renderItem={renderItem}
                                keyExtractor={keyExtractor}
                                onRefresh={refreshData}
                                refreshing={refreshing}
                            />
                        )}
                    </View>

                    <TouchableOpacity
                        style={{ width: 200, height: 40, borderWidth: 1, borderRadius: 12, marginTop: 24, justifyContent: 'center', alignItems: 'center', backgroundColor: '#4D8D6E' }}
                        onPress={() => dispatch(updateEmail(email))}>
                        <Text style={{ color: '#FFFFFF' }}>Cập nhật</Text>
                    </TouchableOpacity>

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
                        style={{ width: 200, height: 40, borderWidth: 1, borderRadius: 12, marginTop: 24, justifyContent: 'center', alignItems: 'center', backgroundColor: '#4D8D6E' }}
                        onPress={() => handleShowToast()}>
                        <Text style={{ color: '#FFFFFF' }}>show Toast</Text>
                    </TouchableOpacity>

                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
import React, { Component, useState, useEffect } from "react";
import { StyleSheet, Text, View, TouchableOpacity, TextInput, SafeAreaView, Dimensions, ScrollView, Image, FlatList, StatusBar, Linking } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useDispatch, useSelector } from 'react-redux';
import { WebView } from 'react-native-webview';
import stylesBase from '../../../configs/styles/styles';
import colors from '../../../configs/colors/colors';

export default WebViewScreen = ({ route }) => {
    const { url, title } = route.params;
    const navigation = useNavigation()
    const dispatch = useDispatch()

    useEffect(() => {
        console.log("Create WebViewScreen")

        return () => {
            console.log("Destroy WebViewScreen")
        }
    }, [])

    const openSearchInBrowser = () => {
        Linking.openURL(url);
    };

    return (
        <View style={{ flex: 1 }}>
            {/* TaskBar */}
            <View style={{ height: 40, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 8, backgroundColor: colors.white }}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}>
                    <Image
                        style={{ width: 24, height: 24, tintColor: colors.ink500 }}
                        source={require('../../../images/ic_close.png')} resizeMode="stretch" />
                </TouchableOpacity>
                <Text numberOfLines={1} ellipsizeMode="tail"
                    style={[stylesBase.H5Strong, { color: colors.ink500, flex: 1, textAlign: 'center', paddingStart: 8, paddingEnd: 8 }]}>{title}</Text>
                <TouchableOpacity
                    onPress={() => openSearchInBrowser()}>
                    <Image
                        style={{ width: 24, height: 24, tintColor: colors.ink500 }}
                        source={require('../../../images/ic_share.png')} resizeMode="stretch" />
                </TouchableOpacity>
            </View>

            {/* WebView */}
            <WebView source={{ uri: url }} />
        </View>
    );
};
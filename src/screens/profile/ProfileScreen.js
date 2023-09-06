import React, { Component, useState, useEffect } from "react";
import { StyleSheet, Text, View, Button, TouchableOpacity, TextInput, SafeAreaView, Dimensions, StatusBar, ImageBackground, Image } from "react-native";
import { useDispatch, useSelector } from 'react-redux';
import colors from '../../configs/colors/colors'
import stylesBase from '../../configs/styles/styles'

export default ProfileScreen = ({ navigation }) => {
    const dispatch = useDispatch();

    return (
        <SafeAreaView style={{ flex: 1 }}>
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

            <View style={styles.container}>
                <Text style={{ fontSize: 24 }}>Profile</Text>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#EEEEEE",
        alignItems: "center",
        justifyContent: "center"
    }
});
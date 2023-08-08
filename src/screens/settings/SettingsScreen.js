import React, { Component, useState, useEffect } from "react";
import { StyleSheet, Text, View, TouchableOpacity, TextInput, SafeAreaView, Dimensions, ScrollView, Image, FlatList } from "react-native";
import { useDispatch, useSelector } from 'react-redux';

export default SettingsScreen = ({ navigation }) => {
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={{ width: '100%', height: '6%', flexDirection: 'row', alignItems: 'center', backgroundColor: "#FFFFFF" }}>
                <TouchableOpacity
                    style={{ height: '100%', aspectRatio: 1.5, alignItems: 'center', flexDirection: 'row', marginStart: 12 }}
                    onPress={() => {
                        navigation.goBack()
                    }}>
                    <Image
                        style={{ width: 24, height: 24, }}
                        source={require('../../images/ic_back.png')} resizeMode="stretch" />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}
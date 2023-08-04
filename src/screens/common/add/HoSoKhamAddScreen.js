import React, { Component, useState, useEffect } from "react";
import { StyleSheet, Text, View, TouchableOpacity, TextInput, SafeAreaView, Dimensions, ScrollView, Image, FlatList } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from 'react-redux';
import { getPatientRecord } from '../../../redux/actions/updateAction'
import colors from '../../../configs/colors/colors'
import stylesBase from '../../../configs/styles/styles'

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default HoSoKhamAddScreen = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const [selectedValueGender, setSelectedValueGender] = useState('male');

    useEffect(() => {
        console.log("Create HoSoKhamAddScreen")

        return () => {
            console.log("Destroy HoSoKhamAddScreen")
        }
    }, [])

    const handleOptionSelect = (value) => {
        setSelectedValueGender(value);
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.sBackground, }}>
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
                <Text style={[stylesBase.H5Strong, { color: colors.ink500 }]}>Tạo hồ sơ mới</Text>
                <TouchableOpacity
                    style={{ height: '100%', aspectRatio: 1.5, alignItems: 'center', flexDirection: 'row', justifyContent: 'flex-end', marginEnd: 12 }}>
                    <Image
                        style={{ width: 24, height: 24 }}
                        source={require('../../../images/ic_sos.png')} resizeMode="stretch" />
                </TouchableOpacity>
            </View>

            <View style={{ flex: 1, backgroundColor: colors.sBackground, marginTop: 8, }}>
                {/* Chọn làm hồ sơ chính */}
                <TouchableOpacity style={{ flexDirection: 'row', backgroundColor: colors.white, alignItems: 'center' }}>
                    <Image
                        style={{ width: 24, height: 24, marginStart: 16, marginEnd: 8 }}
                        source={require('../../../images/ic_square_uncheck.png')} resizeMode="stretch" />
                    <Text style={[stylesBase.H5, { color: colors.ink500, marginTop: 12, marginBottom: 12 }]}>Chọn làm hồ sơ chính</Text>
                </TouchableOpacity>

                <View style={{ backgroundColor: colors.white, marginTop: 8 }}>
                    {/* Họ và tên */}
                    <View style={{ marginStart: 16, marginEnd: 16 }}>
                        <Text style={[stylesBase.H5, { color: colors.ink400, marginTop: 12 }]}>Họ và tên</Text>
                        <TextInput
                            style={[stylesBase.H3Strong, { color: colors.ink500, }]}
                            autoCapitalize='none'
                            placeholder="Nhập tên hồ sơ"
                            placeholderTextColor='#B3C3D4'
                        // onChangeText={setPassword}
                        // value={password}
                        />
                    </View>

                    {/* Giới tính */}
                    <View style={{ marginStart: 16, marginEnd: 16 }}>
                        <View style={{ width: '100%', height: 1, backgroundColor: colors.sLine, }} />
                        <Text style={[stylesBase.H5, { color: colors.ink400, marginTop: 12 }]}>Giới tính</Text>
                        <View style={{ flexDirection: 'row', marginTop: 4, marginBottom: 12 }}>
                            <TouchableOpacity
                                style={{ flexDirection: 'row', alignItems: 'center', }}
                                onPress={() => handleOptionSelect('male')}>
                                {selectedValueGender === 'male' ?
                                    <Image
                                        style={{ width: 24, height: 24, marginEnd: 8 }}
                                        source={require('../../../images/ic_circle_check.png')} resizeMode="stretch" />
                                    :
                                    <Image
                                        style={{ width: 24, height: 24, marginEnd: 8 }}
                                        source={require('../../../images/ic_circle_uncheck.png')} resizeMode="stretch" />}

                                <Text style={[stylesBase.H3Strong, { color: colors.ink500, }]}>Nam</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={{ flexDirection: 'row', alignItems: 'center', marginStart: 12 }}
                                onPress={() => handleOptionSelect('female')}>
                                {selectedValueGender === 'female' ?
                                    <Image
                                        style={{ width: 24, height: 24, marginEnd: 8 }}
                                        source={require('../../../images/ic_circle_check.png')} resizeMode="stretch" />
                                    :
                                    <Image
                                        style={{ width: 24, height: 24, marginEnd: 8 }}
                                        source={require('../../../images/ic_circle_uncheck.png')} resizeMode="stretch" />}
                                <Text style={[stylesBase.H3Strong, { color: colors.ink500, }]}>Nữ</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{ width: '100%', height: 1, backgroundColor: colors.sLine, }} />
                    </View>
                </View>
            </View>
        </SafeAreaView >
    );
}
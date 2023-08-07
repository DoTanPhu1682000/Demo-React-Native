import React, { Component, useState, useEffect } from "react";
import { StyleSheet, Text, View, TouchableOpacity, TextInput, SafeAreaView, Dimensions, ScrollView, Image, FlatList, StatusBar } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from 'react-redux';
import { getPatientRecord } from '../../../redux/actions/updateAction'
import colors from '../../../configs/colors/colors'
import stylesBase from '../../../configs/styles/styles'
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default HoSoKhamAddScreen = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const [selectedPatientRecord, setSelectedPatientRecord] = useState(false)
    const [selectedGender, setSelectedGender] = useState('male');
    const [selectedNation, setSelectedNation] = useState('vn');
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);

    useEffect(() => {
        console.log("Create HoSoKhamAddScreen")

        return () => {
            console.log("Destroy HoSoKhamAddScreen")
        }
    }, [])

    const handleSelectPatientRecord = () => {
        setSelectedPatientRecord(!selectedPatientRecord);
    };

    const handleSelectGender = (value) => {
        setSelectedGender(value);
    };

    const handleSelectNation = (value) => {
        setSelectedNation(value);
    };

    const handleDateChange = (event, date) => {
        setShowDatePicker(false);
        if (date !== undefined) {
            setSelectedDate(date);
        }
    };

    const formattedDate = format(selectedDate, 'dd/MM/yyyy');

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.sBackground, }}>
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
                <Text style={[stylesBase.H5Strong, { color: colors.ink500 }]}>Tạo hồ sơ mới</Text>
                <TouchableOpacity
                    style={{ height: '100%', aspectRatio: 1.5, alignItems: 'center', flexDirection: 'row', justifyContent: 'flex-end', marginEnd: 12 }}>
                    <Image
                        style={{ width: 24, height: 24 }}
                        source={require('../../../images/ic_sos.png')} resizeMode="stretch" />
                </TouchableOpacity>
            </View>

            <ScrollView>
                <View style={{ flex: 1, backgroundColor: colors.sBackground, marginTop: 8, marginBottom: 20 }}>
                    {/* Chọn làm hồ sơ chính */}
                    <TouchableOpacity
                        style={{ flexDirection: 'row', backgroundColor: colors.white, alignItems: 'center' }}
                        onPress={() => handleSelectPatientRecord()}>
                        {selectedPatientRecord ?
                            <Image
                                style={{ width: 24, height: 24, marginStart: 16, marginEnd: 8 }}
                                source={require('../../../images/ic_square_check.png')} resizeMode="stretch" />
                            : <Image
                                style={{ width: 24, height: 24, marginStart: 16, marginEnd: 8 }}
                                source={require('../../../images/ic_square_uncheck.png')} resizeMode="stretch" />}
                        <Text style={[stylesBase.H5, { color: colors.ink500, marginTop: 12, marginBottom: 12 }]}>Chọn làm hồ sơ chính</Text>
                    </TouchableOpacity>

                    <View style={{ backgroundColor: colors.white, marginTop: 8, }}>
                        <View style={{ marginStart: 16, marginEnd: 16 }}>
                            {/* Họ và tên */}
                            <Text style={[stylesBase.H5, { color: colors.ink400, marginTop: 12 }]}>Họ và tên</Text>
                            <TextInput
                                style={[stylesBase.H3Strong, { color: colors.ink500, }]}
                                autoCapitalize='none'
                                placeholder="Nhập tên hồ sơ"
                                placeholderTextColor='#B3C3D4'
                            // onChangeText={setPassword}
                            // value={password}
                            />

                            {/* Giới tính */}
                            <View style={{ width: '100%', height: 1, backgroundColor: colors.sLine, }} />
                            <Text style={[stylesBase.H5, { color: colors.ink400, marginTop: 12 }]}>Giới tính</Text>
                            <View style={{ flexDirection: 'row', marginTop: 4, marginBottom: 12 }}>
                                <TouchableOpacity
                                    style={{ flexDirection: 'row', alignItems: 'center', }}
                                    onPress={() => handleSelectGender('male')}>
                                    {selectedGender === 'male' ?
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
                                    onPress={() => handleSelectGender('female')}>
                                    {selectedGender === 'female' ?
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

                            {/* Ngày sinh */}
                            <View style={{ width: '100%', height: 1, backgroundColor: colors.sLine, }} />
                            <Text style={[stylesBase.H5, { color: colors.ink400, marginTop: 12 }]}>Ngày sinh</Text>
                            <TouchableOpacity
                                style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 6, paddingTop: 6, }}
                                onPress={() => setShowDatePicker(true)}>
                                <Text style={[stylesBase.H3Strong, { color: colors.ink500 }]}>{formattedDate}</Text>
                                <Image
                                    style={{ width: 24, height: 24, }}
                                    source={require('../../../images/ic_calendar.png')} resizeMode="stretch" />
                            </TouchableOpacity>
                            {showDatePicker && (
                                <DateTimePicker
                                    value={selectedDate}
                                    mode="date"
                                    maximumDate={new Date()}
                                    display="default"
                                    onChange={handleDateChange} />
                            )}

                            {/* Email */}
                            <View style={{ width: '100%', height: 1, backgroundColor: colors.sLine, marginTop: 6 }} />
                            <Text style={[stylesBase.H5, { color: colors.ink400, marginTop: 12 }]}>Email</Text>
                            <TextInput
                                style={[stylesBase.H3Strong, { color: colors.ink500, }]}
                                autoCapitalize='none'
                                placeholder="Nhập email"
                                placeholderTextColor='#B3C3D4'
                            // onChangeText={setPassword}
                            // value={password}
                            />

                            {/* Chiều cao & Cân nặng */}
                            <View style={{ width: '100%', height: 1, backgroundColor: colors.sLine }} />
                            <View style={{ flexDirection: 'row', }}>
                                <View style={{ flexDirection: 'column', flex: 1, }}>
                                    <Text style={[stylesBase.H5, { color: colors.ink400, marginTop: 12 }]}>Chiều cao (cm)</Text>
                                    <TextInput
                                        style={[stylesBase.H3Strong, { color: colors.ink500, }]}
                                        autoCapitalize='none'
                                        placeholder="Nhập chiều cao"
                                        placeholderTextColor='#B3C3D4'
                                    // onChangeText={setPassword}
                                    // value={password}
                                    />
                                </View>
                                <View style={{ width: 1, backgroundColor: colors.sLine, marginTop: 12, marginBottom: 12 }} />
                                <View style={{ flexDirection: 'column', flex: 1, marginStart: 12 }}>
                                    <Text style={[stylesBase.H5, { color: colors.ink400, marginTop: 12 }]}>Cân nặng (Kg)</Text>
                                    <TextInput
                                        style={[stylesBase.H3Strong, { color: colors.ink500, }]}
                                        autoCapitalize='none'
                                        placeholder="Nhập cân nặng"
                                        placeholderTextColor='#B3C3D4'
                                    // onChangeText={setPassword}
                                    // value={password}
                                    />
                                </View>
                            </View>

                            {/* Số điện thoại */}
                            <View style={{ width: '100%', height: 1, backgroundColor: colors.sLine }} />
                            <Text style={[stylesBase.H5, { color: colors.ink400, marginTop: 12 }]}>Số điện thoại</Text>
                            <TextInput
                                style={[stylesBase.H3Strong, { color: colors.ink500, }]}
                                autoCapitalize='none'
                                placeholder="Nhập số điện thoại"
                                placeholderTextColor='#B3C3D4'
                            // onChangeText={setPassword}
                            // value={password}
                            />

                            {/* Quốc gia */}
                            <View style={{ width: '100%', height: 1, backgroundColor: colors.sLine, }} />
                            <Text style={[stylesBase.H5, { color: colors.ink400, marginTop: 12 }]}>Quốc gia</Text>
                            <View style={{ flexDirection: 'row', marginTop: 4, marginBottom: 12 }}>
                                <TouchableOpacity
                                    style={{ flexDirection: 'row', alignItems: 'center', }}
                                    onPress={() => handleSelectNation('vn')}>
                                    {selectedNation === 'vn' ?
                                        <Image
                                            style={{ width: 24, height: 24, marginEnd: 8 }}
                                            source={require('../../../images/ic_circle_check.png')} resizeMode="stretch" />
                                        :
                                        <Image
                                            style={{ width: 24, height: 24, marginEnd: 8 }}
                                            source={require('../../../images/ic_circle_uncheck.png')} resizeMode="stretch" />}

                                    <Text style={[stylesBase.H3Strong, { color: colors.ink500, }]}>Việt Nam</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={{ flexDirection: 'row', alignItems: 'center', marginStart: 12 }}
                                    onPress={() => handleSelectNation('foreign')}>
                                    {selectedNation === 'foreign' ?
                                        <Image
                                            style={{ width: 24, height: 24, marginEnd: 8 }}
                                            source={require('../../../images/ic_circle_check.png')} resizeMode="stretch" />
                                        :
                                        <Image
                                            style={{ width: 24, height: 24, marginEnd: 8 }}
                                            source={require('../../../images/ic_circle_uncheck.png')} resizeMode="stretch" />}
                                    <Text style={[stylesBase.H3Strong, { color: colors.ink500, }]}>Nước ngoài</Text>
                                </TouchableOpacity>
                            </View>

                            {/* Địa chỉ */}
                            <View style={{ width: '100%', height: 1, backgroundColor: colors.sLine }} />
                            <Text style={[stylesBase.H5, { color: colors.ink400, marginTop: 12 }]}>Địa chỉ</Text>
                            <TextInput
                                style={[stylesBase.H3Strong, { color: colors.ink500, }]}
                                autoCapitalize='none'
                                placeholder="Nhập địa chỉ"
                                placeholderTextColor='#B3C3D4'
                            // onChangeText={setPassword}
                            // value={password}
                            />
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
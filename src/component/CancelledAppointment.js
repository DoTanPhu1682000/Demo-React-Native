import React, { Component, useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Modal, Image, TextInput } from 'react-native';
import colors from '../configs/colors/colors'
import stylesBase from '../configs/styles/styles'

const CancelledAppointment = ({ isVisible, onConfirm, onCancel, title, message, confirmText, cancelText, onNoteSelected, }) => {
    const [selectedNoteCancell, setSelectedNoteCancell] = useState("");
    const [selectedReason, setSelectedReason] = useState(null); // Lưu trạng thái của lý do được chọn
    const [isOtherReasonSelected, setIsOtherReasonSelected] = useState(false);
    const reasons = [
        { id: 0, text: 'Tôi bận / tôi muốn đổi lịch' },
        { id: 1, text: 'Tôi đã đi khám / tôi đã khỏi' },
        { id: 2, text: 'Tôi muốn hủy / Lý do khác' },
    ];

    const handleReasonSelection = (id) => {
        if (id === 2) {
            setIsOtherReasonSelected(!isOtherReasonSelected);
        } else {
            setIsOtherReasonSelected(false);
        }
        setSelectedReason(id);
    };

    return (
        <Modal visible={isVisible} transparent={true}>
            <View style={{ flex: 1, opacity: 0.5, backgroundColor: 'black' }} />
            <View style={{ position: 'absolute', width: '100%', bottom: 0 }}>
                <View style={{ backgroundColor: 'white', padding: 16, borderRadius: 12, }}>
                    <Text style={[stylesBase.H4Strong, { color: colors.ink500, textAlign: 'center' }]}>{title}</Text>
                    <View style={{ width: '100%', height: 1, backgroundColor: colors.sLine, marginVertical: 12 }} />
                    <View style={{ flexDirection: 'row', padding: 8, borderWidth: 1, borderColor: colors.primaryB200, borderRadius: 8, backgroundColor: "#EBF4FF", alignItems: 'center' }}>
                        <Image
                            style={{ width: 24, height: 24 }}
                            source={require('../images/ic_info_blue.png')} resizeMode="stretch" />
                        <Text style={[stylesBase.P1, { color: colors.primaryB500, marginStart: 8 }]}>Vui lòng chọn lý do để hủy</Text>
                    </View>

                    {reasons.map((reasonItem) => (
                        <TouchableOpacity
                            key={reasonItem.id}
                            style={{ flexDirection: 'row', paddingHorizontal: 8, paddingVertical: 12, borderRadius: 12, backgroundColor: colors.ink100, alignItems: 'center', marginTop: 12 }}
                            onPress={() => handleReasonSelection(reasonItem.id)}>
                            <Image
                                style={{ width: 24, height: 24 }}
                                source={
                                    selectedReason === reasonItem.id
                                        ? require('../images/ic_circle_check.png') // Đổi hình khi nút được chọn
                                        : require('../images/ic_circle_uncheck.png') // Hình mặc định khi nút không được chọn
                                }
                                resizeMode="stretch"
                            />
                            <Text style={[stylesBase.H5, { color: colors.ink500, marginStart: 8 }]}>{reasonItem.text}</Text>
                        </TouchableOpacity>
                    ))}

                    <TextInput
                        style={[stylesBase.H5, { height: 115, marginTop: 12, color: colors.ink500, backgroundColor: colors.ink100, borderRadius: 8, paddingVertical: 4, paddingHorizontal: 8, }]}
                        autoCapitalize='none'
                        placeholder="Nhập ý kiến của bạn"
                        placeholderTextColor={colors.ink200}
                        multiline={true}
                        maxLength={1000}
                        textAlignVertical="top"
                        onChangeText={setSelectedNoteCancell}
                        value={selectedNoteCancell}
                        editable={isOtherReasonSelected} />

                    <TouchableOpacity
                        style={{ flex: 1, alignItems: 'center', marginTop: 16, paddingVertical: 12, backgroundColor: colors.primary, borderRadius: 8 }}
                        onPress={() => {
                            // Gọi callback prop và truyền giá trị selectedNoteCancell
                            onNoteSelected(selectedNoteCancell);
                            onConfirm();
                        }}>
                        <Text style={[stylesBase.H5, { color: colors.white }]}>{confirmText}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal >
    );
};

export default CancelledAppointment;
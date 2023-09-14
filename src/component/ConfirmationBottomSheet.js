import React from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';
import colors from '../configs/colors/colors'
import stylesBase from '../configs/styles/styles'

const ConfirmationBottomSheet = ({ isVisible, onConfirm, onCancel, title, message, confirmText, cancelText }) => {
    return (
        <Modal visible={isVisible} transparent={true}>
            <View style={{ flex: 1, opacity: 0.5, backgroundColor: 'black' }} />
            <View style={{ position: 'absolute', width: '100%', bottom: 0 }}>
                <View style={{ backgroundColor: 'white', padding: 16, borderRadius: 12, }}>
                    <Text style={[stylesBase.H4Strong, { marginBottom: 4, color: colors.ink500, textAlign: 'center' }]}>{title}</Text>
                    <Text style={[stylesBase.H5, { color: colors.ink400, textAlign: 'center' }]}>{message}</Text>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 }}>
                        <TouchableOpacity
                            style={{ flex: 1, alignItems: 'center', backgroundColor: colors.primary100, borderRadius: 8 }}
                            onPress={onCancel}>
                            <Text style={[stylesBase.H5, { color: colors.primary, marginTop: 12, marginBottom: 12 }]}>{cancelText}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{ flex: 1, alignItems: 'center', marginStart: 12, backgroundColor: colors.primary, borderRadius: 8 }}
                            onPress={onConfirm}>
                            <Text style={[stylesBase.H5, { color: colors.white, marginTop: 12, marginBottom: 12 }]}>{confirmText}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal >
    );
};

export default ConfirmationBottomSheet;
import React from 'react';
import { Modal, View, Text, TouchableOpacity, Dimensions } from 'react-native';
import PropTypes from 'prop-types';
import colors from '../configs/colors/colors'
import stylesBase from '../configs/styles/styles'

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const BaseDialog = ({ visible, title, content, confirmText, onClose }) => {
    return (
        <Modal transparent={true} visible={visible} onRequestClose={onClose}>
            <View style={{ flex: 1, opacity: 0.7, backgroundColor: 'black' }} />
            <View style={{ position: 'absolute', width: windowWidth - 32, marginStart: 16, backgroundColor: 'white', padding: 16, borderRadius: 8, top: '40%' }}>
                <View>
                    <Text style={[stylesBase.H4Strong, { marginBottom: 4, color: colors.ink500, textAlign: 'center' }]}>{title}</Text>
                    <Text style={[stylesBase.H5, { color: colors.ink400, textAlign: 'center' }]}>{content}</Text>
                    <TouchableOpacity
                        style={{ marginTop: 16, alignItems: 'center', paddingTop: 8, paddingBottom: 8, textAlign: 'center', backgroundColor: colors.primary, borderRadius: 8 }}
                        onPress={onClose}>
                        <Text style={[stylesBase.H5, { color: colors.white }]}>{confirmText}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

BaseDialog.propTypes = {
    visible: PropTypes.bool.isRequired,
    title: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    onClose: PropTypes.func.isRequired,
};

export default BaseDialog;
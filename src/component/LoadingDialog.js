import React from 'react';
import { View, Modal, ActivityIndicator } from 'react-native';

const LoadingDialog = ({ visible }) => {
    return (
        <Modal visible={visible} transparent>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                <ActivityIndicator size="large" color="#ffffff" />
            </View>
        </Modal>
    );
};

export default LoadingDialog;
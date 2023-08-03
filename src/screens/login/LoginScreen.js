import React, { Component, useState, useEffect } from "react";
import { StyleSheet, Text, View, TouchableOpacity, TextInput, SafeAreaView, Dimensions, StatusBar, Image } from "react-native";
import { useDispatch, useSelector } from 'react-redux';
import { getAccessToken } from '../../redux/actions/updateAction'
import LoadingDialog from '../../component/LoadingDialog'
import colors from '../../configs/colors/colors'
import styles from '../../configs/styles/styles'

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const SIGN_IN = 'SIGN_IN';
const GET_STARTED = 'GET_STARTED';

export default LoginScreen = ({ navigation }) => {
    const dispatch = useDispatch();
    const [page, setPage] = useState(SIGN_IN)

    return (
        <View style={{ width: '100%', height: '100%' }}>
            <View style={{ width: '100%', height: '25%' }}>
                <RedComponent page={page} setPage={setPage} />
            </View>

            <View style={{ width: '100%', height: '50%', backgroundColor: '#F5F5F5' }}>
                {page === SIGN_IN ? <GreenComponent navigation={navigation} dispatch={dispatch} /> : <YellowComponent />}
            </View>

            <View style={{ flex: 1, backgroundColor: '#F5F5F5' }}>
                <BlueComponent />
            </View>
        </View>
    );
}

const BlueComponent = () => {
    return (
        <View style={{ width: '100%', height: '100%' }}>
            <View style={{ width: windowWidth - 60, height: 40, marginStart: 30, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                <View style={{ height: 1, width: '30%', backgroundColor: '#707070' }}></View>
                <View>
                    <Text style={{ color: '#1F2D3D' }}>  or connect with  </Text>
                </View>
                <View style={{ height: 1, width: '30%', backgroundColor: '#707070' }}></View>
            </View>

            <View style={{ width: windowWidth - 60, height: 50, marginStart: 30, marginTop: 16, flexDirection: 'row' }}>
                <TouchableOpacity
                    style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 8 }}>
                    <Image source={require('../../images/ic_google.png')} resizeMode="stretch"
                        style={{ width: 30, height: 30 }} />
                    <Text style={{ color: '#1F2D3D', marginStart: 12 }}>Google</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 8, marginStart: 12 }}>
                    <Image source={require('../../images/ic_facebook.png')} resizeMode="stretch"
                        style={{ width: 30, height: 30 }} />
                    <Text style={{ color: '#1F2D3D', marginStart: 12 }}>Facebook</Text>
                </TouchableOpacity>
            </View>

            <View style={{ width: windowWidth - 60, height: 50, marginStart: 30, marginTop: 16, flexDirection: 'row' }}>
                <TouchableOpacity
                    style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 8 }}>
                    <Image source={require('../../images/ic_twitter.png')} resizeMode="stretch"
                        style={{ width: 30, height: 30 }} />
                    <Text style={{ color: '#1F2D3D', marginStart: 12 }}>Twitter</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 8, marginStart: 12 }}>
                    <Image source={require('../../images/ic_discord.png')} resizeMode="stretch"
                        style={{ width: 30, height: 30 }} />
                    <Text style={{ color: '#1F2D3D', marginStart: 12 }}>Discord   </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const YellowComponent = () => {
    const [pwdHidden, setPWDHidden] = useState(true);
    return (
        <View style={{ width: '100%', height: '100%', justifyContent: 'center' }}>
            <Text style={{ fontSize: 24, marginStart: 30, color: '#1F2D3D' }}>Become part of the future</Text>
            {/* Email */}
            <View style={{ width: windowWidth - 60, height: 60, marginStart: 30, marginTop: 12, backgroundColor: '#FFFFFF', flexDirection: 'row', alignItems: 'center', borderRadius: 12 }}>
                <Image source={require('../../images/ic_gmail.png')} resizeMode="stretch"
                    style={{ width: 28, height: 28, marginStart: 12 }} />
                <TextInput
                    style={{ height: '100%', flex: 1, marginStart: 12, fontSize: 16 }}
                    autoCapitalize='none'
                    placeholder="E-mail" />
            </View>
            {/* Password */}
            <View style={{ width: windowWidth - 60, height: 60, marginStart: 30, marginTop: 12, backgroundColor: '#FFFFFF', flexDirection: 'row', alignItems: 'center', borderRadius: 12 }}>
                <Image source={require('../../images/ic_lock.png')} resizeMode="stretch"
                    style={{ width: 28, height: 28, marginStart: 12 }} />
                <TextInput
                    style={{ height: '100%', flex: 1, marginStart: 12, fontSize: 16 }}
                    autoCapitalize='none'
                    placeholder="Create password"
                    secureTextEntry={pwdHidden ? true : false} />
                <TouchableOpacity style={{ height: '100%', aspectRatio: 1, justifyContent: 'center', alignItems: "center" }}
                    onPress={() => setPWDHidden(!pwdHidden)}>
                    <Image source={require('../../images/ic_password.png')} resizeMode="stretch"
                        style={{ width: 28, height: 28 }} />
                </TouchableOpacity>
            </View>
            {/* Repeat password */}
            <View style={{ width: windowWidth - 60, height: 60, marginStart: 30, marginTop: 12, backgroundColor: '#FFFFFF', flexDirection: 'row', alignItems: 'center', borderRadius: 12 }}>
                <Image source={require('../../images/ic_lock.png')} resizeMode="stretch"
                    style={{ width: 28, height: 28, marginStart: 12 }} />
                <TextInput
                    style={{ height: '100%', flex: 1, marginStart: 12, fontSize: 16 }}
                    autoCapitalize='none'
                    placeholder="Repeat password"
                    secureTextEntry={pwdHidden ? true : false} />
                <TouchableOpacity style={{ height: '100%', aspectRatio: 1, justifyContent: 'center', alignItems: "center" }}
                    onPress={() => setPWDHidden(!pwdHidden)}>
                    <Image source={require('../../images/ic_password.png')} resizeMode="stretch"
                        style={{ width: 28, height: 28 }} />
                </TouchableOpacity>
            </View>
            {/* Button Join in community */}
            <TouchableOpacity style={{ width: windowWidth - 60, height: 50, marginStart: 30, marginTop: 20, justifyContent: 'center', alignItems: 'center', backgroundColor: '#4D8D6E', borderRadius: 100 }}>
                <Text style={{ color: '#FFFFFF', fontSize: 16 }}>Join in community</Text>
            </TouchableOpacity>
            {/* Terms of use and Privacy policy */}
            <View style={{ width: windowWidth - 60, height: 50, marginStart: 30, marginTop: 12, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ color: '#1F2D3D', fontSize: 12 }}>By creating an account, you agree to Wasty</Text>
                <Text style={{ color: '#1F2D3D', fontSize: 12 }}>Terms of use and Privacy policy</Text>
            </View>
        </View>
    );
}

const GreenComponent = ({ navigation, dispatch }) => {
    const navigateToHomeScreen = () => {
        dispatch(getAccessToken(navigation, phone, password))
    }
    const [phone, setPhone] = useState('0356709238');
    const [password, setPassword] = useState('123456');
    const [pwdHidden, setPWDHidden] = useState(true);

    return (
        <View style={{ width: '100%', height: '100%', justifyContent: 'center' }}>
            <Text style={{ fontSize: 24, marginStart: 30, color: '#1F2D3D' }}>Login in your account</Text>
            {/* Email */}
            <View style={{ width: windowWidth - 60, height: 60, marginStart: 30, marginTop: 20, backgroundColor: '#FFFFFF', flexDirection: 'row', alignItems: 'center', borderRadius: 12 }}>
                <Image source={require('../../images/ic_gmail.png')} resizeMode="stretch"
                    style={{ width: 28, height: 28, marginStart: 12 }} />
                <TextInput
                    style={{ height: '100%', flex: 1, marginStart: 12, fontSize: 16 }}
                    autoCapitalize='none'
                    placeholder="Phone"
                    onChangeText={setPhone}
                    value={phone} />
            </View>
            {/* Password */}
            <View style={{ width: windowWidth - 60, height: 60, marginStart: 30, marginTop: 20, backgroundColor: '#FFFFFF', flexDirection: 'row', alignItems: 'center', borderRadius: 12 }}>
                <Image source={require('../../images/ic_lock.png')} resizeMode="stretch"
                    style={{ width: 28, height: 28, marginStart: 12 }} />
                <TextInput
                    style={{ height: '100%', flex: 1, marginStart: 12, fontSize: 16 }}
                    autoCapitalize='none'
                    placeholder="Password"
                    onChangeText={setPassword}
                    value={password}
                    secureTextEntry={pwdHidden ? true : false} />
                <TouchableOpacity style={{ height: '100%', aspectRatio: 1, justifyContent: 'center', alignItems: "center" }}
                    onPress={() => setPWDHidden(!pwdHidden)}>
                    <Image source={require('../../images/ic_password.png')} resizeMode="stretch"
                        style={{ width: 28, height: 28 }} />
                </TouchableOpacity>
            </View>
            {/* Forget password */}
            <View style={{ width: windowWidth - 60, height: 30, marginStart: 30, marginTop: 20, flexDirection: 'row', alignItems: 'center' }}>
                <TouchableOpacity style={{ position: 'absolute', right: 0 }}>
                    <Text style={{ color: '#707070' }}>Forget password ?</Text>
                </TouchableOpacity>
            </View>
            {/* Button Login */}
            <TouchableOpacity style={{ width: windowWidth - 60, height: 50, marginStart: 30, marginTop: 10, justifyContent: 'center', alignItems: 'center', backgroundColor: '#4D8D6E', borderRadius: 100 }}
                onPress={navigateToHomeScreen}>
                <Text style={{ color: '#FFFFFF', fontSize: 16 }}>Login</Text>
            </TouchableOpacity>
        </View>
    );
}

const RedComponent = ({ page, setPage }) => {
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <StatusBar barStyle={'light-content'} />
            <View style={{ width: '100%', height: '100%' }}>
                <View style={{ width: '100%', flex: 1, backgroundColor: '#4D8D6E', justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ fontSize: 50, fontWeight: '600', color: '#FFFFFF' }}>wasty.</Text>
                    <Text style={{ color: '#FFFFFF' }}>think for nature</Text>
                </View>

                {/* Sign In or Get Started */}
                <View style={{ height: 50, flexDirection: 'row', backgroundColor: '#FFFFFF' }}>
                    <TouchableOpacity style={{ width: '50%', height: '100%', justifyContent: 'center', alignItems: "center" }}
                        onPress={() => { setPage(SIGN_IN) }}
                        disabled={page === SIGN_IN ? true : false}>
                        <Text style={{ fontSize: 20, color: '#4D8D6E' }}>Sign In</Text>
                        {page === SIGN_IN ? <View style={{ width: '100%', height: 3, position: 'absolute', bottom: 0, backgroundColor: '#4D8D6E' }}></View> : null}
                    </TouchableOpacity>

                    <TouchableOpacity style={{ width: '50%', height: '100%', justifyContent: 'center', alignItems: "center" }}
                        onPress={() => { setPage(GET_STARTED) }}
                        disabled={page === GET_STARTED ? true : false}>
                        <Text style={{ fontSize: 20, color: '#4D8D6E' }}>Get Started</Text>
                        {page === GET_STARTED ? <View style={{ width: '100%', height: 3, position: 'absolute', bottom: 0, backgroundColor: '#4D8D6E' }}></View> : null}
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView >
    );
}
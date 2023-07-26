import React, { Component } from 'react';
import { Text, Button, View, SafeAreaView, TouchableOpacity, ImageBackground } from 'react-native';

export default class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      message: "Welcome to Code 101 - React-native"
    }
  }

  render() {
    return (
      <View>
        <Text style={{ alignSelf: 'center', backgroundColor: '#33CC33' }}>{this.state.message}</Text>
        <ImageBackground style={{ height: '100%', width: '100%' }} source={require('./src/images/bluedeep.jpg')}></ImageBackground>
      </View>
    );
  }
}
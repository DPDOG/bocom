import React, {Component} from 'react';
import {View,Image,TouchableOpacity} from 'react-native';
import {WebView} from "react-native-webview";
import { getStatusBarHeight } from 'react-native-iphone-x-helper'
export default class TermsWebView extends React.Component {
  static navigationOptions = ({navigation}) => {
    return {
        headerTitle: (
            <View></View>
        ),
        headerStyle: {
            backgroundColor: '#26466c',
            borderBottomWidth: 0,
            shadowColor: "transparent",
            elevation: 0,
            shadowOpacity: 0,
      },
        headerRight: (<View/>),
        headerLeft: (
            <View style={{marginLeft: 10}}>
                <TouchableOpacity onPress={() => navigation.goBack(null)} style={{
                    width: 45,
                    height: 45,
                    marginLeft: 5,
                    justifyContent: "center",
                    alignItems: "center",
                    alignSelf: "center"
                }}>
                    <Image style={{resizeMode: "contain", width: 15, height: 15, marginBottom: 5,tintColor:"white"}}
                           source={require('../res/images/back.png')}/>
                </TouchableOpacity>
            </View>
        ),


    }
};
  render() {
    return (
      <WebView
        source={{uri: 'https://gtbob.com/'}}
       
      />
    );
  }
}
import React, { Component } from 'react';
import {GlobalVariables} from "./GlobalVariables";
import RNFirebase from 'react-native-firebase';

const configurationOptions = {
    debug: true,
    promptOnMissingPlayServices: true
}

const firebase = RNFirebase.initializeApp(configurationOptions)

export default firebase
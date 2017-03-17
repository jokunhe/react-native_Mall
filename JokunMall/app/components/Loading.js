
"use strict";

import React,{Component } from 'react';
import {View,Text,ActivityIndicator} from 'react-native';

export default class Loading extends Component{
    render(){
        return(
            <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                <ActivityIndicator size='large'/>
                <Text style={{marginTop:20}}>拼命加载中...</Text>
            </View>
        );
    }
}
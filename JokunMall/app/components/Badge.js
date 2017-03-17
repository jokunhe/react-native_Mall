

'use strict';

import React,{ Component } from 'react';
import { StyleSheet,Text,View } from 'react-native';
import p2d from '../utils/p2d';

class Badge extends Component{
    constructor(props){
        super(props);
    }
    render(){
        const text = this.props.text > 99 ? "..." : this.props.text ;
        return(
            <View style={[styles.badge,this.props.style]}><Text style={styles.badgeText}>{text}</Text></View>
        );
    }
}


const styles = StyleSheet.create({
    badge:{
        position:'absolute',
        top:0,
        right:0,
        width:p2d(36),
        height:p2d(36),
        backgroundColor:'#ff0000',
        borderRadius:p2d(18),
        alignItems:'center',
        justifyContent:'center'
    },
    badgeText:{
        backgroundColor:'transparent',
        color:'#ffffff',
        fontSize:p2d(18),
        fontWeight:'bold'
    }
});
export { Badge as default };
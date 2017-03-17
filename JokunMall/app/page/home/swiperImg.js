import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image
} from 'react-native';
let Dimensions =require('Dimensions');
let {width} = Dimensions.get('window');
export default class swiperImg extends Component {
    constructor(props){
        super(props);
    }
    render() {
        return (
            <Image style={[styles.slideView,]} source={{uri:this.props.logo}}/>
        );
    }
}

const styles = StyleSheet.create({

    slideView: {
        height: 240,
        width: width,
        resizeMode: Image.resizeMode.contain,
    }
});

module.exports = swiperImg;

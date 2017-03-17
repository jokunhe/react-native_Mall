import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
} from 'react-native';
let Dimensions =require('Dimensions');
let {width} = Dimensions.get('window');
export default class MiddleCommon extends Component {
    constructor(props){
        super(props);
    }
    render() {
        return (
            <View style={styles.container}>
                <Image source={{uri:this.props.logo}} style={styles.logo} />

                <View>
                    <Text numberOfLines={1} style={styles.title}> {this.props.displayName}</Text>
                </View>

                <View>
                    <Text style={styles.price}> 秒杀价￥{this.props.price}</Text>
                </View>

                <View>
                    <Text style={styles.creditPrice}> 美兑积分可抵{this.props.creditPrice}元</Text>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container:{
        backgroundColor:'white',
        width: width * 0.333333 ,
        borderLeftWidth:0.5,
    },
    logo:{
        height:90,
        resizeMode:'contain',
    },
    title:{
        fontSize:12,
        textAlign:'center'
    },
    price:{
        fontSize:10,
        textAlign:'center'
    },
    creditPrice:{
        fontSize:8,
        textAlign:'center'
    },
});
module.exports = MiddleCommon;

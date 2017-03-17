

'use strict';

import React,{ Component,PropTypes } from 'react';
import {View,StyleSheet,Image,Text,TouchableOpacity} from 'react-native';
import { colors } from '../constant/Consts';
import p2d from '../utils/p2d';


//按钮 For 详情页
export default class Button extends Component{
    static propTypes = {
        style: PropTypes.number, //按钮样式
        icon: PropTypes.number,  //按钮图标
        text: PropTypes.string,  //按钮文字
        textStyle:PropTypes.number, //按钮文字样式
        onPress: PropTypes.func,    //按钮点击事件
    }

    constructor(props){
        super(props);
    }

    render(){
        const { style,icon,text,textStyle,onPress } = this.props;
        return(
            <TouchableOpacity activeOpacity={0.8} onPress={onPress} >
                <View style={[styles.btn,style]}>
                    <Image style={styles.btnImg} source={icon}></Image>
                    <Text style={[styles.text,textStyle]}>{text}</Text>
                </View>
            </TouchableOpacity>
        );
    }
}

//通栏按钮
export class FullButton extends Component{
    static propTypes = {
        style : PropTypes.number,
        leftIcon: PropTypes.number,   //左侧图标
        leftText: PropTypes.string,   //左侧文字
        rightText: PropTypes.string,  //右侧文字
        onPress: PropTypes.func,      //按钮点击事件
    }
    
    constructor(props){
        super(props);
    }

    render(){
        const {style, leftIcon,leftText,rightText,onPress } = this.props;
        return(
            <TouchableOpacity style={[styles.full,style]} onPress={onPress}>
                <View style={styles.fullName}>
                    {leftIcon ? <Image style={styles.fullNameImg} source={leftIcon}></Image> : null}
                    <Text style={styles.fullNameText}>{leftText}</Text>
                </View>
                <View style={styles.fullName}>
                    <Text style={styles.fullNameText} >{rightText}</Text>
                    <Image style={styles.fullEnterImg} source={require('../../imgs/goods-right-arrow.png')}/>
                </View>
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    btn:{ flexDirection:'row', alignItems:'center',justifyContent:'center', width:p2d(375), height:p2d(100),backgroundColor: colors.bg_color_blue },
    btnImg:{ width:p2d(55),height:p2d(55),marginRight:p2d(14) },
    text: { color: colors.text_color_yellow, fontSize:p2d(30) },

    //通栏按钮
    full:{ 
        flexDirection:'row', justifyContent:'space-between', alignItems:'center', 
        width:p2d(750), height:p2d(76), backgroundColor:colors.bg_color_yellow,paddingLeft:p2d(26),paddingRight:p2d(26) 
    },
    fullName:{ flexDirection:'row', alignItems:'center' },
    fullNameImg: { width:p2d(48), height:p2d(48), borderRadius:p2d(24), marginRight:p2d(16) },
    fullNameText: { fontSize:p2d(30), color:colors.bg_color_blue },
    fullEnterImg:{ width:p2d(40),height:p2d(40) },

})
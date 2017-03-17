
'use strict';

import React, { Component } from 'react';
import {StyleSheet, View ,Image,Text,TouchableOpacity,Alert} from 'react-native';
import NavigationBar,{ NavigationButton } from '../../components/NavigationBar';
import Page from './Page';
import p2d from '../../utils/p2d';
import Easing from './Earnings';


export default class Popularize extends Page{
    constructor(props){
        super(props);
    }
    render(){
        return(
            <View style={styles.container}>
                <NavigationBar 
                    title="全面推广"
                    leftButtons={<NavigationButton icon={require('../../../imgs/left-arrow.png')} onPress={this._handleBack.bind(this)}/>}
                    rightButtons={ <NavigationButton text="推广说明" />  }
                />
                <View style={styles.content}>
                    <View style={styles.codeBox}>
                        <Image style={styles.codeImg} source={require('../../../imgs/mine-defalut-head.png')}/>
                        <Text style={styles.codeName}>我的昵称</Text>
                        <Text style={styles.codeMoney}>收益：10223</Text>
                        <Image style={styles.codeHLine} source={require('../../../imgs/Hline.png')}/>
                        <View style={styles.funs}>
                            <View style={styles.funsItem}><Text style={styles.funsNun}>512</Text><Text style={styles.funsText}>一级粉丝</Text></View>
                            <Image style={styles.codeVLine} source={require('../../../imgs/Vline.png')}/>
                            <View style={styles.funsItem}><Text style={styles.funsNun}>512</Text><Text style={styles.funsText}>一级粉丝</Text></View>
                        </View>
                        <TouchableOpacity style={styles.share}>
                            <Image style={styles.shareImg} source={require('../../../imgs/share.png')}/>
                            <Text style={styles.shareText}>分 享</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <TouchableOpacity style={styles.item} activeOpacity={0.9} onPress={this._onDetails.bind(this)}>
                    <Text style={styles.font}>收益明细</Text>
                    <Image style={{width:p2d(18),height:p2d(28)}} source={require('../../../imgs/right-arrow.png')}/>
                </TouchableOpacity>
                <TouchableOpacity style={styles.item} activeOpacity={0.9}>
                    <Text style={styles.font}>我的推广者</Text>
                    <Text style={styles.font}>1833****333</Text>
                </TouchableOpacity>
            </View>
        );
    }
    _onDetails(){
        this.props.navigator.push({
            component:Easing,
            params:{
                userId:1000,
            }
        })
    }
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        alignItems:'center',
        backgroundColor:'#f4d36a',
    },
    codeBox:{
        width:p2d(718),
        height:p2d(550),
        marginTop:p2d(16),
        backgroundColor:'#ffffff',
        alignItems:'center'
    },
    codeImg:{
        width:p2d(200),
        height:p2d(200),
        marginTop:p2d(90),
        backgroundColor:"#eeeeee"
    },
    codeName:{
        marginTop:p2d(20),
        fontSize:p2d(28),
    },
    codeMoney:{
        marginTop:p2d(20),
        marginBottom:p2d(20),
        fontSize:p2d(28)
    },
    funs:{
        width:p2d(718),
        paddingTop:p2d(20),
        flexDirection:'row',
        justifyContent:'space-around',
        alignItems:'center'
    },
    funsItem:{
        alignItems:'center'
    },
    funsNun:{
        fontSize:p2d(28)
    },
    funsText:{
        fontSize:p2d(24),
        marginTop:p2d(6),
        color:'#666666'
    },
    codeHLine:{
        width:p2d(700),
        height:p2d(1)
    },
    codeVLine:{
        width:p2d(1),
        height:p2d(46)
    },
    share:{
        position:'absolute',
        top:p2d(20),
        right:p2d(20),
        alignItems:'center'
    },
    shareImg:{
        width:p2d(42),
        height:p2d(42),
    },
    shareText:{
        fontSize:p2d(20)
    },
    item:{
        height:p2d(76),
        width:p2d(718),
        marginTop:p2d(16),
        paddingLeft:p2d(20),
        paddingRight:p2d(20),
        justifyContent:'space-between',
        alignItems:'center',
        flexDirection:'row',
        backgroundColor:'#ffffff'
    },
    font:{
        fontSize:p2d(28),
        color:"#0d2941",
    }

});


'use strict';

import React,{Component} from 'react';
import {StyleSheet, View, Image, Text,ListView,TouchableOpacity} from 'react-native';
import NavigationBar,{ NavigationButton } from '../../components/NavigationBar';
import Page from './Page';
import p2d from '../../utils/p2d';


export default class Earnings extends Page{
    constructor(props){
        super(props);
        let ds = new ListView.DataSource({rowHasChanged:(r1,r2)=> r1!==r2});
        const data = [
            {
                orderId:'A12343D12313',
                msg:'提成[全面推广-138*****313]',
                date:'2015-01-01',
                time:'10:10:10',
                status:'交易成功',
                money:"+30"
            },
            {
                orderId:'A12343D12313',
                msg:'提成[全面推广-138*****313]',
                date:'2015-01-01',
                time:'10:10:10',
                status:'交易成功',
                money:"+30"
            },
            {
                orderId:'A12343D12313',
                msg:'提成[全面推广-138*****313]',
                date:'2015-01-01',
                time:'10:10:10',
                status:'交易成功',
                money:"+30"
            },
            {
                orderId:'A12343D12313',
                msg:'提成[全面推广-138*****313]',
                date:'2015-01-01',
                time:'10:10:10',
                status:'交易成功',
                money:"+30"
            }
        ];
        this.state = {
            dataSource : ds.cloneWithRows(data)
        }
    }

    render(){
        return(
            <View style={{flex:1}}>
                <NavigationBar 
                    title="明细"
                    leftButtons={ <NavigationButton icon={require('../../../imgs/left-arrow.png')} onPress={this._handleBack.bind(this)}/> }
                />
                <ListView style={{flex:1}} dataSource={this.state.dataSource} renderRow={(item)=> this._renderRow(item)} />
            </View>
        );
    }
    _renderRow(item){
        return (
            <TouchableOpacity>
            <View style={styles.row}>
                <Image style={styles.rowImg} source={require('../../../imgs/ticheng.png')}/>
                <View style={styles.centerCell}>
                    <Text style={styles.info} >订单号[{item.orderId}]</Text>
                    <Text style={styles.info} >{item.msg}</Text>
                    <Text style={styles.time}>{item.date}   {item.time}</Text>
                </View>
                <View style={styles.rightCell}>
                    <Text style={styles.money}>{item.money}</Text>
                    <Text style={styles.status}>{item.status}</Text>
                </View>
            </View>
            <Image style={styles.line} source={require('../../../imgs/Hline.png')}/>
            </TouchableOpacity>
    );
    }
}

const  styles = StyleSheet.create({
    row:{
        flexDirection:'row',
        justifyContent:'space-between',
        width:p2d(750),
        height:p2d(159),
        paddingLeft:p2d(25),
        paddingRight:p2d(25),
        paddingTop:p2d(32),
    },
    rowImg:{
        width:p2d(60),
        height:p2d(60),
        marginLeft:p2d(20),
        marginRight:p2d(30)
    },
    centerCell:{
        flex:1,
    },
    info:{
        fontSize:p2d(20),
        color:"#0c2744",
    },
    time:{
        marginTop:p2d(20),
        color:"#a4a4a4",
        fontSize:p2d(20),
    },
    rightCell:{
        alignItems:'flex-end'
    },
    money:{
        fontSize:p2d(25),
        color:"#0c2744",
        fontWeight:'bold',
    },
    status:{
        fontSize:p2d(20),
        marginTop:p2d(46),
        color:"#a4a4a4",

    },
    line:{
        width:p2d(700),
        height:p2d(1),
        alignSelf:'center'
    }
});
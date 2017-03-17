import React, { Component } from 'react';
import {
    Image,
    View,
    StyleSheet
} from 'react-native';
const Lauch =require('../../../imgs/launcher_page.jpg');
import Main from './Main';


//export 因为要在其他类中使用
export default class LaunchImage extends Component{
    render(){
        return (

           <Image source={Lauch} style={styles.launchstyle} />

        )
    }
    //定时器|网络请求
    componentDidMount() {
        //定时：2s后切换到Main.js
        setTimeout(()=>{
            //跳转
            this.props.navigator.replace({
                component:Main, // 具体路由板块
            });

        },1000);
    }
}

//样式
const styles = StyleSheet.create({
    launchstyle:{
        flex:1,
        height:300,
        width:360,


    }
});
module.exports =LaunchImage;
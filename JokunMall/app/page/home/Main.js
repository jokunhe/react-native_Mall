import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Image,
    Platform,   // 判断当前运行的系统
    Navigator,
    AsyncStorage,
    BackAndroid
} from 'react-native';


/**-----导入外部的组件类------**/
import TabNavigator from 'react-native-tab-navigator';
//导入页面
const Nearby = require('./Nearby');
const Classified = require('./Classified');
const Home = require('./HomePage');
const ShopCar = require('../shopcart/ShopCart');
import Mine from '../mine/Mine';
//附近
const Nearbyicon = require('../../../imgs/tab_shop_home_n.png');
const Nearbyicons = require('../../../imgs/tab_shop_home_s.png');
//分类
const Classicon = require('../../../imgs/tab_classify_n.png');
const Classicons = require('../../../imgs/tab_classify_s.png');
//购物（主页）
const Homeicon = require('../../../imgs/tab_nearby_s.png');

//购物车
const Shopicon = require('../../../imgs/tab_shop_cart_n.png');
const Shopicons = require('../../../imgs/tab_shop_cart_s.png');
//我的
const Mineicon = require('../../../imgs/tab_mycenter_n.png');
const Minesicons = require('../../../imgs/tab_mycenter_s.png');




export default class Main extends Component{

    // 初始化函数(变量是可以改变的,充当状态机的角色)
    constructor(props) {
        super(props);
        this.state = {
            selectedTab: this.props.tab ? this.props.tab : 'home'
        };
    }
    render() {
        return (

            <TabNavigator tabBarStyle={styles.tab}>
                {/*--附近--*/}

                {this.renderTabBarItem('附近',Nearbyicon,Nearbyicons,'nearby','附近',Nearby)}
                {/*--分类--*/}
                {this.renderTabBarItem('分类',Classicon,Classicons,'classified ','分类',Classified)}
                {/*--购物--*/}
                {this.renderTabBarItem('购物',Homeicon,Homeicon,'home','购物',Home)}
                {/*--购物车--*/}
                {this.renderTabBarItem('购物车',Shopicon,Shopicons,'shopCar','购物车',ShopCar)}
                {/*--我的--*/}
                {this.renderTabBarItem('我的',Mineicon,Minesicons,'mine','我的',Mine)}
            </TabNavigator>

        );
    }
    //每个TabBarItem
    renderTabBarItem(title,iconName,selectedIconName,selectedTab,componentName,Component){
        return(
            <TabNavigator.Item
                title= {title}
                renderIcon={() => <Image source={iconName} style={styles.iconStyle}/>} // 图标
                renderSelectedIcon={() =><Image source={iconName} style={styles.iconStyle}/>}   // 选中的图标
                onPress={()=>{this.setState({selectedTab:selectedTab})}}
                selected={this.state.selectedTab === selectedTab}
                selectedTitleStyle={styles.selectedTitleStyle}
            >
               {<Component navigator={this.props.navigator}/>}
            </TabNavigator.Item>

        )

    }


    componentWillMount() {
        if (Platform.OS === 'android') {
            BackAndroid.addEventListener('hardwareBackPress', this.onBackAndroid);
        }
    };

    componentDidUnMount() {
        if (Platform.OS === 'android') {
            BackAndroid.removeEventListener('hardwareBackPress', this.onBackAndroid);
        }
    };

    onBackAndroid = () => {
        const { navigator } = this.props;
        const routers = navigator.getCurrentRoutes();
        if (routers.length > 1) {
            navigator.pop();
            return true;//接管默认行为
        }
        return false;//默认行为


    };

}



const styles = StyleSheet.create({
    tab:{
        backgroundColor:'#112945',

    },
    iconStyle:{
        width: Platform.OS === 'ios' ? 30 : 25,
        height:Platform.OS === 'ios' ? 30 : 25
    },

    selectedTitleStyle:{
        color:'#fddb64'
    }
});

// 输出组件类
module.exports = Main;
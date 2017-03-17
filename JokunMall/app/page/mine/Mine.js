
'use strict';

import React,{ Component } from 'react';
import { StyleSheet, View, Text, PixelRatio, Image,TouchableOpacity, Alert,InteractionManager} from 'react-native';
import NavigationBar from '../../components/NavigationBar';
import Item from '../../components/ItemForMine';
import p2d from '../../utils/p2d';
import { colors } from '../../constant/Consts';
import Popularize from './Popularize';
import Login from './Login';
import Detail from '../goods/Detail';
import {memberInfo as memberInfoURL} from '../../constant/ConstUrl';
import { post,get} from '../../utils/NetUtils';
import { toastShort } from '../../utils/ToastUtils';
import Page from './Page';

//我的页面
export default class Mine extends Page{
    constructor(props){
        super(props);
        this.state= {
            isLogin :false, //是否登录
            memberInfo:{}
        }
    }

    componentDidMount(){
      //页面切换动画结束后执行请求
      InteractionManager.runAfterInteractions(() => {
        this._getMemberInfo();
      });
    }

    componentWillReceiveProps() {
      //页面切换动画结束后执行请求
      InteractionManager.runAfterInteractions(() => {
        this._getMemberInfo();
      });
    }

    render(){
        return(
            <View style={styles.container}>
            <NavigationBar title="我的" />
                {this._renderInfo()}
            <View style={[styles.allOrder,styles.borderBottom]}>
                <Text style={{color:"#1d3447",fontSize:p2d(28)}}>全部订单</Text>
                <TouchableOpacity style={styles.lookAll} onPress={this.alert.bind(this)}>
                    <Text style={{color:"#7a7567",fontSize:p2d(22)}}>查看全部订单</Text>
                    <Image style={styles.rightArrow} source={require('../../../imgs/right-arrow.png')} />
                </TouchableOpacity>
            </View>
            <View style={[styles.itemBox,styles.borderBottom]}>
                <Item text="待付款" icon={require('../../../imgs/fahuo.png')} badge={100} onPress={this._login.bind(this)}  />
                <Item text="代发货" icon={require('../../../imgs/fahuo.png')} badge={1} onPress={this._detail.bind(this)}  />
                <Item text="待收货" icon={require('../../../imgs/shouhuo.png')} badge={1} onPress={this._setAddress.bind(this)}  />
                <Item text="待评价" icon={require('../../../imgs/pingjia.png')} onPress={this._getAddress.bind(this)}  />
                <Item text="退款/售后" icon={require('../../../imgs/tuikuan.png')}  onPress={this.alert.bind(this)}  />
            </View>
            <View style={[styles.itemBox,styles.borderBottom]}>
                <Item text="全民推广" icon={require('../../../imgs/tuiguang.png')} badge={22} onPress={this._popularize.bind(this)}  />
                <Item text="我的收藏" icon={require('../../../imgs/shoucang.png')}  onPress={this.alert.bind(this)}  />
                <Item text="消费明细" icon={require('../../../imgs/mingxi.png')}  onPress={this.alert.bind(this)}  />
                <Item text="我的评价" icon={require('../../../imgs/wode.png')}  onPress={this.alert.bind(this)}  />
                <Item text="我的积分" badge={1} icon={require('../../../imgs/jifen.png')}  onPress={this._unLogin.bind(this)}  />
            </View>
        </View>
        );
    }

    /**
     * 获取token去请求会员信息
     * @private
     */
    _getMemberInfo(){
        storage.load({key:'TOKEN'}).then((data)=>{
            get( memberInfoURL ,{token:data})
                .then((rs)=>{
                    if(rs.status_code==0){
                        this.setState({
                            isLogin:true,
                            memberInfo:rs.result
                        });
                    }else{
                        console.log(rs);
                        toastShort(rs.result_msg ? rs.result_msg : '获取信息失败，请重试');
                    }
                })
                .catch((error)=>{
                    console.log(error)
                });
        }).catch((error)=>{})
    }

    /**
     * 显示信息
     * @private
     */
    _renderInfo(){
        if(this.state.isLogin){
            return(
                <View style={[styles.head,styles.borderBottom]}>
                    {
                        this.state.memberInfo.pic_url ?
                            <Image style={styles.headImg} source={{uri:this.state.memberInfo.pic_url}} />
                        :
                            <Image style={styles.headImg} source={require('../../../imgs/mine-defalut-head.png')} />
                    }
                    <Text style={styles.phone}>{this.state.memberInfo.nick_name}</Text>
                    <TouchableOpacity style={styles.setting} onPress={this.alert.bind(this)}>
                        <Text style={{fontSize:p2d(26)}}>设置</Text>
                    </TouchableOpacity>
                </View>
            );
        }else{
            return(
                <View style={[styles.head,styles.borderBottom,{justifyContent:'center'}]}>
                    <View style={{ flexDirection:'row',alignItems:'center' }}>
                        <TouchableOpacity style={[styles.loginBtn,{marginRight:20}]} onPress={this.alert.bind(this)}>
                            <Text style={{color:colors.text_color_yellow}}>登录</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.loginBtn} onPress={this.alert.bind(this)}>
                            <Text style={{color:colors.text_color_yellow}}>注册</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            );
        }
    }

    //全民推广
    _popularize(){
        this.props.navigator.push({
            component:Popularize,
        })
    }

    //登录
    _login(){
        this.props.navigator.push({
            component:Login,
            params:{
                onSuccess:()=>{this.props.navigator.pop()}
            }
        })
    }

    //详情页面
    _detail(){
        this.props.navigator.push({
            component:Detail,
            params:{
                id:'587389975a5516caeb4e295e'
                //id:"5873896d5a5516caeb4def9c",
            }
        })
    }

    //调试用
    _productList(){
        storage.load({key:'TOKEN'}).then((token)=>{
            post('http://192.168.4.240:9050/mall/mall_commodity_service/v1/product/search',{
                token:token
            }).then((rs)=>{
                console.log('商品列表：',rs)
            });
        }).catch((error)=>{});
    }
    //测试用：设置一个固定的地址
    _setAddress(){
      storage.load({key:'TOKEN'}).then((token)=>{
        post('http://192.168.4.240:9050/mall/mall_user_service/v1/address/add',{
          token:token,
          provinceId:'110000',
          cityId:'110100',
          countyId:'110101',
          address:'这是一个测试用地址',
          prefered:1,
          receiver:'测试姓名',
          phone:'13728620011',
          certid:'510321199411285436'
        }).then((rs)=>{
          console.log('添加地址：',rs);
          if(rs.status_code==0){
            toastShort('添加地址成功。');
          }else{
            toastShort('添加地址失败。');
          }
        });

      }).catch((error)=>{});
    }

  //调试用
  _getAddress(){
    storage.load({key:'TOKEN'}).then((token)=>{
        post('http://192.168.4.240:9050/mall/mall_user_service/v1/address/list',{
        token:token,
      }).then((rs)=>{
        console.log('地址列表：',rs)
      });
    }).catch((error)=>{});
  }

    alert(){
        if(this.state.isLogin){
            Alert.alert("提示","开发中~~我是："+this.state.memberInfo.nick_name+"，余额："+this.state.memberInfo.consume_points);
        }else{
            this.props.navigator.push({
                component:Login,
                params:{
                    onSuccess:()=>{this.props.navigator.pop()}
                }
            })
        }
    }

    //退出登录
    _unLogin(){
        //删除token
        storage.remove({key: 'TOKEN'});
        TOKEN = '';

        //更改登录状态
        this.setState({
            isLogin :false,
            memberInfo:{}
        });
        toastShort('退出登录完成。');
    }
}

let styles = StyleSheet.create({
  container :{
    flex:1,
    alignItems: 'center',
    backgroundColor:'#fdda6a'
  },
  borderBottom:{
    borderBottomWidth:p2d(1),
    borderBottomColor:'#0d2844',
    borderStyle:'solid',
  },
  head:{
    width:p2d(700),
    height:p2d(345),
    alignItems:'center',
  },
  headImg:{
    width:p2d(160),
    height:p2d(160),
    borderRadius:p2d(80),
    marginTop:p2d(68),
    marginBottom:p2d(36),
    backgroundColor:'#fff'
  },
  phone:{
    marginBottom:p2d(56),
    color:'#ffffff',
  },
  setting:{
    alignSelf:'flex-end',
    alignItems:'flex-end',
    position:'absolute',
    top:p2d(30),
    right:p2d(30),
  },
  allOrder:{
    width:p2d(700),
    height:p2d(72),
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center',
    paddingLeft:p2d(20),
    paddingRight:p2d(20),
  },
  lookAll:{
    flexDirection:'row',
    justifyContent:'center',
    alignItems:'center'
  },
  rightArrow:{
    width:p2d(16),
    height:p2d(26),
    marginLeft:p2d(20)
  },
  itemBox:{
    width:p2d(700),
    flexDirection:'row',
    justifyContent:'space-between'
  },
  loginBtn:{width:100,height:40,justifyContent:'center',alignItems:'center',backgroundColor:colors.bg_color_blue}
});
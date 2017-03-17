/*
 *
 * 登录页面
 * @param onSuccess 登录完成后的回调函数
 * 使用例子：
     this.props.navigator.push({
        component:Login,
        params:{
            onSuccess:()=>{this.props.navigator.pop()}
        }
     });
 * 登录成功后 token 会持久化存储
 * 全局获取token例子：
     storage.load({key:'TOKEN'}).then((data)=>{
        console.log(data);
     }).catch((error)=>{
        console.log(error);
     })
 */

'use strict';

import React,{ PropTypes } from 'react';
import {StyleSheet, View, Image, Text,TextInput,TouchableOpacity,ScrollView} from 'react-native';
import Page from './Page';
import NavigationBar,{NavigationButton} from '../../components/NavigationBar';
import p2d from '../../utils/p2d';
import {post,get } from '../../utils/NetUtils';
import {colors} from '../../constant/Consts';
import {login as loginUrl} from '../../constant/ConstUrl';
import MD5 from '../../utils/MD5';
import {toastShort} from '../../utils/ToastUtils';

//登录页面
export default class Login extends Page{
    static propTypes= {
        onSuccess: PropTypes.func
    };

    constructor(props){
        super(props);
        this.state= {
            secureTextEntry : true, //密码是否可见，备用
            user_id:'',             //账号
            pass_word:'',           //密码
            toastVisable:false,     //弹窗
            isLoging:false,          //是否登录中
        };

    }


    render(){
        return(
            <View>
                <NavigationBar 
                    title="登录"
                    leftButtons={ <NavigationButton icon={require('../../../imgs/left-arrow.png')} onPress={this._handleBack.bind(this)}/> }
                />
                <ScrollView>
                    <View style={styles.logoBox}>
                        <Image style={styles.logo} source={require('../../../imgs/login-logo.png')}/>
                    </View>
                    <View style={styles.inputBox}>
                        <Text style={styles.label}>账号</Text>
                        <TextInput
                            ref="username"
                            style={styles.input}
                            editable={!this.state.isLoging}
                            placeholder="请输入账号"
                            onChangeText={(text)=>this.setState({user_id:text})}
                        />
                    </View>
                    <View style={styles.inputBox}>
                        <Text style={styles.label}>密码</Text>
                        <TextInput
                            ref="password"
                            style={styles.input}
                            editable={!this.state.isLoging}
                            placeholder="请输入密码"
                            secureTextEntry={this.state.secureTextEntry}
                            onChangeText={(text)=>this.setState({pass_word:text})}
                        />
                        <TouchableOpacity><Text style={styles.findPwd}>忘记密码?</Text></TouchableOpacity>
                    </View>
                    <TouchableOpacity style={[styles.loginBtn,{height:p2d(100)}]} onPress={this._actionLogin.bind(this)} activeOpacity={0.9}>
                        <Image resizeMethod="scale" resizeMode="stretch" style={[styles.loginBtn, this.state.isLoging && styles.disableBtn ]} source={require('../../../imgs/login-btn.png')}>
                            <Text style={{color:colors.bg_color_blue}}>{this.state.isLoging ? "登录中..." : "登录"}</Text>
                        </Image>
                    </TouchableOpacity>
                    <View style={styles.other}>
                        <View style={styles.line}/>
                        <Text style={styles.otherText}>其他登录方式</Text>
                        <View style={styles.line}/>
                    </View>
                    <View style={styles.threeLogin}>
                        <TouchableOpacity style={styles.weixinqq}>
                            <Image style={styles.otherImg} source={require('../../../imgs/login-weixin.png')} />
                            <Text>微信</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.weixinqq}>
                            <Image style={styles.otherImg} source={require('../../../imgs/login-qq.png')} />
                            <Text>QQ</Text>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity style={styles.regBtn} onPress={this._actionRegister.bind(this)}>
                        <Image style={styles.regImg} source={require('../../../imgs/login-register.png')}/>
                        <Text style={styles.regText}>注册新用户</Text>
                    </TouchableOpacity>
                </ScrollView>

            </View>
        );
    }

    /**
     * 登录
     * @returns {boolean}
     * @private
     */
    _actionLogin(){
        //避免重复点击发送请求
        if(this.state.isLoging){
            return false;
        }

        //简单校验输入数据
        if( this.state.user_id==''){
            toastShort('请输入账号。');
            this.refs.username.focus();
            return false;
        }

        if( this.state.pass_word==''){
            toastShort('请输入密码。');
            this.refs.password.focus();
            return false;
        }

        this.setState({isLoging:true});   //设置为登录中

        const encryptPassword = MD5(this.state.pass_word);
        post(loginUrl,{
            user_id: this.state.user_id,
            pass_word: encryptPassword
        }).then((rs)=>{
            if(rs.status_code==0){
                storage.save({
                    key: 'TOKEN',               //登录token
                    rawData:rs.result.token,
                    // 如果不指定过期时间，则会使用defaultExpires参数
                    // 如果设为null，则永不过期
                    expires: null,
                });

                TOKEN ? rs.result.token : global.TOKEN = rs.result.token;
                
                toastShort('登录成功',null,null,null,this.props.onSuccess);  //提示完后调用回调函数
            }else{
                toastShort(rs.result_msg);
            }
            this.setState({isLoging:false});
        }).catch((err)=>{
            this.setState({isLoging:false});
            toastShort('请求失败,请重试。');
        });
    }
    //注册
    _actionRegister(){
        //测试代码
        storage.load({key:'TOKEN'}).then((data)=>{
            console.log(data);
        }).catch((error)=>{
            console.log(error);
        })
    }
}

const styles = StyleSheet.create({
    logoBox:{
        width:p2d(750),
        height:p2d(386),
        backgroundColor:'#fddb6a',
        alignItems:'center',
    },
    logo:{
        width:p2d(200),
        height:p2d(200),
        marginTop:p2d(100)
    },
    inputBox:{
        flexDirection:'row',
        width:p2d(548),
        height:p2d(70),
        marginTop:p2d(20),
        paddingLeft:p2d(20),
        paddingRight:p2d(20),
        backgroundColor:'#f7f7f7',
        alignSelf:'center',
        justifyContent:'space-between',
        alignItems:'center'
    },
    label:{
        marginRight:p2d(10),
        fontSize:p2d(22),
        color:"#112944"
    },
    input:{
        flex:1,
        fontSize:p2d(22),
        color:"#112944"
    },
    findPwd:{
        fontSize:p2d(18),
        color:"#c2c2c2",
    },
    loginBtn:{
        width:p2d(290),
        height:p2d(80),
        justifyContent:'center',
        alignItems:'center',
        alignSelf:'center',
        marginTop:p2d(20),
        opacity:1
    },
    disableBtn:{
        opacity:0.5
    },
    other:{
        flexDirection:'row',
        alignSelf:'center',
        alignItems:'center',
        marginTop:p2d(106)

    },
    line:{
        width:p2d(88),
        height:0,
        borderTopWidth:1,
        borderColor:'#9d9d9d',
        marginLeft:p2d(14),
        marginRight:p2d(14)
    },
    otherText:{
        fontSize:p2d(22),
        color:'#9d9d9d'
    },
    otherImg:{
        width:p2d(70),
        height:p2d(60),
    },
    threeLogin:{
        flexDirection:'row',
        justifyContent:'space-between',
        width:p2d(270),
        marginTop:p2d(62),
        alignSelf:'center'
    },
    weixinqq:{
        justifyContent:'center',
        alignItems:'center'
    },
    regBtn:{
        flexDirection:'row',
        width:p2d(750),
        height:p2d(88),
        marginTop:p2d(102),
        backgroundColor:'#fddb6a',
        justifyContent:'center',
        alignItems:'center'
    },
    regImg:{
        width:p2d(40),
        height:p2d(40),
        marginRight:p2d(14),
    },
    regText:{
        fontSize:p2d(30),
        color:"#112945",
    }
});
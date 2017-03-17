import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    TextInput,
    ScrollView
} from 'react-native';
const juhuatu = require('../../../imgs/launcher_page.jpg');
import { post, get } from '../../utils/NetUtils';
import {colors, window} from '../../constant/Consts';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import {defaultAddress,Total,multibuy,} from'../../constant/ConstUrl';
import {memberInfo as memberInfoURL} from '../../constant/ConstUrl';
import Orderlist from './Orderlist';
import pay from'../../page/pay/Pay';
import Main from'../../page/home/Main';
import NavigationBar,{ NavigationButton } from '../../components/NavigationBar';
let ids =[];
export default class ConfirmOrder extends Component {
    constructor(props) {
        super(props);
        this.state = {
            defaultaddress: [],
            shoppingcart: [],
            isloding: false,
            Totalitem:[],
            totalpoints:[],
        };
            for (var i = 0; i<this.props.items.length; i++) {
                ids.push(
                    this.props.items[i].id
                );
            }
    }

    componentDidMount() {
        storage.load({key:'TOKEN'}).then((token)=>{
            /*默认地址数据请求*/
            post(defaultAddress, {token:token}).then((rs) => {


                this.setState({
                    defaultaddress: rs.result,
                    isloding: true,
                });
                if(this.state.defaultaddress == null){
                   this.nulladress()
                }
                console.log(this.state.defaultaddress);
            }).catch((error) => {
                console.log('出错了:', error);
            }).done();
            /*合计数据请求*/
            post(Total, {token:token,ids}).then((rs) => {
                this.setState({
                    Totalitem: rs.result,
                });
                console.log(this.state.Totalitem);
            }).catch((error) => {
                console.log('出错了:', error);
            }).done();
            /*积分余额请求*/
            get(memberInfoURL, {token:token}).then((rs) => {
                this.setState({
                    totalpoints: Number(rs.result.totalpoints).toFixed(0),
                });

            }).catch((error) => {
                console.log('出错了:', error);
            }).done();
        });
    }
    _Orderlist(){
        var listitem =[];
        var data = this.props.items;

        for (var i=0;i<data.length;i++) {
            var item = data[i];
            console.log(item);
            listitem.push(
                <Orderlist {...item} key={i}/>
            );
        }
        return listitem;
    }
    _handleBack(){
        const navigator = this.props.navigator;
        if(navigator && navigator.getCurrentRoutes().length > 1){
            navigator.pop();
            return true;
        }
        return false;
    }

    conOder(){
        if(this.state.text == undefined){
            this.setState({
                text: '买家没有留言'
            })
        }
        storage.load({key:'TOKEN',}).then((token)=>{
            /* 创建订单*/
            post(multibuy, {token:token,itemIds:ids,addressId:this.state.defaultaddress.id,remark:this.state.text}).then((rs) => {
                console.log(rs);
                if(rs.status_code == '0'){
                this.props.navigator.push(
                    {
                        component:pay,
                        params:{
                            paymentId:rs.result_msg
                        }
                    }
                )}
                else {
                    alert(rs.result_msg)
                }
            }).catch((error) => {
                console.log('出错了:', error);
            }).done();
        });
    }

    nulladress(){
        setTimeout(()=>{
            this.props.navigator.resetTo({
                component : Main,
                params:{
                    tab:'mine'
                }
            })},700);
    }

    render() {
        console.log(this.props.items);
        if (this.state.isloding == false) {
            return (
                <Image source={juhuatu} style={styles.juhuatu}/>
            );
        }
        else if(this.state.defaultaddress == null){
            return(
              <View style={styles.nulladress}>
                  <Text>
                      请先添加收货地址！
                  </Text>

              </View>
            );
        }
        else {
            return (
                <ScrollView>
                    <NavigationBar
                        title="提交订单"
                        leftButtons={<NavigationButton icon={require('../../../imgs/left-arrow.png')} onPress={this._handleBack.bind(this)}/>}
                    />
                <View style={styles.container}>
                    {/*地址栏*/}
                    <View style={styles.addres}>
                        <View>
                            <View style={styles.addresman}>
                                <Text>
                                    收货人：{this.state.defaultaddress.receiver}
                                </Text>
                                <Text>
                                    {this.state.defaultaddress.phone}
                                </Text>
                            </View>
                            <Text>
                                收货地址：{this.state.defaultaddress.province}{this.state.defaultaddress.city}{this.state.defaultaddress.county}{this.state.defaultaddress.address}
                            </Text>
                        </View>
                    </View>
                    {/*商品列表栏*/}
                    {this._Orderlist()}
                    {/*配送方式*/}
                    <View style={styles.courier}>
                        <Text>配送方式:</Text>
                        <Text style={{color:'#9e9e9f'}}>快递上门</Text>
                    </View>

                    {/*留言栏*/}
                    <View style={styles.messageboxs}>
                        <Text style={{width:window.scWidth*0.2, marginTop:5,}}>
                            买家留言：
                        </Text>
                        <KeyboardAwareScrollView>
                        <View style={styles.messagebox}>
                            <TextInput
                                style={styles.message}
                                keyboardType='web-search'
                                underlineColorAndroid='transparent'
                                autoFocus={true}
                                onChangeText={(text) => {
                                    this.setState({text});
                                }}
                            />
                        </View>
                        </KeyboardAwareScrollView>
                    </View>

                    {/*合计栏*/}
                    <View style={{position:'relative',height:290,}}>
                    <View style={styles.Total}>
                        <Text style={{width:window.scWidth*0.3}}>
                            共{this.props.items.length}件商品
                        </Text>
                        <Text style={{width:window.scWidth*0.3}}>
                            合计：
                        </Text>
                        <View>
                            <Text>
                                金额：￥{this.state.Totalitem.total}
                            </Text>

                            <Text>
                                运费：￥{this.state.Totalitem.freight}
                            </Text>

                            <Text>
                                积分：{this.state.Totalitem.creditTotal}
                            </Text>
                        </View>
                    </View>
                    {/*积分余额以及提交订单*/}
                    <View style={styles.sub}>
                        <Text>积分余额：{this.state.totalpoints}</Text>
                        <TouchableOpacity onPress={this.conOder.bind(this)}>
                        <View style={styles.Ordersub}>
                            <Text style={{textAlign:'center',height:20,alignSelf:'center',}} >
                                提交订单
                            </Text>
                        </View>
                        </TouchableOpacity>
                    </View>
                    </View>
                </View>
                </ScrollView>
            )
        }
    }
}
const styles = StyleSheet.create({
    container:{
        backgroundColor: 'white',
        flex:1,
    },
    juhuatu:{
        flex:1,
        height:300,
        width:360,
    },
    addres:{
        padding:5,
        margin:5,
        borderWidth:1,
    },
    addresman:{
        flexDirection: 'row',
        justifyContent:'space-between',
    },
    courier:{
        flexDirection: 'row',
        height:50,
        margin:5,
        borderTopWidth:1,
        alignItems:'center',
    },
    messageboxs:{
        margin:5,
        flexDirection: 'row',
        paddingTop:5,
        borderTopWidth:1,
        borderBottomWidth:1
    },
    messagebox:{
        height:100,
        width:window.scWidth*0.75,
    },
    message:{
        paddingTop:0,
        paddingBottom:0,
        fontSize:14,
    },
    Total:{
        flexDirection: 'row',
        width:window.scWidth,
        padding:5,
        borderTopWidth:1,
        position: 'absolute',
        bottom:40,
        left:0
    },
    sub:{
        width:window.scWidth,
        flexDirection: 'row',
        justifyContent:'space-between',
        paddingRight:5,
        paddingLeft:5,
        paddingTop:5,
        marginTop:5,
        borderTopWidth:1,
        position: 'absolute',
        bottom:5,
        left:0
    },

    Ordersub:{
        height:30,
        borderRadius: 5,
        backgroundColor: '#fdda6a',
        width:80,
        justifyContent:'center'
    },
    nulladress:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',

    }
}

);

module.exports =ConfirmOrder;
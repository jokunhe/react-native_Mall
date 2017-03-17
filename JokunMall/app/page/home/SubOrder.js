/**
 * Created by jokunhe on 2017/1/13.
 */
import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    TextInput,

} from 'react-native';
const juhuatu = require('../../../imgs/launcher_page.jpg');
import { post, get } from '../../utils/NetUtils';
import {colors, window} from '../../constant/Consts';
import {defaultAddress,shoppingCart,userInfo,price} from'../../constant/ConstUrl';
const cellHeight = 104;
export default class SubOrder extends Component {
    constructor(props) {
        super(props);
        this.state = {
            defaultaddress: {},
            shoppingcart: {},
            isloding: false

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

        }).catch((error) => {
            console.log('出错了:', error);

        }).done()}
    );
    }


    render() {
        console.log(this.props.token);
        if (this.state.isloding == false) {
            return (

                <Image source={juhuatu} style={styles.juhuatu}/>

            );
        }
        else {
            return (
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
                    <View style={styles.shoppinlist}>
                        {/*商品图片*/}
                        <View>
                            <Image source={{uri: this.state.defaultaddress.province}} style={styles.shoppingimg}/>
                        </View>

                        {/*商品数据*/}
                        <View style={styles.bili}>
                            {/*商品名字*/}
                            <Text>
                                {this.state.defaultaddress.province}
                            </Text>
                            {/*价格跟数量*/}
                            <View style={styles.priceQuantity}>
                                <Text>
                                    积分{this.state.defaultaddress.province}+￥{this.state.defaultaddress.province}
                                </Text>
                                <Text>
                                    X{this.state.defaultaddress.province}
                                </Text>
                            </View>
                        </View>
                    </View>
                    {/*配送方式*/}
                    <View style={styles.courier}>
                    <Text>配送方式:</Text>
                    <Text style={{color:'#9e9e9f'}}>快递上门</Text>
                    </View>

                    {/*留言栏*/}
                    <View style={styles.messageboxs}>
                        <Text style={{width:window.scWidth*0.2}}>
                            买家留言：
                        </Text>
                        <View style={styles.messagebox}>
                        <TextInput
                            style={styles.message}
                            keyboardType='web-search'
                            underlineColorAndroid='transparent'
                            multiline={true}

                        />
                        </View>

                    </View>

                    {/*合计栏*/}
                    <View style={styles.Total}>
                        <Text style={{width:window.scWidth*0.3}}>
                            共件商品
                        </Text>
                        <Text style={{width:window.scWidth*0.3}}>
                            合计：
                        </Text>
                        <View>
                            <Text>
                                金额：￥
                            </Text>

                            <Text>
                                运费：￥
                            </Text>

                            <Text>
                                积分：
                            </Text>
                        </View>
                    </View>

                    {/*积分余额以及提交订单*/}
                    <View style={styles.sub}>
                        <Text>积分余额：</Text>
                        <View style={styles.Ordersub}>
                            <Text style={{textAlign:'center',height:20,alignSelf:'center',}}>
                                提交订单
                            </Text>
                        </View>

                    </View>
                </View>

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
    shoppinlist:{
        padding:10,
        height:100,
        flexDirection: 'row',
        borderTopWidth:1,
    },
    shoppingimg:{
        flexGrow:1,
        height:80,
        width:80,
        marginRight:10,
    },
    bili:{
        flexGrow:2,
        justifyContent:'space-between',
    },
    priceQuantity:{

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
    },

    Ordersub:{
        height:30,
        borderRadius: 5,
        backgroundColor: '#fdda6a',
        width:80,
        justifyContent:'center'
    }

});

module.exports =SubOrder;
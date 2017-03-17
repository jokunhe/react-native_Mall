import React, {Component, PropTypes} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    PixelRatio,
    Modal,
    TextInput
} from 'react-native';
import NavigationBar from 'react-native-navbar';
import {post, get} from '../../utils/NetUtils';
import  {window} from '../../constant/Consts';
import Alipay from 'react-native-yunpeng-alipay'
import { toastShort } from '../../utils/ToastUtils';
import PaySuccess from '../pay/PaySuccess'
import {payDetailUrl, payCreditUrl, payAlipayUrl, payWechatUrl} from'../../constant/ConstUrl';

export default class Pay extends Component {
    static propTypes = {
        paymentId : PropTypes.string.isRequired
    };

    constructor(props) {
        super(props);
        this.state = {
            isAlipay:true,
            password:'',
            credit:'',
            creditDescription:'',
            price:'',
            priceDescription:'',
            modalVisible:false,
        }
        this.token = ''
        this.payPriceModel=null
    }

    /**
     * 组件加载后请求数据
     * 
     * 
     * @memberOf ShopCart
     */
    componentDidMount() {
        storage.load({key:'TOKEN'}).then((data)=>{
            this.token = data
            this._fetchPayment()
        }).catch((error)=>{
            alert('还未登录')
        })
    }

    /**
     * 获取购物车列表数据
     * 
     * 
     * @memberOf ShopCart
     */
    _fetchPayment() {
        post(payDetailUrl,{
            token: this.token,
            paymentId:this.props.paymentId
        }).then((rs)=>{
            console.log(rs)
            if (rs.status_code == 0) {
                this.payPriceModel = rs.result

                var creditDescription = ''
                var priceDescription = ''
                if (this.payPriceModel.unpaidCredits) {
                    creditDescription = "待支付"
                } else {
                    creditDescription = "已支付";
                }
                if (this.payPriceModel.unpaidTotal) {
                    priceDescription = "待支付";
                } else {
                    priceDescription = "免支付";
                }

                this.setState({
                    credit:this.payPriceModel.unpaidCredits,
                    price:this.payPriceModel.unpaidTotal,
                    creditDescription:creditDescription,
                    priceDescription:priceDescription,
                } )
            }
        }).catch((error)=> {
            console.log('出错了:',error);
        }).done();
    }

    /**
     * 积分支付
     * 
     * 
     * @memberOf Pay
     */
    _buyCredit(password) {
        post(payCreditUrl,{
            token: this.token,
            paymentId:this.props.paymentId,
            payPassword:password
        }).then((rs)=>{
            console.log(rs)
            this._setModalVisible(false);
            if (rs.status_code == 0) {
                toastShort('积分支付成功')
                // this._fetchPayment();
                this.payPriceModel.unpaidCredits = 0
                this.setState({
                    credit:this.payPriceModel.unpaidCredits,
                    creditDescription:'已支付',
                } )
            } else {
                toastShort(rs.result_msg)
            }
        }).catch((error)=> {
            this._setModalVisible(false);
            console.log('出错了:',error);
        }).done();
    }

    _buyPrice() {
        if (this.state.isAlipay) {
            post(payAlipayUrl,{
                token: this.token,
                paymentId:this.props.paymentId,
                money:0.11
            }).then((rs)=>{
                console.log(rs)
                if (rs.status_code == 0) {
                    /*打开支付宝进行支付*/
                    Alipay.pay(rs.result).then((data) => {
                        if (data.length && data[0].resultStatus) {
                            /*处理支付结果*/
                            switch (data[0].resultStatus) {
                                case "9000":
                                toastShort('支付成功')
                                this._paySuccess()
                                break;
                                case "8000":
                                toastShort('支付结果未知,请查询订单状态')
                                break;
                                case "4000":
                                toastShort('订单支付失败')
                                break;
                                case "5000":
                                toastShort('重复请求')
                                break;
                                case "6001":
                                toastShort('用户中途取消')
                                break;
                                case "6002":
                                toastShort('网络连接出错')
                                break;
                                case "6004":
                                toastShort('支付结果未知,请查询订单状态')
                                break;
                                default:
                                toastShort('其他失败原因')
                            break;
                            }
                        } else {
                            toastShort('其他失败原因')
                        }
                    }, (err) => {
                        toastShort('支付失败，请重新支付')
                    })
                }
            }).catch((error)=> {
                console.log('出错了:',error);
            }).done();
        } else {
            post(payWechatUrl,{
                token: this.token,
                paymentId:this.props.paymentId,
                money:this.payPriceModel.unpaidTotal
            }).then((rs)=>{
                console.log(rs)
                if (rs.status_code == 0) {
                    var result = rs.result

                }
            }).catch((error)=> {
                console.log('出错了:',error);
            }).done();
        }
    }

    /**
     * 返回
     * 
     * 
     * @memberOf Pay
     */
    _goBack () {
        this.props.navigator.popToTop();
    }

    /**
     * 选择支付宝支付
     * 
     * 
     * @memberOf Pay
     */
    _selectAlipay () {
        this.setState({isAlipay: true});
    }

    /**
     * 选择微信支付
     * 
     * 
     * @memberOf Pay
     */
    _selectWeachatPay () {
        this.setState({isAlipay: false});
    }


    _creditPay() {
        if (this.state.password.length == 0) {
            toastShort('请输入密码')
            return
        }
        this._buyCredit(this.state.password)
    }

    /**
     * 点击确定
     * 
     * 
     * @memberOf Pay
     */
    _pricePay () {
        if (this.payPriceModel.unpaidCredits != 0) {
            this._setModalVisible(true)
        } else if (this.payPriceModel.unpaidTotal != 0) {
            this._buyPrice()
        } else {
            this._paySuccess()
        }
    }

    
    /**
     * 跳转传值支付成功页
     * 
     * 
     * @memberOf Pay
     */
    _paySuccess() {
        creditPrices = this.payPriceModel.unpaidCredits + this.payPriceModel.paidCredits;
        totalmoney = this.payPriceModel.paidTotal + this.payPriceModel.unpaidTotal;
        this.props.navigator.push({
            component:PaySuccess,
            params:{
                orderId : this.props.paymentId,
                creditPrices : creditPrices,
                totalmoney : totalmoney
            }
        })
    }

    _setModalVisible(visible) {
        console.log('隐藏')
        this.setState({
            password:'',
            modalVisible: visible
        });
    }


    render() {
        return (
            <View style={{ flex: 1, backgroundColor: '#fdda6a'}}>
                <Modal
                    animationType={"slide"}
                    transparent={true}
                    visible={this.state.modalVisible}
                    onRequestClose={() => {}}>
                    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor:'rgba(0, 0, 0, 0.5)'}}>
                        <View style={{backgroundColor: '#EAEAEA', width:300, height:150}}>
                            <View style={{backgroundColor: '#0F1E34', height:49, flexDirection:'row',}}>
                                    <TouchableOpacity onPress={() => this._setModalVisible(false)}>
                                        <Image
                                        source={require('../../../imgs/left-arrow.png')}
                                        style={{width:49, height:49, marginLeft:0}}/>
                                    </TouchableOpacity>
                                    <View style={{justifyContent: 'center', marginLeft:46}}>
                                        <Text style={{color:'#C2AC4C', fontSize: 18}}>积分支付密码</Text>
                                    </View>
                            </View>
                            <View style={{flex:1, backgroundColor: '#EAEAEA'}}>
                                <TextInput
                                    style={{marginTop:16, marginLeft:16, height: 32, width:268, backgroundColor:'white', textAlign:'center'}}
                                    onChangeText={(text) => this.setState({password:text})}
                                    value={this.state.password}
                                    secureTextEntry={true}
                                />
                                <TouchableOpacity onPress={() => this._creditPay()} 
                                    style={{marginLeft:120, marginTop:12, height:30, width:60, borderRadius:5, backgroundColor:'#0F1E34', justifyContent: 'center', alignItems: 'center'}}>
                                    <Text style={{fontSize: 20, color: '#C2AC4C'}}>确定</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
                <NavigationBar
                    style={{ backgroundColor: '#112945' }}
                    statusBar={{ tintColor: '#112945' }}
                    title={{ title: '支付', style: { color: '#fdda6a', fontSize: 17 } }}
                    leftButton={
                        <TouchableOpacity onPress={() => this._goBack()}>
                            <Image
                            source={require('../../../imgs/left-arrow.png')}
                            style={{width:44, height:44, marginLeft:5}}/>
                        </TouchableOpacity>    
                    }/>
                <View style={{flex:1,alignItems: 'center'}}>
                    <View style={{width:window.scWidth-16, marginTop:8 , height:70, backgroundColor: 'white', flexDirection:'row'}}>
                        <Text style={{marginTop:12, marginLeft:8, fontSize: 15, color: '#112945'}}>订单金额</Text>
                        <View style={{flex: 1, flexDirection:'column'}}>
                            <View style={{height:35, flexDirection:'row', alignItems: 'center', justifyContent:'flex-end'}}>
                                <Text style={{marginRight:8, marginLeft:8, fontSize: 15, color: '#112945'}}>{'积分：'+this.state.credit}</Text>
                                <Text style={{marginRight:8, marginLeft:8, fontSize: 15, color: '#112945'}}>{this.state.creditDescription}</Text>
                            </View>
                            <View style={{height:35, flexDirection:'row', alignItems: 'center', justifyContent:'flex-end'}}>
                                <Text style={{marginRight:8, marginLeft:8, fontSize: 15, color: '#112945'}}>{'金额：¥'+this.state.price}</Text>
                                <Text style={{marginRight:8, marginLeft:8, fontSize: 15, color: '#112945'}}>{this.state.priceDescription}</Text>
                            </View>
                        </View>
                    </View>
                    <View style={{width:window.scWidth-16, marginTop:16, height:100, backgroundColor: 'white'}}>
                        <View style={{height:50, flexDirection: 'row', alignItems: 'center' }}>
                            <TouchableOpacity
                                style={{height: 50, alignItems: 'center', justifyContent: 'center', flexDirection: 'row'}}
                                onPress={() => this._selectAlipay()}
                                activeOpacity={1}>
                                <Image
                                    source={this.state.isAlipay? require('../../../imgs/on.png') : require('../../../imgs/off.png')} 
                                    style={{width:13.5,height:13.5, marginLeft:8, marginRight:8}}/>
                                <Text style={{fontSize: 14, color: '#112945', marginRight:8 }}>{'支付宝'}</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{height:50, flexDirection: 'row', alignItems: 'center' }}>
                            <TouchableOpacity
                                style={{height: 50, alignItems: 'center', justifyContent: 'center', flexDirection: 'row'}}
                                onPress={() => this._selectWeachatPay()}
                                activeOpacity={1}>
                                <Image
                                    source={!this.state.isAlipay? require('../../../imgs/on.png') : require('../../../imgs/off.png')} 
                                    style={{width:13.5,height:13.5, marginLeft:8, marginRight:8}}/>
                                <Text style={{fontSize: 14, color: '#112945', marginRight:8 }}>{'微信支付'}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <Text style={{width:window.scWidth-16, marginTop:8, fontSize: 15, color: '#AAAAAA'}}>
                    {'付款流程：先付积分，积分付款成功再付余额'}
                    </Text>
                    <View style={{flex:1,justifyContent: 'flex-end'}}>
                        <TouchableOpacity
                            style={{width:window.scWidth ,height: 65, alignItems: 'center', justifyContent: 'center', backgroundColor:'#112945'}}
                            onPress={() => this._pricePay()}
                            activeOpacity={1}>
                            <Text style={{fontSize: 18, color: '#fdda6a' }}>{'确认'}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    
});
module.exports = Pay;
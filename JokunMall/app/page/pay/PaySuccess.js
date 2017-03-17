import React, {Component, PropTypes} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
} from 'react-native';
import NavigationBar from 'react-native-navbar';
import {post, get} from '../../utils/NetUtils';
import  {window} from '../../constant/Consts';
import { toastShort } from '../../utils/ToastUtils';

export default class PaySuccess extends Component {
    static propTypes = {
        orderId : PropTypes.string.isRequired,
        creditPrices : PropTypes.string.isRequired,
        totalmoney : PropTypes.string.isRequired
    };

    constructor(props) {
        super(props);
        this.state = {

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

    render() {
        return (
            <View style={{ flex: 1, backgroundColor: '#fdda6a'}}>
                <NavigationBar
                    style={{ backgroundColor: '#112945' }}
                    statusBar={{ tintColor: '#112945' }}
                    title={{ title: '支付成功', style: { color: '#fdda6a', fontSize: 17 } }}
                    leftButton={
                        <TouchableOpacity onPress={() => this._goBack()}>
                            <Image
                                source={require('../../../imgs/left-arrow.png')}
                                style={{width:44, height:44, marginLeft:5}}/>
                        </TouchableOpacity>    
                    }/>
                <View style={{width:window.scWidth-16, marginTop:8, marginLeft:8 , height:170, backgroundColor: 'white', alignItems: 'center'}}>
                    <View style={{flexDirection:'row', marginTop: 30, alignItems: 'center'}}>
                        <Image
                            source={require('../../../imgs/pay_succ.png')}
                            style={{width:20, height:20}}/>
                        <Text style={{marginLeft:8, color:'#112945', fontSize: 14}}>订单支付成功</Text>
                    </View>
                    <View style={{flexDirection:'row', marginTop: 10, alignItems: 'center'}}>
                        <Text style={{marginLeft:8, color:'#112945', fontSize: 14}}>订单编号:</Text>
                        <Text style={{marginLeft:8, color:'#112945', fontSize: 14}}>{this.props.orderId}</Text>
                    </View>
                    <View style={{flexDirection:'row', marginTop: 10, alignItems: 'center'}}>
                        <Text style={{marginLeft:8, color:'#112945', fontSize: 14}}>订单金额:</Text>
                        <Text style={{marginLeft:8, color:'#112945', fontSize: 14}}>{'积分'+this.props.creditPrices+'+¥'+this.props.totalmoney}</Text>
                    </View>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    
});
module.exports = PaySuccess;
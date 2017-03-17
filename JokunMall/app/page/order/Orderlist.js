import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image
} from 'react-native';
let Dimensions =require('Dimensions');
let {width} = Dimensions.get('window');
export default class Orderlist extends Component {
    constructor(props){
        super(props);
    }
    render() {
        console.log(this.props);
        return (
            <View style={styles.shoppinlist}>
                {/*商品图片*/}
                <View>
                    <Image source={{uri: this.props.productLogo}} style={styles.shoppingimg}/>
                </View>
                {/*商品数据*/}
                <View style={styles.bili}>
                    {/*商品名字*/}
                    <Text numberOfLines={1} style={{width:250}}>
                        {this.props.productName}
                    </Text>
                    {/*价格跟数量*/}
                    <View style={styles.priceQuantity}>
                        <Text>
                            积分{this.props.creditPrice}+￥{this.props.price}
                        </Text>
                        <Text>
                            X{this.props.num}
                        </Text>
                    </View>
                </View>
            </View>
        );
    }
}






const styles = StyleSheet.create({
    shoppinlist:{
        padding:5,
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
});

module.exports = Orderlist;
import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity
} from 'react-native';
let Dimensions = require('Dimensions');
let scWidth = Dimensions.get('window').width;
import Detail from '../goods/Detail';
export default class HomeMiddleView extends Component {

    render() {
        var goods = this.props.products;
        console.log('this.props.logo', this.props.logo);
        return (
            <View >
                <Image source={{uri: this.props.logo}} style={{width: scWidth, height: 150}}/>
                <View style={{flexDirection: 'row', width: scWidth}}>
                    {goods ? this._renderProduct(goods) : null}
                </View>

            </View>
        );
    }

    /**
     *
     *@author panda
     *created at 2017/1/18 9:47
     */
    _renderProduct(goods) {
        let view = [];
        for (var i = 0; i < goods.length; i++) {
            if (i == 0) {
                var good1 = goods[0];
                console.log('顶尖货_renderProduct', good1.logo);
                view.push(
                    <TouchableOpacity key={i}  activeOpacity={0.75} onPress={()=>{this._goToDetail(good1.id)}} >
                        <View  style={{alignItems: "center"}}>
                            <Image source={{uri: good1.logo}}
                                   style={{width: scWidth/2, height: scWidth/2,marginTop:30}}/>
                            <Text
                                numberOfLines={1}
                                style={{maxWidth: 200, marginLeft: 5, marginRight: 5}}>{good1.displayName}</Text>
                            <Text style={{maxWidth: 200}}>积分{good1.creditPrice}+¥{good1.price}</Text>
                        </View>
                    </TouchableOpacity>
                )
            }
        }
        view.push(
            <View key={'abc'} style={{alignItems: 'center', flex: 1}}>
                {this._renderCellView(goods)}
            </View>
        );
        return view;

    }

    _renderCellView(goods) {
        let view = [];
        for (var i = 1; i < goods.length && i < 3; i++) {
            var good = goods[i];
            view.push(
                <TouchableOpacity  key={i} activeOpacity={0.75} onPress={()=>{this._goToDetail(good.id)}}>
                <View >
                    <Image source={{uri: good.logo}} style={{width: 100, height: 100}}/>
                    <Text numberOfLines={1}
                          style={{maxWidth: 200, marginLeft: 5, marginRight: 5}}>{good.displayName}</Text>
                    <Text style={{maxWidth: 200}}>积分{good.creditPrice}+¥{good.price}</Text>
                </View>
                </TouchableOpacity>
            )
        }
        return view;
    }

    _goToDetail(id){
        this.props.navigator.push({
            component:Detail,
            params:{
                id:id
            }
            }
        )
    }

}

const styles = StyleSheet.create({
    HomeMiddleView: {
        flexDirection: 'row',
    },
    logo: {
        height: 100,
        width: scWidth,
    }

});

module.exports = HomeMiddleView;
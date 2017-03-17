

import React, {Component} from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Image,
    ListView,
    TouchableOpacity
} from 'react-native';

var Dimensions = require('Dimensions');
var scWidth = Dimensions.get('window').width;
export default  class HomeContent extends  Component{

    constructor(props){
        super(props);
    }

    render() {
        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        var data = this.props.productsList?this.props.productsList:[];
        return (
            <ListView
                dataSource={ds.cloneWithRows(data)}
                renderRow={this.renderRow}
            />

        )
    }

    renderRow(rowData, sectionId, rowId, highlight){
        var products = rowData.products;
        var smallProducts = [];
        for (var i = 0; i < products.length; i++) {
            if (i > 0) {
                smallProducts.push(products[i]);
            }
        }
        return (
            <View>
                <Image source={{uri: rowData.logo}} style={{width: scWidth, height: 150, marginTop: 10}}/>
                <View style={{flexDirection: 'row'}}>
                    <View style={{alignItems: 'center'}}>
                        <Image style={{width: scWidth / 2, height: scWidth / 2}} source={{uri: products[0].logo}}/>
                        <Text style={{maxWidth: (scWidth / 2 - 15), marginTop: 10}} numberOfLines={1}>
                            {products[0].displayName}
                        </Text>
                        <Text>
                            积分{products[0].creditPrice}+¥{products[0].price}
                        </Text>
                    </View>
                    <View style={{flexDirection: 'row', flex: 1, flexWrap: 'wrap', alignItems: 'flex-start'}}>
                        {this._renderView(smallProducts)}
                    </View>
                </View>
            </View>

        )
    }

    _renderView(arrs){
        var views = [];
        for (var i = 0; i < arrs.length && i < 4; i++) {
            var goodsId = arrs[i].id;
            views.push(
                <TouchableOpacity key={i} >
                    <View style={{alignItems: 'center', marginTop: 5}}>
                        <Image style={{width: scWidth / 4 - 5, height: scWidth / 4 - 5}} source={{uri: arrs[i].logo}}/>
                        <Text style={{maxWidth: (scWidth / 4 - 5), marginTop: 10, fontSize: 10}} numberOfLines={1}>
                            {arrs[i].displayName}
                        </Text>
                        <Text style={{fontSize: 10, maxWidth: scWidth / 4 - 5}} numberOfLines={1}>
                            积分{arrs[i].creditPrice}+¥{arrs[i].price}
                        </Text>
                    </View>

                </TouchableOpacity>
            )
        }
        return views;

    }


};

const styles = StyleSheet.create({});

module.exports = HomeContent;




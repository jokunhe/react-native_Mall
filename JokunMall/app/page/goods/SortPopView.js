

import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    TouchableOpacity
} from 'react-native';

import  {window} from '../../constant/Consts';


export  default  class SortModalView extends Component {


    render() {
        return (
            <View>
                <View style={styles.sortStyle}>
                </View>
                {this._renderCellView('综合排序',1)}
                {this._renderCellView('新品优先',2)}
                {this._renderCellView('销量从高到低',3)}
                {this._renderCellView('评价从高到低',4)}

            </View>
        )

    }


    _renderCellView(msg,index) {
        return (
            <TouchableOpacity activeOpacity={0.9} onPress={()=>{this._sortItemClick(index)}}>
                <View style={styles.itemViewStyle}>
                    <Text>
                        {msg}
                    </Text>
                    <Image source={require('../../../imgs/sort_select.png')}/>
                </View>
            </TouchableOpacity>
        )
    }

    _sortItemClick(index){
        this.setState({
            sortIndex:index,
        });
        // this.props.callBack(index);
    }

}


const styles = StyleSheet.create({
    itemViewStyle: {
        width: window.scWidth,
        padding: 10,
        flexDirection: 'row',

    },
    imgStyle: {
        width: 24,
        height: 16,
        position: 'absolute',
        left: 10,

    },
    sortStyle: {
        width: window.scWidth,
        height: 91,
        backgroundColor:'#99ff94'
    }
});
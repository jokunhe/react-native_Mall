import React, { Component } from 'react';
import {
    Image,
    TextInput,
    View,
    StyleSheet
} from 'react-native';


//export 因为要在其他类中使用  
export default class Header extends Component{
    render(){
        return (
                <View style={styles.searchBox}>
                    <Image source={require('../../../imgs/Header_search.png')} style={styles.searchIcon}/>
                    <TextInput style={styles.inputText}
                               underlineColorAndroid='transparent'
                               keyboardType='web-search'
                               placeholder='美兑壹购物'
                               placeholderTextColor='#fdda6a'/>
                </View>

        )
    }
}

//样式  
const styles = StyleSheet.create({
    searchBox:{//搜索框  
        height:35,
        flexDirection: 'row',   // 水平排布
        borderRadius: 5,  // 设置圆角边
        backgroundColor: 'white',
        alignItems: 'center',
        marginLeft: 50,
        marginRight: 50,
    },
    searchIcon: {//搜索图标    
        height: 20,
        width: 20,
        marginLeft: 5,
        resizeMode: 'stretch'
    },
    inputText:{
        paddingTop:0,
        paddingBottom:0,
        flex:1,
        fontSize:14,
        backgroundColor:'#fff',
        lineHeight:14,
    },
});
module.exports =Header;
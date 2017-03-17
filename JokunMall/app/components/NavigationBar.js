

'use strict';

import React,{ Component,PropTypes } from 'react';
import {StyleSheet,View,Image,Text,StatusBar,TouchableOpacity,Platform} from 'react-native';
import p2d from '../utils/p2d';
import {colors} from '../constant/Consts';


class NavigationBar extends Component {
    static propTypes = {
        title : PropTypes.string,
        style : PropTypes.any,
        leftButtons: PropTypes.oneOfType([ PropTypes.object,PropTypes.array ]),
        rightButtons: PropTypes.oneOfType([ PropTypes.object,PropTypes.array ]),
    }
    constructor(props){
        super(props);
    }

    render(){
        const { title, style, leftButtons, rightButtons } = this.props;
        return(
            <View style={[styles.container,style]}>
                <View style={styles.barBox}>
                    <View style={styles.titleBox}><Text style={styles.title}>{title}</Text></View>
                    <View style={[styles.betweenBox,styles.leftBox]}>
                        {leftButtons}
                    </View>
                    <View style={[styles.betweenBox,styles.rightBox]}>
                        {rightButtons}
                    </View>
                </View>
            </View>
        );
    }
};

class NavigationButton extends Component{
    static propTypes = {
        icon: PropTypes.number,
        text: PropTypes.string,
        onPress: PropTypes.func
    }
    constructor(props){
        super(props);
    }

    render(){
        const { icon,text,onPress } = this.props;
        return(
            <TouchableOpacity onPress={onPress}>
                {
                    icon ?
                    <Image style={styles.btnImg} source={icon}/>
                    :
                    <Text style={styles.btnText}>{text}</Text>
                }
            </TouchableOpacity>
        );
    }
}

let styles = StyleSheet.create({
    container:{
        paddingTop: Platform.OS === "android" ? 0:p2d(40),
        width:p2d(750),backgroundColor:colors.bg_color_blue},
    barBox:{ height:p2d(88)},
    titleBox:{ width:p2d(750),height:p2d(88),justifyContent:'center' , alignItems:'center' },
    title:{ fontSize:p2d(34), color:colors.text_color_yellow },
    betweenBox:{ position:'absolute', top:0, height:p2d(88),flexDirection:'row',alignItems:'center' },
    leftBox:{ left:p2d(20) },
    rightBox:{ right:p2d(20), },
    btnText:{ fontSize:p2d(30),color:colors.text_color_yellow,marginLeft:p2d(5),marginRight:p2d(5) },
    btnImg:{ width:p2d(50), height:p2d(50), marginLeft:p2d(5),marginRight:p2d(5) },
});

export { NavigationBar as default, NavigationButton }

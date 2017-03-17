


'use strict';

import React,{ Component, PropTypes } from 'react';
import {StyleSheet, Text, View, Image,TouchableOpacity } from 'react-native';
import Badge from './Badge';
import p2d from '../utils/p2d';

export default class Item extends Component {
    static propTypes = {
        icon: PropTypes.number.isRequired,
        text: PropTypes.string.isRequired,
        badge : PropTypes.number,
        onPress: PropTypes.func
    }
    constructor(props){
        super(props);
    }

    render(){
        const {icon, text, badge, onPress} = this.props;
        return(
            <TouchableOpacity style={styles.item} onPress={onPress}>
                <Image style={styles.itemImg} source={icon}/>
                <Text style={styles.itemText}>{text}</Text>
                { badge  ? <Badge text= { badge }/> : null }
            </TouchableOpacity>
        );
    }
}

let styles = StyleSheet.create({
  item:{
    marginTop:p2d(46),
    marginBottom:p2d(52),
    paddingTop:p2d(10),
    paddingRight:p2d(10),
    paddingLeft:p2d(10),
    alignItems:'center',
  },
  itemImg:{
    width:p2d(98),
    height:p2d(98),
    marginBottom:p2d(24)
  },
  itemText:{
      fontSize:p2d(24)
  }
});
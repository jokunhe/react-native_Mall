
'use strict';

import React,{ Component } from 'react';
import {StyleSheet,View,Image,Text} from 'react-native';
import Swiper from 'react-native-swiper';
import p2d from '../utils/p2d';


export default class SwiperForDetail extends Component {
    constructor(props){
        super(props);
    }

    render(){
        return(
            <Swiper
                height={p2d(750)}
                autoplay={true}
                dot={<View style={[styles.dot,styles.notActiveDot]} />}
                activeDot={ <View style={[styles.dot,styles.activeDot]} />}
                paginationStyle={ styles.pagination}
            >
                { this._renderItem()}
            </Swiper>
        );
    }

    _renderItem(){
       const {images} = this.props;
       let viewArray = [];
       if(images){
           for(let i=0;i<images.length;i++){
               let item = images[i];
               viewArray.push(
                   <View key={i} style={styles.slide}>
                       <Image style={styles.image} source={{uri:item}}/>
                   </View>
               )
           }
       }
       return viewArray;
    }
};

const styles = StyleSheet.create({
    //轮播
    slide: { width:p2d(750), justifyContent: 'center',alignItems: 'center',backgroundColor: '#9e9e9f' },
    image: { width:p2d(750),height:p2d(750)},
    dot: { width: p2d(12),height: p2d(12),borderRadius:p2d(6),marginLeft: p2d(4),marginRight:p2d(4),marginTop:p2d(4),marginBottom:p2d(4) },
    notActiveDot: {backgroundColor: '#5a5758'},
    activeDot: { backgroundColor: 'rgba(255,255,255,1)' },
    pagination: { bottom: p2d(10) },
})

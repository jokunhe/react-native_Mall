import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
} from 'react-native';
import Swiper from 'react-native-swiper';

import SwiperImg from './swiperImg';


export default class swiper extends Component {
    constructor(props) {
        super(props);

    }

    swiperImgView() {
        var swiperImg = [];
        var data = this.props;
        for (var key in data) {
            swiperImg.push(
                <SwiperImg {...data[key]} key={key}/>
            );
        }
        return swiperImg;
    }


    render() {
        return (
            <Swiper showsButtons={false} autoplay={true} height={260} autoplayTimeout={3}
                    loop={true}
                    activeDot={<View style={{backgroundColor:'#1EA0DB', width: 8, height: 8,borderRadius: 4, marginLeft: 3, marginRight: 3, marginTop: 3, marginBottom: 3,}} />}
                    scrollsToTop={true}>
                {this.swiperImgView()}
            </Swiper>
        );
    }


}


module.exports = swiper;
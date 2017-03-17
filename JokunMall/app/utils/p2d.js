


'use strict';

import { Dimensions } from 'react-native';

//设备的宽度，单位:pd
const deviceWidthDp = Dimensions.get('window').width;

//设计稿宽度,单位：px
const uiWidthPx = 750;

/**
 * 将px转换到pd
 * @param uiElementPx 设计稿的尺寸
 * @returns {number} 实际屏幕的尺寸
 */
export default function p2d(uiElementPx){
    return uiElementPx *  deviceWidthDp / uiWidthPx;
} 
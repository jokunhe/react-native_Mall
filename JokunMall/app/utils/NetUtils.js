
/**
 * 使用方法：
 * import { post as $post , get as $get  } from '../utils/NetUtils';
 * ....
 * $post('http://192.168.4.240:8097/member/front_user_center/v1/baseop/login',{
            user_id:'13728620010',
            pass_word : MD5('123456'),
        }).then((rs)=>{
            console.log('返回结果:',rs);
        }).catch((error)=>{
            console.log('出错了:',error);
        }).done();
   get方法使用方式一样
 */

'use strict';

import { clientID, clientKey } from '../constant/Consts';
import MD5 from './MD5';

/**
 *  POST方式发送请求
 * @param url String 请求连接
 * @param params Object 请求参数
 * @returns {*}
 */
function post(url ,params ){
    return request(url,params,'POST');
}

/**
 *  Get方式发送请求
 * @param url String 请求连接
 * @param params Object 请求参数
 * @returns {*}
 */
function get(url,params){
    return request(url,params,'GET');
}

function request(url,params, method = "POST"){
    return new Promise((resolve, reject)=> {
        // if( Object.prototype.toString.call(url) !== "[object String]" ||
        //     Object.prototype.toString.call(params) !== '[object Object]'){
        //     reject('参数类型错误，请检查.');
        // }

        //检查空值，并删除空属性
        params = checkParams(params);
        //合并必要参数 clientId timestamp
        params = mergeArgs(params);
        //生成stingA
        const stringA = getParamsString(params);
        //生成签名
        const sign = getSign(stringA);
        //合并签名参数
        const url_params_obj = Object.assign({},params,{sign:sign});
        //拼接请求参数
        const url_params = stringA + '&sign=' + sign;
        //处理url前后斜杠
        const whole_url = trim(url);
        //拼接带参数的请求链接
        const whole_url_params = whole_url + "?" + url_params;
        console.log("request====>"+JSON.stringify(url_params_obj));
        console.log("url====>"+whole_url);
        if (method === 'POST'){
            fetch( whole_url , {
                method: method,
                headers: {
                    'Content-Type': 'application/json; charset=utf-8',
                },
                body: JSON.stringify(url_params_obj),
            })
                .then((response)=>response.json())
                .then((responseJson)=>{
                console.log("responseJson==>",responseJson);
                resolve(responseJson); })
                .catch((error)=>{ reject(error); })
                .done();
        }else{
            fetch( whole_url_params ,{ 
                method: method,
                headers: {
                    'Content-Type': 'Content-Type',
                },
            } )
                .then((response)=>response.json())
                .then((responseJson)=>{ resolve(responseJson); })
                .catch((error)=>{ reject(error); })
                .done();
        }
    });
}

//按ASCII字典顺序生成参数字符串
function getParamsString(params){
    const dic = Object.keys(params).sort();
    let str = '';
    for(const key in dic){
        var value = params[dic[key]]
        if (Object.prototype.toString.call(value) === '[object Array]') {
            str += '&' + dic[key] + '=' + '['
            for (const index in value) {
                const indexValue = value[index]
                str += '"' + indexValue + '",'
            }
            str = str.substring(0, str.length-1);  
            str += ']' 
        } else {
            str += '&' + dic[key] + '=' + params[dic[key]]
        }
    }
    return str.substr(1);
}

//生成签名
function getSign(str){
    return MD5( str +'&key='+ clientKey ).toUpperCase();
}

//合并clientID 和 timestamp
function mergeArgs(params){
    const base = {
        clientID : clientID,
        timestamp: (new Date()).getTime().toString()
    };
    return Object.assign({},base,params);
}

//去除字符串首尾的斜杠
function trim(str){
    return str.replace(/^\/+|\/+$/g,'')
}

/**
 * 检查空值，是空就删除该属性
 * @param params
 */
function checkParams(params){
    for(let key in params){
        const value = params[key];
        if( value === '' ||
            value === undefined ||
            ( Object.prototype.toString.call(value) === '[object Array]' && value.length ==0 )
        ){
            delete params[key];
        }
    }
    return params;
}


export { post , get };
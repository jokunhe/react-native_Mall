

'use strict';
import React,{ Component } from 'react';
import {Navigator,AsyncStorage } from 'react-native';
import Main from './page/home/Main';
import Storage from 'react-native-storage';
import SearchList from './page/goods/SearchList'

let storage = new Storage({
  // 最大容量，默认值1000条数据循环存储
  size: 1000,

  // 存储引擎：对于RN使用AsyncStorage，对于web使用window.localStorage
  // 如果不指定则数据只会保存在内存中，重启后即丢失
  storageBackend: AsyncStorage,

  // 数据过期时间，默认一整天（1000 * 3600 * 24 毫秒），设为null则永不过期
  defaultExpires: 1000 * 3600 * 24,

  // 读写时在内存中缓存数据。默认启用。
  enableCache: true,

  // 如果storage中没有相应数据，或数据已过期，
  // 则会调用相应的sync方法，无缝返回最新数据。
  // sync方法的具体说明会在后文提到
  // 你可以在构造函数这里就写好sync的方法
  // 或是写到另一个文件里，这里require引入
  // 或是在任何时候，直接对storage.sync进行赋值修改
  // sync: require('./sync')
});


export default class App extends Component {
    
    //组件将要加载时调用
    componentWillMount(){
        // 声明全局storage以供全局使用
        global.storage = storage;

        // 声明全局token
        global.TOKEN = '';

        storage.load({key:'TOKEN'}).then((token)=>{
            TOKEN = token;
        }).catch((error)=>{
            TOKEN = '';
            console.log('获取本地token失败：',error);
        });
    }
    render(){
        return(
            <Navigator
                initialRoute={{ component:Main}}
                configureScene={(route) => {
                    var conf = Navigator.SceneConfigs.HorizontalSwipeJump;
                    conf.gestures ={pop:false}; //去除，左右滑动时整个页面左右滑动一段距离的效果。
                    return conf;
                }}
                renderScene={(route, navigator) => {
                    let Component = route.component;
                    return <Component {...route.params} navigator={navigator} />
                }}
            />
        );
    }
}
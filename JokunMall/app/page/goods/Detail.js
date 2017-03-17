

'use strict';

import React,{ Component,PropTypes } from 'react';
import {StyleSheet, Image, Text,View,ScrollView,StatusBar,TouchableOpacity,WebView,Alert ,Dimensions, Modal,ActivityIndicator,RefreshControl,Platform,InteractionManager} from 'react-native';
import p2d from '../../utils/p2d';
import Page from '../mine/Page';
import { goodsInfo as goodsInfoURL ,addCart as addCartURL} from '../../constant/ConstUrl';
import NavigationBar,{ NavigationButton } from '../../components/NavigationBar';
import Button,{FullButton} from '../../components/ButtonForDetail';
import SwiperForDetail from '../../components/SwiperForDetail';
import {toastShort} from '../../utils/ToastUtils';
import Loading from '../../components/Loading';
import { post,get} from '../../utils/NetUtils';
import { colors } from '../../constant/Consts';
import Swiper from 'react-native-swiper';
import OnceBuy from '../order/OnceBuy';
import Main from '../home/Main';
import Login from '../mine/Login';
import {window } from '../../constant/Consts';
import WebContainer from '../../components/WebContainer';

const HTML = '<img src="http://meidui.oss-cn-shenzhen.aliyuncs.com/579576890cf2b47be55bc693/attachment/20168/1473156327681-57ce94e70cf2906815916beb.jpg" style="color: rgb(0, 0, 0); font-family: &quot;Microsoft Yahei&quot;, &quot;Open Sans&quot;, &quot;Helvetica Neue&quot;, Helvetica, Arial, sans-serif; font-size: 13px; line-height: 18.5714px; width: 800px; max-width: 100%; min-width: auto; min-height: auto; height: auto; outline: none !important;">';

//商品详情页面
export default class Detail extends Page{
    static propTypes = {
        id : PropTypes.string.isRequired
    };

    constructor(props){
        super(props);
        this.state={
            modalVisible: false,    //规格选择是否可见
            isLoading : true,       //是否加载中
            goodData:{},            //商品信息
            selectedMatrix:{},      //已选择的规格
            selectedMatrixIndex: 0, //已选择的规格index
            buyCount:1,             //购买数量
            htmlContent:'',         //详情介绍
            notFound:false,         //是否没有找到商品
        };
    }

    componentDidMount() {
      //页面切换动画结束后执行请求
      InteractionManager.runAfterInteractions(() => {
        this._getGoodData();
      });
    }

    render(){
        return(
            <View style={{flex:1}}>
                <NavigationBar
                    style={styles.navigationBar}
                    leftButtons={ <NavigationButton icon={require('../../../imgs/left-arrow.png')} onPress={this._handleBack.bind(this)}/> }
                    rightButtons={[
                            <NavigationButton onPress={this._actionCollect.bind(this)} key={0} icon={require('../../../imgs/goods-heart-off.png')}/>,
                            <NavigationButton onPress={this._actionEnterCart.bind(this)} key={1} icon={require('../../../imgs/goods-cart.png')}/>,
                            <NavigationButton onPress={this._actcionShare.bind(this)} key={2} icon={require('../../../imgs/goods-share.png')}/>
                        ]}
                />
                {
                    this._renderContent()
                }
                {
                    this._renderBottomBtn()
                }
            </View>
        );
    }

    _getGoodData(){
        this.setState({
            isLoading:true,
            notFound:false
        });

        post( goodsInfoURL ,{ "key":'', id:this.props.id })
            .then((rs)=>{
                console.log(rs);
                if(rs.status_code==0){
                    //选择一个有效的分类
                    if(rs.result.styles.matrix.length > 0){
                        for(let i=0; i<rs.result.styles.matrix.length; i++){
                            const matrix = rs.result.styles.matrix[i];
                            //判断是否有库存
                            if(matrix.qty > 0){
                                this.setState({
                                    selectedMatrix:  matrix,
                                    selectedMatrixIndex: i,
                                });
                                break;
                            }
                        }
                    }
                    this.setState({
                        goodData:rs.result,
                        isLoading:false,
                        notFound:false
                    });
                }else{
                    this.setState({
                        isLoading:false,
                        notFound:true
                    });
                }
            })
            .catch((error)=>{
                console.log("出错了：", error);
                this.setState({
                    isLoading:false,
                    notFound:true
                });
        });

        // const data = require('./goodData.json');
        // const that = this;
        // //模拟网络延时
        // setTimeout(()=>{
        //     if(data.status_code == 0){
        //         if(data.result.styles.matrix.length > 0){
        //             for(let i=0; i<data.result.styles.matrix.length; i++){
        //                 const matrix = data.result.styles.matrix[i];
        //                 if(matrix.qty > 0){
        //                     that.setState({
        //                         selectedMatrix:  matrix,
        //                         selectedMatrixIndex: i,
        //                     });
        //                     break;
        //                 }
        //             }
        //         }
        //         that.setState({
        //             goodData:data.result,
        //             isLoading:false,
        //             notFound:false,
        //         });
        //     }else{
        //         that.setState({
        //             isLoading:false,
        //             notFound:true
        //         });
        //     }
        // },1000);
    }

    _renderContent(){
        return(
            <ScrollView pagingEnabled={true} showsVerticalScrollIndicator={false}
                        refreshControl={
                            <RefreshControl
                            refreshing={this.state.isLoading}
                            onRefresh={this._getGoodData.bind(this)}
                            tintColor={colors.bg_color_blue}
                            title="拼命加载中..."
                            titleColor={colors.bg_color_blue}
                            />
                        }
            >
                <View style={[{flex:1,backgroundColor:'#ffffff'}, Platform.OS ==='ios' ? styles.pageHeight: null ]}>
                    <ScrollView showsVerticalScrollIndicator={false} >
                        {this.state.notFound ?
                        <View style={{flex:1,height:window.scHeight,justifyContent:'center', alignItems:'center'}}>
                            <Image style={{width:100,height:100}}  source={require('../../../imgs/notFound.png')}/>
                            <Text>找不到此商品,请返回重试!</Text>
                        </View>
                        :
                        <View style={{flex:1}}>
                            <SwiperForDetail images={this.state.goodData.imageUrls}/>
                            <View>
                                <Text numberOfLines={1} style={styles.goodTitle}>{ this.state.selectedMatrix.title}</Text>
                            </View>
                            <View style={styles.priceBox}>
                                <View style={styles.price}>
                                    <Text style={[styles.priceText,{fontSize:p2d(40)}]}>￥</Text>
                                    <Text style={[styles.priceText,{fontSize:p2d(50)}]}>{this.state.selectedMatrix.price}</Text>
                                    <Text style={[styles.priceText,{fontSize:p2d(40),marginLeft:p2d(5)}]}>+</Text>
                                    <Text style={{fontSize:p2d(30),marginLeft:p2d(18),color:colors.bg_color_blue}}>积分</Text>
                                    <Text style={[styles.priceText,{fontSize:p2d(50)}]}>{this.state.selectedMatrix.credits}</Text>
                                </View>
                                <TouchableOpacity style={styles.shop} onPress={this._actcionShop.bind(this)}>
                                    <Image style={styles.iconNomal} source={require('../../../imgs/goods-shop.png')}/>
                                    <Text style={styles.shopText}>店铺</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.marketPrice}>
                                <Text style={[styles.marketText,{textDecorationLine:'line-through'}]}>市场价:￥{this.state.selectedMatrix.mktPrice}</Text>
                                <Text style={styles.marketText}>运费:{this.state.goodData.freight}元</Text>
                                <Text style={styles.marketText}>库存:{this.state.selectedMatrix.qty}</Text>
                            </View>
                            <FullButton leftText="选择商品套装" style={styles.suit} onPress={()=>this.setModalVisible(true)}/>
                            {this._renderComment()}
                            <FullButton onPress={this._actcionShop.bind(this)} leftText="官方专卖店" rightText="进入店铺" leftIcon={require('../../../imgs/goods-03.png') }/>
                            <Text style={styles.scrollDown}>往下加载更多内容</Text>
                            {this._renderModal()}
                        </View>}
                    </ScrollView>
                    <View style={{height:p2d(100)}}/>
                </View>
                {this.state.notFound ? null:
                <View style={[{flex:1,backgroundColor:'#ffffff'}, Platform.OS ==='ios' ? styles.pageHeight: null ]}>
                    {
                        this.state.goodData.pc_desc ?
                            <WebContainer html={String(this.state.goodData.pc_desc).replace(/\\/g,'')} />
                            :
                            <View style={{width:p2d(750),height:window.scHeight,justifyContent:"center",alignItems:'center'}}><Text>暂无介绍</Text></View>
                    }
                    <View style={{height:p2d(100)}}/>
                </View>}
            </ScrollView>
        );
    }

    _renderModal(){
        return(
            <Modal
                animationType={"slide"}
                transparent={true}
                visible={this.state.modalVisible}
                onRequestClose={() => {this.setModalVisible(false)}}
            >
                <Image style={styles.goodImg} source={{uri:this.state.goodData.displayImageUrl}}/>
                <View style={styles.popBox}>
                        <TouchableOpacity style={{position:'absolute',top:p2d(20),right:p2d(20),}}  onPress={() => {this.setModalVisible(!this.state.modalVisible)}}>
                            <Image style={styles.iconNomal} source={require('../../../imgs/goods-close.png')}/>
                        </TouchableOpacity>
                        <View>
                            <Text style={styles.popPrice}>
                                <Text style={{fontSize:p2d(24), fontWeight:'400'}}>积分</Text>
                                {this.state.selectedMatrix.price} + ￥{this.state.selectedMatrix.credits}
                            </Text>
                        </View>
                        <View><Text style={styles.popSelect}>已选 ({this.state.selectedMatrix.specInfo ? this.state.selectedMatrix.skuTitle : "默认"})   库存:{this.state.selectedMatrix.qty}</Text></View>
                        <View style={styles.popLine}/>
                        <View style={styles.selectBox}>
                            <Text style={styles.selectItemTitle}>颜色分类</Text>
                            <View style={styles.selectItems}>
                                {this._renderMatrix()}
                            </View>
                        </View>
                        <View style={styles.popLine}/>
                        <View style={styles.countBox}>
                            <Text style={styles.countBoxText}>购买数量</Text>
                            <View style={styles.countCale}>
                                <TouchableOpacity onPress={this._actionSubtract.bind(this)}><Image style={styles.addReduce} source={require('../../../imgs/goods-reduce.png')}/></TouchableOpacity>
                                <Text style={styles.count}>{this.state.buyCount}</Text>
                                <TouchableOpacity onPress={this._actionAdd.bind(this)}><Image style={styles.addReduce} source={require('../../../imgs/goods-add.png')}/></TouchableOpacity>
                            </View>
                        </View>
                        <View style={styles.popLine}/>
                        {this._renderBottomBtn()}
                    </View>
            </Modal>
        );
    }
    //渲染分类
    _renderMatrix(){
        let tempArr = [];
        if(this.state.isLoading || this.state.notFound ) return tempArr;

        const matrixs = this.state.goodData.styles.matrix ? this.state.goodData.styles.matrix: [];
        if(matrixs && matrixs.length > 0 ){
            for(let i=0;i< matrixs.length;i++){
                tempArr.push(
                    matrixs[i].qty <= 0 ?
                        <View key={i}>
                            <Text  style={styles.forbidSelect}>{matrixs[i].skuTitle}</Text>
                        </View>
                    :
                        <TouchableOpacity key={i} onPress={this._actionChangeSku.bind(this,i)}>
                            <Text style={ this.state.selectedMatrixIndex == i ? styles.selectedItem : styles.selectItem}>{matrixs[i].skuTitle}</Text>
                        </TouchableOpacity>
                );
            }
        }else{
            tempArr.push(<TouchableOpacity><Text key={'DEFAULT'} style={styles.selectItem}>默认</Text></TouchableOpacity>)
        }
        return tempArr;
    }

    //底部按钮
    _renderBottomBtn(){
        return(
            <View style={styles.buyBox}>
                <Button onPress={this._actionAddCart.bind(this)} text='加入购物车' icon={require('../../../imgs/goods-addcart.png')}  />
                <Button onPress={this._actionBuy.bind(this)} text='立即购买' style={styles.buy} textStyle={styles.buyText} icon={require('../../../imgs/goods-buy.png')}  />
            </View>
        )
    }

    //评论模块
    _renderComment(){
        return(
            <View>
                <Text style={styles.commentTitle}>用户评价</Text>
                <View>
                    <View style={styles.rate}>
                        <Image style={styles.rateImg} source={require('../../../imgs/goods-02.png')}></Image>
                        <Text style={styles.rateText} numberOfLines={1}>阿斯顿发士大夫阿斯蒂芬啊是打发大师傅啊地方撒双方都啊是打发阿斯蒂芬</Text>
                    </View>
                    <View style={styles.rate}>
                        <Image style={styles.rateImg} source={require('../../../imgs/goods-02.png')}></Image>
                        <Text style={styles.rateText} numberOfLines={1}>阿斯顿发士大夫阿斯蒂芬啊是打发大师傅啊地方撒双方都啊是打发阿斯蒂芬</Text>
                    </View>
                    <View style={styles.rateMore}>
                        <View style={styles.rateLine}/>
                        <Text style={styles.rateMoreText}>MORE</Text>
                        <View style={styles.rateLine}/>
                    </View>
                </View>
            </View>
        );
        
    }

    /**
     * 颜色分类选择
     * @param index
     * @private
     */
    _actionChangeSku(index){
        const temp = this.state.goodData.styles.matrix[index];
        console.log('index',index,temp);
        this.setState({
            selectedMatrix:temp,
            selectedMatrixIndex: index,
            buyCount:1,
        });
    }
    //弹窗显示隐藏
    setModalVisible(visible) {
        this.setState({modalVisible: visible});
    }

    //增加购买数量
    _actionAdd(){
        const max = this.state.selectedMatrix.qty;
        const buyCount = this.state.buyCount + 1;
        if(buyCount <= max){
            this.setState({
                buyCount:buyCount
            })
        }
    }

    //减少购买数量
    _actionSubtract(){
        const min = this.state.selectedMatrix.minbuy;
        const buyCount = this.state.buyCount - 1;
        if(buyCount > 0 && buyCount >= min){
            this.setState({
                buyCount:buyCount
            })
        }
    }
    //加入购物车
    _actionAddCart(){
        if(this.state.isLoading || this.state.notFound ) return;
        const productId = this.state.goodData.id;
        const skuId = this.state.selectedMatrix.skuId;
        const qty = this.state.buyCount;

        if(TOKEN!=''){
            post(addCartURL,{
                token:TOKEN,
                productId:productId,
                skuId:skuId,
                qty:qty
            })
            .then((rs)=>{
                console.log(rs);
                if(rs.status_code==0){
                    toastShort('添加完成',this.setModalVisible(false));
                }else{
                    console.log(rs);
                    toastShort(rs.result_msg ? rs.result_msg : '错误,请稍后重试。');
                }
            })
            .catch((e)=>{console.log(e);toastShort('错误,请稍后重试。')});
        }else{
            this.props.navigator.push({
                component:Login,
                params:{
                    onSuccess:()=>{this.props.navigator.pop()}
                }
            });
        }
    }
    //进入购物车
    _actionEnterCart(){
        if(this.state.isLoading || this.state.notFound ) return;
        
        this.props.navigator.resetTo({
            component : Main,
            params:{
                tab:'shopCar'
            }
        })
    }
    //立即购买
    _actionBuy(){
        if(this.state.isLoading || this.state.notFound ) return;
        this.setModalVisible(false);
        if(TOKEN!=''){
            const items = [{
                "minbuy": this.state.selectedMatrix.minbuy,
                "creditPrice": this.state.selectedMatrix.credits,
                "maxbuy": this.state.selectedMatrix.maxbuy,
                "productLogo": this.state.goodData.displayImageUrl,
                "id": this.state.goodData.id,
                "size": this.state.selectedMatrix.size,
                "num": this.state.buyCount,
                "price": this.state.selectedMatrix.price,
                "skuId": this.state.selectedMatrix.skuId,
                "productName": this.state.selectedMatrix.title
            }];
            this.props.navigator.push({
                component : OnceBuy,
                params:{
                    items:items
                }
            })
        }else{
            this.props.navigator.push({
                component:Login,
                params:{
                    onSuccess:()=>{this.props.navigator.pop()}
                }
            });
        }
    }

    //收藏
    _actionCollect(){
        if(this.state.isLoading || this.state.notFound ) return;
        Alert.alert('提示','收藏开发中..');    
    }
    //分享
    _actcionShare(){
        if(this.state.isLoading || this.state.notFound ) return;
        Alert.alert('提示','分享开发中..');    
    }
    //进入店铺
    _actcionShop(){
        if(this.state.isLoading || this.state.notFound ) return;
        Alert.alert('提示','进入店铺开发中..');    
    }
}

let styles = StyleSheet.create({
    pageHeight:{
        height:Dimensions.get('window').height,
    },
    //导航条
    navigationBar:{ backgroundColor:'transparent', position:'absolute',top:0,left:0,zIndex:10},

    goodTitle:{ fontSize:p2d(30), paddingLeft:p2d(26),paddingRight:p2d(26),paddingTop:p2d(36),paddingBottom:p2d(54),color:colors.bg_color_blue,},
    priceBox:{flexDirection:'row',justifyContent:"space-between",paddingLeft:p2d(26),paddingRight:p2d(26),marginBottom:p2d(46)},
    price :{flexDirection:'row',alignItems:'center'},
    priceText: {fontWeight:'bold',color:colors.bg_color_blue},
    suit:{
        flexDirection:'row',justifyContent:"space-between",alignItems:'center',width:p2d(750),height:p2d(76),
        backgroundColor:'#fdda6a',paddingLeft:p2d(26),paddingRight:p2d(26),marginTop:p2d(36),marginBottom:p2d(36)
    },

    // 用户评价
    commentTitle:{fontSize:p2d(30),color:colors.bg_color_blue,marginBottom:p2d(42),paddingLeft:p2d(26)},
    rate:{flexDirection:'row',alignItems:'center',marginBottom:p2d(42),paddingRight:p2d(26),paddingLeft:p2d(26)},
    rateImg:{width:p2d(54),height:p2d(54),borderRadius:p2d(27),marginRight:p2d(20)},
    rateText:{flex:1,fontSize:p2d(22),color:'#9e9e9f'},
    rateMore:{flexDirection:'row', justifyContent:'space-between', alignItems:'center', paddingLeft:p2d(226),paddingRight:p2d(226), paddingTop:p2d(20),paddingBottom:p2d(62)},
    rateLine:{height:0,width:p2d(88),borderWidth:p2d(1),borderColor:colors.bg_color_blue},
    rateMoreText:{fontSize:p2d(35),fontWeight:'bold',color:colors.bg_color_blue},
    
    //往下加载更多
    scrollDown:{ alignSelf:'center', fontSize:p2d(22),color:'#9e9e9f',marginTop:p2d(40), marginBottom:p2d(45) },
    
    //购买按钮
    buyBox:{ flexDirection:'row', alignItems:'center', height:p2d(100),position:'absolute', bottom:0,left:0,zIndex:10},
    
    buy:{ backgroundColor:colors.bg_color_yellow },
    buyText:{ color:colors.bg_color_blue , fontSize:p2d(30)},
    //店铺
    shop:{flexDirection:'row',alignItems:'flex-end',paddingBottom:p2d(5)},
    shopText:{fontSize:p2d(22),color:'#9e9e9e',paddingBottom:p2d(5)},

    //市场价 价格 库存
    marketPrice:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingLeft:p2d(26),paddingRight:p2d(26)},
    marketText:{ fontSize:p2d(22),color:'#9e9e9f' },
    
    // 弹窗
    popBox:{ width:p2d(750), height:p2d(900),paddingTop:p2d(200), backgroundColor:'#ffffff', position:'absolute',bottom:0,left:0,zIndex:9, shadowColor:"#000000",shadowOpacity:0.5, shadowRadius:4,shadowOffset:{ width:2,height:2 },borderTopWidth:1,borderColor:'#eeeeee'},
    goodImg:{width:p2d(300),height:p2d(300),alignSelf:'center',position:'absolute',bottom:p2d(700),left:p2d(225),zIndex:10,borderWidth:1,borderColor:'#eeeeee'},
    popPrice:{ marginTop:p2d(50),marginBottom:p2d(50), paddingLeft:p2d(26), fontSize:p2d(35), color:colors.bg_color_blue, fontWeight:'bold' },
    popSelect:{ paddingLeft:p2d(26), fontSize:p2d(24),color:'#9e9e9f', },
    popLine:{ height:0, width:p2d(698), alignSelf:'center', borderWidth:p2d(1), borderColor:'#9e9e9f', marginTop:p2d(30),marginBottom:p2d(30),},
    selectBox:{ paddingLeft:p2d(26),paddingRight:p2d(26) },
    selectItemTitle:{ color:'#9e9e9f',fontSize:p2d(28),marginBottom:p2d(20) },
    selectItems:{ flexDirection:'row',  alignItems:'center', flexWrap:'wrap',},
    selectItem:{
        height:p2d(50), borderWidth:p2d(1),borderColor:colors.bg_color_blue,
        paddingLeft:p2d(30),paddingRight:p2d(30),paddingTop:p2d(10),paddingBottom:p2d(10),marginTop:p2d(20),marginRight:p2d(20),
        fontSize:p2d(24),color:colors.bg_color_blue,textAlignVertical: 'center',justifyContent:'center'
    },
    selectedItem:{
        height:p2d(50), paddingLeft:p2d(30),paddingRight:p2d(30),paddingTop:p2d(10),paddingBottom:p2d(10),marginTop:p2d(20),marginRight:p2d(20),
        fontSize:p2d(24),color:colors.bg_color_blue,backgroundColor:colors.bg_color_yellow,textAlignVertical: 'center',justifyContent:'center'
    },
    forbidSelect:{
        height:p2d(50),paddingLeft:p2d(30),paddingRight:p2d(30),paddingTop:p2d(10),paddingBottom:p2d(10),marginTop:p2d(20),marginRight:p2d(20),
        fontSize:p2d(24),color:'#9e9e9f', borderWidth:p2d(1),borderColor:'#9e9e9f',textAlignVertical: 'center',justifyContent:'center'
    },
    countBox:{ flexDirection:'row', justifyContent:'space-between', alignItems:'center', paddingLeft:p2d(26),paddingRight:p2d(26)},
    countBoxText:{ fontSize:p2d(24),color:'#9e9e9f' },
    countCale: { flexDirection:'row',justifyContent:'space-between', alignItems:'center',},
    count:{ fontSize:p2d(35), fontWeight:'bold', marginLeft:p2d(25),marginRight:p2d(25) },
    addReduce:{ width:p2d(50),height:p2d(50) },

    iconNomal:{width:p2d(40),height:p2d(40)}
});

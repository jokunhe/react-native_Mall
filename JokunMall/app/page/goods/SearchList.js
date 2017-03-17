


import React, {Component} from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Image,
    TextInput,
    ListView,
    Modal,
    TouchableOpacity,
    Navigator,
} from 'react-native';

import {colors, window} from '../../constant/Consts';
import FilterView from './FilterCellView';
import PopOver from 'react-native-popover';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {post,get} from '../../utils/NetUtils';
import datas from './searchResult.json';
import {searchList} from '../../constant/ConstUrl'
import Detail from './Detail';
import Toast from 'react-native-root-toast';
import LoadingView from '../../components/Loading';



let selectIndex = true;
let categoryid = '';
let displayid = '';
let pageSize = '20';
let currentPage = '0'

export default class SearchList extends Component {

    constructor(props) {
        super(props);
        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
            firstPressed: true,  //综合
            firstImgUrl: require('../../../imgs/drop_down_select.png'),
            secondPressed: false,  //积分
            secondImgUrl: require('../../../imgs/sort_normal.png'),
            thirdPressed: false,  //价格
            thirdImgUrl: require('../../../imgs/sort_normal.png'),
            fourthPressed: false,  //筛选
            sortIndex: 1,
            popIsVisible: false, //综合排序 菜单 显示控制
            popRect: {},
            sortName: '综合',
            filterVisible: false, //筛选菜单 显示控制
            dataSource: ds.cloneWithRows([]),
            isEmptyData:true,  //返回数据是否为空，界面显示无数据
            isLoading:true,  //标记 是否为加载状态， 是，界面显示loading菊花
        };
    }

    render() {
        return (
            <View style={{flex:1,backgroundColor:'#fff'}}>
                <View style={styles.titleStyle}>
                    <TouchableOpacity ref='iconBack' onPress={()=>{this._goBack()}}>
                        <Image source={require('../../../imgs/back.png')} style={{width: 35,height: 35,left:8}}/>
                    </TouchableOpacity>
                    {this._renderEditView()}
                    <Image source={require('../../../imgs/search_.png')} style={{width: 35,height:35,right:8}}/>
                </View>
                {this._renderFilter()}
                {this._renderContent()}


                <PopOver isVisible={this.state.popIsVisible}
                         fromRect={this.state.popRect}
                         onClose={()=>this._popClose()}
                         placement="bottom"
                >
                    {this._renderSort(this.state.sortIndex)}
                </PopOver>

                <Modal
                    animationType={'fade'}
                    transparent={true}
                    visible={this.state.filterVisible}
                    onRequestClose={()=>{}}>
                    {this._renderFilterMenu()}
                </Modal>

            </View>
        );
    }


    componentDidMount() {
        this._loadData();
    }

    _renderContent() {
        if(this.state.isLoading){
            return(
                <LoadingView/>
            )
        }
        if (this.state.isEmptyData) {
            return (
                <View style={{paddingTop:120,alignItems:'center',flex:1}}>

                    <Image source={require('../../../imgs/no_product.png')}
                           style={{width: 63,height:65,marginBottom:10}}/>
                    <Text>
                        抱歉,暂无相关产品
                    </Text>
                </View>
            )
        }
        return (
            <ListView
                dataSource={this.state.dataSource}
                renderRow={this._renderListItem.bind(this)}
                showsVerticalScrollIndicator={false}

            />
        )

    }

    _renderListItem(rowData, sectionId, rowId, highlightRow) {
        return (
            <TouchableOpacity activeOpacity={0.75} onPress={()=>{this._listItemOnClick(rowData)}}>
                <View
                    style={{width: window.scWidth,flexDirection:'row',paddingTop:8,paddingBottom:8,borderColor:colors.bg_color_yellow,borderBottomWidth:1} }>
                    <Image style={{width:70,height:70,marginLeft:10,marginRight:10}}
                           source={{uri:rowData.displayImageUrl}}/>
                    <View style={{flex:1,marginRight:5}}>
                        <Text numberOfLines={2} style={{fontSize:13,color:'black'}}>
                            {rowData.displayName}
                        </Text>
                        <Text style={{fontSize:12,color: colors.text_color_gray,textDecorationLine:'line-through'}}>
                            市场价:¥{rowData.marketPrice}
                        </Text>
                        <Text style={{fontSize:13,color:'black'}}>
                            积分{rowData.creditPrice}+¥{rowData.price}
                        </Text>
                    </View>
                </View>
            </TouchableOpacity>
        )

    }

    /**
    *  listView Item 点击 跳转 到商品详情界面
    *@author panda
    *created at 2017/1/17 15:17
    */
    _listItemOnClick(rowData){
        this.props.navigator.push(
            {
                component:Detail,
                params:{
                    id:rowData.id
                }

            }
        )
    }

    _loadData() {
        console.log("开始加载数据");
        /*传递参数里取出 分类id 或显示id*/
        if (this.props.categoryid) {
            categoryid = this.props.categoryid;
        }
        if (this.props.displayid) {
            displayid = this.props.displayid;
        }
        post(searchList,{categoryId:categoryid,displayId:displayid,page:currentPage,pageSize:pageSize})
            .then((rs) => {
                console.log("searchList 返回数据",rs);
                if (rs.status_code == 0) {
                    if (rs.result.length > 0) {
                        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
                        this.setState({

                            dataSource: ds.cloneWithRows(rs.result),
                            isEmptyData:false,
                            isLoading:false
                        })
                    }else{
                        this.setState({
                            isLoading:false,
                            isEmptyData:true
                        })
                    }
                } else {
                    console.log("rs.status_code!=0 =====>" + rs.toString());
                    this.setState({
                        isLoading:false
                    })
                }

            }).catch((err) => {
            this.setState({
                isLoading:false
            })
            Toast.show('服务器返回失败，请稍后再试!',{
                duration: Toast.durations.SHORT,
                position: Toast.positions.BOTTOM,
                shadow: true,
                animation: true,
                hideOnPress: true,
                delay: 0,
            })

        });

    }

    componentDidUnMount() {
        this.timer && clearTimeout(this.timer);
    }

    /**
     *fkfjkjkjl
     *@author panda
     *created at 2017/1/11 12:35
     */
    _goBack() {
        this.props.navigator.pop();
    }

    /**
     *点击筛选 弹出筛选条件设置菜单
     *@author panda
     *created at 2017/1/7 12:57
     */
    _renderFilterMenu() {
        return (
            <View style={{flexDirection:'row',alignItems:'stretch'}}>
                <TouchableOpacity onPress={()=>{this._filterMenuClose()}}>
                    <View style={{width: window.scWidth/3,height:window.scHeight}}>
                    </View>
                </TouchableOpacity>
                <View style={{justifyContent:'center',alignItems:'center',backgroundColor:'#fff',flex: 1}}>
                    {this._renderFilterMenuContent()}
                    <View
                        style={{width: window.scWidth*2/3,height:40,flexDirection:'row',position: 'absolute',bottom:0}}>
                        <TouchableOpacity activeOpacity={0.75} onPress={()=>{this._resetFilter()}} style={{flex:1,backgroundColor:colors.bg_color_yellow,justifyContent:'center',alignItems:'center'}}>
                                <Text style={[{color:'black'}]}>
                                    重置
                                </Text>
                        </TouchableOpacity>
                        <TouchableOpacity activeOpacity={0.75} onPress={()=>{this._filterMenuClose()} }
                                          style={{flex:1,backgroundColor:colors.bg_color_blue_deep,justifyContent:'center',alignItems:'center'}}>
                            <Text style={[{color:'yellow'}]}>
                                完成
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        )
    }

    _renderFilterMenuContent() {
        return (
            <KeyboardAwareScrollView>

                <View style={{width: window.scWidth*2/3,height:window.scHeight,paddingLeft:15}}>
                    <Text style={{marginTop:40,fontSize:15,fontWeight:'bold'}}>
                        积分区间
                    </Text>
                    <View style={{width:window.scWidth*2/3,flexDirection:'row',marginTop:10,
                    marginBottom:5,alignItems:'center'}}>
                        <View style={styles.editTextBgStyle}>
                            <TextInput ref="etMinCredits"
                                       placeholder={'最低积分'}
                                       keyboardType={'numeric'}
                                       placeholderTextColor={colors.text_color_gray}
                                       style={styles.editTextStyle}/>
                        </View>
                        <Text style={{color:colors.text_color_gray,marginLeft:5,marginRight:5}}>
                            ----
                        </Text>
                        <View style={styles.editTextBgStyle}>
                            <TextInput ref="etMaxCredits"
                                       placeholder={'最高积分'}
                                       keyboardType={'numeric'}
                                       placeholderTextColor={colors.text_color_gray}
                                       style={styles.editTextStyle}/>
                        </View>

                    </View>

                    <Text style={{marginTop:5,fontSize:15,fontWeight:'bold'}}>
                        价格区间
                    </Text>
                    <View
                        style={{width:window.scWidth*2/3,flexDirection:'row',borderBottomWidth:0.5,
                        borderBottomColor:colors.text_color_gray,marginTop:10,paddingBottom:10}}>
                        <View style={styles.editTextBgStyle}>
                            <TextInput ref="etMinPrice" placeholder={'最低价格'}
                                       keyboardType={'numeric'}
                                       placeholderTextColor={colors.text_color_gray}
                                       style={styles.editTextStyle}/>
                        </View>
                        <Text style={{color:colors.text_color_gray,marginLeft:5,marginRight:5}}>
                            ----
                        </Text>
                        <View style={styles.editTextBgStyle}>
                            <TextInput ref="etMaxPrice" placeholder={'最高价格'}
                                       keyboardType={'numeric'}
                                       placeholderTextColor={colors.text_color_gray}
                                       style={styles.editTextStyle}/>
                        </View>
                    </View>

                    <Text style={{marginTop:5,fontSize:15,fontWeight:'bold'}}>
                        品牌区间
                    </Text>


                </View>
            </KeyboardAwareScrollView>
        )
    }

    /**
     *重置 筛选条件
     *@author panda
     *created at 2017/1/9 16:45
     */
    _resetFilter() {
        this.refs.etMinCredits.clear();
        this.refs.etMaxCredits.clear();
        this.refs.etMinPrice.clear();
        this.refs.etMaxPrice.clear();

    }

    _filterMenuClose() {
        this.setState({
            filterVisible: false
        })
    }

    _filterMenuShow() {
        this.setState({
            filterVisible: true
        })
    }

    /**
     *综合排序 弹出框布局 index -- 记录item的选择状态，选中的字体黑色 带icon
     *@author panda
     *created at 2017/1/7 11:54
     */
    _renderSort(index) {
        return (
            <View style={styles.SortRefStyle}>
                {this._renderSortItem("综合排序", index == 1, 1)}
                {this._renderSortItem("新品优先", index == 2, 2)}
                {this._renderSortItem("销量从高到低", index == 3, 3)}
                {this._renderSortItem("评价从高到低", index == 4, 4)}
            </View>
        )
    }

    _renderSortItem(msg, flag, index) {
        return (
            <TouchableOpacity activeOpacity={0.75} onPress={()=>{this._sortItemOnClick(index)}}>
                <View style={styles.SortItemStyle}>
                    <Text style={{color: flag?'black':'gray',fontSize:15}}>
                        {msg}
                    </Text>
                    {flag ? <Image source={require('../../../imgs/sort_select.png')}
                                   style={{width:20,height:14 ,position: 'absolute',right: 60,top: 15}}/> : null}
                </View>
            </TouchableOpacity>
        )
    }

    /**
     *点击综合排序后，弹窗口消失
     *@author panda
     *created at 2017/1/7 11:53
     */
    _sortItemOnClick(index) {
        var name;
        switch (index) {
            case 1:
                name = "综合";
                break;
            case 2:
                name = "新品";
                break;
            case 3:
                name = "销量";
                break;
            case 4:
                name = "评价";
                break;
        }
        this.setState({
            sortIndex: index,
            sortName: name,
        });
        this.timer = setTimeout(() => {
            this._popClose()
        }, 300);


    }

    /**
     *综合 popwindow 消失
     *@author panda
     *created at 2017/1/7 11:53
     */
    _popClose() {
        this.setState({popIsVisible: false})
    }

    _showPop() {
        this.refs.first.measure((ox, oy, width, height, px, py) => {
            this.setState({
                popIsVisible: true,
                popRect: {x: px, y: py, width: width, height: height}

            })
        })

    }


    /**
     *title bar 搜索输入框
     *@author panda
     *created at 2017/1/5 20:39
     */
    _renderEditView() {
        return (
            <View style={styles.editStyle}>
                <Image source={require('../../../imgs/search_t.png')} style={{width: 30,height:30,marginLeft:5}}/>
                <TextInput multiline={false}
                           placeholder={'搜索商品'}
                           placeholderTextColor={colors.text_color_gray}
                           underlineColorAndroid={'transparent'}
                           style={{flex: 1}}/>


            </View>

        )
    }

    /**
     * 排序 和 筛选条件
     *@author panda
     *created at 2017/1/5 20:41
     */
    _renderFilter() {
        return (
            <View style={styles.filterStyle}>

                <TouchableOpacity ref='first' onPress={()=>{this._firstOnClick()}} activeOpacity={0.75}>
                    <FilterView isPressed={this.state.firstPressed}
                                msg={this.state.sortName}
                                imageUrl={this.state.firstImgUrl}/>
                </TouchableOpacity>

                <TouchableOpacity onPress={()=>{this._secondOnClick()}} activeOpacity={0.75}>
                    <FilterView msg="积分"
                                isPressed={this.state.secondPressed}
                                imageUrl={this.state.secondImgUrl}/>
                </TouchableOpacity>

                <TouchableOpacity onPress={()=>this._thirdOnClick()} activeOpacity={0.75}>
                    <FilterView msg="价格"
                                isPressed={this.state.thirdPressed}
                                imageUrl={this.state.thirdImgUrl}/>
                </TouchableOpacity>

                <TouchableOpacity onPress={()=>this._fourthOnClick()} activeOpacity={0.75}>
                    <FilterView msg="筛选"
                                isPressed={this.state.fourthPressed}/>

                </TouchableOpacity>

            </View>


        )
    }

    /**
     *点击 综合
     *@author panda
     *created at 2017/1/5 21:12
     */
    _firstOnClick() {
        selectIndex = true;
        this.setState({
            firstPressed: true,  //综合
            firstImgUrl: require('../../../imgs/drop_down_select.png'),
            secondPressed: false,  //积分
            secondImgUrl: require('../../../imgs/sort_normal.png'),
            thirdPressed: false,  //价格
            thirdImgUrl: require('../../../imgs/sort_normal.png'),
            fourthPressed: false,  //筛选
            modalShow: true
        });
        this._showPop();


    }

    /**
     *点击 积分
     *@author panda
     *created at 2017/1/5 21:12
     */
    _secondOnClick() {
        this.setState({
            firstPressed: false,  //综合
            firstImgUrl: require('../../../imgs/drop_down_normal.png'),
            secondPressed: true,  //积分
            secondImgUrl: selectIndex ? require('../../../imgs/sort_select_down.png') :
                require('../../../imgs/sort_select_up.png'),
            thirdPressed: false,  //价格
            thirdImgUrl: require('../../../imgs/sort_normal.png'),
            fourthPressed: false,  //筛选
            modalShow: false
        })
        selectIndex = !selectIndex;
    }

    /**
     *点击 价格
     *@author panda
     *created at 2017/1/5 21:12
     */
    _thirdOnClick() {
        this.setState({
            firstPressed: false,  //综合
            firstImgUrl: require('../../../imgs/drop_down_normal.png'),
            secondPressed: false,  //积分
            secondImgUrl: require('../../../imgs/sort_normal.png'),
            thirdPressed: true,  //价格
            thirdImgUrl: selectIndex ? require('../../../imgs/sort_select_down.png') :
                require('../../../imgs/sort_select_up.png'),
            fourthPressed: false,  //筛选
            modalShow: false,
        })
        selectIndex = !selectIndex;
    }

    /**
     *点击 筛选
     *@author panda
     *created at 2017/1/5 21:13
     */
    _fourthOnClick() {
        selectIndex = true;
        this.setState({
            firstPressed: false,  //综合
            firstImgUrl: require('../../../imgs/drop_down_normal.png'),
            secondPressed: false,  //积分
            secondImgUrl: require('../../../imgs/sort_normal.png'),
            thirdPressed: false,  //价格
            thirdImgUrl: require('../../../imgs/sort_normal.png'),
            fourthPressed: true,  //筛选
            modalShow: false,
        })

        this._filterMenuShow();
    }


}


const styles = StyleSheet.create({
    titleStyle: {
        width: window.width,
        height: 48,
        flexDirection: 'row',
        justifyContent: 'center',
        backgroundColor: colors.bg_color_yellow,
        alignItems: 'center'
    },
    editStyle: {
        flex: 1,
        height: 38,
        backgroundColor: colors.bg_color_white,
        marginLeft: 15,
        marginRight: 15,
        borderRadius: 2,
        flexDirection: 'row',
        alignItems: 'center'
    },
    filterStyle: {
        width: window.scWidth,
        height: 43,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'stretch',
        borderBottomWidth: 0.5,
        borderBottomColor: '#aeaeae'

    },
    modalStyle: {
        flexDirection: 'row'
    },
    sortViewStyle: {
        width: window.scWidth,
        height: 43 + 48,
    },
    SortRefStyle: {
        width: window.scWidth,
        height: 160,
        justifyContent: 'space-between'
    },
    SortItemStyle: {
        width: window.scWidth,
        height: 40,
        flexDirection: 'row',
        paddingRight: 10,
        paddingLeft: 10,
        alignItems: 'center',

    },
    editTextStyle: {
        width: 70,
        height:30,
        padding: 0,
        textAlign: 'center',


    },
    editTextBgStyle: {
        borderRadius: 5,
        borderWidth: 1,
        borderColor: colors.bg_color_yellow,
    }


});


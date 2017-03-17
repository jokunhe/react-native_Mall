import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    ListView,
    Image,
    TouchableOpacity,
    PixelRatio,
    RefreshControl,
    ScrollView,
    
} from 'react-native';
import NavigationBar from 'react-native-navbar';
import {post, get} from '../../utils/NetUtils';
import MD5 from '../../utils/MD5';
import  {window} from '../../constant/Consts';
import ConfirmOrder from '../order/ConfirmOrder'
import {shopCartListUrl, shopCartDeleteUrl, shopCartUpdateNumberUrl} from'../../constant/ConstUrl';

const cellHeight = 104;
const bottomViewHeight = 50;

export default class ShopCart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSource: this._newDatasource(),
            hasData: false,
            isEditting: false,
            isSelectAll: false,
            isRefreshing:false,
            amountText:'',
            selectCount:0
        };
        this.dataArray = []
        this.token = ''
        this._selectAll = this._selectAll.bind(this)
        this._renderShopCarCell = this._renderShopCarCell.bind(this)
        this._selectRow = this._selectRow.bind(this)
        this._addRow = this._addRow.bind(this)
        this._subtractRow = this._subtractRow.bind(this)
        this._deleteRow = this._deleteRow.bind(this)
        this._deleteWithIds = this._deleteWithIds.bind(this)
        this._updateNumber = this._updateNumber.bind(this)
        this._onRefresh = this._onRefresh.bind(this)
    }
    
    /**
     * 组件加载后请求数据
     * 
     * 
     * @memberOf ShopCart
     */
    componentDidMount() {
        storage.load({key:'TOKEN'}).then((data)=>{
            this.token = data
            this._fetchShopCarList()
        }).catch((error)=>{
            alert('还未登录')
        })
    }

    
    /**
     * 进入组件重新加载数据
     * 
     * 
     * @memberOf ShopCart
     */
    componentWillReceiveProps() {
        storage.load({key:'TOKEN'}).then((data)=>{
            this.token = data
            this._fetchShopCarList()
        }).catch((error)=>{
            alert('还未登录')
        })
    }


    /**
     * 创建datasource对象
     * 
     * @returns
     * 
     * @memberOf ShopCart
     */
    _newDatasource() {
        return new ListView.DataSource({
                rowHasChanged: (row1, row2) =>   row1 !== row2
            })
    }

    /**
     * 获取购物车列表数据
     * 
     * 
     * @memberOf ShopCart
     */
    _fetchShopCarList() {
        post(shopCartListUrl,{
            token: this.token
        }).then((rs)=>{
            var dataArray = rs.result;
            for (var index in dataArray) {
                var model = dataArray[index]
                model = Object.assign(model,{isSelect:false})
            }
            this.dataArray = dataArray
            var dataSource = this._newDatasource();
            this.setState({
                isRefreshing: false,
                dataSource: dataSource.cloneWithRows(this.dataArray),
            })
            this._refreshListView();
        }).catch((error)=> {
            this.setState({
                isRefreshing: false,
            })
            console.log('出错了:',error);
        }).done();
    }

    /**
     * 删除cell处理方法
     * 
     * @param {any} indexs 删除的index数组
     * 
     * @memberOf ShopCart
     */
    _deleteWithIds(indexs) {
        var ids = [];
        for (var i in indexs) {
            index = indexs[i]
            var model = this.dataArray[index]
            ids.push(model.id)
        }
        post(shopCartDeleteUrl,{
            ids:ids,
            token : this.token,
        }).then((rs)=>{
            if (rs.status_code == 0) {
                for (var i in indexs) {
                    var index = indexs[i]
                    this.dataArray.splice(index,1)
                    var dataSource = this._newDatasource();
                    this.setState ({
                        dataSource: dataSource.cloneWithRows(this.dataArray)
                    })
                }
                this._refreshListView()
                alert('删除成功');
            } 
        }).catch((error)=> {
            console.log('出错了:',error);
        }).done();
    }


    /**
     * 更新数量方法
     * 
     * @param {any} model 更新的购物车id
     * @param {any} num 更新到的数量
     * 
     * @memberOf ShopCart
     */
    _updateNumber(model, num) {
        post(shopCartUpdateNumberUrl,{
            id:model.id,
            num:num,
            token : this.token,
        }).then((rs)=>{
            if (rs.status_code == 0) {
                model.num = num
                this.setState ({
                    hasData:true
                })                
                alert('修改成功');
            } 
        }).catch((error)=> {
            console.log('出错了:',error);
        }).done();
    }

    
    /**
     * 编辑完成按钮
     * 
     * 
     * @memberOf ShopCart
     */
    _doneAction() {
        const count = this.state.dataSource.getRowCount();
        if (count == 0 && !this.state.isEditting) {
            alert('没有可编辑的商品喔，快去商城逛逛吧')
            return
        }
        for (var i = 0; i < count ;i++) {
            var model = this.state.dataSource.getRowData(0,i)
            model.isSelect = false
        }
        this.state.isEditting = !this.state.isEditting
        this._refreshListView();     
    }

    /**
     * 点击+
     * 
     * @param {any} model
     * 
     * @memberOf ShopCart
     */
    _addRow(model) {
        if (model.num+1 > model.maxbuy) {
            alert('最多购买'+model.maxbuy+'件')
            return
        }
        this._updateNumber(model, model.num+1);
    }

    /**
     * 点击-
     * 
     * @param {any} model
     * 
     * @memberOf ShopCart
     */
    _subtractRow(model) {
        if (model.num-1 < model.minbuy) {
            alert('最少购买'+model.minbuy+'件')
            return
        }
        this._updateNumber(model, model.num-1);
    }

    /**
     * 删除cell
     * 
     * @param {any} rowId
     * 
     * @memberOf ShopCart
     */
    _deleteRow(rowId) {
        console.log('删除cell');
        console.log(rowId);
        this._deleteWithIds([rowId])
    }

    /**
     * 点击单选按钮
     * 
     * @param {any} model 数据model
     * 
     * @memberOf ShopCart
     */
    _selectRow(model) {
        model.isSelect = !model.isSelect;
        this._refreshListView()
    }

    /**
     * 点击全选按钮
     * 
     * 
     * @memberOf ShopCart
     */
    _selectAll() {
        for (var i = 0; i < this.state.dataSource.getRowCount() ;i++) {
            var model = this.state.dataSource.getRowData(0,i)
            model.isSelect = !this.state.isSelectAll
        }
        this._refreshListView();
    }

    /**
     * 刷新listview方法，计算价格
     * 
     * 
     * @memberOf ShopCart
     */
    _refreshListView() {
        var price = 0
        var creditPrice = 0;
        var selectCount = 0;
        var allCount = this.dataArray.length
        for (var i = 0; i < allCount ;i++) {
            var model = this.dataArray[i]
            if (model.isSelect) {
                if (!this.state.isEditting) {
                    price += model.price * model.num
                    creditPrice += model.creditPrice * model.num
                }
                selectCount++
            }
        }

        var amountText = ''
        if (!this.state.isEditting) {
            amountText = '积分' + creditPrice + '+¥' + price   
        }
        var selectAll = false
        if (allCount == selectCount) {
            selectAll = true
        }
        var hasData = false
        if (allCount != 0) {
            hasData = true
        }
        var dataSource = this._newDatasource();

        this.setState({
            selectCount:selectCount,
            hasData: hasData,
            isSelectAll : selectAll,
            amountText: amountText,
            dataSource: dataSource.cloneWithRows(this.dataArray)
        })
    }

    /**
     * 点击结算按钮
     * 
     * 
     * @memberOf ShopCart
     */
    _settleAccounts() { 
        var items = [];
        var allCount = this.state.dataSource.getRowCount()
        for (var i = 0; i < allCount ;i++) {
            var item = this.state.dataSource.getRowData(0,i)
            if (item.isSelect) {
                items.push(item)
            }
        }
        if (items.length == 0) {
            alert('亲，您还没有选择要结算的商品哦')
            return
        }
        //跳转传值结算页
        this.props.navigator.push({
            component:ConfirmOrder,
            params:{
                items:items
            }
        })
    }


    /**
     * 点击选择删除
     * 
     * 
     * @memberOf ShopCart
     */
    _deleteSelect() {
        var indexs = [];
        var allCount = this.state.dataSource.getRowCount();
        var item;
        for (var i = 0; i < allCount ;i++) {
            item = this.state.dataSource.getRowData(0,i)
            if (item.isSelect) {
                indexs.push(i)
            }
        }
        if (indexs.length == 0) {
            return
        }
        this._deleteWithIds(indexs)
    }

    /**
     * 下拉刷新方法
     * 
     * 
     * @memberOf ShopCart
     */
    _onRefresh() {
        this.setState({isRefreshing: true});
        setTimeout(() => {
            this._fetchShopCarList();
        }, 500);
    }

    render() {
        return (
            <View style={{ flex: 1, backgroundColor: 'white'}}>
                <NavigationBar
                    style={{ backgroundColor: '#112945' }}
                    statusBar={{ tintColor: '#112945' }}
                    title={{ title: '购物车', style: { color: '#fdda6a', fontSize: 17 } }}
                    rightButton={{ title: this.state.isEditting ? '完成' : '编辑', tintColor: '#fdda6a',
                        handler: () => { this._doneAction() }
                    }}/>
                {
                    this.state.hasData ? (
                    <ListView
                    dataSource={this.state.dataSource}
                    renderRow={this._renderShopCarCell}
                    style={{backgroundColor: 'white'}}
                    enableEmptySections = {true}
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.isRefreshing}
                            onRefresh={this._onRefresh}
                            title="Loading..."
                        />
                        }
                    />) : (
                        <ScrollView contentContainerStyle={{ flex: 1, backgroundColor: 'white', alignItems: 'center', justifyContent: 'flex-start'}}
                        refreshControl={
                            <RefreshControl
                                refreshing={this.state.isRefreshing}
                                onRefresh={this._onRefresh}
                                title="Loading..."
                            />
                        }>
                            <Image source={require('../../../imgs/shop_car_noproduct.png')} style={{width:94.5,height:102, marginTop:100}}></Image>
                            <Text style={{fontSize: 17, color: '#000000', marginTop:20}}>{'您的购物车空无一物'}</Text>
                        </ScrollView>
                    ) 
                }
                
                <View style={{ flexDirection: 'column'}}>
                    <Image source={require('../../../imgs/blue_line.png')} style={ {height:1, width:window.scWidth} }/>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <TouchableOpacity
                            style={{height: bottomViewHeight, alignItems: 'center', justifyContent: 'center', flexDirection: 'row'}}
                            onPress={() => this._selectAll()}
                            activeOpacity={1}>
                            <Image
                                source={this.state.isSelectAll? require('../../../imgs/on.png') : require('../../../imgs/off.png')} 
                                style={{width:13.5,height:13.5, marginLeft:12, marginRight:6}}/>
                            <Text style={{fontSize: 14, color: '#112945', marginRight:8 }}>{'全选'}</Text>
                        </TouchableOpacity>
                        <View style={{flex:1, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end'}}> 
                        {//编辑状态不显示价格
                            this.state.isEditting ? null :
                            (<Text style={{fontSize: 15, color: '#112945', textAlign: 'right', marginRight:8 }}>{this.state.amountText}</Text>)
                        }
                            <TouchableOpacity
                                style={{ width: 80, height: 34, alignItems: 'center', justifyContent: 'center', backgroundColor :'#fdda6a' , borderRadius:15, marginRight:8}}
                                onPress={() => this.state.isEditting ? this._deleteSelect() : this._settleAccounts()}
                                activeOpacity={0.75}>
                            <Text style={{fontSize: 16, color: '#112945', textAlign: 'right' }}>{(this.state.isEditting?'删除':'结算')+'('+this.state.selectCount.toString()+')'}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        );
    }


    /**
     * 刷新cell方法
     * 
     * @param {any} model model数据
     * @param {any} sectionId
     * @param {any} rowId
     * @returns
     * 
     * @memberOf ShopCart
     */
    _renderShopCarCell(model, sectionId, rowId) {
        return (
            <View style={{ flex:1, backgroundColor: 'white', flexDirection: 'column'}}>
                <View style={{backgroundColor: 'white', flexDirection: 'row',width:window.scWidth,height:cellHeight}}>
                    <TouchableOpacity 
                        onPress={()=>{this._selectRow(model)}}
                        style={{ width: 38, height: cellHeight, alignItems: 'center', justifyContent: 'center'}}
                        activeOpacity={1}>
                        <Image
                            source={model.isSelect? require('../../../imgs/on.png') : require('../../../imgs/off.png')} 
                            style={{width:13.5,height:13.5}}/>
                    </TouchableOpacity>
                    <View style={{ width: 92, height: cellHeight, alignItems: 'center', justifyContent: 'center'}}>
                        <Image
                            source={{ uri: model.productLogo }}
                            style={ {height:92,width:92} }
                        />
                    </View>
                    <View
                        style={{ flexDirection: 'column', backgroundColor: 'white', marginLeft:16, marginBottom: 6, width:window.scWidth-92-16-38-16 }}>
                        <View style={{ backgroundColor: 'white', marginTop: 6}}>
                            <Text style={{ fontSize: 13,color: '#112945'} } numberOfLines={2}>{model.productName}</Text>
                        </View>
                        {//编辑状态显示编辑view，非编辑状态显示正常view   
                            this.state.isEditting ? (
                                <View style={{ backgroundColor: 'white', flexDirection: 'column',flex:1, justifyContent: 'flex-end' }}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center',justifyContent: 'flex-start' }}>
                                        <TouchableOpacity
                                            style={{height: 25, width:25, alignItems: 'center', justifyContent: 'center'}}
                                            onPress={() => this._subtractRow(model)}
                                            activeOpacity={1}>
                                            <Image
                                                source={require('../../../imgs/reduce.png')} 
                                                style={{width:25,height:25}}/>
                                        </TouchableOpacity>
                                        <Text style={{width:35, fontSize: 14, color: '#112945',textAlign: 'center' }}>{model.num}</Text>
                                        <TouchableOpacity
                                            style={{height: 25, alignItems: 'center', justifyContent: 'center', flexDirection: 'row'}}
                                            onPress={() => this._addRow(model)}
                                            activeOpacity={1}>
                                            <Image
                                                source={require('../../../imgs/add.png')} 
                                                style={{width:25,height:25}}/>
                                        </TouchableOpacity> 
                                        <View style={{flexDirection: 'row',flex:1, justifyContent: 'flex-end'}}>
                                            <TouchableOpacity
                                                style={{height: 25, alignItems: 'center', justifyContent: 'center', flexDirection: 'row',marginRight: 0}}
                                                onPress={() => this._deleteRow(rowId)}
                                                activeOpacity={1}>
                                                <Image
                                                    source={require('../../../imgs/shopcar_delete.png')} 
                                                    style={{width:14,height:14, marginRight:4}}/>
                                                <Text style={{fontSize: 14, color: '#112945' }}>{'删除'}</Text>
                                            </TouchableOpacity>       
                                        </View>
                                    </View>
                                </View>
                             ) : (
                                <View style={{ backgroundColor: 'white', flexDirection: 'row',flex:1 }}>
                                    <View style={{ flexDirection: 'column', justifyContent: 'flex-end' }}>
                                        <Text
                                            style={{fontSize: 12, color: '#AAAAAA', marginBottom: 6 }}>{'规格：' + ( model.color ? model.color : '默认类型' ) }</Text>
                                        <Text style={{fontSize: 12, color: '#AAAAAA' }}>{'数量：x' + model.num }</Text>
                                    </View>
                                    <View style={{flexDirection:'column', justifyContent: 'flex-end',flex:1}}>
                                        <Text
                                            style={{fontSize: 12, color: '#112945', textAlign: 'right' }}>{'积分' + model.creditPrice + '+¥' + model.price}</Text>
                                    </View>
                                </View>
                             )
                        }
                    </View>
                </View>
                <Image source={require('../../../imgs/blue_line.png')} style={ {height:1, width:window.scWidth, marginLeft:10} }/>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    
});
module.exports = ShopCart;
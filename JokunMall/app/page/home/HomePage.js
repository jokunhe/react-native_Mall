import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    ScrollView,
    ListView,
    RefreshControl
} from 'react-native';
import {homePage} from'../../constant/ConstUrl';
import {post, get} from '../../utils/NetUtils';
import Header from './Header';
import Swiper from './swiper';
import HomeMiddleView from './HomeMiddleView';
import Toast from 'react-native-root-toast';
import Loading from '../../components/Loading';
import Detail from './../goods/Detail';
import SearchList from './../goods/SearchList';
var Dimensions = require('Dimensions');
var scWidth = Dimensions.get('window').width;

export default class HomePage extends Component {
    constructor(props) {
        super(props);
        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
            homeData: {},
            dataSource: ds.cloneWithRows([]),
            isLoading: true,
            isRefreshing: false,
        }
    }

    componentDidMount() {
        this._loadData();
    }

    _loadData() {
        post(homePage, {}).then((rs) => {
            var data = rs.result;
            var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
            console.log(data);
            if (this.state.isRefreshing) {
                Toast.show('刷新完成', {
                    duration: Toast.durations.SHORT,
                    position: Toast.positions.CENTER,
                    shadow: true,
                    animation: true,
                    hideOnPress: true,
                    delay: 0,
                })
            }
            this.setState({
                homeData: data,
                dataSource: ds.cloneWithRows(data.productsList),
                isRefreshing: false,
                isLoading: false
            });

        }).catch((error) => {
            if (this.state.isRefreshing) {
                Toast.show('刷新失败', {
                    duration: Toast.durations.SHORT,
                    position: Toast.positions.CENTER,
                    shadow: true,
                    animation: true,
                    hideOnPress: true,
                    delay: 0,
                })
            }
            this.setState({
                isLoading: false
            });
            console.log('出错了:', error);

        }).done();

    }

    render() {
        return (
            <ScrollView style={styles.container}
                        refreshControl={
           <RefreshControl
            refreshing={this.state.isRefreshing}
            onRefresh={()=>{this._onRefresh()}}
            tintColor="#ff0000"
            title="Loading..."
            titleColor="#00ff00"
            colors={['#ff0000', '#00ff00', '#0000ff']}
            progressBackgroundColor="#fff"/>}>
                {/*--搜索栏--*/}
                <View style={styles.searchBox}>
                    <Header/>
                </View>
                {this._renderContent()}
            </ScrollView>
        );
    }

    _onRefresh() {
        this.setState({isRefreshing: true});
        this._loadData();
    }

    renderRow(rowData, sectionId, rowId, highlight) {
        var products = rowData.products;
        var smallProducts = [];
        /*排除第一个大图显示的商品*/
        for (var i = 0; i < products.length; i++) {
            if (i > 0) {
                smallProducts.push(products[i]);
            }
        }
        return (
            <View>
                <Image source={{uri: rowData.logo}} style={{width: scWidth, height: 150, marginTop: 10}}/>
                <View style={{flexDirection: 'row'}}>
                    <TouchableOpacity onPress={()=>{this._productOnClick(rowData.id)}}>
                        <View style={{alignItems: 'center'}}>
                            <Image style={{width: scWidth / 2, height: scWidth / 2}} source={{uri: products[0].logo}}/>
                            <Text style={{maxWidth: (scWidth / 2 - 15), marginTop: 10}} numberOfLines={1}>
                                {products[0].displayName}
                            </Text>
                            <Text>
                                积分{products[0].creditPrice}+¥{products[0].price}
                            </Text>
                        </View>
                    </TouchableOpacity>
                    <View style={{flexDirection: 'row', flex: 1, flexWrap: 'wrap', alignItems: 'flex-start'}}>
                        {this._renderView(smallProducts)}
                    </View>
                </View>
            </View>

        )
    }


    _renderContent() {
        let swiperimg = this.state.homeData.advList;
        if (this.state.isLoading) {
            return (
                <View style={{paddingTop:200}}>
                    <Loading/>
                </View>
            )
        }
        return (
            <View>
                {/*--轮播图--*/}
                {/*<Swiper*/}
                    {/*{...swiperimg}*/}
                {/*/>*/}
                {/*--分类--*/}
                <View style={styles.categoryStyle}>
                    {this._renderCategory()}
                </View>
                {/*/!*顶尖货*!/*/}
                <View >
                    <HomeMiddleView
                        {...this.state.homeData.topGoods}
                        {...this.props}
                    />
                </View>

                {/*/!*商品列表*!/*/}
                <ListView
                    dataSource={this.state.dataSource}
                    renderRow={this.renderRow.bind(this)}
                    showsVerticalScrollIndicator={false}
                    enableEmptySections={true}
                />
            </View>
        )
    }

    _renderView(arrs) {
        var views = [];
        for (var i = 0; i < arrs.length && i < 4; i++) {
            var goodsId = arrs[i].id;
            views.push(
                <TouchableOpacity key={i} onPress={this._productOnClick.bind(this,goodsId)}>
                    <View style={{alignItems: 'center', marginTop: 5}}>
                        <Image style={{width: scWidth / 4 - 5, height: scWidth / 4 - 5}} source={{uri: arrs[i].logo}}/>
                        <Text style={{maxWidth: (scWidth / 4 - 5), marginTop: 10, fontSize: 10}} numberOfLines={1}>
                            {arrs[i].displayName}
                        </Text>
                        <Text style={{fontSize: 10, maxWidth: scWidth / 4 - 5}} numberOfLines={1}>
                            积分{arrs[i].creditPrice}+¥{arrs[i].price}
                        </Text>
                    </View>

                </TouchableOpacity>
            )
        }
        return views;

    }

    _renderCategory() {
        let category = [];
        var categoryList = this.state.homeData.cateList;
        if (categoryList && categoryList.length > 0) {
            for (var i = 0; i < categoryList.length && i < 5; i++) {
                var url = categoryList[i].logo;
                var name = categoryList[i].name;
                var id = categoryList[i].displayId;
                category.push(
                    <TouchableOpacity key={i} onPress={this._cateOnclick.bind(this,id)}>
                        <View style={{alignItems: 'center'}}>
                            <Image source={{uri: url}} style={{width: 60, height: 60}}/>
                            <Text style={{fontSize: 12}}>
                                {name}
                            </Text>
                        </View>

                    </TouchableOpacity>
                )
            }
        }
        return category
    }


    _productOnClick(id) {
        if(id){
            this.props.navigator.push({
                    component:Detail,
                    params:{
                        id:id
                    }
                }
            )
        }

    }

    _cateOnclick(displayId) {
        if(displayId){
            this.props.navigator.push({
                    component:SearchList,
                    params:{
                        displayid:displayId
                    }
                }
            )
        }else {
            alert("商品信息不全")
        }
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'

    },
    searchBox: {
        backgroundColor: '#112945',
        height: 44,
        justifyContent: 'center',

    },
    categoryStyle: {
        flexDirection: 'row',
        justifyContent: 'space-around',

    }

});
module.exports = HomePage;
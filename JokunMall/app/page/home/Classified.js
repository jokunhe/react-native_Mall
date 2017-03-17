import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ListView,
    TouchableOpacity,
    Image
} from 'react-native';
import {topCategory,childCategory} from'../../constant/ConstUrl';
import { post } from '../../utils/NetUtils';
import {colors, window} from '../../constant/Consts';
import searchList from '../goods/SearchList';
const juhuatu = require('../../../imgs/launcher_page.jpg');
export default class Classified extends Component {


    constructor(props) {
        super(props);

        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
            isloding: false,
            dataSource: ds,
            childCategoryData:{},
            topCategoryData:{},
            selectedItem:{},
            show:false,
        };
        console.log(this.props);
    }


    componentDidMount() {
        /*一级分类数据请求*/
        post(topCategory,{}).then((rs)=>{
            this.setState({
                topCategoryData : rs.result,
                isloding : true,
            });
        }).catch((error)=> {
            console.log('出错了:',error);

        }).done();
    }
    render(){
        if(this.state.isloding == false) {
            return (

                <Image source={juhuatu} style={styles.juhuatu}/>

            );
        }
        else {
            return (
                <ListView
                    contentContainerStyle = {styles.container}
                    dataSource={this.state.dataSource.cloneWithRows(this.state.topCategoryData)}
                    renderRow={(rowData) => this.renderCell(rowData)}
                />
            );
        }
    }
    renderCell(rowData){
        return(
            <View>
                <TouchableOpacity onPress={this._click.bind(this,rowData)} >
                    <View style={styles.class}>
                        <Text style={styles.className}>{rowData.name}</Text>
                    </View>
                </TouchableOpacity>
                {rowData.secend && rowData.secend.length > 0  &&  this.state.selectedItem && rowData.id === this.state.selectedItem.id ?
                    <View>
                        <View style={styles.child} >
                            {this.childView(rowData.secend)}
                        </View>
                        <View style={styles.close} >
                            <Text onPress={this._close.bind(this)}>点击收起</Text>
                        </View>
                    </View>
                    :null}

            </View>
        );
    }



    _click(selectedItem)
    {
        this.setState({
            selectedItem: this.state.selectedItem.id === selectedItem.id ? {} : selectedItem
        });
        post(childCategory,{id:selectedItem.id}).then((rs)=>{
            let data= rs.result;
            let source = this.state.topCategoryData;
            for(var  i=0; i<source.length;i++){
                let item = source[i];
                source[i].secend =[];
                if(item.id == selectedItem.id){
                    source[i].secend = data;
                }
            }
            this.setState({
                topCategoryData :source
            });
        }).catch((error)=> {
            console.log('出错了:',error);
        }).done();
    }

    _close(){
        this.setState({
            selectedItem:{}
        });
    }


    childView(items) {
        var childView = [];
        for(var i=0;i< items.length;i++){
            childView.push(
                <View style={styles.childText} key={i}>
                    <Text  onPress={this.searchlist.bind(this)}> {items[i].name}</Text>
                </View>
            );
        }

        return childView;
    }
    searchlist(){
        this.props.navigator.push(
            {
                component:searchList,
            }
        )
    }

}

const styles = StyleSheet.create({
    juhuatu:{
        flex:1,
        height:300,
        width:360,
    },
    container: {
        backgroundColor: colors.bg_color_yellow,
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom:40,
        paddingTop:40,
    },
    class:{
        alignItems: 'center',
        marginTop:20,
        borderWidth:1,
        width:window.scWidth*0.7,
        height:80,
        justifyContent: 'center',
    },
    child:{
        flexDirection: 'row',
        flexWrap:'wrap',
        width:window.scWidth*0.7,
        justifyContent:'space-around',
        alignItems:'center',
        borderWidth:1,


    },
    childText:{
        width:window.scWidth*0.7*0.3,
        height:50,
        alignItems: 'center',
        justifyContent: 'center',
    },
    close:{
        alignItems: 'center',
        borderWidth:1,
        width:window.scWidth*0.7,
        height:30,
        justifyContent: 'center',
        borderTopWidth:0,
        backgroundColor:'#112945'
    }

});
module.exports = Classified;
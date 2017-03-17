
import React, {PropTypes} from 'react';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    StyleSheet,
    Navigator
} from 'react-native';
import {window} from '../../constant/Consts';
propTypes = {
    msg: Text.string,
    isPressed: PropTypes.boolean,
};

const FilterCellView = ({msg, isPressed, imageUrl}) => (


    <View style={styles.viewStyle}>
        <Text style={{color:isPressed?'black':'gray'}}>
            {msg}
        </Text>
        <Image source={imageUrl} style={{width:6,height:20,marginLeft:2}} resizeMode={'center'}/>
    </View>

);

FilterCellView.prototype = PropTypes;

FilterCellView.defaultProps = {
    isPressed: false,
    onPress: {},
}

export default FilterCellView;


const styles = StyleSheet.create({
    viewStyle: {
        width: window.scWidth / 5,
        height: 43,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    }
});

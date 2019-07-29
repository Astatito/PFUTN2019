import React , {Component} from 'react';
import {Text, View} from 'react-native';

class Escaner extends Component {
       
    render () {
        const {navigation} = this.props;
        const tipo = navigation.getParam('tipo', 'ERROR');

        return (
            <View>
                <Text>Acá va el escaner</Text>
                <Text>{tipo}</Text>
            </View>
        )
        
    }
};
export default Escaner;

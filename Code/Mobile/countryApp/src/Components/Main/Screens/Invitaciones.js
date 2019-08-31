import React, { Component } from 'react';
import { Text, View } from 'react-native';

class Invitaciones extends Component {
    static navigationOptions = {
        title: 'Invitaciones',
        headerRight: <View />
    };
    render() {
        return (
            <View
                style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                <Text>Bienvenido a mis invitaciones! </Text>
            </View>
        );
    }
}

export default Invitaciones;

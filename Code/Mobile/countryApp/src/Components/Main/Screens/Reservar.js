import React, { Component } from 'react';
import { Text, View } from 'react-native';

class Reservar extends Component {
    static navigationOptions = {
        title: 'Reservar',
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
                <Text>Bienvenido a mis reservas !</Text>
            </View>
        );
    }
}

export default Reservar;

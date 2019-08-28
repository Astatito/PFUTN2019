import React, { Component } from 'react';
import { Text, View } from 'react-native';

// import Icon from 'react-native-vector-icons/EvilIcons';
class MiPerfil extends Component {
    static navigationOptions = {
        title: 'Mi perfil',
        headerRight: <View />,
        
}
    render() {
        return (
            <View
                style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                <Text>Bienvenido a mi perfil!</Text>
            </View>
        );
    }
}

export default MiPerfil;

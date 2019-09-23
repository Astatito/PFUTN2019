import React, { Component } from 'react';
import { LocalStorage } from '../../Storage';
import { Text, View } from 'react-native';

// import Icon from 'react-native-vector-icons/EvilIcons';
class MiPerfil extends Component {
    static navigationOptions = {
        title: 'Mi perfil',
        headerRight: <View />
    };

    componentDidMount() {
        LocalStorage.load({
            key: 'UsuarioLogueado'
        })
            .then(response => {
                console.log(response.usuario);
                console.log(response.tipoUsuario);
                console.log(response.country);
                console.log(response.datos);
            })
            .catch(error => {
                switch (error.name) {
                    case 'NotFoundError':
                        console.log('La key solicitada no existe.');
                        break;
                    default:
                        console.warn('Error inesperado: ', error.message);
                }
            });
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

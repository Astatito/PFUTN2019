import React, { Component } from 'react';
import { View, StyleSheet, Image, StatusBar } from 'react-native';
import { Text, Content } from 'native-base';
import { LocalStorage } from '../../../DataBase/Storage';

class Propietario extends Component {
    static navigationOptions = {
        title: 'Home'
    };

    render() {
        //TODO: SOLO TESTING
        // LocalStorage.save({
        //     key: 'UsuarioLogueado',
        //     data: {
        //         usuario: 'propietario@countryapp.com',
        //         tipoUsuario: 'Propietario',
        //         country: 'nkB2OpDMe6znzVkQRCRf',
        //         datos: 'F73bChXtjOvqTVNdx85j'
        //     }
        // });
        //FIN DEL TODO
        return (
            <Content>
                <View style={styles.container}>
                    <StatusBar backgroundColor="#1e90ff"></StatusBar>
                    <Text style={styles.header}> Bienvenido de nuevo !</Text>
                    <View style={{ height: 340, width: 340, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' }}>
                        <Image source={require('../../../../assets/Logo/LogoTransparente.png')} style={{ height: 340, width: 340 }}></Image>
                    </View>
                </View>
            </Content>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
        paddingLeft: '5%',
        paddingRight: '5%'
    },
    header: {
        fontSize: 30,
        marginBottom: '15%',
        marginTop: '15%',
        color: '#08477A',
        fontWeight: 'normal',
        fontStyle: 'normal'
    }
});
export default Propietario;

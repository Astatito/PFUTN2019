import React, { Component } from 'react';
import { View, StyleSheet, Image, StatusBar } from 'react-native';
import { Text, Content } from 'native-base';
import { LocalStorage } from '../../../DataBase/Storage';

//TODO: SOLO TESTING
LocalStorage.save({
    key: 'UsuarioLogueado',
    data: {
        usuario: 'encargado@countryapp.com',
        tipoUsuario: 'Encargado',
        country: 'nkB2OpDMe6znzVkQRCRf',
        datos: 'j6cHI1TEPzYTN4l6vTUU'
    }
});
//FIN DEL TODO

class Encargado extends Component {
    static navigationOptions = {
        title: 'Inicio'
    };

    render() {
        return (
            <Content>
                <View style={styles.container}>
                    <StatusBar backgroundColor="#1e90ff"></StatusBar>
                    <Text style={styles.header}>¡Bienvenido de nuevo !</Text>
                    <View style={{ height: 340, width: 340, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' }}>
                        <Image
                            source={require('../../../../assets/Images/LogoTransparente.png')}
                            style={{ height: 340, width: 340 }}></Image>
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
export default Encargado;

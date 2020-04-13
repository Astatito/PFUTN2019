import React, { Component } from 'react';
import { View, StyleSheet, Image, StatusBar } from 'react-native';
import { Text, Content } from 'native-base';
import { LocalStorage } from '../../../DataBase/Storage';
import call from 'react-native-phone-call'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const callArgs = {
    number: '3512071228', //Poner el telefono de un guardia.
    prompt: true 
}

//TODO: SOLO TESTING
LocalStorage.save({
    key: 'UsuarioLogueado',
    data: {
        usuario: 'propietario@countryapp.com',
        tipoUsuario: 'Propietario',
        country: 'nkB2OpDMe6znzVkQRCRf',
        datos: 'F73bChXtjOvqTVNdx85j'
    }
});
//FIN DEL TODO

class Propietario extends Component {
    static navigationOptions = {
        title: 'Home',
        headerRight: <MaterialIcons style={{ paddingRight: 20 }} name="call" size={25} onPress={() => call(callArgs).catch(console.error)}/>
    };
    
    render() {
        return (
            <Content>
                <View style={styles.container}>
                    <StatusBar backgroundColor="#1e90ff"></StatusBar>
                    <Text style={styles.header}> Bienvenido de nuevo !</Text>
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
    },
    btn: {
        alignSelf: 'center',
        padding: '3%',
        alignItems: 'center',
        backgroundColor: '#1e90ff',
        width:'50%'
    }
});
export default Propietario;

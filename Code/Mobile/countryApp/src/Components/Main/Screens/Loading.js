import React, { Component } from 'react';
import { View, StyleSheet, StatusBar, Image, Text } from 'react-native';
import { Toast, Root } from 'native-base';
import { Firebase, Database } from '../../DataBase/Firebase';
import { LocalStorage } from '../../DataBase/Storage';
import 'firebase/auth';

class Loading extends Component {

    componentDidMount () {
        this.isAlreadyLogged()
    }

    isAlreadyLogged = async () => {
        Firebase.auth().onAuthStateChanged(async (user) => {
            if (user) {
                var home = await this.registrarUsuarioLogueado(user.email.toLowerCase());
                switch (home) {
                    case 1:
                        this.props.navigation.navigate('Propietario');
                        break;
                    case 2:
                        this.props.navigation.navigate('Encargado');
                        break;
                }
            } else {
                setTimeout(() => {this.props.navigation.navigate('Login')}, 2000)
            }
        });
    };

    storeUsuario = (keyStore, obj) => {
        LocalStorage.save({
            key: keyStore,
            data: {
                usuario: obj.NombreUsuario,
                tipoUsuario: obj.TipoUsuario.id,
                country: obj.IdCountry.id,
                datos: obj.IdPersona.id,
            },
        });
    };

    registrarUsuarioLogueado = async (email) => {
        var dbRef = Database.collection('Usuarios');
        try {
            var doc = await dbRef.doc(email).get();
            if (doc.exists) {
                this.storeUsuario('UsuarioLogueado', doc.data());
                switch (doc.data().TipoUsuario.id) {
                    case 'Propietario':
                        return 1;
                    case 'Encargado':
                        return 2;
                }
            }
        } catch (error) {
            Toast.show({
                text: "Lo siento, ocurrió un error inesperado.",
                buttonText: "Aceptar",
                duration: 3000,
                position: "bottom",
                type: "danger",
            })
        }
    };

    render() {
        return (
            <Root>
                <View style={styles.container}>
                    <StatusBar backgroundColor="#96D0E8"></StatusBar>
                    <View style={{ height: 250, width: 250, backgroundColor: '#96D0E8', alignItems: 'center', justifyContent: 'center',marginBottom: 50 }}>
                        <Image
                            source={require('../../../assets/Images/LogoTransparente.png')}
                            style={{ height: 250, width: 300, borderRadius: 0}}></Image>
                        <Text style={styles.version}> v1.0 </Text>
                    </View>
                </View>
            </Root>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#96D0E8',
        paddingLeft: '10%',
        paddingRight: '10%',
    },
    version: {
        fontWeight: 'bold',
        alignSelf: 'center',
        fontSize: 16,
        color: '#35383D'
    }
});
export default Loading;

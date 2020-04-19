import React, { Component } from 'react';
import { View, StyleSheet, StatusBar, Image, Text } from 'react-native';
import { Firebase } from '../../DataBase/Firebase';
import { LocalStorage } from '../../DataBase/Storage';
import 'firebase/auth';

class Loading extends Component {

    state = {timePassed : false}

    componentDidMount () {
        setTimeout(() => {this.isAlreadyLogged()}, 2000)
    }

    isAlreadyLogged = async () => {
        Firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                LocalStorage.load({
                    key: 'UsuarioLogueado',
                }).then((response) => {
                    switch (response.tipoUsuario) {
                        case 'Propietario':
                            this.props.navigation.navigate('Propietario')
                            break
                        case 'Encargado':
                            this.props.navigation.navigate('Encargado');
                            break
                    }
                })
            } else {
                this.props.navigation.navigate('Login')
            }
        });
    };

    render() {
        return (
                <View style={styles.container}>
                    <StatusBar backgroundColor="#96D0E8"></StatusBar>
                    <View style={{ height: 250, width: 250, backgroundColor: '#96D0E8', alignItems: 'center', justifyContent: 'center',marginBottom: 50 }}>
                        <Image
                            source={require('../../../assets/Images/LogoTransparente.png')}
                            style={{ height: 250, width: 300, borderRadius: 0}}></Image>
                        <Text style={styles.version}> v1.0 </Text>
                    </View>
                    
                </View>
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

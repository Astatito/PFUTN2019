import React, { Component } from 'react';
import { View, StyleSheet, Image, StatusBar } from 'react-native';
import { Text, Content, Root, Toast } from 'native-base';
import { LocalStorage } from '../../../DataBase/Storage';
import call from 'react-native-phone-call';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import IconIonicons from 'react-native-vector-icons/Ionicons';
import { Database } from '../../../DataBase/Firebase';

var number = '';
const withNotifications = '#FCCB00';
const withoutNotifications = '#0E4275';

class Propietario extends Component {
    componentWillMount() {
        LocalStorage.load({
            key: 'UsuarioLogueado',
        })
            .then((usuario) => {
                this.setState({ usuario }, () => {
                    try {
                        var doc = Database.collection('Country')
                        .doc(this.state.usuario.country)
                        .get()
                        .then((doc) => {
                            if (doc.exists) {
                                var celular = doc.data().Celular;
                                number = celular;
                            }
                        });
                    } catch (error) {
                        Toast.show({
                            text: 'Lo siento, ocurrió un error inesperado.',
                            buttonText: 'Aceptar',
                            duration: 3000,
                            position: 'bottom',
                            type: 'danger',
                        });
                    }
                });
                this.props.navigation.setParams({ iconColor: withoutNotifications });
                this.obtenerNotificaciones();
                this.createListeners();
            })
            .catch((error) => {
                Toast.show({
                    text: 'La key solicitada no existe.',
                    buttonText: 'Aceptar',
                    duration: 3000,
                    position: 'bottom',
                    type: 'danger',
                });
            });
    }

    componentWillUnmount() {
        this._unsubscribeSnapshot.remove();
        this._subscribeSnapshot.remove();
    }

    createListeners() {
        this._subscribeSnapshot = this.props.navigation.addListener('didFocus', () => {
            this.obtenerNotificaciones();
        });

        this._unsubscribeSnapshot = this.props.navigation.addListener('didBlur', () => {
            this.snapshotNotificaciones();
        });
    }

    obtenerNotificaciones = () => {
        var refCountry = Database.collection('Country').doc(this.state.usuario.country);
        var refNotificaciones = refCountry.collection('Notificaciones');
        try {
            this.snapshotNotificaciones = refNotificaciones
            .where(
                'IdPropietario',
                '==',
                Database.doc('Country/' + this.state.usuario.country + '/Propietarios/' + this.state.usuario.datos)
            )
            .where('Visto', '==', false)
            .onSnapshot((snapshot) => {
                if (!snapshot.empty) {
                    this.props.navigation.setParams({ iconColor: withNotifications });
                } else {
                    this.props.navigation.setParams({ iconColor: withoutNotifications });
                }
            });
        } catch (error) {
            Toast.show({
                text: 'Lo siento, ocurrió un error inesperado.',
                buttonText: 'Aceptar',
                duration: 3000,
                position: 'bottom',
                type: 'danger',
            });
        }
    };

    static navigationOptions = ({ navigation }) => {
        return {
            title: 'Inicio',
            headerRight: (
                <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', width: 100 }}>
                    <MaterialIcons
                        style={{ paddingRight: 20 }}
                        name="call"
                        size={25}
                        onPress={() =>
                            call({
                                number: number,
                                prompt: true,
                            }).catch(console.error)
                        }
                    />
                    <IconIonicons
                        style={{ paddingRight: 20, color: navigation.getParam('iconColor') }}
                        name="ios-notifications"
                        size={25}
                        onPress={() => navigation.navigate('Notificaciones')}></IconIonicons>
                </View>
            ),
        };
    };

    render() {
        return (
<<<<<<< Updated upstream
            <Root>
                <Content>
                    <View style={styles.container}>
                        <StatusBar backgroundColor="#1e90ff"></StatusBar>
                        <Text style={styles.header}>¡Bienvenido de nuevo!</Text>
                        <View style={{ height: 340, width: 340, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' }}>
                            <Image
                                source={require('../../../../assets/Images/LogoTransparente.png')}
                                style={{ height: 340, width: 340 }}></Image>
                        </View>
=======
            <Content>
                <View style={styles.container}>
                    <StatusBar backgroundColor="#1e90ff"></StatusBar>
                    <Text style={styles.header}>¡Bienvenido de nuevo!</Text>
                    <View style={{ height: 340, width: 340, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' }}>
                        <Image
                            source={require('../../../../assets/Images/LogoTransparente.png')}
                            style={{ height: 340, width: 340 }}></Image>
>>>>>>> Stashed changes
                    </View>
                </Content>
            </Root>
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
        paddingRight: '5%',
    },
    header: {
        fontSize: 30,
        marginBottom: '15%',
        marginTop: '15%',
        color: '#08477A',
        fontWeight: 'normal',
        fontStyle: 'normal',
    },
    btn: {
        alignSelf: 'center',
        padding: '3%',
        alignItems: 'center',
        backgroundColor: '#1e90ff',
        width: '50%',
    },
    iconContainer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        width: 100,
    },
});
export default Propietario;

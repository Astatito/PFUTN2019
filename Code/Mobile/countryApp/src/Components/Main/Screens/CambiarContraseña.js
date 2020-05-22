import React, { Component } from 'react';
import { View, StyleSheet, TextInput, StatusBar } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Content, Button, Text, Root, Toast} from 'native-base';
import Spinner from 'react-native-loading-spinner-overlay';
import { LocalStorage } from '../../DataBase/Storage';
import * as firebase from 'firebase';


const LIGHT_GRAY = '#D3D3D3';

class CambiarContraseña extends Component {

    state = {
        routeName: '',
        passwordActual: '',
        passwordNuevo: '',
        passwordNuevoRepetido : '',
        isFocused: false,
        showSpinner: false,
        isVisible: false,
        passwordActualError: '',
        passwordNuevoError: '',
        passwordNuevoRepetidoError: ''
    }   

    componentWillMount() {

        LocalStorage.load({
            key: 'UsuarioLogueado',
        })
            .then((usuario) => {
                switch (usuario.tipoUsuario) {
                    case 'Encargado':
                        this.setState({routeName: 'Encargado'});
                        break;
                    case 'Propietario':
                        this.setState({routeName: 'Propietario'});
                        break;
                }
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

        setInterval(() => {
            this.setState({
                showSpinner: false,
            });
        }, 10000);
    }

    onBlur() {
        this.setState({ isFocused: false });
    }
    
    onFocus() {
        this.setState({ isFocused: true });
    }

    onToastClosed = (reason) => {
        this.limpiarCampos();
        this.props.navigation.navigate(this.state.routeName)
    };

    verificarTextInputs = async (inputArray) => {
        let someEmpty = false;
        inputArray.forEach((text) => {
            const inputError = text + 'Error';
            if (this.state[text] == '') {
                someEmpty = true;
                this.setState({ [inputError]: '*Campo requerido', showSpinner: false });
            } else {
                this.setState({ [inputError]: '' });
            }
        });
        return someEmpty;
    };

    limpiarCampos = () => {
        this.setState({
            passwordActualFirebase: 'PasswordFirebase',
            passwordActual: '',
            passwordNuevo: '',
            passwordNuevoRepetido : '',
            isFocused: false,
            showSpinner: false,
            isVisible: false,
            passwordActualError: '',
            passwordNuevoError: '',
            passwordNuevoRepetidoError: ''
        });
    };

    reAuthenticate = async () => {
        var user = firebase.auth().currentUser;
        var cred = firebase.auth.EmailAuthProvider.credential(user.email, this.state.passwordActual);
        return user.reauthenticateWithCredential(cred);
    }

    updatePassword = async () => {
        var user = firebase.auth().currentUser;
        try {
            await this.reAuthenticate()
            await user.updatePassword(this.state.passwordNuevo)
            return 0
        } catch (error) {
            switch (error.code) {
                case "auth/wrong-password":
                    return 1
                case "auth/weak-password":
                    return 2
                default:
                    return 3
            }
        } finally {
            this.setState({showSpinner: false});
        }
    }
    
    render() {
        
        return (
            <Root>
                <ScrollView>
                    <Content>
                        <View style={styles.container}>
                            <Spinner visible={this.state.showSpinner} textContent={'Loading...'} textStyle={styles.spinnerTextStyle} />
                            <StatusBar backgroundColor="#1e90ff"></StatusBar>
                            <TextInput
                                style={styles.textInput}
                                placeholder="Contraseña actual"
                                value= {this.state.passwordActual}
                                onChangeText={(passwordActual) => this.setState({ passwordActual })}
                                underlineColorAndroid={LIGHT_GRAY}
                                onFocus={() => this.onFocus()}
                                onBlur={() => this.onBlur()}
                                keyboardType={'default'}
                                maxLength={25}
                                secureTextEntry={true}
                            />
                            <Text style={styles.error}>{this.state.passwordActualError}</Text>

                            <TextInput
                                style={styles.textInput}
                                placeholder="Nueva Contraseña"
                                value= {this.state.passwordNuevo}
                                onChangeText={(passwordNuevo) => this.setState({ passwordNuevo })}
                                underlineColorAndroid={LIGHT_GRAY}
                                onFocus={() => this.onFocus()}
                                onBlur={() => this.onBlur()}
                                keyboardType={'default'}
                                maxLength={25}
                                secureTextEntry={true}
                            />
                            <Text style={styles.error}>{this.state.passwordNuevoError}</Text>

                            <TextInput
                                style={styles.textInput}
                                placeholder="Nueva Contraseña"
                                value= {this.state.passwordNuevoRepetido}
                                onChangeText={(passwordNuevoRepetido) => this.setState({ passwordNuevoRepetido })}
                                underlineColorAndroid={LIGHT_GRAY}
                                onFocus={() => this.onFocus()}
                                onBlur={() => this.onBlur()}
                                keyboardType={'default'}
                                maxLength={25}
                                secureTextEntry={true}
                            />
                            <Text style={styles.error}>{this.state.passwordNuevoRepetidoError}</Text>

                            <View style={{ flexDirection: 'row' }}>
                                <View style={styles.buttons}>
                                    <Button
                                        bordered
                                        success
                                        style={{ paddingHorizontal: '5%' }}
                                        onPress={async () => {
                                            this.setState({ showSpinner: true }, async () => {
                                                const textInputs = await this.verificarTextInputs(['passwordActual', 'passwordNuevo', 'passwordNuevoRepetido']);
                                                if (textInputs == true) {
                                                    return false;
                                                }
                                                if (this.state.passwordNuevo != this.state.passwordNuevoRepetido) {
                                                    Toast.show({
                                                        text: 'Las contraseñas no coinciden.',
                                                        buttonText: 'Aceptar',
                                                        duration: 3000,
                                                        position: 'bottom',
                                                        type: 'warning',
                                                    });
                                                    this.setState({ showSpinner: false })
                                                    return false
                                                }
                                                const result = await this.updatePassword()
                                                if (result == 0) {
                                                    Toast.show({
                                                        text: 'Contraseña actualizada correctamente.',
                                                        buttonText: 'Aceptar',
                                                        duration: 3000,
                                                        position: 'bottom',
                                                        type: 'success',
                                                        onClose: this.onToastClosed.bind(this),
                                                    });
                                                } else if (result == 1) {
                                                    Toast.show({
                                                        text: 'La contraseña ingresada es incorrecta.',
                                                        buttonText: 'Aceptar',
                                                        duration: 3000,
                                                        position: 'bottom',
                                                        type: 'danger',
                                                    });
                                                } else if (result == 2) {
                                                    Toast.show({
                                                        text: 'La contraseña debe contener al menos 6 caracteres.',
                                                        buttonText: 'Aceptar',
                                                        duration: 3000,
                                                        position: 'bottom',
                                                        type: 'danger',
                                                    });
                                                } else if (result == 3) {
                                                    Toast.show({
                                                        text: 'Lo siento, ocurrió un error inesperado.',
                                                        buttonText: 'Aceptar',
                                                        duration: 3000,
                                                        position: 'bottom',
                                                        type: 'danger',
                                                        onClose: this.onToastClosed.bind(this),
                                                    });
                                                }
                                            });
                                        }}>
                                        <Text>Aceptar</Text>
                                    </Button>
                                </View>
                                <View style={styles.buttons}>
                                    <Button
                                        bordered
                                        danger
                                        style={{ paddingHorizontal: '5%' }}
                                        onPress={() => {
                                            this.limpiarCampos();
                                            this.props.navigation.navigate(this.state.routeName)
                                        }}>
                                        <Text>Cancelar</Text>
                                    </Button>
                                </View>
                            </View>
                        </View>
                    </Content>
                </ScrollView>
            </Root>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
        marginHorizontal: '2%',
        marginVertical: '9%',
        flexDirection: 'column',
        flex: 1,
    },
    spinnerTextStyle: {
        fontSize: 20,
        fontWeight: 'normal',
        color: '#FFF',
    },
    textInput: {
        width: '82%',
        fontSize: 16,
        alignItems: 'flex-start',
        marginTop: '3%',
    },
    buttons: {
        alignItems: 'center',
        justifyContent: 'center',
        width: '45%',
        marginTop: '6%',
    },
    error: {
        color: 'red',
        alignSelf: 'flex-start',
        fontSize: 12,
        marginLeft: '10%',
    },
});

export default CambiarContraseña;

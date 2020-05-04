import React, { Component } from 'react';
import { View, StyleSheet, TextInput, StatusBar } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Content, Button, Text, Root, Toast} from 'native-base';
import Spinner from 'react-native-loading-spinner-overlay';
import { NavigationActions } from 'react-navigation';

const BLUE = '#428AF8';
const LIGHT_GRAY = '#D3D3D3';

const navigateAction = NavigationActions.navigate({
    routeName: 'Propietario',
    action: NavigationActions.navigate({ routeName: 'Propietario' }),
});

class CambiarContraseña extends Component {

    componentWillMount() {
        // this.setState({ showSpinner: true });
        setInterval(() => {
            this.setState({
                showSpinner: false,
            });
        }, 3000);
    }

    state = {
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
    };

    handleFocus = (event) => {
        this.setState({ isFocused: true });
        if (this.props.onFocus) {
            this.props.onFocus(event);
        }
    };

    handleBlur = (event) => {
        this.setState({ isFocused: false });
        if (this.props.onBlur) {
            this.props.onBlur(event);
        }
    };

    onToastClosed = (reason) => {
        this.limpiarCampos();
        this.props.navigation.dispatch(navigateAction);
    };

    actualizarContraseña = async() => {
        //Logica de Firebase para actualizar la contraseña.
        return 0
    }

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

    render() {
        const { isFocused } = this.state;

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
                                underlineColorAndroid={isFocused ? BLUE : LIGHT_GRAY}
                                onFocus={this.handleFocus}
                                onBlur={this.handleBlur}
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
                                underlineColorAndroid={isFocused ? BLUE : LIGHT_GRAY}
                                onFocus={this.handleFocus}
                                onBlur={this.handleBlur}
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
                                underlineColorAndroid={isFocused ? BLUE : LIGHT_GRAY}
                                onFocus={this.handleFocus}
                                onBlur={this.handleBlur}
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
                                                if (this.state.passwordActual != this.state.passwordActualFirebase) {
                                                    Toast.show({
                                                        text: 'Las contraseña actual no es correcta.',
                                                        buttonText: 'Aceptar',
                                                        duration: 3000,
                                                        position: 'bottom',
                                                        type: 'warning',
                                                    });
                                                    this.setState({ showSpinner: false })
                                                    return false
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
                                                const result = await this.actualizarContraseña()
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
                                            this.props.navigation.dispatch(navigateAction);
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

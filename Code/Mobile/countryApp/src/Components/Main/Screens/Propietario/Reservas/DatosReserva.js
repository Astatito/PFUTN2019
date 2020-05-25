import React, { Component } from 'react';
import { View, StyleSheet, TextInput, StatusBar, Alert } from 'react-native';
import { Database } from '../../../../DataBase/Firebase';
import { Content, Button, Text, Root, Toast } from 'native-base';
import Spinner from 'react-native-loading-spinner-overlay';
import moment from 'moment';


const LIGHT_GRAY = '#D3D3D3';

class DatosReserva extends Component {
    state = {
        nombreReserva: '',
        reserva: {},
        showSpinner: false,
        isFocused: false,
        isVisible: false,
        esDesde: null,
        usuario: {},
        nombreReservaError: ''
    };

    componentDidMount() {
        setInterval(() => {
            this.setState({
                showSpinner: false
            });
        }, 3000);
    }

    componentWillMount() {
        this.setState({ showSpinner: true });

        const { navigation } = this.props;
        const usuario = navigation.dangerouslyGetParent().getParam('usuario');
        const reserva = navigation.dangerouslyGetParent().getParam('reserva');

        this.setState({
            usuario: usuario,
            nombreReserva: reserva.nombre,
            reserva: reserva,
            showSpinner: false
        });
    }

    onBlur() {
        this.setState({ isFocused: false });
    }
    
    onFocus() {
        this.setState({ isFocused: true });
    }

    handlePicker = datetime => {
        if (this.state.esDesde == true) {
            this.setState({
                isVisible: false,
                fechaDesde: moment(datetime)
            });
        } else {
            this.setState({
                isVisible: false,
                fechaHasta: moment(datetime)
            });
        }
    };

    hidePicker = () => {
        this.setState({ isVisible: false });
    };

    showPicker = () => {
        this.setState({ isVisible: true });
    };

    onToastClosed = (reason) => {
        this.props.navigation.navigate('MisReservas');
    }

    modificarReserva = async () => {
        var refCountry = Database.collection('Country').doc(this.state.usuario.country);
        var refReserva = refCountry
            .collection('Propietarios')
            .doc(this.state.usuario.datos)
            .collection('Reservas')
            .doc(this.state.reserva.key);
        try {
            await refReserva.set(
                {
                    Nombre: this.state.nombreReserva
                },
                { merge: true }
            );
            refReserva = Database.doc(this.state.reserva.idReservaServicio);
            await refReserva.set(
                {
                    Nombre: this.state.nombreReserva
                },
                { merge: true }
            );
            return 0
        } catch (error) {
            return 1
        } finally {
            this.setState({ showSpinner: false });
        }
    };

    verificarTextInputs = async(inputArray) => {
        let someEmpty = false
        inputArray.forEach(text => {
            const inputError= text + 'Error'
            if (this.state[text] == '') {
                someEmpty = true
                this.setState({ [inputError] : '*Campo requerido', showSpinner: false  });
            } else {
                this.setState({ [inputError] : '' });
            }
        });
        return someEmpty
    }

    render() {

        return (
            <Root>
                <Content>
                    <View style={styles.container}>
                        <Spinner visible={this.state.showSpinner} textContent={'Loading...'} textStyle={styles.spinnerTextStyle} />
                        <StatusBar backgroundColor="#1e90ff"></StatusBar>
                        <Text style={styles.header}> Modificar reserva </Text>

                        <TextInput
                            style={styles.textInput}
                            placeholder="Nombre de reserva"
                            value={this.state.nombreReserva}
                            onChangeText={nombreReserva => this.setState({ nombreReserva })}
                            underlineColorAndroid={LIGHT_GRAY}
                            onFocus={() => this.onFocus()}
                            onBlur={() => this.onBlur()}
                            keyboardType={'default'}
                            maxLength={20}
                        />
                        <Text style={styles.error}>{this.state.nombreReservaError}</Text>
                        <View style={{ flexDirection: 'row' }}>
                            <View style={styles.buttons}>
                                <Button
                                    bordered
                                    success
                                    style={{ paddingHorizontal: '5%' }}
                                    onPress={async () => {
                                        const textInputs = await this.verificarTextInputs(['nombreReserva'])
                                            if ( textInputs == true) {
                                                return false
                                            }
                                        Alert.alert(
                                            'Atención',
                                            '¿ Está seguro que desea modificar esta reserva ? ',
                                            [
                                                { text: 'Cancelar', onPress: () => console.log('Cancel pressed'), style: 'cancel' },
                                                {
                                                    text: 'Aceptar',
                                                    onPress: async () => {
                                                        this.setState({ showSpinner: true }, async () => {
                                                            const result = await this.modificarReserva()
                                                            if (result == 0) {
                                                                Toast.show({
                                                                    text: "Datos de reserva actualizados.",
                                                                    buttonText: "Aceptar",
                                                                    duration: 3000,
                                                                    position: "bottom",
                                                                    type: "success",
                                                                    onClose : this.onToastClosed.bind(this)
                                                                })
                                                            } else if (result == 1) {
                                                                Toast.show({
                                                                    text: "Lo siento, ocurrió un error inesperado.",
                                                                    buttonText: "Aceptar",
                                                                    duration: 3000,
                                                                    position: "bottom",
                                                                    type: "danger",
                                                                    onClose : this.onToastClosed.bind(this)
                                                                })
                                                            }
                                                        });
                                                    }
                                                }
                                            ],
                                            { cancelable: true }
                                        );
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
                                        this.props.navigation.navigate('MisReservas');
                                    }}>
                                    <Text>Cancelar</Text>
                                </Button>
                            </View>
                        </View>
                    </View>
                </Content>
            </Root>
            
        );
    }
}
const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
        marginHorizontal: '3%',
        marginVertical: '5%',
        flex: 1
    },
    spinnerTextStyle: {
        fontSize: 20,
        fontWeight: 'normal',
        color: '#FFF'
    },
    header: {
        textAlign: 'center',
        fontSize: 26,
        marginHorizontal: '5%',
        marginVertical: '9%',
        color: '#08477A',
        fontWeight: 'normal',
        fontStyle: 'normal'
    },
    textInput: {
        width: '80%',
        fontSize: 16,
        alignItems: 'flex-start',
        marginTop: '7%'
    },
    buttons: {
        alignItems: 'center',
        justifyContent: 'center',
        width: '45%',
        marginTop: '8%'
    },
    error: {
        color:'red',
        alignSelf:'flex-start',
        fontSize:12,
        marginLeft:'10%'
    }
});

export default DatosReserva;

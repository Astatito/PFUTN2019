import React, { Component } from 'react';
import { View, StyleSheet, TextInput, StatusBar } from 'react-native';
import { Database } from '../../../../DataBase/Firebase';
import { Content, Button, Text } from 'native-base';
import Spinner from 'react-native-loading-spinner-overlay';
import DateTimePicker from 'react-native-modal-datetime-picker';
import IconFontAwesome from 'react-native-vector-icons/FontAwesome';
import { LocalStorage } from '../../../../DataBase/Storage';
import moment from 'moment';

const BLUE = '#428AF8';
const LIGHT_GRAY = '#D3D3D3';

class DatosReserva extends Component {

    state = {
        nombreReserva: '',
        fechaDesde: moment(new Date()),
        fechaHasta: moment(new Date()),
        showSpinner: false,
        isFocused: false,
        isVisible: false,
        esDesde: null,
        usuario: {}
    };

    componentDidMount() {
        this.setState({ showSpinner: true });

        setInterval(() => {
            this.setState({
                showSpinner: false
            });
        }, 3000);
        
        LocalStorage.load({
            key: 'UsuarioLogueado'
        })
            .then(response => {
                this.setState({ usuario: response });
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

    handleFocus = event => {
        this.setState({ isFocused: true });
        if (this.props.onFocus) {
            this.props.onFocus(event);
        }
    };

    handleBlur = event => {
        this.setState({ isFocused: false });
        if (this.props.onBlur) {
            this.props.onBlur(event);
        }
    };

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

    render() {
        const { isFocused } = this.state;

        return (
            <Content>
                <View style={styles.container}>
                    <Spinner visible={this.state.showSpinner} textContent={'Loading...'} textStyle={styles.spinnerTextStyle} />
                    <StatusBar backgroundColor="#1e90ff"></StatusBar>
                    <Text style={styles.header}> Modificar reserva </Text>

                    <TextInput
                        style={styles.textInput}
                        placeholder="Nombre de reserva"
                        onChangeText={nombreReserva => this.setState({ nombreReserva })}
                        underlineColorAndroid={isFocused ? BLUE : LIGHT_GRAY}
                        onFocus={this.handleFocus}
                        onBlur={this.handleBlur}
                        keyboardType={'numeric'}
                    />

                    <View style={styles.datetime}>
                        <Text style={{ alignSelf: 'center', color: '#8F8787' }}>Ingreso</Text>
                        <Text style={{ alignSelf: 'center', color: '#1e90ff', paddingHorizontal: '9.5%', fontSize: 15 }}>
                            {this.state.fechaDesde.format('MMMM, Do YYYY HH:mm')}
                        </Text>
                        <IconFontAwesome
                            style={{ alignSelf: 'center' }}
                            onPress={() => {
                                this.showPicker();
                                this.setState({ esDesde: true });
                            }}
                            name="calendar"
                            size={25}
                        />
                    </View>

                    <View style={styles.datetime}>
                        <Text style={{ alignSelf: 'center', color: '#8F8787' }}>Egreso</Text>
                        <Text style={{ alignSelf: 'center', color: '#1e90ff', paddingHorizontal: '10%', fontSize: 15 }}>
                            {this.state.fechaHasta.format('MMMM, Do YYYY HH:mm')}
                        </Text>
                        <IconFontAwesome
                            style={{ alignSelf: 'center' }}
                            onPress={() => {
                                this.showPicker();
                                this.setState({ esDesde: false });
                            }}
                            name="calendar"
                            size={25}
                        />
                    </View>

                    <DateTimePicker
                        isVisible={this.state.isVisible}
                        onConfirm={this.handlePicker}
                        onCancel={this.hidePicker}
                        mode={'datetime'}
                        is24Hour={true}></DateTimePicker>

                    <View style={{ flexDirection: 'row' }}>
                        <View style={styles.buttons}>
                            <Button
                                bordered
                                success
                                style={{ paddingHorizontal: '5%' }}
                                onPress={() => {
                                    this.props.navigation.goBack();
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
                                    this.props.navigation.goBack();
                                }}>
                                <Text>Cancelar</Text>
                            </Button>
                        </View>
                    </View>
                </View>
            </Content>
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
        margin: '7%'
    },
    datetime: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        margin: '7%',
        width: '80%'
    },
    buttons: {
        alignItems: 'center',
        justifyContent: 'center',
        width: '45%',
        marginVertical: '5%'
    }
});

export default DatosReserva;

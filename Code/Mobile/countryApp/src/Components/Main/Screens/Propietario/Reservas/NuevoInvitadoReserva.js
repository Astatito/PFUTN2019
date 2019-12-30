import React, { Component } from 'react';
import { View, StyleSheet, TextInput, StatusBar } from 'react-native';
import { Database } from '../../../../DataBase/Firebase';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Content, Button, Text, Picker } from 'native-base';
import Spinner from 'react-native-loading-spinner-overlay';
import { LocalStorage } from '../../../../DataBase/Storage';

const BLUE = '#428AF8';
const LIGHT_GRAY = '#D3D3D3';

class NuevoInvitadoReserva extends Component {

    static navigationOptions = ({ navigation }) => {
        return {
            title: 'Nuevo Invitado',
            headerLeft: <Icon style={{ paddingLeft: 10 }} onPress={() => navigation.goBack()} name="arrow-back" size={30} />,
            headerRight: <View />
        };
    };

    state = {
        picker: '',
        tiposDocumento: [],
        documento: '',
        showSpinner: false,
        isFocused: false,
        isVisible: false,
        usuario: {}
    };

    componentDidMount() {
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

    // TODO: extraer este metodo a un modulo aparte para evitar consultas repetitivas a la BD.
    obtenerPickers = () => {
        var dbRef = Database.collection('TipoDocumento');
        var dbDocs = dbRef.get().then(snapshot => {
            var tiposDocumento = [];
            snapshot.forEach(doc => {
                tiposDocumento.push({ id: doc.id, nombre: doc.data().Nombre });
            });
            this.setState({ tiposDocumento });
        });
    };

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

    registrarNuevoInvitado = (tipoDoc, numeroDoc) => {
        // Lógica para registrar un nuevo invitado asociado a una reserva.
    };

    render() {
        const { isFocused } = this.state;

        if (this.state.tiposDocumento.length < 3) {
            this.obtenerPickers();
        }

        return (
            <Content>
                <View style={styles.container}>
                    <Spinner visible={this.state.showSpinner} textContent={'Loading...'} textStyle={styles.spinnerTextStyle} />
                    <StatusBar backgroundColor="#1e90ff"></StatusBar>
                    <Text style={styles.header}> Registrar nuevo invitado </Text>

                    <Picker
                        note
                        mode="dropdown"
                        style={styles.picker}
                        selectedValue={this.state.picker}
                        onValueChange={itemValue => this.setState({ picker: itemValue })}>
                        <Picker.Item label="Tipo de documento" value="-1" color="#7B7C7E" />
                        {this.state.tiposDocumento.map((item, index) => {
                            return <Picker.Item label={item.nombre} value={item.id} key={index} />;
                        })}
                    </Picker>

                    <TextInput
                        style={styles.textInput}
                        placeholder="Número de documento"
                        onChangeText={documento => this.setState({ documento })}
                        underlineColorAndroid={isFocused ? BLUE : LIGHT_GRAY}
                        onFocus={this.handleFocus}
                        onBlur={this.handleBlur}
                        keyboardType={'numeric'}
                    />

                    <View style={{ flexDirection: 'row' }}>
                        <View style={styles.buttons}>
                            <Button
                                bordered
                                success
                                style={{ paddingHorizontal: '5%' }}
                                onPress={() => {
                                    this.registrarNuevoInvitado(this.state.picker, this.state.documento);
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
    picker: {
        width: '85%',
        fontSize: 18,
        marginTop: '5%',
        alignItems: 'flex-start'
    },
    textInput: {
        width: '80%',
        fontSize: 16,
        alignItems: 'flex-start',
        margin: '7%'
    },
    buttons: {
        alignItems: 'center',
        justifyContent: 'center',
        width: '45%',
        marginVertical: '5%'
    }
});

export default NuevoInvitadoReserva;

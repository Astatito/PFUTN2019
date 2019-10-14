import React, { Component } from 'react';
import { View, StyleSheet, TextInput, StatusBar, Alert } from 'react-native';
import { Database } from '../../Firebase';
import { ScrollView } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Content, Button, Text, Picker } from 'native-base';
import Spinner from 'react-native-loading-spinner-overlay';
import DateTimePicker from 'react-native-modal-datetime-picker';
import moment from 'moment';
import IconFontAwesome from 'react-native-vector-icons/FontAwesome';

const BLUE = '#428AF8';
const LIGHT_GRAY = '#D3D3D3';

class RegistroVisitante extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            title: 'Registrar visitante',
            headerLeft: <Icon style={{ paddingLeft: 10 }} onPress={() => navigation.goBack()} name="arrow-back" size={30} />
        };
    };

    state = {
        picker: '',
        tiposDocumento: [],
        documento: '',
        tipoAcceso: '',
        usuario: {},
        nombre: '',
        apellido: '',
        fechaNacimiento: moment(new Date()),
        telefono: '',
        celular: '',
        isFocused: false,
        showSpinner: false,
        isVisible: false,
        isEditable: true,
        esDesde: null,
        fechaDesde: new Date(),
        fechaHasta: new Date(),
        idInvitacion: ''
    };

    componentWillMount() {
        const { navigation } = this.props;
        const esAcceso = navigation.getParam('esAcceso', false);

        if (esAcceso) {
            const tipoDoc = navigation.getParam('tipoDocumento');
            const numeroDoc = navigation.getParam('numeroDocumento');
            const nombre = navigation.getParam('nombre', '');
            const apellido = navigation.getParam('apellido', '');
            const tipoAcceso = navigation.getParam('tipoAcceso');
            const usuario = navigation.getParam('usuario');
            const fecha = navigation.getParam('fechaNacimiento');
            const autenticado = false;
            const invitacion = navigation.getParam('invitacion');
            this.setearDatos(tipoDoc, numeroDoc, nombre, apellido, fecha, tipoAcceso, usuario, autenticado, invitacion);
        }
    }

    componentDidMount() {
        Alert.alert('Atención', 'El visitante no está registrado; por favor, complete el siguiente formulario. ', [
            { text: 'Aceptar', onPress: () => console.log('Cancel pressed'), style: 'cancel' }
        ]);
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

    setearDatos(tipo, numero, nombre, apellido, fecha, acceso, user, autent, invit) {
        this.setState({
            picker: tipo,
            documento: numero,
            nombre,
            apellido,
            fechaNacimiento: moment(fecha, 'DD-MM-YYYY'),
            tipoAcceso: acceso,
            usuario: user,
            isEditable: autent,
            idInvitacion: invit
        });
    }

    //Graba los datos referidos a la autenticación y el ingreso en Firestore
    grabarDatos = () => {
        this.setState({ showSpinner: true });
        var resultAut = this.autenticarVisitante();
        var resultGrab = this.grabarIngreso(this.state.nombre, this.state.apellido, this.state.picker, this.state.documento);

        if (resultAut == 0) {
            if (resultGrab == 0) {
                this.setState({ showSpinner: false });
                Alert.alert('Atención', 'El ingreso se registró correctamente. (VISITANTE SIN AUTENTICAR)');
                this.props.navigation.navigate('Ingreso');
            } else {
                this.setState({ showSpinner: false });
                Alert.alert('Atención', 'Ocurrió un error: ' + resultGrab);
            }
        } else {
            this.setState({ showSpinner: false });
            Alert.alert('Atención', 'Ocurrió un error: ' + resultAut);
        }
    };

    //Autentica los datos del visitante en Firestore
    autenticarVisitante = () => {
        try {
            var refCountry = Database.collection('Country').doc(this.state.usuario.country);
            var refInvitacion = refCountry.collection('Invitados').doc(this.state.idInvitacion);

            refInvitacion.set(
                {
                    Nombre: this.state.nombre,
                    Apellido: this.state.apellido,
                    FechaNacimiento: this.state.fechaNacimiento.toDate()
                },
                { merge: true }
            );

            return 0;
        } catch (error) {
            return error;
        }
    };

    //Graba el ingreso en Firestore
    grabarIngreso = (nombre, apellido, tipoDoc, numeroDoc) => {
        try {
            var refCountry = Database.collection('Country').doc(this.state.usuario.country);
            var refIngresos = refCountry.collection('Ingresos');
            refIngresos.add({
                Nombre: nombre,
                Apellido: apellido,
                Documento: numeroDoc,
                TipoDocumento: Database.doc('TipoDocumento/' + tipoDoc),
                Descripcion: '',
                Egreso: true,
                Estado: true,
                Fecha: new Date(),
                IdEncargado: Database.doc('Country/' + this.state.usuario.country + '/Encargados/' + this.state.usuario.datos)
            });

            return 0;
        } catch (error) {
            return error;
        }
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

    handlePicker = datetime => {
        this.setState({
            isVisible: false,
            fechaNacimiento: moment(datetime)
        });
    };

    hidePicker = () => {
        this.setState({ isVisible: false });
    };

    showPicker = () => {
        this.setState({ isVisible: true });
    };

    render() {
        const { isFocused } = this.state;

        if (this.state.tiposDocumento.length < 3) {
            this.obtenerPickers();
        }

        return (
            <ScrollView>
                <Content>
                    <View style={styles.container}>
                        <Spinner visible={this.state.showSpinner} textContent={'Loading...'} textStyle={styles.spinnerTextStyle} />
                        <StatusBar backgroundColor="#1e90ff"></StatusBar>
                        <Text style={styles.header}> Registrar nuevo visitante</Text>

                        <TextInput
                            style={styles.textInput}
                            placeholder="Nombre"
                            value={this.state.nombre}
                            onChangeText={nombre => this.setState({ nombre })}
                            underlineColorAndroid={isFocused ? BLUE : LIGHT_GRAY}
                            onFocus={this.handleFocus}
                            onBlur={this.handleBlur}
                            keyboardType={'default'}
                        />

                        <TextInput
                            style={styles.textInput}
                            placeholder="Apellido"
                            value={this.state.apellido}
                            onChangeText={apellido => this.setState({ apellido })}
                            underlineColorAndroid={isFocused ? BLUE : LIGHT_GRAY}
                            onFocus={this.handleFocus}
                            onBlur={this.handleBlur}
                            keyboardType={'default'}
                        />

                        <Picker
                            note
                            mode="dropdown"
                            style={styles.picker}
                            selectedValue={this.state.picker}
                            enabled={this.state.isEditable}
                            onValueChange={(itemValue, itemIndex) => this.setState({ picker: itemValue })}>
                            <Picker.Item label="Tipo de documento" value="-1" color="#7B7C7E" />
                            {this.state.tiposDocumento.map((item, index) => {
                                return <Picker.Item label={item.nombre} value={item.id} key={index} />;
                            })}
                        </Picker>

                        <TextInput
                            style={styles.textInput}
                            placeholder="Número de documento"
                            value={this.state.documento}
                            onChangeText={documento => this.setState({ documento })}
                            editable={this.state.isEditable}
                            underlineColorAndroid={isFocused ? BLUE : LIGHT_GRAY}
                            onFocus={this.handleFocus}
                            onBlur={this.handleBlur}
                            keyboardType={'numeric'}
                        />

                        <View style={styles.datetime}>
                            <Text style={{ alignSelf: 'center', color: '#8F8787' }}>Fecha de nacimiento</Text>
                            <Text style={{ alignSelf: 'center', color: '#1e90ff', paddingHorizontal: '7%', fontSize: 15 }}>
                                {this.state.fechaNacimiento.format('MMM Do YY')}
                            </Text>
                            <IconFontAwesome
                                style={{ alignSelf: 'center' }}
                                onPress={() => {
                                    this.showPicker();
                                }}
                                name="calendar"
                                size={25}
                            />
                        </View>

                        <DateTimePicker
                            isVisible={this.state.isVisible}
                            onConfirm={this.handlePicker}
                            onCancel={this.hidePicker}
                            mode={'date'}
                            is24Hour={true}></DateTimePicker>

                        <View style={{ flexDirection: 'row' }}>
                            <View style={styles.buttons}>
                                <Button
                                    bordered
                                    success
                                    style={{ paddingHorizontal: '5%' }}
                                    onPress={() => {
                                        this.grabarDatos();
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
            </ScrollView>
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
        marginTop: '7%',
        color: '#08477A',
        fontWeight: 'normal',
        fontStyle: 'normal'
    },
    picker: {
        width: '85%',
        fontSize: 18,
        marginTop: '7%',
        alignItems: 'flex-start'
    },
    textInput: {
        width: '82%',
        fontSize: 16,
        alignItems: 'flex-start',
        marginTop: '7%'
    },
    buttons: {
        alignItems: 'center',
        justifyContent: 'center',
        width: '45%',
        marginTop: '7%'
    },
    datetime: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginTop: '10%',
        width: '80%'
    }
});

export default RegistroVisitante;

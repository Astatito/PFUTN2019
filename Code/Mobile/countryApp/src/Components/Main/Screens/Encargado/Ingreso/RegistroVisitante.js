import React, { Component } from 'react';
import { View, StyleSheet, TextInput, StatusBar } from 'react-native';
import { Database } from '../../../../DataBase/Firebase';
import { ScrollView } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Content, Button, Text, Picker, Root, Toast } from 'native-base';
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
            headerLeft: <Icon style={{ paddingLeft: 10 }} onPress={() => navigation.goBack()} name="arrow-back" size={30} />,
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
        idInvitacion: '',
        nombreError: '',
        apellidoError: '',
    };

    componentWillMount() {
        this.setState({ showSpinner: true, tiposDocumento: global.tiposDocumento });
        const { navigation } = this.props;
        const esAcceso = navigation.getParam('esAcceso', false);

        if (esAcceso) {
            const tipoDoc = navigation.getParam('tipoDocumento');
            const numeroDoc = navigation.getParam('numeroDocumento');
            const nombre = navigation.getParam('nombre', '');
            const apellido = navigation.getParam('apellido', '');
            const tipoAcceso = navigation.getParam('tipoAcceso');
            const usuario = navigation.getParam('usuario');
            const date = navigation.getParam('fechaNacimiento');
            if (date == undefined) {
                fecha = moment(new Date());
            } else {
                fecha = moment(date, 'DD-MM-YYYY');
            }
            const autenticado = false;
            const invitacion = navigation.getParam('invitacion');
            this.setearDatos(tipoDoc, numeroDoc, nombre, apellido, fecha, tipoAcceso, usuario, autenticado, invitacion);
        }
    }

    // TODO: extraer este metodo a un modulo aparte para evitar consultas repetitivas a la BD.
    obtenerPickers = async () => {
        var dbRef = Database.collection('TipoDocumento');
        var snapshot = await dbRef.get()
        var tiposDocumento = [];
        snapshot.forEach(doc => {
            tiposDocumento.push({ id: doc.id, nombre: doc.data().Nombre });
        });
    }

    setearDatos(tipo, numero, nombre, apellido, fecha, acceso, user, autent, invit) {
        this.setState({
            picker: tipo,
            documento: numero,
            nombre,
            apellido,
            fechaNacimiento: fecha,
            tipoAcceso: acceso,
            usuario: user,
            isEditable: autent,
            idInvitacion: invit,
            showSpinner: false
        });
    }

    //Graba los datos referidos a la autenticación y el ingreso en Firestore
    grabarDatos = async () => {
        try {
            var resultAut = await this.autenticarVisitante();
            var resultGrab = await this.grabarIngreso(this.state.nombre, this.state.apellido, this.state.picker, this.state.documento);
            if (resultAut == 0) {
                if (resultGrab == 0) {
                    return 0;
                } else {
                    return 1;
                }
            } else {
                return 1;
            }
        } catch (error) {
            return 1;
        } finally {
            this.setState({ showSpinner: false });
        }
    };

    onToastClosed = (reason) => {
        this.props.navigation.navigate('Ingreso');
    };

    //Autentica los datos del visitante en Firestore
    autenticarVisitante = async () => {
        try {
            var refCountry = Database.collection('Country').doc(this.state.usuario.country);
            var refInvitacion = refCountry.collection('Invitados').doc(this.state.idInvitacion);

            await refInvitacion.set(
                {
                    Nombre: this.state.nombre,
                    Apellido: this.state.apellido,
                    FechaNacimiento: this.state.fechaNacimiento.toDate(),
                },
                { merge: true }
            );
            return 0;
        } catch (error) {
            return 1;
        }
    };

    //Graba el ingreso en Firestore
    grabarIngreso = async (nombre, apellido, tipoDoc, numeroDoc) => {
        try {
            var refCountry = Database.collection('Country').doc(this.state.usuario.country);
            var refIngresos = refCountry.collection('Ingresos');
            await refIngresos.add({
                Nombre: nombre,
                Apellido: apellido,
                Documento: numeroDoc,
                TipoDocumento: Database.doc('TipoDocumento/' + tipoDoc),
                Descripcion: '',
                Egreso: true,
                Estado: true,
                Fecha: new Date(),
                IdEncargado: Database.doc('Country/' + this.state.usuario.country + '/Encargados/' + this.state.usuario.datos),
            });
            return 0;
        } catch (error) {
            return 1;
        }
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

    handlePicker = (datetime) => {
        this.setState({
            isVisible: false,
            fechaNacimiento: moment(datetime),
        });
    };

    hidePicker = () => {
        this.setState({ isVisible: false });
    };

    showPicker = () => {
        this.setState({ isVisible: true });
    };

    verificarFechaNacimiento = async () => {
        const today = moment();
        const birthDate = this.state.fechaNacimiento;
        if (birthDate.isBefore(today)) {
            return 0;
        } else {
            this.setState({ showSpinner: false });
            return 1;
        }
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

    render() {
        const { isFocused } = this.state;

        return (
            <Root>
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
                                onChangeText={(nombre) => this.setState({ nombre })}
                                underlineColorAndroid={isFocused ? BLUE : LIGHT_GRAY}
                                onFocus={this.handleFocus}
                                onBlur={this.handleBlur}
                                keyboardType={'default'}
                                maxLength={25}
                            />
                            <Text style={styles.error}>{this.state.nombreError}</Text>
                            <TextInput
                                style={styles.textInput}
                                placeholder="Apellido"
                                value={this.state.apellido}
                                onChangeText={(apellido) => this.setState({ apellido })}
                                underlineColorAndroid={isFocused ? BLUE : LIGHT_GRAY}
                                onFocus={this.handleFocus}
                                onBlur={this.handleBlur}
                                keyboardType={'default'}
                                maxLength={25}
                            />
                            <Text style={styles.error}>{this.state.apellidoError}</Text>
                            <Picker
                                note
                                mode="dropdown"
                                style={styles.picker}
                                selectedValue={this.state.picker}
                                enabled={this.state.isEditable}
                                onValueChange={(itemValue, itemIndex) => this.setState({ picker: itemValue })}>
                                {this.state.tiposDocumento.map((item, index) => {
                                    return <Picker.Item label={item.nombre} value={item.id} key={index} />;
                                })}
                            </Picker>

                            <TextInput
                                style={styles.textInput}
                                placeholder="Número de documento"
                                value={this.state.documento}
                                onChangeText={(documento) => this.setState({ documento })}
                                editable={this.state.isEditable}
                                underlineColorAndroid={isFocused ? BLUE : LIGHT_GRAY}
                                onFocus={this.handleFocus}
                                onBlur={this.handleBlur}
                                keyboardType={'numeric'}
                                maxLength={8}
                            />

                            <View style={styles.datetime}>
                                <Text style={{ color: '#8F8787' }}>Fecha de nacimiento</Text>
                                <Text style={{ color: '#1e90ff', fontSize: 15 }}>{this.state.fechaNacimiento.format('DD/MM/YYYY')}</Text>
                                <IconFontAwesome
                                    onPress={() => {
                                        console.log(this.state.fechaNacimiento);
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
                                date={new Date(this.state.fechaNacimiento)}
                                is24Hour={true}></DateTimePicker>

                            <View style={{ flexDirection: 'row' }}>
                                <View style={styles.buttons}>
                                    <Button
                                        bordered
                                        success
                                        style={{ paddingHorizontal: '5%' }}
                                        onPress={() => {
                                            this.setState({ showSpinner: true }, async () => {
                                                const textInputs = await this.verificarTextInputs(['nombre', 'apellido']);
                                                if (textInputs == true) {
                                                    return false;
                                                }
                                                const verificacion = await this.verificarFechaNacimiento();
                                                if (verificacion == 1) {
                                                    Toast.show({
                                                        text: 'La fecha de nacimiento debe ser anterior al día actual.',
                                                        buttonText: 'Aceptar',
                                                        duration: 3000,
                                                        position: 'bottom',
                                                        type: 'warning',
                                                    });
                                                } else if (verificacion == 0) {
                                                    const result = await this.grabarDatos();
                                                    if (result == 0) {
                                                        Toast.show({
                                                            text: 'Ingreso registrado exitosamente.',
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
                                            this.props.navigation.goBack();
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
        marginHorizontal: '3%',
        marginVertical: '5%',
        flex: 1,
    },
    spinnerTextStyle: {
        fontSize: 20,
        fontWeight: 'normal',
        color: '#FFF',
    },
    header: {
        textAlign: 'center',
        fontSize: 26,
        marginHorizontal: '5%',
        marginTop: '6%',
        marginBottom: '2%',
        color: '#08477A',
        fontWeight: 'normal',
        fontStyle: 'normal',
    },
    picker: {
        width: '85%',
        fontSize: 18,
        alignItems: 'flex-start',
        marginTop: '2%',
    },
    textInput: {
        width: '82%',
        fontSize: 16,
        alignItems: 'flex-start',
        marginTop: '4%',
    },
    buttons: {
        alignItems: 'center',
        justifyContent: 'center',
        width: '45%',
        marginTop: '7%',
    },
    datetime: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        marginTop: '7%',
        width: '85%',
    },
    error: {
        color: 'red',
        alignSelf: 'flex-start',
        fontSize: 12,
        marginLeft: '10%',
    },
});

export default RegistroVisitante;

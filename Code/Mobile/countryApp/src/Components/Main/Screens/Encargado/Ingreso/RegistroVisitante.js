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

const LIGHT_GRAY = '#D3D3D3';

class RegistroVisitante extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            title: 'Nuevo visitante',
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
        propietarios: [],
        invitado: {},
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
            const propietarios = navigation.getParam('propietarios');

            this.setearDatos(tipoDoc, numeroDoc, nombre, apellido, fecha, tipoAcceso, usuario, autenticado, invitacion, propietarios);
        }
    }

    setearDatos(tipo, numero, nombre, apellido, fecha, acceso, user, autent, invit, prop) {
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
            showSpinner: false,
            propietarios: prop,
        });
    }

    //Graba los datos referidos a la autenticación y el ingreso en Firestore
    grabarDatos = async () => {
        try {
            var resultAut = await this.autenticarVisitante();
            if (this.state.propietarios.length > 1) {
                var inv = {
                    nombre: this.state.nombre,
                    apellido: this.state.apellido,
                    tipoDoc: this.state.picker,
                    numeroDoc: this.state.documento,
                };
                this.setState({ invitado: inv });
                return 2;
            }

            var resultGrab = await this.grabarIngreso(
                this.state.nombre,
                this.state.apellido,
                this.state.picker,
                this.state.documento,
                this.state.propietarios[0]
            );
            if (resultAut == 0) {
                if (resultGrab == 0) {
                    return 0;
                } else {
                    console.log('Falló la grabación');
                    return 1;
                }
            } else {
                console.log('Falló la autenticación');
                return 1;
            }
        } catch (error) {
            console.log('Entró al catch:', error);
            return 1;
        } finally {
            this.setState({ showSpinner: false });
        }
    };

    onToastClosed = (reason) => {
        this.props.navigation.navigate('Ingreso');
    };

    propietariosToast = (reason) => {
        this.props.navigation.navigate('ListaDePropietarios', {
            invitado: this.state.invitado,
            propietarios: this.state.propietarios,
        });
    };

    //Autentica los datos del visitante en Firestore
    autenticarVisitante = async () => {
        try {
            var refCountry = Database.collection('Country').doc(this.state.usuario.country);
            var refInvitados = refCountry.collection('Invitados');

            invitaciones = await refInvitados
                .where('Documento', '==', this.state.documento)
                .where('TipoDocumento', '==', Database.doc('TipoDocumento/' + this.state.picker))
                .get();

            for (var i = 0; i < invitaciones.docs.length; i++) {
                var refInvitacion = refInvitados.doc(invitaciones.docs[i].id);
                await refInvitacion.set(
                    {
                        Nombre: this.state.nombre,
                        Apellido: this.state.apellido,
                        FechaNacimiento: this.state.fechaNacimiento.toDate(),
                    },
                    { merge: true }
                );
            }
            return 0;
        } catch (error) {
            console.log(error);
            return 1;
        }
    };

    generarNotificacionIngreso = async (idPropietario, nombre, apellido) => {
        var refCountry = Database.collection('Country').doc(this.state.usuario.country);
        var refNotificaciones = refCountry.collection('Notificaciones');
        var notificacion = {
            Fecha: new Date(),
            Tipo: 'Ingreso',
            Texto: nombre + ' ' + apellido + ' ha ingresado al complejo.',
            IdPropietario: idPropietario,
            Visto: false,
        };
        await refNotificaciones.add(notificacion);
    };

    //Graba el ingreso en Firestore
    grabarIngreso = async (nombre, apellido, tipoDoc, numeroDoc, idPropietario = undefined) => {
        try {
            var refCountry = Database.collection('Country').doc(this.state.usuario.country);
            var refIngresos = refCountry.collection('Ingresos');
            var ingreso = {
                Nombre: nombre,
                Apellido: apellido,
                Documento: numeroDoc,
                TipoDocumento: Database.doc('TipoDocumento/' + tipoDoc),
                Descripcion: '',
                Egreso: true,
                Estado: true,
                Fecha: new Date(),
                IdEncargado: Database.doc('Country/' + this.state.usuario.country + '/Encargados/' + this.state.usuario.datos),
            };
            if (idPropietario) {
                ingreso.IdPropietario = Database.doc('Country/' + this.state.usuario.country + '/Propietarios/' + idPropietario);
                this.generarNotificacionIngreso(idPropietario, nombre, apellido);
            }
            await refIngresos.add(ingreso);
            return 0;
        } catch (error) {
            return 1;
        }
    };

    onBlur() {
        this.setState({ isFocused: false });
    }

    onFocus() {
        this.setState({ isFocused: true });
    }

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
        return (
            <Root>
                <ScrollView>
                    <Content>
                        <View style={styles.container}>
                            <Spinner visible={this.state.showSpinner} textContent={'Loading...'} textStyle={styles.spinnerTextStyle} />
                            <StatusBar backgroundColor="#1e90ff"></StatusBar>
                            <TextInput
                                style={styles.textInput}
                                placeholder="Nombre"
                                value={this.state.nombre}
                                onChangeText={(nombre) => this.setState({ nombre })}
                                underlineColorAndroid={LIGHT_GRAY}
                                onFocus={() => this.onFocus()}
                                onBlur={() => this.onBlur()}
                                keyboardType={'default'}
                                maxLength={25}
                            />
                            <Text style={styles.error}>{this.state.nombreError}</Text>
                            <TextInput
                                style={styles.textInput}
                                placeholder="Apellido"
                                value={this.state.apellido}
                                onChangeText={(apellido) => this.setState({ apellido })}
                                underlineColorAndroid={LIGHT_GRAY}
                                onFocus={() => this.onFocus()}
                                onBlur={() => this.onBlur()}
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
                                underlineColorAndroid={LIGHT_GRAY}
                                onFocus={() => this.onFocus()}
                                onBlur={() => this.onBlur()}
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
                                        disabled={this.state.showSpinner}
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
                                                    } else if (result == 2) {
                                                        Toast.show({
                                                            text: 'Debe seleccionar el propietario a visitar.',
                                                            buttonText: 'Aceptar',
                                                            duration: 3000,
                                                            position: 'bottom',
                                                            type: 'warning',
                                                            onClose: this.propietariosToast.bind(this),
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
                                        disabled={this.state.showSpinner}
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
    picker: {
        width: '85%',
        fontSize: 18,
        marginTop: '3%',
        marginBottom: '3%',
        alignItems: 'flex-start',
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
        marginTop: '5%',
    },
    datetime: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: '13%',
        marginBottom: '3%',
        width: '80%',
    },
    error: {
        color: 'red',
        alignSelf: 'flex-start',
        fontSize: 12,
        marginLeft: '10%',
    },
});

export default RegistroVisitante;

import React, { Component } from 'react';
import { View, StyleSheet, TextInput, StatusBar } from 'react-native';
import { Database } from '../../../../DataBase/Firebase';
import { ScrollView } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Content, Button, Text, Picker, Root, Toast } from 'native-base';
import Spinner from 'react-native-loading-spinner-overlay';
import { LocalStorage } from '../../../../DataBase/Storage';
import moment from 'moment';

const BLUE = '#428AF8';
const LIGHT_GRAY = '#D3D3D3';

class IngresoManual extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            title: 'Ingreso Manual',
            headerLeft: <Icon style={{ paddingLeft: 10 }} onPress={() => navigation.goBack()} name="arrow-back" size={30} />,
        };
    };

    state = {
        picker: '',
        tiposDocumento: [],
        documento: '',
        showSpinner: false,
        isFocused: false,
        usuario: {},
        invitacionId: null,
        documentoError: '',
    };

    componentWillMount() {
        LocalStorage.load({
            key: 'UsuarioLogueado',
        })
            .then((usuario) => {
                this.setState({ usuario, tiposDocumento: global.tiposDocumento });
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

    componentDidMount() {
        setInterval(() => {
            this.setState({
                showSpinner: false,
            });
        }, 3000);
    }

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

    //Devuelve la primer invitación válida a partir de un conjunto de invitaciones
    obtenerInvitacionValida = (invitaciones) => {
        var now = moment().unix(); //Se obtiene la fecha actual en formato Timestamp para facilitar la comparación

        for (var i = 0; i < invitaciones.length; i++) {
            var docInvitacion = invitaciones[i].data();
            if (now >= docInvitacion.FechaDesde.seconds && now <= docInvitacion.FechaHasta.seconds) {
                docInvitacion.id = invitaciones[i].id;
                return docInvitacion;
            }
        }
        return -1;
    };

    //Verifica si el visitante está autenticado o no
    estaAutenticado = (invitacion) => {
        return invitacion.Nombre != '' && invitacion.Apellido != '';
    };

    //Redirige al formulario para autenticar el visitante
    autenticarVisitante = (tipoDocumento, numeroDocumento, usuario, invitacion) => {
        this.props.navigation.navigate('RegistroVisitante', {
            esAcceso: true,
            tipoAcceso: 'Ingreso',
            tipoDocumento: tipoDocumento,
            numeroDocumento: numeroDocumento,
            usuario: usuario,
            invitacion: invitacion,
        });
    };

    //Registra el ingreso según tipo y número de documento
    registrarIngreso = async (tipoDoc, numeroDoc) => {
        //Busca si es un propietario
        var refCountry = Database.collection('Country').doc(this.state.usuario.country);
        var refPropietarios = refCountry.collection('Propietarios');
        try {
            const snapshot = await refPropietarios
                .where('Documento', '==', numeroDoc)
                .where('TipoDocumento', '==', Database.doc('TipoDocumento/' + tipoDoc))
                .get();
            if (!snapshot.empty) {
                //Si existe el propietario, registra el ingreso.
                var docPropietario = snapshot.docs[0].data();
                var result = await this.grabarIngreso(docPropietario.Nombre, docPropietario.Apellido, tipoDoc, numeroDoc);
                if (result == 0) {
                    return 0;
                } else {
                    return 1;
                }
            } else {
                //Si no existe el propietario, busca si tiene invitaciones.
                var refInvitados = refCountry.collection('Invitados');
                const snapshot = await refInvitados
                    .where('Documento', '==', numeroDoc)
                    .where('TipoDocumento', '==', Database.doc('TipoDocumento/' + tipoDoc))
                    .get();
                if (!snapshot.empty) {
                    //Si tiene invitaciones, verifica que haya alguna invitación válida.
                    var invitacion = this.obtenerInvitacionValida(snapshot.docs);
                    if (invitacion != -1) {
                        //Si hay una invitación válida, verifica que esté autenticado.
                        if (this.estaAutenticado(invitacion)) {
                            //Si está autenticado, registra el ingreso.
                            var result = await this.grabarIngreso(invitacion.Nombre, invitacion.Apellido, tipoDoc, numeroDoc);
                            if (result == 0) {
                                return 0;
                            } else {
                                return 1;
                            }
                        } else {
                            //Si no está autenticado, se debe autenticar.
                            this.setState({ invitacionId: invitacion.id });
                            return 2;
                        }
                    } else {
                        // Existe pero no tiene invitaciones válidas, TODO:se debe generar una nueva invitación por ese día.
                        return 3;
                    }
                } else {
                    //La persona no existe , TODO:se debe generar una nueva invitación por ese día.
                    return 4;
                }
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

    autenticarToast = (reason) => {
        this.autenticarVisitante(this.state.picker, this.state.documento, this.state.usuario, this.state.invitacionId);
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

    getKeyboard = () => {
        if (this.state.picker == 'Pasaporte' ) {
            return 'default'
        } else {
            return 'numeric'
        }
    }

    getLimit = () => {
        if (this.state.picker = 'Documento') {
            return 8
        } else {
            return 10
        }
    }

    render() {
        const { isFocused } = this.state;

        return (
            <Root>
                <ScrollView>
                    <Content>
                        <View style={styles.container}>
                            <Spinner visible={this.state.showSpinner} textContent={'Loading...'} textStyle={styles.spinnerTextStyle} />
                            <StatusBar backgroundColor="#1e90ff"></StatusBar>
                            <Text style={styles.header}>Registrar nuevo ingreso</Text>

                            <Picker
                                note
                                mode="dropdown"
                                style={styles.picker}
                                selectedValue={this.state.picker}
                                onValueChange={(itemValue, itemIndex) => this.setState({ picker: itemValue })}>
                                {this.state.tiposDocumento.map((item, index) => {
                                    return <Picker.Item label={item.nombre} value={item.id} key={index} />;
                                })}
                            </Picker>

                            <TextInput
                                style={styles.textInput}
                                placeholder="Número de documento"
                                onChangeText={(documento) => this.setState({ documento })}
                                underlineColorAndroid={isFocused ? BLUE : LIGHT_GRAY}
                                onFocus={this.handleFocus}
                                onBlur={this.handleBlur}
                                keyboardType={this.getKeyboard()}
                                maxLength={this.getLimit()}
                            />
                            <Text style={styles.error}>{this.state.documentoError}</Text>
                            <View style={{ flexDirection: 'row' }}>
                                <View style={styles.buttons}>
                                    <Button
                                        bordered
                                        success
                                        style={{ paddingHorizontal: '5%' }}
                                        onPress={async () => {
                                            this.setState({ showSpinner: true }, async () => {
                                                const textInputs = await this.verificarTextInputs(['documento']);
                                                if (textInputs == true) {
                                                    return false;
                                                }
                                                const result = await this.registrarIngreso(this.state.picker, this.state.documento);
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
                                                        text: 'El visitante no está autenticado, se debe autenticar primero.',
                                                        buttonText: 'Aceptar',
                                                        duration: 3000,
                                                        position: 'bottom',
                                                        type: 'warning',
                                                        onClose: this.autenticarToast.bind(this),
                                                    });
                                                } else if (result == 3) {
                                                    Toast.show({
                                                        text: 'El invitado no tiene ninguna invitación activa.',
                                                        buttonText: 'Aceptar',
                                                        duration: 3000,
                                                        position: 'bottom',
                                                        type: 'warning',
                                                        onClose: this.onToastClosed.bind(this),
                                                    });
                                                } else if (result == 4) {
                                                    Toast.show({
                                                        text: 'La persona no se encuentra registrada en el sistema.',
                                                        buttonText: 'Aceptar',
                                                        duration: 3000,
                                                        position: 'bottom',
                                                        type: 'warning',
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
        marginTop: '13%',
        color: '#08477A',
        fontWeight: 'normal',
        fontStyle: 'normal',
    },
    picker: {
        width: '83%',
        fontSize: 18,
        marginTop: '15%',
        alignItems: 'flex-start',
    },
    textInput: {
        width: '80%',
        fontSize: 16,
        alignItems: 'flex-start',
        marginTop: '13%',
    },
    buttons: {
        alignItems: 'center',
        justifyContent: 'center',
        width: '45%',
        marginTop: '13%',
    },
    error: {
        color: 'red',
        alignSelf: 'flex-start',
        fontSize: 12,
        marginLeft: '10%',
    },
});

export default IngresoManual;

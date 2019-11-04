import React, { Component } from 'react';
import { AppRegistry, StyleSheet, Text, TouchableOpacity, View, Alert } from 'react-native';
import { RNCamera } from 'react-native-camera';
import { Database } from '../../../DataBase/Firebase';
import { LocalStorage } from '../../../DataBase/Storage';
import moment from 'moment';

class Escaner extends Component {
    state = { usuario: {}, ingreso: false };
    shouldScan = true;

    capitalize = string => {
        return string
            .toLowerCase()
            .split(' ')
            .map(s => s.charAt(0).toUpperCase() + s.substring(1))
            .join(' ');
    };

    componentWillMount() {
        const { navigation } = this.props;
        const esIngreso = navigation.getParam('esIngreso', false);

        this.setState({ ingreso: esIngreso });
    }

    componentDidMount() {
        LocalStorage.load({
            key: 'UsuarioLogueado'
        })
            .then(usuario => {
                this.setState({ usuario });
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

    //Devuelve la primer invitación válida a partir de un conjunto de invitaciones
    obtenerInvitacionValida = invitaciones => {
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
    estaAutenticado = invitacion => {
        return invitacion.Nombre != '' && invitacion.Apellido != '';
    };

    //Redirige al formulario para autenticar el visitante
    autenticarVisitante = (persona, usuario, invitacion) => {
        this.props.navigation.navigate('RegistroVisitante', {
            esAcceso: true,
            tipoAcceso: 'Ingreso',
            tipoDocumento: persona.TipoDocumento,
            numeroDocumento: persona.Documento,
            nombre: persona.Nombre,
            apellido: persona.Apellido,
            fechaNacimiento: persona.FechaNacimiento,
            usuario: usuario,
            invitacion: invitacion
        });
    };

    //Registra el ingreso según tipo y número de documento
    registrarIngreso = persona => {
        //Busca si es un propietario
        var refCountry = Database.collection('Country').doc(this.state.usuario.country);
        var refPropietarios = refCountry.collection('Propietarios');
        this.setState({ showSpinner: true });
        refPropietarios
            .where('Documento', '==', persona.Documento)
            .where('TipoDocumento', '==', Database.doc('TipoDocumento/' + persona.TipoDocumento))
            .get()
            .then(snapshot => {
                if (!snapshot.empty) {
                    //Si existe el propietario, registra el ingreso.
                    var docPropietario = snapshot.docs[0].data();

                    var result = this.grabarIngreso(
                        docPropietario.Nombre,
                        docPropietario.Apellido,
                        persona.TipoDocumento,
                        persona.Documento
                    );
                    if (result == 0) {
                        this.setState({ showSpinner: false });
                        Alert.alert('Atención', 'El ingreso se registró correctamente. (PROPIETARIO)');
                        this.props.navigation.navigate('Ingreso');
                    } else {
                        this.setState({ showSpinner: false });
                        Alert.alert('Atención', 'Ocurrió un error: ' + result);
                    }
                } else {
                    //Si no existe el propietario, busca si tiene invitaciones.
                    var refInvitados = refCountry.collection('Invitados');

                    refInvitados
                        .where('Documento', '==', persona.Documento)
                        .where('TipoDocumento', '==', Database.doc('TipoDocumento/' + persona.TipoDocumento))
                        .get()
                        .then(snapshot => {
                            if (!snapshot.empty) {
                                //Si tiene invitaciones, verifica que haya alguna invitación válida.

                                var invitacion = this.obtenerInvitacionValida(snapshot.docs);
                                if (invitacion != -1) {
                                    //Si hay una invitación válida, verifica que esté autenticado.

                                    if (this.estaAutenticado(invitacion)) {
                                        //Si está autenticado, registra el ingreso.
                                        var result = this.grabarIngreso(
                                            invitacion.Nombre,
                                            invitacion.Apellido,
                                            persona.TipoDocumento,
                                            persona.Documento
                                        );
                                        if (result == 0) {
                                            this.setState({ showSpinner: false });
                                            Alert.alert(
                                                'Atención',
                                                'El ingreso se registró correctamente. (VISITANTE AUTENTICADO CON INVITACIÓN VÁLIDA)'
                                            );
                                            this.props.navigation.navigate('Ingreso');
                                        } else {
                                            this.setState({ showSpinner: false });
                                            Alert.alert('Atención', 'Ocurrió un error: ' + result);
                                        }
                                    } else {
                                        //Si no está autenticado, se debe autenticar.
                                        console.log('El visitante no está autenticado, se debe autenticar primero.');
                                        console.log(invitacion);
                                        this.autenticarVisitante(persona, this.state.usuario, invitacion.id);
                                        this.setState({ showSpinner: false });
                                    }
                                } else {
                                    // Existe pero no tiene invitaciones válidas, TODO:se debe generar una nueva invitación por ese día.
                                    console.log('No hay ninguna invitación válida.');
                                    this.setState({ showSpinner: false });
                                    Alert.alert('Atención', 'No se encontró ninguna invitación válida.');
                                }
                            } else {
                                //La persona no existe , TODO:se debe generar una nueva invitación por ese día.
                                console.log('No tiene invitaciones.');
                                this.setState({ showSpinner: false });
                                Alert.alert('Atención', 'La persona no existe.');
                            }
                        });
                }
            })
            .catch(error => {
                Alert.alert('Atención', 'Ocurrió un error: ', error);
                this.setState({ showSpinner: false });
            });
    };

    //Graba el egreso en Firestore
    grabarEgreso = (nombre, apellido, tipoDoc, numeroDoc) => {
        try {
            var refCountry = Database.collection('Country').doc(this.state.usuario.country);
            var refEgresos = refCountry.collection('Egresos');
            refEgresos.add({
                Nombre: nombre,
                Apellido: apellido,
                Documento: numeroDoc,
                TipoDocumento: Database.doc('TipoDocumento/' + tipoDoc),
                Descripcion: '',
                Fecha: new Date(),
                IdEncargado: Database.doc('Country/' + this.state.usuario.country + '/Encargados/' + this.state.usuario.datos)
            });

            return 0;
        } catch (error) {
            return error;
        }
    };

    //Registra el egreso según tipo y número de documento
    registrarEgreso = persona => {
        //Busca si es un propietario
        var refCountry = Database.collection('Country').doc(this.state.usuario.country);
        var refPropietarios = refCountry.collection('Propietarios');
        this.setState({ showSpinner: true });
        refPropietarios
            .where('Documento', '==', persona.Documento)
            .where('TipoDocumento', '==', Database.doc('TipoDocumento/' + persona.TipoDocumento))
            .get()
            .then(snapshot => {
                if (!snapshot.empty) {
                    //Si existe el propietario, registra el egreso.
                    var docPropietario = snapshot.docs[0].data();

                    var result = this.grabarEgreso(
                        docPropietario.Nombre,
                        docPropietario.Apellido,
                        persona.TipoDocumento,
                        persona.Documento
                    );
                    if (result == 0) {
                        this.setState({ showSpinner: false });
                        Alert.alert('Atención', 'El egreso se registró correctamente. (PROPIETARIO)');
                        this.props.navigation.navigate('Egreso');
                    } else {
                        this.setState({ showSpinner: false });
                        Alert.alert('Atención', 'Ocurrió un error: ' + result);
                    }
                } else {
                    //Si no existe el propietario, busca si tiene invitaciones.
                    var refInvitados = refCountry.collection('Invitados');

                    refInvitados
                        .where('Documento', '==', persona.Documento)
                        .where('TipoDocumento', '==', Database.doc('TipoDocumento/' + persona.TipoDocumento))
                        .get()
                        .then(snapshot => {
                            if (!snapshot.empty) {
                                //Si tiene invitaciones, verifica que haya alguna invitación válida.

                                var invitacion = this.obtenerInvitacionValida(snapshot.docs);
                                if (invitacion != -1) {
                                    //Si hay una invitación válida, registra el egreso.

                                    var result = this.grabarEgreso(
                                        invitacion.Nombre,
                                        invitacion.Apellido,
                                        persona.TipoDocumento,
                                        persona.Documento
                                    );
                                    if (result == 0) {
                                        this.setState({ showSpinner: false });
                                        Alert.alert('Atención', 'El egreso se registró correctamente. (VISITANTE)');
                                        this.props.navigation.navigate('Egreso');
                                    } else {
                                        this.setState({ showSpinner: false });
                                        Alert.alert('Atención', 'Ocurrió un error: ' + result);
                                    }
                                } else {
                                    //Si no tiene invitaciones, emitir alerta.
                                    this.setState({ showSpinner: false });
                                    Alert.alert('Atención', 'ESA PERSONA NO DEBERÍA ESTAR ADENTRO.');
                                }
                            } else {
                                //Si no es propietario ni visitante, emitir alerta.
                                this.setState({ showSpinner: false });
                                Alert.alert('Atención', 'ESA PERSONA ES UN FANTASMA .');
                            }
                        });
                }
            })
            .catch(error => {
                this.setState({ showSpinner: false });
                Alert.alert('Atención', 'Ocurrió un error: ', error);
            });
    };

    onBarCodeRead = barcodes => {
        if (this.shouldScan) {
            this.shouldScan = false;
            var data = barcodes[0].rawData.split('@');
            var persona = {
                Apellido: this.capitalize(data[1]),
                Nombre: this.capitalize(data[2]),
                Documento: data[4],
                TipoDocumento: 'DocumentoDeIdentidad',
                FechaNacimiento: data[6]
            };

            console.log(persona);

            if (this.state.ingreso) {
                this.registrarIngreso(persona);
            } else {
                this.registrarEgreso(persona);
            }
        }
    };

    render() {
        return (
            <View style={styles.container}>
                <RNCamera
                    ref={ref => {
                        this.camera = ref;
                    }}
                    style={styles.preview}
                    type={RNCamera.Constants.Type.back}
                    flashMode={RNCamera.Constants.FlashMode.on}
                    androidCameraPermissionOptions={{
                        title: 'Permission to use camera',
                        message: 'We need your permission to use your camera',
                        buttonPositive: 'Ok',
                        buttonNegative: 'Cancel'
                    }}
                    androidRecordAudioPermissionOptions={{
                        title: 'Permission to use audio recording',
                        message: 'We need your permission to use your audio',
                        buttonPositive: 'Ok',
                        buttonNegative: 'Cancel'
                    }}
                    onGoogleVisionBarcodesDetected={({ barcodes }) => {
                        this.onBarCodeRead(barcodes);
                    }}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: 'black'
    },
    preview: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
    capture: {
        flex: 0,
        backgroundColor: '#fff',
        borderRadius: 5,
        padding: 15,
        paddingHorizontal: 20,
        alignSelf: 'center',
        margin: 20
    }
});

export default Escaner;

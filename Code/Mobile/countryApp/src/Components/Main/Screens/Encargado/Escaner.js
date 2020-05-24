import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import { RNCamera } from 'react-native-camera';
import { Database } from '../../../DataBase/Firebase';
import { Root, Toast } from 'native-base';

import { LocalStorage } from '../../../DataBase/Storage';
import moment from 'moment';

class Escaner extends Component {
    state = { usuario: {}, ingreso: false };
    shouldScan = true;

    capitalize = (string) => {
        return string
            .toLowerCase()
            .split(' ')
            .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
            .join(' ');
    };

    componentWillMount() {
        const { navigation } = this.props;
        const esIngreso = navigation.getParam('esIngreso', false);

        this.setState({ ingreso: esIngreso });
    }

    componentDidMount() {
        LocalStorage.load({
            key: 'UsuarioLogueado',
        })
            .then((usuario) => {
                this.setState({ usuario });
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
            invitacion: invitacion,
        });
    };

    buscarInvitacionesEventos = async (tipoDoc, numeroDoc, autenticado = undefined, nombre = undefined, apellido = undefined) => {
        var refCountry = Database.collection('Country').doc(this.state.usuario.country);
        var refInvitaciones = refCountry.collection('InvitacionesEventos');
        const invitaciones = await refInvitaciones
            .where('Documento', '==', numeroDoc)
            .where('TipoDocumento', '==', Database.doc('TipoDocumento/' + tipoDoc))
            .get();
        if (!invitaciones.empty) {
            console.log('Tiene invitaciones a eventos');
            var invitacion = this.obtenerInvitacionValida(invitaciones.docs);
            if (invitacion != -1) {
                console.log('Tiene una invitacion a eventos valida');
                console.log('Está autenticado:', autenticado);
                if (autenticado) {
                    console.log('Esta autenticado');
                    var result = await this.grabarIngreso(nombre, apellido, tipoDoc, numeroDoc);
                    if (result == 0) {
                        return 0;
                    } else {
                        return 1;
                    }
                } else if (autenticado == undefined) {
                    // TODO: HAY QUE VER QUE SE HACE EN ESTE CASO;
                    console.log('No necesita autenticación');
                    var result = 0; // await this.grabarIngreso(nombre, apellido, tipoDoc, numeroDoc);
                    if (result == 0) {
                        return 0;
                    } else {
                        return 1;
                    }
                } else {
                    console.log('No está autenticado');
                    return 2;
                }
            } else {
                console.log('No tiene invitaciones validas para un evento');
                return 3;
            }
        } else {
            console.log('No tiene ninguna invitacion a eventos');
            return 4;
        }
    };

    registrarIngreso = async (persona) => {
        //Busca si es un propietario
        var refCountry = Database.collection('Country').doc(this.state.usuario.country);
        var refPropietarios = refCountry.collection('Propietarios');
        try {
            const snapshot = await refPropietarios
                .where('Documento', '==', persona.Documento)
                .where('TipoDocumento', '==', Database.doc('TipoDocumento/' + persona.TipoDocumento))
                .get();
            if (!snapshot.empty) {
                //Si existe el propietario, registra el ingreso.
                var docPropietario = snapshot.docs[0].data();
                var result = await this.grabarIngreso(
                    docPropietario.Nombre,
                    docPropietario.Apellido,
                    persona.TipoDocumento,
                    persona.Documento
                );
                if (result == 0) {
                    return 0;
                } else {
                    return 1;
                }
            } else {
                //Si no existe el propietario, busca si tiene invitaciones.
                var refInvitados = refCountry.collection('Invitados');
                const snapshot = await refInvitados
                    .where('Documento', '==', persona.Documento)
                    .where('TipoDocumento', '==', Database.doc('TipoDocumento/' + persona.TipoDocumento))
                    .get();
                if (!snapshot.empty) {
                    //Si tiene invitaciones, verifica que haya alguna invitación válida.
                    var invitacion = this.obtenerInvitacionValida(snapshot.docs);
                    if (invitacion != -1) {
                        //Si hay una invitación válida, verifica que esté autenticado.
                        var autenticado = this.estaAutenticado(invitacion);
                        if (autenticado) {
                            //Si está autenticado, registra el ingreso.
                            var result = await this.grabarIngreso(
                                invitacion.Nombre,
                                invitacion.Apellido,
                                persona.TipoDocumento,
                                persona.Documento
                            );
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
                        console.log('Existe pero no tiene invitaciones válidas, buscando en los eventos...');
                        var result = await this.buscarInvitacionesEventos(
                            persona.TipoDocumento,
                            persona.Documento,
                            this.estaAutenticado(snapshot.docs[0].data()),
                            snapshot.docs[0].data().Nombre,
                            snapshot.docs[0].data().Apellido
                        );
                        return result;
                    }
                } else {
                    console.log('No tiene invitaciones, buscando en los eventos...');
                    var result = await this.buscarInvitacionesEventos(persona.TipoDocumento, persona.Documento);
                    return result;
                }
            }
        } catch (error) {
            return 1;
        } finally {
            this.setState({ showSpinner: false });
        }
    };

    onToastClosedIngreso = (reason) => {
        this.props.navigation.navigate('Ingreso');
    };

    autenticarToast = (persona) => {
        this.autenticarVisitante(persona, this.state.usuario, this.state.invitacionId);
    };

    //Graba el egreso en Firestore
    grabarEgreso = async (nombre, apellido, tipoDoc, numeroDoc) => {
        try {
            var refCountry = Database.collection('Country').doc(this.state.usuario.country);
            var refEgresos = refCountry.collection('Egresos');
            await refEgresos.add({
                Nombre: nombre,
                Apellido: apellido,
                Documento: numeroDoc,
                TipoDocumento: Database.doc('TipoDocumento/' + tipoDoc),
                Descripcion: '',
                Fecha: new Date(),
                IdEncargado: Database.doc('Country/' + this.state.usuario.country + '/Encargados/' + this.state.usuario.datos),
            });
            return 0;
        } catch (error) {
            return 1;
        }
    };

    //Registra el egreso según tipo y número de documento
    registrarEgreso = async (persona) => {
        //Busca si es un propietario
        var refCountry = Database.collection('Country').doc(this.state.usuario.country);
        var refPropietarios = refCountry.collection('Propietarios');
        try {
            const snapshot = await refPropietarios
                .where('Documento', '==', persona.Documento)
                .where('TipoDocumento', '==', Database.doc('TipoDocumento/' + persona.TipoDocumento))
                .get();
            if (!snapshot.empty) {
                //Si existe el propietario, registra el egreso.
                var docPropietario = snapshot.docs[0].data();
                var result = await this.grabarEgreso(
                    docPropietario.Nombre,
                    docPropietario.Apellido,
                    persona.TipoDocumento,
                    persona.Documento
                );
                if (result == 0) {
                    return 0;
                } else {
                    return 1;
                }
            } else {
                //Si no existe el propietario, busca si tiene invitaciones.
                var refInvitados = refCountry.collection('Invitados');
                const snapshot = await refInvitados
                    .where('Documento', '==', persona.Documento)
                    .where('TipoDocumento', '==', Database.doc('TipoDocumento/' + persona.TipoDocumento))
                    .get();
                if (!snapshot.empty) {
                    //Si tiene invitaciones, verifica que haya alguna invitación válida.
                    var invitacion = this.obtenerInvitacionValida(snapshot.docs);
                    if (invitacion != -1) {
                        //Si hay una invitación válida, registra el egreso.
                        var result = await this.grabarEgreso(
                            invitacion.Nombre,
                            invitacion.Apellido,
                            persona.TipoDocumento,
                            persona.Documento
                        );
                        if (result == 0) {
                            return 0;
                        } else {
                            return 1;
                        }
                    } else {
                        //Si no tiene invitaciones, emitir alerta.
                        return 2;
                    }
                } else {
                    //Si no es propietario ni visitante, emitir alerta.
                    return 3;
                }
            }
        } catch (error) {
            return 1;
        } finally {
            this.setState({ showSpinner: false });
        }
    };

    onToastClosedEgreso = (reason) => {
        this.props.navigation.navigate('Egreso');
    };

    onBarCodeRead = async (barcodes) => {
        if (this.shouldScan) {
            this.shouldScan = false;
            var data = barcodes[0].rawData.split('@');
            var persona = {
                Apellido: this.capitalize(data[1]),
                Nombre: this.capitalize(data[2]),
                Documento: data[4],
                TipoDocumento: 'DocumentoDeIdentidad',
                FechaNacimiento: data[6],
            };

            if (this.state.ingreso) {
                const result = await this.registrarIngreso(persona);
                if (result == 0) {
                    Toast.show({
                        text: 'Ingreso registrado exitosamente.',
                        buttonText: 'Aceptar',
                        duration: 3000,
                        position: 'bottom',
                        type: 'success',
                        onClose: this.onToastClosedIngreso.bind(this),
                    });
                } else if (result == 1) {
                    Toast.show({
                        text: 'Lo siento, ocurrió un error inesperado.',
                        buttonText: 'Aceptar',
                        duration: 3000,
                        position: 'bottom',
                        type: 'danger',
                        onClose: this.onToastClosedIngreso.bind(this),
                    });
                } else if (result == 2) {
                    Toast.show({
                        text: 'El visitante no está autenticado, se debe autenticar primero.',
                        buttonText: 'Aceptar',
                        duration: 3000,
                        position: 'bottom',
                        type: 'warning',
                        onClose: this.autenticarToast(persona),
                    });
                } else if (result == 3) {
                    Toast.show({
                        text: 'El invitado no tiene ninguna invitación activa.',
                        buttonText: 'Aceptar',
                        duration: 3000,
                        position: 'bottom',
                        type: 'warning',
                        onClose: this.onToastClosedIngreso.bind(this),
                    });
                } else if (result == 4) {
                    Toast.show({
                        text: 'La persona no se encuentra registrada en el sistema.',
                        buttonText: 'Aceptar',
                        duration: 3000,
                        position: 'bottom',
                        type: 'warning',
                        onClose: this.onToastClosedIngreso.bind(this),
                    });
                }
            } else {
                const result = await this.registrarEgreso(persona);
                if (result == 0) {
                    Toast.show({
                        text: 'Egreso registrado exitosamente.',
                        buttonText: 'Aceptar',
                        duration: 3000,
                        position: 'bottom',
                        type: 'success',
                        onClose: this.onToastClosedEgreso.bind(this),
                    });
                } else if (result == 1) {
                    Toast.show({
                        text: 'Lo siento, ocurrió un error inesperado.',
                        buttonText: 'Aceptar',
                        duration: 3000,
                        position: 'bottom',
                        type: 'danger',
                        onClose: this.onToastClosedEgreso.bind(this),
                    });
                } else if (result == 2) {
                    Toast.show({
                        text: 'El visitante no tiene invitaciones activas.',
                        buttonText: 'Aceptar',
                        duration: 3000,
                        position: 'bottom',
                        type: 'warning',
                        onClose: this.onToastClosedEgreso.bind(this),
                    });
                } else if (result == 3) {
                    Toast.show({
                        text: 'Esta persona es un fantasma.',
                        buttonText: 'Aceptar',
                        duration: 3000,
                        position: 'bottom',
                        type: 'warning',
                        onClose: this.onToastClosedEgreso.bind(this),
                    });
                }
            }
        }
    };

    render() {
        return (
            <Root>
                <View style={styles.container}>
                    <RNCamera
                        ref={(ref) => {
                            this.camera = ref;
                        }}
                        style={styles.preview}
                        type={RNCamera.Constants.Type.back}
                        flashMode={RNCamera.Constants.FlashMode.on}
                        androidCameraPermissionOptions={{
                            title: 'Permission to use camera',
                            message: 'We need your permission to use your camera',
                            buttonPositive: 'Ok',
                            buttonNegative: 'Cancel',
                        }}
                        androidRecordAudioPermissionOptions={{
                            title: 'Permission to use audio recording',
                            message: 'We need your permission to use your audio',
                            buttonPositive: 'Ok',
                            buttonNegative: 'Cancel',
                        }}
                        onGoogleVisionBarcodesDetected={({ barcodes }) => {
                            this.onBarCodeRead(barcodes);
                        }}
                    />
                </View>
            </Root>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: 'black',
    },
    preview: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    capture: {
        flex: 0,
        backgroundColor: '#fff',
        borderRadius: 5,
        padding: 15,
        paddingHorizontal: 20,
        alignSelf: 'center',
        margin: 20,
    },
});

export default Escaner;

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
    grabarIngreso = async (nombre, apellido, tipoDoc, numeroDoc, idPropietario) => {
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
            await refIngresos.add();
            return 0;
        } catch (error) {
            return 1;
        }
    };

    //Devuelve la primer invitación válida a partir de un conjunto de invitaciones
    obtenerInvitacionValida = (invitaciones) => {
        var now = moment().unix(); //Se obtiene la fecha actual en formato Timestamp para facilitar la comparación
        var result = [];
        for (var i = 0; i < invitaciones.length; i++) {
            var docInvitacion = invitaciones[i].data();
            if (now >= docInvitacion.FechaDesde.seconds && now <= docInvitacion.FechaHasta.seconds) {
                docInvitacion.id = invitaciones[i].id;
                result.push(docInvitacion);
            }
        }
        return result;
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
            propietarios: propietarios,
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
                } else {
                    console.log('No está autenticado');
                    this.setState({ invitacionId: invitacion.id });
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
                    .where('Estado', '==', true)
                    .get();
                if (!snapshot.empty) {
                    //Si tiene invitaciones, verifica que haya alguna invitación válida.
                    var invitaciones = this.obtenerInvitacionValida(snapshot.docs);
                    if (invitaciones.length > 0) {
                        //Si hay una invitación válida, verifica que esté autenticado.
                        var autenticado = this.estaAutenticado(invitaciones[0]);
                        if (autenticado) {
                            //Si está autenticado, registra el ingreso.
                            if (invitaciones.length == 1) {
                                var result = await this.grabarIngreso(
                                    invitacion.Nombre,
                                    invitacion.Apellido,
                                    persona.TipoDocumento,
                                    persona.Documento,
                                    invitaciones[0].IdPropietario.id
                                );
                                if (result == 0) {
                                    return 0;
                                } else {
                                    return 1;
                                }
                            } else {
                                propietarios = invitaciones.map((inv) => {
                                    return inv.IdPropietario.id;
                                });
                                var inv = {
                                    nombre: invitaciones[0].Nombre,
                                    apellido: invitaciones[0].Apellido,
                                    tipoDoc: tipoDoc,
                                    numeroDoc: numeroDoc,
                                };
                                this.setState({ invitado: inv, propietarios: propietarios });
                                return 5;
                            }
                        } else {
                            //Si no está autenticado, se debe autenticar.
                            propietarios = invitaciones.map((inv) => {
                                return inv.IdPropietario.id;
                            });
                            this.setState({ invitacionId: invitacion.id });
                            return 2;
                        }
                    } else {
                        var result = await this.buscarInvitacionesEventos(
                            persona.TipoDocumento,
                            persona.Documento,
                            this.estaAutenticado(snapshot.docs[0].data()),
                            snapshot.docs[0].data().Nombre,
                            snapshot.docs[0].data().Apellido
                        );
                        if (result == 4) {
                            return 3;
                        }
                        return result;
                    }
                } else {
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

    propietariosToast = (reason) => {
        this.props.navigation.navigate('ListaDePropietarios', {
            invitado: this.state.invitado,
            propietarios: this.state.propietarios,
        });
    };

    generarNotificacionEgreso = async (nombre, apellido, tipoDoc, numeroDoc) => {
        var refCountry = Database.collection('Country').doc(this.state.usuario.country);
        var refIngresos = refCountry.collection('Ingresos');

        var ingreso = await refIngresos
            .where('Documento', '==', numeroDoc)
            .where('TipoDocumento', '==', Database.doc('TipoDocumento/' + tipoDoc))
            .orderBy('Fecha', 'desc')
            .limit(1)
            .get();

        var refNotificaciones = refCountry.collection('Notificaciones');
        var notificacion = {
            Fecha: new Date(),
            Tipo: 'Egreso',
            Texto: nombre + ' ' + apellido + ' ha salido del complejo.',
            IdPropietario: ingreso.docs[0].data().IdPropietario.id,
            Visto: false,
        };
        await refNotificaciones.add(notificacion);
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

    buscarInvitacionesEventosEgreso = async (tipoDoc, numeroDoc, invitacionPersonal = undefined) => {
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
                var result = await this.grabarEgreso(invitacionPersonal.Nombre, invitacionPersonal.Apellido, tipoDoc, numeroDoc);
                if (result == 0) {
                    return 0;
                } else {
                    return 1;
                }
            } else {
                await this.grabarEgreso(invitacionPersonal.Nombre, invitacionPersonal.Apellido, tipoDoc, numeroDoc);
                return 2;
            }
        } else {
            console.log('No tiene ninguna invitacion a eventos');
            var result = invitacionPersonal == undefined ? 3 : 2;
            if (result == 2) {
                await this.grabarEgreso(invitacionPersonal.Nombre, invitacionPersonal.Apellido, tipoDoc, numeroDoc);
            }
            return result;
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
                    .where('Estado', '==', true)
                    .get();
                if (!snapshot.empty) {
                    //Si tiene invitaciones, verifica que haya alguna invitación válida.
                    var invitacion = this.obtenerInvitacionValida(snapshot.docs);
                    if (invitacion != -1) {
                        //Si hay una invitación válida, registra el egreso.
                        var notif = await this.generarNotificacionEgreso(
                            invitacion.Nombre,
                            invitacion.Apellido,
                            persona.TipoDocumento,
                            persona.Documento
                        );
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
                        var result = await this.buscarInvitacionesEventosEgreso(tipoDoc, numeroDoc, snapshot.docs[0].data());
                        return result;
                    }
                } else {
                    var result = await this.buscarInvitacionesEventosEgreso(tipoDoc, numeroDoc);
                    return result;
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
                        text: 'El invitado tiene vencida su invitación.',
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
                } else if (result == 5) {
                    Toast.show({
                        text: 'Debe seleccionar el propietario a visitar.',
                        buttonText: 'Aceptar',
                        duration: 3000,
                        position: 'bottom',
                        type: 'warning',
                        onClose: this.propietariosToast.bind(this),
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
                        text: 'Egreso registrado exitosamente (Invitación vencida).',
                        buttonText: 'Aceptar',
                        duration: 3000,
                        position: 'bottom',
                        type: 'success',
                        onClose: this.onToastClosedEgreso.bind(this),
                    });
                } else if (result == 3) {
                    Toast.show({
                        text: 'La persona no se encuentra registrada en el sistema.',
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

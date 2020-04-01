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

class EgresoManual extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            title: 'Egreso Manual',
            headerLeft: <Icon style={{ paddingLeft: 10 }} onPress={() => navigation.goBack()} name="arrow-back" size={30} />
        };
    };

    state = { picker: '', tiposDocumento: [], documento: '', showSpinner: false, isFocused: false, usuario: {} };

    componentDidMount() {
        setInterval(() => {
            this.setState({
                showSpinner: false
            });
        }, 3000);

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

    // TODO: extraer este metodo a un modulo aparte para evitar consultas repetitivas a la BD.
    obtenerPickers = async () => {
        var dbRef = Database.collection('TipoDocumento');
        var snapshot = await dbRef.get()
        var tiposDocumento = [];
        snapshot.forEach(doc => {
            tiposDocumento.push({ id: doc.id, nombre: doc.data().Nombre });
        });
        this.setState({ tiposDocumento });
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

    //Registra el egreso según tipo y número de documento
    registrarEgreso = async (tipoDoc, numeroDoc) => {
        //Busca si es un propietario
        var refCountry = Database.collection('Country').doc(this.state.usuario.country);
        var refPropietarios = refCountry.collection('Propietarios');
        this.setState({ showSpinner: true });
        try {
            const snapshot = await refPropietarios.where('Documento', '==', numeroDoc).where('TipoDocumento', '==', Database.doc('TipoDocumento/' + tipoDoc)).get()
            if (!snapshot.empty) {
                //Si existe el propietario, registra el egreso.
                var docPropietario = snapshot.docs[0].data();
                var result = this.grabarEgreso(docPropietario.Nombre, docPropietario.Apellido, tipoDoc, numeroDoc);
                if (result == 0) {
                    this.setState({ showSpinner: false });
                    return 0
                } else {
                    this.setState({ showSpinner: false });
                    return 1
                }
            } else {
                //Si no existe el propietario, busca si tiene invitaciones.
                var refInvitados = refCountry.collection('Invitados');
                const snapshot = await refInvitados.where('Documento', '==', numeroDoc).where('TipoDocumento', '==', Database.doc('TipoDocumento/' + tipoDoc)).get()
                    if (!snapshot.empty) {
                        //Si tiene invitaciones, verifica que haya alguna invitación válida.
                        var invitacion = this.obtenerInvitacionValida(snapshot.docs);
                        if (invitacion != -1) {
                            //Si hay una invitación válida, registra el egreso.

                            var result = this.grabarEgreso(invitacion.Nombre, invitacion.Apellido, tipoDoc, numeroDoc);
                            if (result == 0) {
                                this.setState({ showSpinner: false });
                                return 0
                            } else {
                                this.setState({ showSpinner: false });
                                return 1
                            }
                        } else {
                            //Si no tiene invitaciones, emitir alerta.
                            this.setState({ showSpinner: false });
                            return 2
                        }
                    } else {
                        //Si no es propietario ni visitante, emitir alerta.
                        this.setState({ showSpinner: false });
                        return 3;
                    }
            };
        } catch (error) {
            this.setState({ showSpinner: false });
            return 1
        }
    }
        
    onToastClosed = reason => {
        this.props.navigation.navigate('Egreso');
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

    render() {
        const { isFocused } = this.state;

        if (this.state.tiposDocumento.length < 3) {
            this.obtenerPickers();
        }

        return (
            <Root>
                <ScrollView>
                    <Content>
                        <View style={styles.container}>
                            <Spinner visible={this.state.showSpinner} textContent={'Loading...'} textStyle={styles.spinnerTextStyle} />
                            <StatusBar backgroundColor="#1e90ff"></StatusBar>
                            <Text style={styles.header}> Registrar nuevo Egreso</Text>

                            <Picker
                                note
                                mode="dropdown"
                                style={styles.picker}
                                selectedValue={this.state.picker}
                                onValueChange={(itemValue, itemIndex) => this.setState({ picker: itemValue })}>
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
                                        onPress={async () => {
                                            const result = await this.registrarEgreso(this.state.picker, this.state.documento);
                                            if (result == 0) {
                                                Toast.show({
                                                    text: "Egreso registrado exitosamente.",
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
                                            } else if (result == 2) {
                                                Toast.show({
                                                    text: "El visitante no tiene ningún ingreso registrado.",
                                                    buttonText: "Aceptar",
                                                    duration: 3000,
                                                    position: "bottom",
                                                    type: "warning",
                                                    onClose : this.onToastClosed.bind(this)
                                                })
                                            } else if (result == 3) {
                                                Toast.show({
                                                    text: "Esta persona es un fantasma.",
                                                    buttonText: "Aceptar",
                                                    duration: 3000,
                                                    position: "bottom",
                                                    type: "warning",
                                                    onClose : this.onToastClosed.bind(this)
                                                })
                                            } 
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
        marginTop: '13%',
        color: '#08477A',
        fontWeight: 'normal',
        fontStyle: 'normal'
    },
    picker: {
        width: '85%',
        fontSize: 18,
        marginTop: '15%',
        alignItems: 'flex-start'
    },
    textInput: {
        width: '80%',
        fontSize: 16,
        alignItems: 'flex-start',
        marginTop: '13%'
    },
    buttons: {
        alignItems: 'center',
        justifyContent: 'center',
        width: '45%',
        marginTop: '13%'
    }
});

export default EgresoManual;

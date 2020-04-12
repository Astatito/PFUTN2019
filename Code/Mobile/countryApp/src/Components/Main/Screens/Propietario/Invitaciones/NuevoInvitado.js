import React, { Component } from 'react';
import { View, StyleSheet, TextInput, StatusBar } from 'react-native';
import { Database } from '../../../../DataBase/Firebase';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Content, Button, Text, Picker, Root, Toast } from 'native-base';
import Spinner from 'react-native-loading-spinner-overlay';
import DateTimePicker from 'react-native-modal-datetime-picker';
import IconFontAwesome from 'react-native-vector-icons/FontAwesome';
import { LocalStorage } from '../../../../DataBase/Storage';
import moment from 'moment';

const BLUE = '#428AF8';
const LIGHT_GRAY = '#D3D3D3';

class NuevoInvitado extends Component {

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
        fechaDesde: moment(new Date()),
        fechaHasta: moment(new Date()),
        showSpinner: false,
        isFocused: false,
        isVisible: false,
        esDesde: null,
        usuario: {},
        invitados: []
    };

    componentWillMount() {
        this.setState({ showSpinner: true });
        LocalStorage.load({
            key: 'UsuarioLogueado'
        })
            .then(usuario => {
                this.setState({ usuario });
                this.obtenerInvitaciones();
                this.obtenerPickers();
            })
            .catch(error => {
                this.setState({ showSpinner: false });
                Toast.show({
                    text: "La key solicitada no existe.",
                    buttonText: "Aceptar",
                    duration: 3000,
                    position: "bottom",
                    type: "danger",
                })
            });
    }   
    
    componentDidMount() {
        setInterval(() => {
            this.setState({
                showSpinner: false
            });
        }, 3000);
    }

    obtenerInvitaciones = () => {
        var refCountry = Database.collection('Country').doc(this.state.usuario.country);
        var refInvitados = refCountry.collection('Invitados');

        this.snapshotInvitados = refInvitados
            .where(
                'IdPropietario',
                '==',
                Database.doc('Country/' + this.state.usuario.country + '/Propietarios/' + this.state.usuario.datos)
            )
            .onSnapshot(snapshot => {
                if (!snapshot.empty) {
                    //El propietario tiene invitaciones
                    var tempArray = [];
                    for (var i = 0; i < snapshot.docs.length; i++) {
                        var invitado = {
                            key: snapshot.docs[i].id,
                            nombre: snapshot.docs[i].data().Nombre,
                            apellido: snapshot.docs[i].data().Apellido,
                            documento: snapshot.docs[i].data().Documento,
                            tipoDocumento: snapshot.docs[i].data().TipoDocumento.id,
                            fechaDesde: moment.unix(snapshot.docs[i].data().FechaDesde.seconds).format('D/M/YYYY HH:mm'),
                            fechaHasta: moment.unix(snapshot.docs[i].data().FechaHasta.seconds).format('D/M/YYYY HH:mm')
                        };
                        tempArray.push(invitado);
                    }
                    this.setState({ invitados: tempArray });
                } else {
                    this.setState({ invitados: [] });
                }
            });
    };

    // TODO: extraer este metodo a un modulo aparte para evitar consultas repetitivas a la BD.
    obtenerPickers = async () => {
        var dbRef = Database.collection('TipoDocumento');
        var snapshot = await dbRef.get()
        var tiposDocumento = [];
        snapshot.forEach(doc => {
            tiposDocumento.push({ id: doc.id, nombre: doc.data().Nombre });
        });
        this.setState({ tiposDocumento, showSpinner : false });
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

    onToastClosed = (reason) => {
        this.props.navigation.goBack();
    }

    verificarFechaCorrecta = async() => {
        const now = moment().subtract(1, "minutes")
        const desde = this.state.fechaDesde
        const hasta = this.state.fechaHasta
        if (desde.isBefore(hasta) && desde.isAfter(now) ) {
            return 0
        } else {
            this.setState({ showSpinner: false });
            return 1
        }
    }

    registrarNuevoInvitado = async (tipoDoc, numeroDoc) => {

        var refCountry = Database.collection('Country').doc(this.state.usuario.country);
        var refInvitados = refCountry.collection('Invitados');

        try {
            var nuevoInvitado = {
                Nombre: '',
                Apellido: '',
                Estado: true,
                FechaAlta: new Date(),
                FechaDesde: this.state.fechaDesde.toDate(),
                FechaHasta: this.state.fechaHasta.toDate(),
                Grupo: '',
                IdPropietario: Database.doc('Country/' + this.state.usuario.country + '/Propietarios/' + this.state.usuario.datos),
                Documento: numeroDoc,
                TipoDocumento: Database.doc('TipoDocumento/' + tipoDoc)
            }
            if (!this.state.invitados.find(
                inv => inv.tipoDocumento == nuevoInvitado.TipoDocumento.id && inv.documento == nuevoInvitado.Documento)) {
                    await refInvitados.add(nuevoInvitado);
                    return 0
            } else {
                    return 2
            }
            
            
        } catch (error) {
            return 1
        } finally {
            this.setState({ showSpinner: false });
        }
    };

    obtenerDiaRelevante = () => {
        if (this.state.esDesde) {
            return this.state.fechaDesde
        } else {
            return this.state.fechaHasta
        }
    }

    render() {
        const { isFocused } = this.state;

        return (
            <Root>  
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
                            maxLength={8}
                        />

                        <View style={styles.datetime}>
                            <Text style={{ color: '#8F8787' }}>Desde</Text>
                            <Text style={{ color: '#1e90ff', fontSize: 15 }}>
                                {this.state.fechaDesde.format('DD/MM/YYYY - HH:mm')}
                            </Text>
                            <IconFontAwesome
                                onPress={() => {
                                    this.showPicker();
                                    this.setState({ esDesde: true });
                                }}
                                name="calendar"
                                size={25}
                            />
                        </View>

                        <View style={styles.datetime}>
                            <Text style={{ alignSelf: 'center', color: '#8F8787' }}>Hasta</Text>
                            <Text style={{ alignSelf: 'center', color: '#1e90ff', fontSize: 15 }}>
                                {this.state.fechaHasta.format('DD/MM/YYYY - HH:mm')}
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
                            date={new Date(this.obtenerDiaRelevante())}
                            is24Hour={true}></DateTimePicker>

                        <View style={{ flexDirection: 'row' }}>
                            <View style={styles.buttons}>
                                <Button
                                    bordered
                                    success
                                    style={{ paddingHorizontal: '5%' }}
                                    onPress={async () => {
                                        this.setState({ showSpinner: true }, async () => {
                                            const verificacion = await this.verificarFechaCorrecta()
                                                if (verificacion == 1) {
                                                    Toast.show({
                                                        text: "Por favor, revise la fecha Desde y la fecha Hasta.",
                                                        buttonText: "Aceptar",
                                                        duration: 3000,
                                                        position: "bottom",
                                                        type: "warning",
                                                    })
                                                } else if (verificacion == 0) {
                                                    const result = await this.registrarNuevoInvitado(this.state.picker, this.state.documento)
                                                    if (result == 0) {
                                                        Toast.show({
                                                            text: "Invitado registrado exitosamente.",
                                                            buttonText: "Aceptar",
                                                            duration: 3000,
                                                            position: "bottom",
                                                            type: "success",
                                                            onClose : this.onToastClosed.bind(this)
                                                        })
                                                    } else if (result == 2) {
                                                        Toast.show({
                                                            text: "El invitado ya se encuentra registrado.",
                                                            buttonText: "Aceptar",
                                                            duration: 3000,
                                                            position: "bottom",
                                                            type: "warning",
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
    datetime: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        margin: '7%',
        width: '92%'
    },
    buttons: {
        alignItems: 'center',
        justifyContent: 'center',
        width: '45%',
        marginVertical: '5%'
    }
});

export default NuevoInvitado;

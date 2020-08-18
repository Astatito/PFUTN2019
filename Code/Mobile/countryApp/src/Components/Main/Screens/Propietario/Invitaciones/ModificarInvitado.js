import React, { Component } from 'react';
import { View, StyleSheet, TextInput, StatusBar } from 'react-native';
import { Database } from '../../../../DataBase/Firebase';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Content, Button, Text, Picker, Root, Toast } from 'native-base';
import Spinner from 'react-native-loading-spinner-overlay';
import DateTimePicker from 'react-native-modal-datetime-picker';
import IconFontAwesome from 'react-native-vector-icons/FontAwesome';
import moment from 'moment';


const LIGHT_GRAY = '#D3D3D3';

class ModificarInvitado extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            title: null,
            headerLeft: <Icon style={{ paddingLeft: 10 }} onPress={() => navigation.goBack()} name="arrow-back" size={30} />,
            headerRight: <View />,
        };
    };

    state = {
        nombre: '',
        apellido: '',
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
        autenticado: null,
        documentoError: '',
    };

    componentDidMount() {
        setInterval(() => {
            this.setState({
                showSpinner: false,
            });
        }, 3000);
    }

    componentWillMount() {
        this.setState({ showSpinner: true, tiposDocumento: global.tiposDocumento });
        const { navigation } = this.props;
        const usuario = navigation.getParam('usuario');
        const invitacion = navigation.getParam('invitacion');
        const autenticado = navigation.getParam('autenticado');
        this.setState({
            autenticado: autenticado,
            usuario: usuario,
            nombre: invitacion.nombre,
            apellido: invitacion.apellido,
            documento: invitacion.documento,
            picker: invitacion.tipoDocumento,
            fechaDesde: moment(invitacion.fechaDesde, 'D/M/YYYY HH:mm'),
            fechaHasta: moment(invitacion.fechaHasta, 'D/M/YYYY HH:mm'),
            idInvitacion: invitacion.key,
            showSpinner: false
        });
    }

    onBlur() {
        this.setState({ isFocused: false });
    }
    
    onFocus() {
        this.setState({ isFocused: true });
    }

    handlePicker = (datetime) => {
        if (this.state.esDesde == true) {
            this.setState({
                isVisible: false,
                fechaDesde: moment(datetime),
            });
        } else {
            this.setState({
                isVisible: false,
                fechaHasta: moment(datetime),
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
    };

    verificarFechaCorrecta = async () => {
        const desde = this.state.fechaDesde;
        const hasta = this.state.fechaHasta;
        if (desde.isBefore(hasta)) {
            return 0;
        } else {
            this.setState({ showSpinner: false });
            return 1;
        }
    };

    actualizarInvitado = async () => {
        var refCountry = Database.collection('Country').doc(this.state.usuario.country);
        var refInvitado = refCountry.collection('Invitados').doc(this.state.idInvitacion);
        try {
            await refInvitado.set(
                {
                    FechaDesde: this.state.fechaDesde.toDate(),
                    FechaHasta: this.state.fechaHasta.toDate(),
                    Documento: this.state.documento,
                    TipoDocumento: Database.doc('TipoDocumento/' + this.state.picker),
                },
                { merge: true }
            );
            return 0;
        } catch (error) {
            return 1;
        } finally {
            this.setState({ showSpinner: false });
        }
    };

    obtenerDiaRelevante = () => {
        if (this.state.esDesde) {
            return this.state.fechaDesde;
        } else {
            return this.state.fechaHasta;
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
        if (this.state.picker == 'DocumentoDeIdentidad') {
            return 8
        } else {
            return 10
        }
    }

    render() {

        if (this.state.nombre == '' && this.state.apellido == '') {
            return (
                <Root>
                    <Content>
                        <View style={styles.container}>
                            <Spinner visible={this.state.showSpinner} textContent={'Loading...'} textStyle={styles.spinnerTextStyle} />
                            <StatusBar backgroundColor="#1e90ff"></StatusBar>
                            <Text style={styles.header}> Modificar invitado </Text>
                            <Picker
                                note
                                mode="dropdown"
                                style={styles.picker}
                                selectedValue={this.state.picker}
                                enabled={!this.state.autenticado}
                                onValueChange={(itemValue) => this.setState({ picker: itemValue })}>
                                {this.state.tiposDocumento.map((item, index) => {
                                    return <Picker.Item label={item.nombre} value={item.id} key={index} />;
                                })}
                            </Picker>

                            <TextInput
                                style={styles.textInput}
                                placeholder="Número de documento"
                                value={this.state.documento}
                                editable={!this.state.autenticado}
                                onChangeText={(documento) => this.setState({ documento })}
                                underlineColorAndroid={LIGHT_GRAY}
                                onFocus={() => this.onFocus()}
                                onBlur={() => this.onBlur()}
                                keyboardType={this.getKeyboard()}
                                maxLength={this.getLimit()}
                            />
                            <Text style={styles.error}>{this.state.documentoError}</Text>
                            <View style={styles.datetime}>
                                <Text style={{ color: '#8F8787' }}>Desde</Text>
                                <Text style={{ color: '#1e90ff', fontSize: 15 }}>{this.state.fechaDesde.format('DD/MM/YYYY - HH:mm')}</Text>
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
                                <Text style={{ color: '#8F8787' }}>Hasta</Text>
                                <Text style={{ color: '#1e90ff', fontSize: 15 }}>{this.state.fechaHasta.format('DD/MM/YYYY - HH:mm')}</Text>
                                <IconFontAwesome
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
                                        disabled={this.state.showSpinner}
                                        style={{ paddingHorizontal: '5%' }}
                                        onPress={() => {
                                            this.setState({ showSpinner: true }, async () => {
                                                const textInputs = await this.verificarTextInputs(['documento']);
                                                if (textInputs == true) {
                                                    return false;
                                                }
                                                const verificacion = await this.verificarFechaCorrecta();
                                                if (verificacion == 1) {
                                                    Toast.show({
                                                        text: 'La fecha Desde debe ser anterior a la fecha Hasta.',
                                                        buttonText: 'Aceptar',
                                                        duration: 3000,
                                                        position: 'bottom',
                                                        type: 'warning',
                                                    });
                                                } else if (verificacion == 0) {
                                                    const result = await this.actualizarInvitado();
                                                    if (result == 0) {
                                                        Toast.show({
                                                            text: 'Invitado actualizado exitosamente.',
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
                </Root>
            );
        } else {
            return (
                <Root>
                    <Content>
                        <View style={styles.container}>
                            <Spinner visible={this.state.showSpinner} textContent={'Loading...'} textStyle={styles.spinnerTextStyle} />
                            <StatusBar backgroundColor="#1e90ff"></StatusBar>
                            <Text style={styles.header}> Modificar invitado </Text>

                            <View style={styles.name}>
                                <Text style={{ alignSelf: 'center', color: '#8F8787', paddingHorizontal: '2%' }}>
                                    {this.state.nombre + ' ' + this.state.apellido}
                                </Text>
                            </View>

                            <Picker
                                note
                                mode="dropdown"
                                style={styles.picker}
                                selectedValue={this.state.picker}
                                enabled={!this.state.autenticado}
                                onValueChange={(itemValue) => this.setState({ picker: itemValue })}>
                                {this.state.tiposDocumento.map((item, index) => {
                                    return <Picker.Item label={item.nombre} value={item.id} key={index} />;
                                })}
                            </Picker>

                            <TextInput
                                style={styles.textInput}
                                placeholder="Número de documento"
                                value={this.state.documento}
                                onChangeText={(documento) => this.setState({ documento })}
                                editable={!this.state.autenticado}
                                underlineColorAndroid={LIGHT_GRAY}
                                onFocus={() => this.onFocus()}
                                onBlur={() => this.onBlur()}
                                keyboardType={this.getKeyboard()}
                                maxLength={this.getLimit()}
                            />

                            <View style={styles.datetime}>
                                <Text style={{ color: '#8F8787' }}>Desde</Text>
                                <Text style={{ color: '#1e90ff', fontSize: 15 }}>{this.state.fechaDesde.format('DD/MM/YYYY - HH:mm')}</Text>
                                <IconFontAwesome
                                    style={{ alignSelf: 'center' }}
                                    onPress={() => {
                                        this.showPicker();
                                        this.setState({ esDesde: true });
                                    }}
                                    name="calendar"
                                    size={25}
                                />
                            </View>
                            <View style={styles.datetime}>
                                <Text style={{ color: '#8F8787' }}>Hasta</Text>
                                <Text style={{ color: '#1e90ff', fontSize: 15 }}>{this.state.fechaHasta.format('DD/MM/YYYY - HH:mm')}</Text>
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
                                        disabled={this.state.showSpinner}
                                        style={{ paddingHorizontal: '5%' }}
                                        onPress={() => {
                                            this.setState({ showSpinner: true }, async () => {
                                                const verificacion = await this.verificarFechaCorrecta();
                                                if (verificacion == 1) {
                                                    Toast.show({
                                                        text: 'Por favor, verifique la fecha desde o fecha hasta.',
                                                        buttonText: 'Aceptar',
                                                        duration: 3000,
                                                        position: 'bottom',
                                                        type: 'warning',
                                                    });
                                                } else if (verificacion == 0) {
                                                    const result = await this.actualizarInvitado();
                                                    if (result == 0) {
                                                        Toast.show({
                                                            text: 'Invitado actualizado exitosamente.',
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
                </Root>
            );
        }
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
        marginVertical: '9%',
        color: '#08477A',
        fontWeight: 'normal',
        fontStyle: 'normal',
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
        marginTop: '5%',
    },
    buttons: {
        alignItems: 'center',
        justifyContent: 'center',
        width: '45%',
        marginTop: '6%',
    },
    datetime: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: '13%',
        marginBottom: '3%',
        width: '80%',
    },
    name: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        marginVertical: '5%',
        width: '83%',
    },
    error: {
        color: 'red',
        alignSelf: 'flex-start',
        fontSize: 12,
        marginLeft: '10%',
    },
});

export default ModificarInvitado;

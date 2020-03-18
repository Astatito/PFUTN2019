import React, { Component } from 'react';
import { LocalStorage } from '../../../DataBase/Storage';
import { View, StyleSheet, TextInput, StatusBar, Alert } from 'react-native';
import { Database } from '../../../DataBase/Firebase';
import { ScrollView } from 'react-native-gesture-handler';
import { Content, Button, Text, Picker, Toast, Root } from 'native-base';
import Spinner from 'react-native-loading-spinner-overlay';
import DateTimePicker from 'react-native-modal-datetime-picker';
import { NavigationActions } from 'react-navigation';
import moment from 'moment';
import IconFontAwesome from 'react-native-vector-icons/FontAwesome';

const BLUE = '#428AF8';
const LIGHT_GRAY = '#D3D3D3';

const navigateAction = NavigationActions.navigate({
    routeName: 'Propietario',
    action: NavigationActions.navigate({ routeName: 'Propietario' })
});

class MiPerfil extends Component {
    static navigationOptions = {
        title: 'Actualizar Datos',
        headerRight: <View />
    };

    componentWillMount() {
        this.setState({ showSpinner: true });

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
                this.obtenerDatosPersonales(usuario);
            })
            .catch(error => {
                switch (error.name) {
                    case 'NotFoundError':
                        console.log('La key solicitada no existe.');
                        this.setState({ showSpinner: false });
                        break;
                    default:
                        console.warn('Error inesperado: ', error.message);
                        this.setState({ showSpinner: false });
                }
            });
    }

    state = {
        tiposDocumento: [],
        tipoAcceso: '',
        nombre: '',
        apellido: '',
        picker: '',
        documento: '',
        fechaNacimiento: moment(new Date()),
        celular: '',
        isFocused: false,
        showSpinner: false,
        isVisible: false
    };

    obtenerDatosPersonales = () => {
        var refCountry = Database.collection('Country').doc(this.state.usuario.country);
        var refPropietarios = refCountry.collection('Propietarios');

        refPropietarios.doc(this.state.usuario.datos).onSnapshot(doc => {
            if (doc.exists) {
                var propietario = doc.data();
                this.setState({
                    nombre: propietario.Nombre,
                    apellido: propietario.Apellido,
                    legajo: propietario.Legajo,
                    documento: propietario.Documento,
                    picker: propietario.TipoDocumento.id,
                    celular: propietario.Celular,
                    fechaNacimiento: moment.unix(propietario.FechaNacimiento.seconds)
                });
                console.log(propietario);
                this.setState({ showSpinner: false });
            }
        });
    };

    actualizarDatos = () => {
        this.setState({ showSpinner: true });
        var refCountry = Database.collection('Country').doc(this.state.usuario.country);
        var refPropietario = refCountry.collection('Propietarios').doc(this.state.usuario.datos);

        refPropietario.set(
            {
                Nombre: this.state.nombre,
                Apellido: this.state.apellido,
                Celular: this.state.celular,
                FechaNacimiento: this.state.fechaNacimiento.toDate()
            },
            { merge: true }
        );
        this.setState({ showSpinner: false });
    };

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

    onToastClosed = (reason) => {
        this.props.navigation.dispatch(navigateAction) 
    }

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
                            <View style={styles.viewContainer}>
                                <Text style={styles.textLabel}>Nombre</Text>
                                <TextInput
                                    style={styles.textInput}
                                    placeholder="Nombre"
                                    onChangeText={nombre => this.setState({ nombre })}
                                    underlineColorAndroid={isFocused ? BLUE : LIGHT_GRAY}
                                    onFocus={this.handleFocus}
                                    onBlur={this.handleBlur}
                                    keyboardType={'default'}
                                    value={this.state.nombre}
                                />
                            </View>

                            <View style={styles.viewContainer}>
                                <Text style={styles.textLabel}>Apellido</Text>
                                <TextInput
                                    style={styles.textInput}
                                    placeholder="Apellido"
                                    onChangeText={apellido => this.setState({ apellido })}
                                    underlineColorAndroid={isFocused ? BLUE : LIGHT_GRAY}
                                    onFocus={this.handleFocus}
                                    onBlur={this.handleBlur}
                                    keyboardType={'default'}
                                    value={this.state.apellido}
                                />
                            </View>

                            <Picker
                                note
                                mode="dropdown"
                                style={styles.picker}
                                selectedValue={this.state.picker}
                                enabled={false}
                                onValueChange={(itemValue, itemIndex) => this.setState({ picker: itemValue })}>
                                <Picker.Item label="Tipo de documento" value="-1" color="#7B7C7E" />
                                {this.state.tiposDocumento.map((item, index) => {
                                    return <Picker.Item label={item.nombre} value={item.id} key={index} />;
                                })}
                            </Picker>

                            <View style={styles.viewContainer}>
                                <Text style={styles.textLabel}>Documento</Text>
                                <TextInput
                                    style={{
                                        width: '70%',
                                        fontSize: 16,
                                        alignItems: 'flex-start',
                                        marginTop: '5%'
                                    }}
                                    placeholder="Número de documento"
                                    onChangeText={documento => this.setState({ documento })}
                                    underlineColorAndroid={isFocused ? BLUE : LIGHT_GRAY}
                                    onFocus={this.handleFocus}
                                    onBlur={this.handleBlur}
                                    keyboardType={'numeric'}
                                    value={this.state.documento}
                                    editable={false}
                                />
                            </View>

                            <View style={styles.datetime}>
                                <Text style={{ alignSelf: 'center', color: '#8F8787' }}>Fecha de nacimiento</Text>
                                <Text style={{ alignSelf: 'center', color: '#1e90ff', paddingHorizontal: '10%', fontSize: 15 }}>
                                    {this.state.fechaNacimiento.format('DD/MM/YYYY')}
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

                            <View style={styles.viewContainer}>
                                <Text style={styles.textLabel}>Celular</Text>
                                <TextInput
                                    style={styles.textInput}
                                    placeholder="Celular"
                                    onChangeText={celular => this.setState({ celular })}
                                    underlineColorAndroid={isFocused ? BLUE : LIGHT_GRAY}
                                    onFocus={this.handleFocus}
                                    onBlur={this.handleBlur}
                                    keyboardType={'numeric'}
                                    value={this.state.celular}
                                />
                            </View>

                            <View style={{ flexDirection: 'row' }}>
                                <View style={styles.buttons}>
                                    <Button
                                        bordered
                                        success
                                        style={{ paddingHorizontal: '5%' }}
                                        onPress={() => {
                                            this.actualizarDatos();
                                            Toast.show({
                                                text: "Datos personales actualizados.",
                                                buttonText: "Aceptar",
                                                duration: 3000,
                                                position: "bottom",
                                                type: "success",
                                                onClose : this.onToastClosed.bind(this)
                                            })
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
                                            this.props.navigation.dispatch(navigateAction);
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
        marginHorizontal: '2%',
        marginVertical: '9%',
        flexDirection: 'column',
        flex: 1
    },
    spinnerTextStyle: {
        fontSize: 20,
        fontWeight: 'normal',
        color: '#FFF'
    },
    picker: {
        width: '92%',
        fontSize: 18,
        marginTop: '5%',
        alignItems: 'flex-start'
    },
    textInput: {
        width: '80%',
        fontSize: 16,
        alignItems: 'flex-start',
        marginTop: '5%'
    },
    buttons: {
        alignItems: 'center',
        justifyContent: 'center',
        width: '45%',
        marginTop: '6%'
    },
    datetime: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginTop: '10%',
        width: '85%'
    },
    viewContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '85%'
    },
    textLabel: {
        alignSelf: 'center',
        color: '#8F8787',
        marginRight: '7%',
        marginTop: '5%'
    }
});

export default MiPerfil;

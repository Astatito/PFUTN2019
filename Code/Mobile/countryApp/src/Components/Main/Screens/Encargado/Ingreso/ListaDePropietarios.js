import React, { Component } from 'react';
import { FlatList, Alert, StyleSheet, View } from 'react-native';
import { ListItem, Left, Body, Text, Thumbnail, Root, Toast, Button } from 'native-base';
import Swipeout from 'react-native-swipeout';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { LocalStorage } from '../../../../DataBase/Storage';
import { Database } from '../../../../DataBase/Firebase';
import Spinner from 'react-native-loading-spinner-overlay';

var datosInvitado = {};
let selectedItem = []

class FlatListItem extends Component {
    state = { showSpinner: false, isSelected: false };

    componentWillMount() {
        this.setState({ usuario: this.props.usuario });
    }

    render() {
        const swipeOutSettings = {
            style: { backgroundColor: '#fff' },
            rowId: this.props.index,
            sectionId: 1,
        };

        if (this.state.isSelected == false) {
            return (
                <Swipeout {...swipeOutSettings}>
                    <ListItem
                        avatar
                        onPress={() => {
                            if (selectedItem.includes(this.props.item)) {
                                let index = selectedItem.indexOf(this.props.item);
                                selectedItem.splice(index, 1);
                                this.setState({ isSelected: false });
                            } else {
                                selectedItem.push(this.props.item);
                                this.setState({ isSelected: true });
                            }
                        }}>
                        <Left>
                            <Thumbnail source={require('../../../../../assets/Images/invitado.jpg')} />
                        </Left>
                        <Body style={{ alignSelf: 'center' }}>
                            <Text></Text>
                            <Text style={{ fontSize: 14 }}> {this.props.item.nombre + ' ' + this.props.item.apellido} </Text>
                        </Body>
                    </ListItem>
                </Swipeout>
            );
        } else {
            return (
                <Swipeout {...swipeOutSettings}>
                    <ListItem
                        avatar
                        onPress={() => {
                            if (selectedItem.includes(this.props.item)) {
                                let index = selectedItem.indexOf(this.props.item);
                                selectedItem.splice(index, 1);
                                this.setState({ isSelected: false });
                            } else {
                                selectedItem.push(this.props.item);
                                this.setState({ isSelected: true });
                            }
                        }}>
                        <Left>
                            <Thumbnail source={require('../../../../../assets/Images/check-azul.png')} />
                        </Left>
                        <Body style={{ alignSelf: 'center' }}>
                            <Text></Text>
                            <Text style={{ fontSize: 14 }}> {this.props.item.nombre + ' ' + this.props.item.apellido} </Text>
                        </Body>
                    </ListItem>
                </Swipeout>
            );
        }
    }
}

export default class BasicFlatList extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            title: 'Propietarios',
            headerLeft: <Icon style={{ paddingLeft: 10 }} onPress={() => navigation.goBack()} name="arrow-back" size={30} />,
        };
    };

    constructor(props) {
        super(props);
        state = { flatListData: [] };
    }

    componentDidMount() {
        setInterval(() => {
            this.setState({
                showSpinner: false,
            });
        }, 3000);
    }

    onToastClosed = (reason) => {
        this.props.navigation.navigate('Ingreso');
        selectedItem = []
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
        try {
            await refNotificaciones.add(notificacion);
        } catch (error) {
            Toast.show({
                text: 'Lo siento, ocurrió un error inesperado.',
                buttonText: 'Aceptar',
                duration: 3000,
                position: 'bottom',
                type: 'danger',
            });
        }
    };

    grabarIngreso = async (invitado, idPropietario) => {
        try {
            var refCountry = Database.collection('Country').doc(this.state.usuario.country);
            var refIngresos = refCountry.collection('Ingresos');
            var ingreso = {
                Nombre: invitado.nombre,
                Apellido: invitado.apellido,
                Documento: invitado.numeroDoc,
                TipoDocumento: Database.doc('TipoDocumento/' + invitado.tipoDoc),
                Descripcion: '',
                Egreso: true,
                Estado: true,
                Fecha: new Date(),
                IdEncargado: Database.doc('Country/' + this.state.usuario.country + '/Encargados/' + this.state.usuario.datos),
                IdPropietario: Database.doc('Country/' + this.state.usuario.country + '/Propietarios/' + idPropietario),
            };
            this.generarNotificacionIngreso(idPropietario, invitado.nombre, invitado.apellido);
            await refIngresos.add(ingreso);
            return 0;
        } catch (error) {
            console.log(error);
            return 1;
        } finally {
            this.setState({ showSpinner: false })
        }
    };

    componentWillMount() {
        this.setState({ showSpinner: true });

        const { navigation } = this.props;
        datosInvitado = navigation.getParam('invitado');
        const propietarios = navigation.getParam('propietarios');
        this.setState({ propietarios });

        LocalStorage.load({
            key: 'UsuarioLogueado',
        })
            .then((response) => {
                this.setState({ usuario: response });
                this.obtenerPropietarios(this.state.propietarios);
            })
            .catch((error) => {
                this.setState({ showSpinner: false });
                Toast.show({
                    text: 'La key solicitada no existe.',
                    buttonText: 'Aceptar',
                    duration: 3000,
                    position: 'bottom',
                    type: 'danger',
                });
            });
    }

    obtenerPropietarios = async (propietarios) => {
        var refCountry = Database.collection('Country').doc(this.state.usuario.country);
        var refPropietarios = refCountry.collection('Propietarios');
        //Reemplazar por la lógica que corresponda.
        var tempArray = [];
        try {
            for (const key of propietarios) {
                prop = await refPropietarios.doc(key).get();
                var aux = {
                    key: key,
                    nombre: prop.data().Nombre,
                    apellido: prop.data().Apellido,
                };
                tempArray.push(aux);
            }
            this.setState({ flatListData: tempArray , showSpinner: false});   
        } catch (error) {
            Toast.show({
                text: 'Lo siento, ocurrió un error inesperado.',
                buttonText: 'Aceptar',
                duration: 3000,
                position: 'bottom',
                type: 'danger',
            });
        }
    };

    render() {
        if (this.state.flatListData && this.state.flatListData.length == 0) {
            return (
                <Root>
                    <View>
                        <Text style={styles.textDefault}> No hay propietarios para mostrar. </Text>
                    </View>
                </Root>
            );
        } else {
            return (
                <Root>
                    <View>
                        <Spinner visible={this.state.showSpinner} textContent={'Loading...'} textStyle={styles.spinnerTextStyle} />
                        <FlatList
                            data={this.state.flatListData}
                            renderItem={({ item, index }) => {
                                return (
                                    <FlatListItem
                                        navigation={this.props.navigation}
                                        usuario={this.state.usuario}
                                        item={item}
                                        index={index}
                                        parentFlatList={this}></FlatListItem>
                                );
                            }}></FlatList>
                        <View style={{ flexDirection: 'row' , alignContent:'space-between', justifyContent: 'center',}}>
                            <View style={styles.buttons}>
                                <Button
                                    bordered
                                    success
                                    disabled={this.state.showSpinner}
                                    style={{ paddingHorizontal: '5%' }}
                                    onPress={async () => {
                                        this.setState({ showSpinner: true }, async () => {
                                            if (selectedItem.length !== 1) {
                                                Toast.show({
                                                    text: 'Debe seleccionar un propietario.',
                                                    buttonText: 'Aceptar',
                                                    duration: 3000,
                                                    position: 'bottom',
                                                    type: 'warning'
                                                });
                                                this.setState({ showSpinner: false })
                                                return
                                            }
                                            const result = await this.grabarIngreso(datosInvitado, selectedItem[0].key);
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
                                        this.props.navigation.goBack()
                                    }}>
                                    <Text>Cancelar</Text>
                                </Button>
                            </View>
                        </View>
                    </View>
                </Root>
            );
        }
    }
}

const styles = StyleSheet.create({
    spinnerTextStyle: {
        fontSize: 20,
        fontWeight: 'normal',
        color: '#FFF',
    },
    textDefault: {
        marginTop: '65%',
        textAlign: 'center',
        fontSize: 14,
        color: '#8F8787',
        fontWeight: 'normal',
        fontStyle: 'normal',
    },
    buttons: {
        alignItems: 'center',
        justifyContent: 'center',
        width: '40%',
        marginTop: '7%',
    }
});

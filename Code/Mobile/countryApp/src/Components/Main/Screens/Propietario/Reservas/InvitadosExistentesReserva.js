import React, { Component } from 'react';
import { FlatList, Alert, StyleSheet, View } from 'react-native';
import { ListItem, Left, Body, Text, Right, Thumbnail, Button, Content, Toast, Root } from 'native-base';
import Swipeout from 'react-native-swipeout';
import { LocalStorage } from '../../../../DataBase/Storage';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Database } from '../../../../DataBase/Firebase';
import moment from 'moment';
import Spinner from 'react-native-loading-spinner-overlay';

let selectedItems = [];

class FlatListItem extends Component {
    state = { showSpinner: false, isSelected: false };

    componentWillMount() {
        // TODO: ESTO NO DEBERÍA HACERSE EN CADA ITEM DEL FLATLIST, ES PROVISORIO!!!!!
        LocalStorage.load({
            key: 'UsuarioLogueado'
        })
            .then(response => {
                this.setState({ usuario: response });
            })
            .catch(error => {
                Toast.show({
                    text: "La key solicitada no existe.",
                    buttonText: "Aceptar",
                    duration: 3000,
                    position: "bottom",
                    type: "danger",
                })
            });
    }

    render() {
        const swipeOutSettings = {
            style: { backgroundColor: '#fff' }
        };

        if (this.props.item.nombre == null && this.props.item.apellido == null && this.state.isSelected == false) {
            return (
                <Swipeout {...swipeOutSettings}>
                    <ListItem
                        avatar
                        onPress={() => {
                            if (selectedItems.includes(this.props.item)) {
                                let index = selectedItems.indexOf(this.props.item);
                                selectedItems.splice(index, 1);
                                this.setState({ isSelected: false });
                            } else {
                                selectedItems.push(this.props.item);
                                this.setState({ isSelected: true });
                            }
                        }}>
                        <Left>
                            <Thumbnail source={require('../../../../../assets/Images/invitado.jpg')} />
                        </Left>
                        <Body style={{ alignSelf: 'center', marginTop: '2.7%' }}>
                            <Text style={{ fontSize: 14 }}> {this.props.item.documento} </Text>
                        </Body>
                        <Right style={{ alignSelf: 'center' }}>
                            <Text style={{ fontSize: 11, color: 'gray' }}> {this.props.item.fechaDesde} </Text>
                            <Text style={{ fontSize: 11, color: 'gray' }}> {this.props.item.fechaHasta} </Text>
                        </Right>
                    </ListItem>
                </Swipeout>
            );
        } else if (this.props.item.nombre == null && this.props.item.apellido == null && this.state.isSelected == true) {
            return (
                <Swipeout {...swipeOutSettings}>
                    <ListItem
                        avatar
                        onPress={() => {
                            if (selectedItems.includes(this.props.item)) {
                                let index = selectedItems.indexOf(this.props.item);
                                selectedItems.splice(index, 1);
                                this.setState({ isSelected: false });
                            } else {
                                selectedItems.push(this.props.item);
                                this.setState({ isSelected: true });
                            }
                        }}>
                        <Left>
                            <Thumbnail source={require('../../../../../assets/Images/check-azul.png')} />
                        </Left>
                        <Body style={{ alignSelf: 'center', marginTop: '2.7%' }}>
                            <Text style={{ fontSize: 14 }}> {this.props.item.documento} </Text>
                        </Body>
                        <Right style={{ alignSelf: 'center' }}>
                            <Text style={{ fontSize: 11, color: 'gray' }}> {this.props.item.fechaDesde} </Text>
                            <Text style={{ fontSize: 11, color: 'gray' }}> {this.props.item.fechaHasta} </Text>
                        </Right>
                    </ListItem>
                </Swipeout>
            );
        } else if (this.state.isSelected == false) {
            return (
                <Swipeout {...swipeOutSettings}>
                    <ListItem
                        avatar
                        onPress={() => {
                            if (selectedItems.includes(this.props.item)) {
                                let index = selectedItems.indexOf(this.props.item);
                                selectedItems.splice(index, 1);
                                this.setState({ isSelected: false });
                            } else {
                                selectedItems.push(this.props.item);
                                this.setState({ isSelected: true });
                            }
                        }}>
                        <Left>
                            <Thumbnail source={require('../../../../../assets/Images/invitado.jpg')} />
                        </Left>
                        <Body style={{ alignSelf: 'center' }}>
                            <Text style={{ fontSize: 14 }}> {this.props.item.nombre + ' ' + this.props.item.apellido} </Text>
                            <Text style={{ fontSize: 14 }}> {this.props.item.documento} </Text>
                        </Body>
                        <Right style={{ alignSelf: 'center', marginTop: '2.4%' }}>
                            <Text style={{ fontSize: 11, color: 'gray' }}> {this.props.item.fechaDesde} </Text>
                            <Text style={{ fontSize: 11, color: 'gray' }}> {this.props.item.fechaHasta} </Text>
                        </Right>
                    </ListItem>
                </Swipeout>
            );
        } else {
            return (
                <Swipeout {...swipeOutSettings}>
                    <ListItem
                        avatar
                        onPress={() => {
                            if (selectedItems.includes(this.props.item)) {
                                let index = selectedItems.indexOf(this.props.item);
                                selectedItems.splice(index, 1);
                                this.setState({ isSelected: false });
                            } else {
                                selectedItems.push(this.props.item);
                                this.setState({ isSelected: true });
                            }
                        }}>
                        <Left>
                            <Thumbnail source={require('../../../../../assets/Images/check-azul.png')} />
                        </Left>
                        <Body style={{ alignSelf: 'center' }}>
                            <Text style={{ fontSize: 14 }}> {this.props.item.nombre + ' ' + this.props.item.apellido} </Text>
                            <Text style={{ fontSize: 14 }}> {this.props.item.documento} </Text>
                        </Body>
                        <Right style={{ alignSelf: 'center', marginTop: '2.4%' }}>
                            <Text style={{ fontSize: 11, color: 'gray' }}> {this.props.item.fechaDesde} </Text>
                            <Text style={{ fontSize: 11, color: 'gray' }}> {this.props.item.fechaHasta} </Text>
                        </Right>
                    </ListItem>
                </Swipeout>
            );
        }
    }
}

export default class BasicFlatList extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            title: 'Invitados personales',
            headerLeft: <Icon style={{ paddingLeft: 10 }} onPress={() => navigation.goBack()} name="arrow-back" size={30} />,
            headerRight: <View />
        };
    };

    constructor(props) {
        super(props);
        state = { flatListData: [], invitadosReserva: [], idReserva: '' };
    }

    componentDidMount() {
        setInterval(() => {
            this.setState({
                showSpinner: false
            });
        }, 3000);
    }

    componentWillMount() {
        selectedItems = [];
        const { navigation } = this.props;
        const reserva = navigation.getParam('reserva');
        this.setState({ showSpinner: true, idReserva: reserva });
        LocalStorage.load({
            key: 'UsuarioLogueado'
        })
            .then(response => {
                this.setState({ usuario: response });
                this.obtenerInvitaciones();
                this.obtenerInvitadosReserva();
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

    obtenerInvitaciones = () => {
        var refCountry = Database.collection('Country').doc(this.state.usuario.country);
        var refInvitados = refCountry.collection('Invitados');

        refInvitados
            .where(
                'IdPropietario',
                '==',
                Database.doc('Country/' + this.state.usuario.country + '/Propietarios/' + this.state.usuario.datos)
            )
            .get()
            .then(snapshot => {
                if (!snapshot.empty) {
                    //El propietario tiene invitaciones
                    var tempArray = [];
                    for (var i = 0; i < snapshot.docs.length; i++) {
                        if (snapshot.docs[i].data().Nombre != '') {
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
                    }
                    this.setState({ showSpinner: false, flatListData: tempArray });
                } else {
                    this.setState({ showSpinner: false, flatListData: [] });
                }
            })
            .catch(error => {
                this.setState({ showSpinner: false });
                Toast.show({
                    text: "No se pudo traer las invitaciones.",
                    buttonText: "Aceptar",
                    duration: 3000,
                    position: "bottom",
                    type: "danger",
                })
            });
    };

    onToastClosed = reason => {
        this.props.navigation.goBack();
    };

    obtenerInvitadosReserva = () => {
        var refCountry = Database.collection('Country').doc(this.state.usuario.country);
        var refPropietario = refCountry.collection('Propietarios').doc(this.state.usuario.datos);
        var refReserva = refPropietario.collection('Reservas').doc(this.state.idReserva);
        var refInvitados = refReserva.collection('Invitados');

        refInvitados.onSnapshot(snapshot => {
            if (!snapshot.empty) {
                //El propietario tiene invitaciones
                var tempArray = [];
                for (var i = 0; i < snapshot.docs.length; i++) {
                    var invitado = {
                        key: snapshot.docs[i].id,
                        nombre: snapshot.docs[i].data().Nombre,
                        apellido: snapshot.docs[i].data().Apellido,
                        estado: snapshot.docs[i].data().Estado,
                        documento: snapshot.docs[i].data().Documento,
                        tipoDocumento: snapshot.docs[i].data().TipoDocumento.id,
                        reserva: this.state.idReserva
                    };
                    tempArray.push(invitado);
                }
                tempArray.sort((a, b) => a.estado - b.estado);
                this.setState({ invitadosReserva: tempArray });
            } else {
                this.setState({ invitadosReserva: tempArray });
            }
        });
    };

    agregarInvitados = async () => {
        var refCountry = Database.collection('Country').doc(this.state.usuario.country);
        var refPropietario = refCountry.collection('Propietarios').doc(this.state.usuario.datos);
        var refReserva = refPropietario.collection('Reservas').doc(this.state.idReserva); //TODO: REEMPLAZAR EL ID POR THIS.STATE.RESERVA
        var refInvitados = refReserva.collection('Invitados');
        var alMenosUnInvitado = false;
        try {
            for (var i = 0; i < selectedItems.length; i++) {
                var nuevoInvitado = {
                    Nombre: selectedItems[i].nombre,
                    Apellido: selectedItems[i].apellido,
                    Documento: selectedItems[i].documento,
                    TipoDocumento: Database.doc('TipoDocumento/' + selectedItems[i].tipoDocumento),
                    Estado: true,
                    IdInvitado: selectedItems[i].key
                };
                if (this.state.invitadosReserva) {
                    if (
                        !this.state.invitadosReserva.find(
                            inv => inv.tipoDocumento == nuevoInvitado.TipoDocumento.id && inv.documento == nuevoInvitado.Documento
                        )
                    ) {
                        alMenosUnInvitado = true;
                        await refInvitados.add(nuevoInvitado);
                    }
                } else {
                    //La lista está vacía. Entonces no hay invitados, agregamos a todos los que seleccione.
                    alMenosUnInvitado = true;
                    await refInvitados.add(nuevoInvitado);
                }
                // TODO: FALTA DEFINIR LA LÓGICA PARA GESTIONAR LAS AUTORIZACIONES
            }
            if (alMenosUnInvitado == true) {
                return 0;
            } else {
                return 1;
            }
        } catch (error) {
            return 2
        } finally {
            this.setState({ showSpinner: false })
        }
    };

    isFlatListItemSelected = ({ item, index }) => {
        return <FlatListItem navigation={this.props.navigation} item={item} index={index} parentFlatList={this}></FlatListItem>;
    };

    render() {
        return (
            <Root>
                <Content>
                    <View>
                        <Spinner visible={this.state.showSpinner} textContent={'Loading...'} textStyle={styles.spinnerTextStyle} />
                        <FlatList
                            data={this.state.flatListData}
                            renderItem={({ item, index }) => {
                                return (
                                    <FlatListItem
                                        navigation={this.props.navigation}
                                        item={item}
                                        index={index}
                                        isSelected={false}
                                        parentFlatList={this}></FlatListItem>
                                );
                            }}></FlatList>
                        <View style={{ flexDirection: 'row', marginLeft: '10%' }}>
                            <View style={styles.buttons}>
                                <Button
                                    bordered
                                    success
                                    style={{ paddingHorizontal: '12%' }}
                                    onPress={() => {
                                        this.setState({ showSpinner: true }, async () => {
                                            const result = await this.agregarInvitados()
                                            if (result == 0) {
                                                Toast.show({
                                                    text: "Invitado añadido exitosamente.",
                                                    buttonText: "Aceptar",
                                                    duration: 3000,
                                                    position: "bottom",
                                                    type: "success",
                                                    onClose : this.onToastClosed.bind(this)
                                                })
                                            } else if (result == 1) {
                                                Toast.show({
                                                    text: 'Los invitados ya están en la lista.',
                                                    buttonText: 'Aceptar',
                                                    duration: 3000,
                                                    position: 'bottom',
                                                    type: 'warning',
                                                    onClose: this.onToastClosed.bind(this)
                                                });
                                            } else if (result == 2) {
                                                Toast.show({
                                                    text: "Lo siento, ocurrió un error inesperado.",
                                                    buttonText: "Aceptar",
                                                    duration: 3000,
                                                    position: "bottom",
                                                    type: "danger",
                                                    onClose : this.onToastClosed.bind(this)
                                                })
                                            }
                                        });
                                    }}>
                                    <Text>Añadir</Text>
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
    spinnerTextStyle: {
        fontSize: 20,
        fontWeight: 'normal',
        color: '#FFF'
    },
    buttons: {
        alignItems: 'center',
        justifyContent: 'center',
        width: '45%',
        marginVertical: '5%'
    }
});

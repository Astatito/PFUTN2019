import React, { Component } from 'react';
import { FlatList, StyleSheet, View, Alert } from 'react-native';
import { ListItem, Left, Body, Text, Thumbnail, Toast, Root } from 'native-base';
import Swipeout from 'react-native-swipeout';
import { LocalStorage } from '../../../../DataBase/Storage';
import { Database } from '../../../../DataBase/Firebase';
import Spinner from 'react-native-loading-spinner-overlay';
import IconEntypo from 'react-native-vector-icons/Entypo';
import IconAntDesign from 'react-native-vector-icons/AntDesign';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Share from 'react-native-share';

class FlatListItem extends Component {
    state = { activeRowKey: null, showSpinner: false };

    componentWillMount() {
        this.setState({ usuario: this.props.usuario });
    }

    descartarInvitado = async (invitado) => {
        var refCountry = Database.collection('Country').doc(this.state.usuario.country);
        console.log(invitado);
        // TODO: Tanto la eliminacion de la autorización como el invitado de la reserva forman parte de una transaccion
        if (invitado.estado == true) {
            // Elimina la autorización para ingresar
            var refInvitacionesEventos = refCountry.collection('InvitacionesEventos');
            var snapshot = await refInvitacionesEventos
                .where('Documento', '==', invitado.documento)
                .where('TipoDocumento', '==', Database.doc('TipoDocumento/' + invitado.tipoDocumento))
                .where('IdReserva', '==', Database.doc(invitado.reserva.idReservaServicio))
                .get();
            var refInvitacion = refInvitacionesEventos.doc(snapshot.docs[0].id);
            await refInvitacion.delete();
        }

        // Elimina el invitado de la reserva
        var refPropietario = refCountry.collection('Propietarios').doc(this.state.usuario.datos);
        var refReserva = refPropietario.collection('Reservas').doc(invitado.reserva.key);
        var refInvitado = refReserva.collection('Invitados').doc(invitado.key);
        try {
            await refInvitado.delete();
            return 0;
        } catch (error) {
            return 1;
        }
    };

    confirmarInvitado = async (invitado) => {
        var refCountry = Database.collection('Country').doc(this.state.usuario.country);

        // TODO: Tanto la invitacion al evento como el update del estado forman parte de una transaccion
        var refInvitados = refCountry.collection('Invitados');
        var snapshot = await refInvitados
            .where('Documento', '==', invitado.documento)
            .where('TipoDocumento', '==', Database.doc('TipoDocumento/' + invitado.tipoDocumento))
            .get();

        if (snapshot.empty) {
            var nuevoInvitado = {
                Nombre: '',
                Apellido: '',
                Estado: false,
                FechaAlta: new Date(),
                FechaDesde: new Date(),
                FechaHasta: new Date(),
                Grupo: '',
                IdPropietario: Database.doc('Country/' + this.state.usuario.country + '/Propietarios/' + this.state.usuario.datos),
                Documento: invitado.documento,
                TipoDocumento: Database.doc('TipoDocumento/' + invitado.tipoDocumento),
            };

            refInvitados.add(nuevoInvitado);
        }

        // Crea la invitación al evento
        var refInvitacionesEventos = refCountry.collection('InvitacionesEventos');
        var invitacionEvento = {
            Documento: invitado.documento,
            FechaDesde: invitado.reserva.fechaDesde.subtract(30, 'minutes').toDate(),
            FechaHasta: invitado.reserva.fechaHasta.add(30, 'minutes').toDate(),
            TipoDocumento: Database.doc('TipoDocumento/' + invitado.tipoDocumento),
            IdReserva: Database.doc(invitado.reserva.idReservaServicio),
        };
        await refInvitacionesEventos.add(invitacionEvento);

        // Actualiza el estado del invitado a la reserva
        var refPropietario = refCountry.collection('Propietarios').doc(this.state.usuario.datos);
        var refReserva = refPropietario.collection('Reservas').doc(invitado.reserva.key);
        var refInvitado = refReserva.collection('Invitados').doc(invitado.key);
        try {
            await refInvitado.set(
                {
                    Estado: true,
                },
                { merge: true }
            );
            return 0;
        } catch (error) {
            return 1;
        }
    };

    render() {
        const swipeOutSettingsConfirmado = {
            autoClose: true,
            style: { backgroundColor: '#fff' },
            onClose: (secId, rowId, direction) => {
                if (this.state.activeRowKey != null) {
                    this.setState({ activeRowKey: null });
                }
            },
            onOpen: (secId, rowId, direction) => {
                this.setState({ activeRowKey: this.props.item.key });
            },
            right: [
                {
                    text: 'Descartar',
                    type: 'delete',
                    onPress: () => {
                        Alert.alert(
                            'Atención',
                            '¿ Está seguro que desea eliminar la invitación ?',
                            [
                                { text: 'Cancelar', onPress: () => console.log('Cancel pressed'), style: 'cancel' },
                                {
                                    text: 'Aceptar',
                                    onPress: async () => {
                                        const result = await this.descartarInvitado(this.props.item);
                                        if (result == 0) {
                                            Toast.show({
                                                text: 'Invitación eliminada exitosamente.',
                                                buttonText: 'Aceptar',
                                                duration: 3000,
                                                position: 'bottom',
                                                type: 'success',
                                            });
                                        } else if (result == 1) {
                                            Toast.show({
                                                text: 'Lo siento, ocurrió un error inesperado.',
                                                buttonText: 'Aceptar',
                                                duration: 3000,
                                                position: 'bottom',
                                                type: 'danger',
                                            });
                                        }
                                    },
                                },
                            ],
                            { cancelable: true }
                        );
                    },
                },
            ],
            rowId: this.props.index,
            sectionId: 1,
        };
        const swipeOutSettingsPendiente = {
            autoClose: true,
            style: { backgroundColor: '#fff' },
            onClose: (secId, rowId, direction) => {
                if (this.state.activeRowKey != null) {
                    this.setState({ activeRowKey: null });
                }
            },
            onOpen: (secId, rowId, direction) => {
                this.setState({ activeRowKey: this.props.item.key });
            },
            left: [
                {
                    text: 'Confirmar',
                    type: 'primary',
                    onPress: () => {
                        Alert.alert(
                            'Atención',
                            '¿ Está seguro que desea confirmar el invitado ?',
                            [
                                { text: 'Cancelar', onPress: () => console.log('Cancel pressed'), style: 'cancel' },
                                {
                                    text: 'Aceptar',
                                    onPress: async () => {
                                        const result = await this.confirmarInvitado(this.props.item);
                                        if (result == 0) {
                                            Toast.show({
                                                text: 'Invitación confirmada exitosamente.',
                                                buttonText: 'Aceptar',
                                                duration: 3000,
                                                position: 'bottom',
                                                type: 'success',
                                            });
                                        } else if (result == 1) {
                                            Toast.show({
                                                text: 'Lo siento, ocurrió un error inesperado.',
                                                buttonText: 'Aceptar',
                                                duration: 3000,
                                                position: 'bottom',
                                                type: 'danger',
                                            });
                                        }
                                    },
                                },
                            ],
                            { cancelable: true }
                        );
                    },
                },
            ],
            right: [
                {
                    text: 'Descartar',
                    type: 'delete',
                    onPress: () => {
                        Alert.alert(
                            'Atención',
                            '¿ Está seguro que desea eliminar la invitación ?',
                            [
                                { text: 'Cancelar', onPress: () => console.log('Cancel pressed'), style: 'cancel' },
                                {
                                    text: 'Aceptar',
                                    onPress: async () => {
                                        const result = await this.descartarInvitado(this.props.item);
                                        if (result == 0) {
                                            Toast.show({
                                                text: 'Invitación eliminada exitosamente.',
                                                buttonText: 'Aceptar',
                                                duration: 3000,
                                                position: 'bottom',
                                                type: 'success',
                                            });
                                        } else if (result == 1) {
                                            Toast.show({
                                                text: 'Lo siento, ocurrió un error inesperado.',
                                                buttonText: 'Aceptar',
                                                duration: 3000,
                                                position: 'bottom',
                                                type: 'danger',
                                            });
                                        }
                                    },
                                },
                            ],
                            { cancelable: true }
                        );
                    },
                },
            ],
            rowId: this.props.index,
            sectionId: 1,
        };

        if (this.props.item.estado == false) {
            return (
                <Swipeout {...swipeOutSettingsPendiente}>
                    <ListItem avatar>
                        <Left>
                            <Thumbnail source={require('../../../../../assets/Images/invitado.jpg')} />
                        </Left>
                        <Body style={{ alignSelf: 'center' }}>
                            <Text style={{ fontSize: 14 }}> {this.props.item.nombre + ' ' + this.props.item.apellido} </Text>
                            <Text style={{ fontSize: 14 }}> {this.props.item.documento} </Text>
                        </Body>
                    </ListItem>
                </Swipeout>
            );
        } else {
            return (
                <Swipeout {...swipeOutSettingsConfirmado}>
                    <ListItem avatar>
                        <Left>
                            <Thumbnail source={require('../../../../../assets/Images/confirmar.jpg')} />
                        </Left>
                        <Body style={{ alignSelf: 'center' }}>
                            <Text style={{ fontSize: 14 }}> {this.props.item.nombre + ' ' + this.props.item.apellido} </Text>
                            <Text style={{ fontSize: 14 }}> {this.props.item.documento} </Text>
                        </Body>
                    </ListItem>
                </Swipeout>
            );
        }
    }
}

export default class BasicFlatList extends Component {
    state = { usuario: null, reserva: null };
    idCountry = '';
    idPropietario = '';
    Reserva = {};

    componentDidMount() {
        setInterval(() => {
            this.setState({
                showSpinner: false,
            });
        }, 3000);
        this.obtenerInvitaciones();
        this.createListeners();
    }

    componentWillMount() {
        this.setState({ showSpinner: true });

        const { navigation } = this.props;
        const usuario = navigation.dangerouslyGetParent().getParam('usuario');
        const reserva = navigation.dangerouslyGetParent().getParam('reserva');

        idCountry = usuario.country;
        idPropietario = usuario.datos;
        idReserva = reserva.key;
        Reserva = reserva;

        this.setState({
            usuario: usuario,
            reserva: reserva,
        });
    }

    componentWillUnmount() {
        this._unsubscribeSnapshot.remove();
        this._subscribeSnapshot.remove();
    }

    static navigationOptions = ({ navigation }) => {
        return {
            title: 'Invitados',
            headerLeft: <Icon style={{ paddingLeft: 10 }} onPress={() => navigation.goBack(null)} name="arrow-back" size={30} />,
            headerRight: (
                <View style={styles.iconContainer}>
                    <IconEntypo
                        style={{ paddingRight: 15 }}
                        name="share"
                        size={23}
                        onPress={() => {
                            let link = 'http://livesafe.com.ar/invitado/' + idCountry + '/' + idPropietario + '/' + idReserva;
                            let shareOptions = {
                                title: 'Compartir',
                                message:
                                    'Hola! Te envío la invitación para mi evento. Por favor, completa tus datos en el siguiente link: ' +
                                    link,
                                subject: 'Invitación a mi evento',
                            };
                            Share.open(shareOptions);
                        }}
                    />
                    <IconAntDesign
                        style={{ paddingRight: 10 }}
                        name="plus"
                        size={25}
                        onPress={() => navigation.navigate('InvitadosExistentesReserva', { reserva: Reserva })}
                    />
                </View>
            ),
            headerStyle: {
                backgroundColor: '#1e90ff',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
                textAlign: 'center',
                flex: 1,
            },
        };
    };

    constructor(props) {
        super(props);
        state = { flatListData: [] };
    }

    createListeners() {
        this._subscribeSnapshot = this.props.navigation.addListener('didFocus', () => {
            this.obtenerInvitaciones();
        });

        this._unsubscribeSnapshot = this.props.navigation.addListener('didBlur', () => {
            this.snapshotInvitados();
        });
    }

    obtenerInvitaciones = () => {
        var refCountry = Database.collection('Country').doc(this.state.usuario.country);
        var refPropietario = refCountry.collection('Propietarios').doc(this.state.usuario.datos);
        var refReserva = refPropietario.collection('Reservas').doc(this.state.reserva.key);
        var refInvitados = refReserva.collection('Invitados');

        this.snapshotInvitados = refInvitados.onSnapshot((snapshot) => {
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
                        reserva: this.state.reserva,
                    };
                    tempArray.push(invitado);
                }
                tempArray.sort((a, b) => a.estado - b.estado);
                this.setState({ showSpinner: false, flatListData: tempArray });
            } else {
                this.setState({ showSpinner: false, flatListData: [] });
            }
        });
    };

    render() {
        if (this.state.flatListData && this.state.flatListData.length == 0) {
            return (
                <Root>
                    <View>
                        <Text style={styles.textDefault}>Aún no hay invitados en esta reserva. </Text>
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
    iconContainer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        width: 100,
    },
});

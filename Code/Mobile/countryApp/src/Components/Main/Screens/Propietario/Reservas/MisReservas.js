import React, { Component } from 'react';
import { FlatList, Alert, StyleSheet, View } from 'react-native';
import { ListItem, Left, Body, Text, Right, Thumbnail, Root, Toast } from 'native-base';
import Swipeout from 'react-native-swipeout';
import { LocalStorage } from '../../../../DataBase/Storage';
import { Database } from '../../../../DataBase/Firebase';
import moment from 'moment';
import Spinner from 'react-native-loading-spinner-overlay';

class FlatListItem extends Component {
    state = { activeRowKey: null, showSpinner: false };

    componentWillMount() {
        this.setState({ usuario: this.props.usuario });
    }

    eliminarReserva = async (reserva) => {
        var refReservaPropietario = Database.doc(
            'Country/' + this.state.usuario.country + '/Propietarios/' + this.state.usuario.datos + '/Reservas/' + reserva.key
        );
        var refReservaServicio = Database.doc(reserva.idReservaServicio);
        try {
            await refReservaPropietario.set({ Cancelado: true }, { merge: true });
            await refReservaServicio.set({ Cancelado: true }, { merge: true });
            return 0;
        } catch (error) {
            return 1;
        }
    };

    render() {
        const swipeOutSettings = {
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
                    text: 'Eliminar',
                    type: 'delete',
                    onPress: () => {
                        Alert.alert(
                            'Atención',
                            '¿ Está seguro que desea eliminar la reserva ? ',
                            [
                                { text: 'Cancelar', onPress: () => console.log('Cancel pressed'), style: 'cancel' },
                                {
                                    text: 'Aceptar',
                                    onPress: async () => {
                                        const result = await this.eliminarReserva(this.props.item);
                                        if (result == 0) {
                                            Toast.show({
                                                text: 'Reserva eliminada exitosamente.',
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

        return (
            <Swipeout {...swipeOutSettings}>
                <ListItem
                    avatar
                    onPress={() => {
                        Alert.alert(
                            'Atención',
                            '¿ Desea modificar esta reserva ? ',
                            [
                                { text: 'Cancelar', onPress: () => console.log('Cancel pressed'), style: 'cancel' },
                                {
                                    text: 'Aceptar',
                                    onPress: () => {
                                        this.props.navigation.navigate('InformacionReserva', {
                                            usuario: this.state.usuario,
                                            reserva: this.props.item,
                                        });
                                    },
                                },
                            ],
                            { cancelable: true }
                        );
                    }}>
                    <Left>
                        <Thumbnail source={require('../../../../../assets/Images/reservas.png')} />
                    </Left>
                    <Body style={{ alignSelf: 'center' }}>
                        <Text style={{ fontSize: 14 }}> {this.props.item.nombre} </Text>
                        <Text style={{ fontSize: 11, color: 'gray' }}> {this.props.item.servicio} </Text>
                    </Body>
                    <Right style={{ alignSelf: 'center', marginTop: '1.3%' }}>
                        <Text style={{ fontSize: 11, color: 'gray' }}> {this.props.item.fechaDesde.format('D/M/YYYY HH:mm')} </Text>
                        <Text style={{ fontSize: 11, color: 'gray' }}> {this.props.item.fechaHasta.format('D/M/YYYY HH:mm')} </Text>
                    </Right>
                </ListItem>
            </Swipeout>
        );
    }
}

export default class BasicFlatList extends Component {
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

    componentWillMount() {
        this.setState({ showSpinner: true });
        LocalStorage.load({
            key: 'UsuarioLogueado',
        })
            .then((response) => {
                this.setState({ usuario: response });
                this.obtenerReservas();
                this.createListeners();
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

    componentWillUnmount() {
        this._unsubscribeSnapshot.remove();
        this._subscribeSnapshot.remove();
    }

    createListeners() {
        this._subscribeSnapshot = this.props.navigation.addListener('didFocus', () => {
            this.obtenerReservas();
        });

        this._unsubscribeSnapshot = this.props.navigation.addListener('didBlur', () => {
            this.snapshotReservas();
        });
    }

    obtenerReservas = () => {
        var refCountry = Database.collection('Country').doc(this.state.usuario.country);
        var refReservas = refCountry.collection('Propietarios').doc(this.state.usuario.datos).collection('Reservas');
        try {
            this.snapshotReservas = refReservas
            .where('Cancelado', '==', false)
            .where('FechaDesde', '>=', new Date())
            .orderBy('FechaDesde')
            .onSnapshot((snapshot) => {
                if (!snapshot.empty) {
                    //El propietario tiene reservas
                    var tempArray = [];
                    for (var i = 0; i < snapshot.docs.length; i++) {
                        var reserva = {
                            key: snapshot.docs[i].id,
                            nombre: snapshot.docs[i].data().Nombre,
                            fechaDesde: moment.unix(snapshot.docs[i].data().FechaDesde.seconds),
                            fechaHasta: moment.unix(snapshot.docs[i].data().FechaHasta.seconds),
                            idReservaServicio: snapshot.docs[i].data().IdReservaServicio.path,
                            servicio: snapshot.docs[i].data().Servicio,
                        };
                        tempArray.push(reserva);
                    }
                    this.setState({ showSpinner: false, flatListData: tempArray });
                } else {
                    this.setState({ showSpinner: false, flatListData: [] });
                }
            });
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
                        <Text style={styles.textDefault}> No hay ninguna reserva activa. </Text>
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
});

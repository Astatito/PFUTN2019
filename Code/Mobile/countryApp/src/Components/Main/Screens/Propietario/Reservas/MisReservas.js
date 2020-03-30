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
        // TODO: ESTO NO DEBERÍA HACERSE EN CADA ITEM DEL FLATLIST, ES PROVISORIO!!!!!
        LocalStorage.load({
            key: 'UsuarioLogueado'
        })
            .then(response => {
                this.setState({ usuario: response });
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

    eliminarReserva = reserva => {
        this.setState({ showSpinner: true });
        var refReservaPropietario = Database.doc(
            'Country/' + this.state.usuario.country + '/Propietarios/' + this.state.usuario.datos + '/Reservas/' + reserva.key
        );
        refReservaPropietario.set({ Cancelado: true }, { merge: true });

        var refReservaServicio = Database.doc(reserva.idReservaServicio);
        refReservaServicio.set({ Cancelado: true }, { merge: true });
        this.setState({ showSpinner: false });
        return 0;
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
                        const deletingRow = this.state.activeRowKey;
                        Alert.alert(
                            'Atención',
                            '¿ Está seguro que desea eliminar la reserva ? ',
                            [
                                { text: 'Cancelar', onPress: () => console.log('Cancel pressed'), style: 'cancel' },
                                {
                                    text: 'Aceptar',
                                    onPress: () => {
                                        if (this.eliminarReserva(this.props.item) == 0) {
                                            Toast.show({
                                                text: 'Reserva eliminada exitosamente.',
                                                buttonText: 'Aceptar',
                                                duration: 3000,
                                                position: 'bottom',
                                                type: 'success'
                                            });
                                        }
                                    }
                                }
                            ],
                            { cancelable: true }
                        );
                    }
                }
            ],
            rowId: this.props.index,
            sectionId: 1
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
                                            reserva: this.props.item
                                        });
                                    }
                                }
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
                        <Text style={{ fontSize: 11, color: 'gray' }}> {this.props.item.fechaDesde} </Text>
                        <Text style={{ fontSize: 11, color: 'gray' }}> {this.props.item.fechaHasta} </Text>
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
                showSpinner: false
            });
        }, 3000);
    }

    componentWillMount() {
        this.setState({ showSpinner: true });
        LocalStorage.load({
            key: 'UsuarioLogueado'
        })
            .then(response => {
                this.setState({ usuario: response });
                this.obtenerReservas();
                this.createListeners();
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
        var refReservas = refCountry
            .collection('Propietarios')
            .doc(this.state.usuario.datos)
            .collection('Reservas');

        this.snapshotReservas = refReservas
            .where('Cancelado', '==', false)
            .where('FechaDesde', '>=', new Date())
            .orderBy('FechaDesde')
            .onSnapshot(snapshot => {
                if (!snapshot.empty) {
                    //El propietario tiene reservas
                    var tempArray = [];
                    for (var i = 0; i < snapshot.docs.length; i++) {
                        var reserva = {
                            key: snapshot.docs[i].id,
                            nombre: snapshot.docs[i].data().Nombre,
                            fechaDesde: moment.unix(snapshot.docs[i].data().FechaDesde.seconds).format('D/M/YYYY HH:mm'),
                            fechaHasta: moment.unix(snapshot.docs[i].data().FechaHasta.seconds).format('D/M/YYYY HH:mm'),
                            idReservaServicio: snapshot.docs[i].data().IdReservaServicio.path,
                            servicio: snapshot.docs[i].data().Servicio
                        };
                        tempArray.push(reserva);
                    }
                    this.setState({ showSpinner: false, flatListData: tempArray });
                } else {
                    this.setState({ showSpinner: false, flatListData: [] });
                }
            });
    };

    render() {
        if (this.state.flatListData && this.state.flatListData.length == 0) {
            return (
                <View>
                    <Text style={styles.textDefault}> No hay ninguna reserva activa. </Text>
                </View>
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
        color: '#FFF'
    },
    textDefault: {
        marginTop: '65%',
        textAlign: 'center',
        fontSize: 14,
        color: '#8F8787',
        fontWeight: 'normal',
        fontStyle: 'normal'
    }
});

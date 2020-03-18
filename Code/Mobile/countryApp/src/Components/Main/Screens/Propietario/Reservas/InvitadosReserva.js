import React, { Component } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { ListItem, Left, Body, Text, Right, Thumbnail } from 'native-base';
import Swipeout from 'react-native-swipeout';
import { LocalStorage } from '../../../../DataBase/Storage';
import { Database } from '../../../../DataBase/Firebase';
import Spinner from 'react-native-loading-spinner-overlay';
import moment from 'moment';

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
                                    onPress: () => {
                                        //Funcion para confirmar el invitado pendiente de una reserva.
                                    }
                                }
                            ],
                            { cancelable: true }
                        );
                    }
                }
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
                                    onPress: () => {
                                        //Funcion para eliminar o no confirmar un invitado pendiente de una reserva.
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
        if (this.props.item.nombre == null && this.props.item.apellido == null) {
            return (
                <Swipeout {...swipeOutSettings}>
                    <ListItem avatar>
                        <Left>
                            <Thumbnail source={require('../../../../../assets/Images/invitado.jpg')} />
                        </Left>
                        <Body style={{ alignSelf: 'center', marginTop: '2.7%' }}>
                            <Text style={{ fontSize: 14 }}> {this.props.item.documento} </Text>
                        </Body>
                        <Right style={{ alignSelf: 'center' }}></Right>
                    </ListItem>
                </Swipeout>
            );
        } else {
            return (
                <Swipeout {...swipeOutSettings}>
                    <ListItem avatar>
                        <Left>
                            <Thumbnail source={require('../../../../../assets/Images/invitado.jpg')} />
                        </Left>
                        <Body style={{ alignSelf: 'center' }}>
                            <Text style={{ fontSize: 14 }}> {this.props.item.nombre + ' ' + this.props.item.apellido} </Text>
                            <Text style={{ fontSize: 14 }}> {this.props.item.documento} </Text>
                        </Body>
                        <Right style={{ alignSelf: 'center', marginTop: '2.4%' }}></Right>
                    </ListItem>
                </Swipeout>
            );
        }
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

        this.obtenerInvitaciones();
    }

    componentWillMount() {
        this.setState({ showSpinner: true });

        const { navigation } = this.props;
        const usuario = navigation.dangerouslyGetParent().getParam('usuario');
        const reserva = navigation.dangerouslyGetParent().getParam('reserva');

        this.setState({
            usuario: usuario,
            reserva: reserva
        });
    }

    obtenerInvitaciones = () => {
        var refCountry = Database.collection('Country').doc(this.state.usuario.country);
        var refPropietario = refCountry.collection('Propietarios').doc(this.state.usuario.datos);
        var refReserva = refPropietario.collection('Reservas').doc(this.state.reserva.key);
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
                        documento: snapshot.docs[i].data().Documento,
                        tipoDocumento: snapshot.docs[i].data().TipoDocumento.id
                    };
                    tempArray.push(invitado);
                }
                this.setState({ showSpinner: false, flatListData: tempArray });
            } else {
                this.setState({ showSpinner: false, flatListData: [] });
            }
        });
    };

    render() {
        return (
            <View>
                <Spinner visible={this.state.showSpinner} textContent={'Loading...'} textStyle={styles.spinnerTextStyle} />
                <FlatList
                    data={this.state.flatListData}
                    renderItem={({ item, index }) => {
                        return (
                            <FlatListItem navigation={this.props.navigation} item={item} index={index} parentFlatList={this}></FlatListItem>
                        );
                    }}></FlatList>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    spinnerTextStyle: {
        fontSize: 20,
        fontWeight: 'normal',
        color: '#FFF'
    }
});

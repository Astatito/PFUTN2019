import React, { Component } from 'react';
import { FlatList, Alert } from 'react-native';
import { ListItem, Left, Body, Text, Right, Thumbnail } from 'native-base';
import IconAntDesign from 'react-native-vector-icons/AntDesign';
import IconEvil from 'react-native-vector-icons/EvilIcons';
import Swipeout from 'react-native-swipeout';
import { LocalStorage } from '../../../../DataBase/Storage';
import { Database } from '../../../../DataBase/Firebase';
import moment from 'moment';

var flatListData = [
    {
        key: 'wulefb43oy',
        nombre: 'Cancha de fútbol 5',
        estado: 'Activa',
        fechaDesde: '02/11/2018 20:00 hs',
        fechaHasta: '02/11/2018 21:00 hs'
    },
    {
        key: 'kqedufhkdu',
        nombre: 'Club House  ',
        estado: 'Finalizada',
        fechaDesde: '02/11/2018 20:00 hs',
        fechaHasta: '03/11/2018 05:00 hs'
    },
    {
        key: '237r8h2eff',
        nombre: 'Cancha de Tenis',
        estado: 'Activa',
        fechaDesde: '12/11/2018 20:00 hs',
        fechaHasta: '02/11/2018 21:00 hs'
    },
    {
        key: '32fh8hfhfh',
        nombre: 'Cancha de Golf ',
        estado: 'Cancelada',
        fechaDesde: '3/11/2018 11:00 hs',
        fechaHasta: '02/11/2018 13:00 hs'
    },
    {
        key: '32h7fhf23h',
        nombre: 'Piscina climatizada ',
        estado: 'Cancelada',
        fechaDesde: '09/11/2018 16:00 hs',
        fechaHasta: '02/11/2018 17:00 hs'
    }
];

class FlatListItem extends Component {
    state = { activeRowKey: null };

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
            right: [
                {
                    text: 'Eliminar',
                    type: 'delete',
                    onPress: () => {
                        const deletingRow = this.state.activeRowKey;
                        Alert.alert(
                            'Atención',
                            'Está seguro que desea eliminar ? ',
                            [
                                { text: 'Cancelar', onPress: () => console.log('Cancel pressed'), style: 'cancel' },
                                {
                                    text: 'Aceptar',
                                    onPress: () => {
                                        flatListData.splice(this.props.index, 1);
                                        //Refresh FlatList
                                        this.props.parentFlatList.refreshFlatList(deletingRow);
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
                            'Desea modificar esta reserva ? ',
                            [
                                { text: 'Cancelar', onPress: () => console.log('Cancel pressed'), style: 'cancel' },
                                {
                                    text: 'Aceptar',
                                    onPress: () => {
                                        this.props.navigation.navigate('InformacionReserva');
                                    }
                                }
                            ],
                            { cancelable: true }
                        );
                    }}>
                    <Left>
                        <Thumbnail source={{ uri: 'https://clubdeltrade.com/wp-content/uploads/2019/06/industria_deportiva.png' }} />
                    </Left>
                    <Body style={{ alignSelf: 'center' }}>
                        <Text style={{ fontSize: 14 }}> {this.props.item.nombre} </Text>
                    </Body>
                    <Right style={{ alignSelf: 'center', marginTop: '2.6%' }}>
                        <Text style={{ fontSize: 11, color: 'gray' }}> {this.props.item.fechaDesde} </Text>
                        <Text style={{ fontSize: 11, color: 'gray' }}> {this.props.item.fechaHasta} </Text>
                    </Right>
                </ListItem>
            </Swipeout>
        );
    }
}

export default class MisReservas extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            title: 'Mis Reservas',
            headerLeft: <IconEvil style={{ paddingLeft: 10 }} onPress={() => navigation.openDrawer()} name="navicon" size={30} />,
            headerRight: (
                <IconAntDesign
                    style={{ paddingRight: 10 }}
                    name="plus"
                    size={25}
                    onPress={() => navigation.navigate('SeleccionarServicio')}
                />
            )
        };
    };

    constructor(props) {
        super(props);
        state = { deletedRowKey: null, flatListData: [] };
    }

    componentWillMount() {
        LocalStorage.load({
            key: 'UsuarioLogueado'
        })
            .then(response => {
                this.setState({ usuario: response });
                this.obtenerReservas();
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

    obtenerReservas = () => {
        var refCountry = Database.collection('Country').doc(this.state.usuario.country);
        var refReservas = refCountry
            .collection('Propietarios')
            .doc(this.state.usuario.datos)
            .collection('Reservas');

        refReservas.onSnapshot(snapshot => {
            if (!snapshot.empty) {
                //El propietario tiene reservas
                var tempArray = [];
                for (var i = 0; i < snapshot.docs.length; i++) {
                    var reserva = {
                        key: snapshot.docs[i].id,
                        nombre: snapshot.docs[i].data().Nombre,
                        fechaDesde: moment.unix(snapshot.docs[i].data().FechaDesde.seconds).format('D/M/YYYY HH:mm'),
                        fechaHasta: moment.unix(snapshot.docs[i].data().FechaHasta.seconds).format('D/M/YYYY HH:mm')
                    };
                    tempArray.push(reserva);
                }
                console.log('FlatList seteado correctamente en state');
                this.setState({ flatListData: tempArray });
                console.log(this.state.flatListData);
            } else {
                this.setState({ flatListData: [] });
            }
        });
    };

    refreshFlatList = deletedKey => {
        this.setState(prevState => {
            return {
                deletedRowKey: deletedKey
            };
        });
    };
    render() {
        return (
            <FlatList
                data={flatListData}
                renderItem={({ item, index }) => {
                    return <FlatListItem navigation={this.props.navigation} item={item} index={index} parentFlatList={this}></FlatListItem>;
                }}></FlatList>
        );
    }
}

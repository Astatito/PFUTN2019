import React, { Component } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { ListItem, Left, Body, Text, Thumbnail } from 'native-base';
import Swipeout from 'react-native-swipeout';
import { LocalStorage } from '../../../../DataBase/Storage';
import { Database } from '../../../../DataBase/Firebase';
import Spinner from 'react-native-loading-spinner-overlay';

var flatListData = [
    {
        key: 'wulefb43oy',
        nombre: 'Alexis',
        apellido: 'Pagura',
        documento: '39611837',
        fechaDesde: '02/11/2018 20:00 hs',
        fechaHasta: '02/11/2018 21:00 hs'
    },
    {
        key: 'kqedufhkdu',
        nombre: 'Fabián',
        apellido: 'Guidobaldi',
        documento: '40564852',
        fechaDesde: '02/11/2018 20:00 hs',
        fechaHasta: '03/11/2018 05:00 hs'
    },
    {
        key: '237r8h2eff',
        nombre: 'Ezequiel ',
        apellido: 'Braicovich',
        documento: '45874125',
        fechaDesde: '12/11/2018 20:00 hs',
        fechaHasta: '02/11/2018 21:00 hs'
    }
];

class FlatListItem extends Component {
    state = {activeRowKey: null, showSpinner: false };

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
        
        return (
            <Swipeout {...swipeOutSettings}>
                <ListItem avatar>
                    <Left>
                        <Thumbnail source= {require('../../../../../assets/Images/invitado.jpg')} />
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
                console.log(this.state.usuario);
                this.obtenerInvitaciones();
            })
            .catch(error => {
                switch (error.name) {
                    case 'NotFoundError':
                        console.log('La key solicitada no existe.');
                        break;
                    default:
                        console.warn('Error inesperado: ', error.message);
                }
                this.setState({ showSpinner: false });
            });
    }

    obtenerInvitaciones = () => {
        //Lógica para obtener los invitados existentes.
    };

    render() {
        if (this.state.flatListData && this.state.flatListData.length == 0) {
            return(
                <View>
                    <Text style={styles.textDefault}>Aún no hay invitados en esta reserva. </Text>
                </View>
            );
        } else {
            return(
                <View>
                    {/* Descomentar para tener Spinner. */}
                    {/* <Spinner visible={this.state.showSpinner} textContent={'Loading...'} textStyle={styles.spinnerTextStyle} /> */}
                    <FlatList
                        //Aca cambiar por this.state.flatListData cuando tengas bien los datos.
                        data={flatListData}
                        renderItem={({ item, index }) => {
                            return <FlatListItem navigation={this.props.navigation} item={item} index={index} parentFlatList={this}></FlatListItem>;
                        }}></FlatList>
                </View>
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
    textDefault : {
        marginTop: '65%',
        textAlign: 'center',
        fontSize: 14,
        color: '#8F8787',
        fontWeight: 'normal',
        fontStyle: 'normal'
    }
});

import React, { Component } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { ListItem, Left, Body, Text, Right, Thumbnail } from 'native-base';
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
    },
    {
        key: '32fh8hfhfh',
        documento: '45874125',
        fechaDesde: '3/11/2018 11:00 hs',
        fechaHasta: '02/11/2018 13:00 hs'
    },
    {
        key: '32h7fhf23h',
        documento: '45874125',
        fechaDesde: '09/11/2018 16:00 hs',
        fechaHasta: '02/11/2018 17:00 hs'
    }
];

class FlatListItem extends Component {
    state = {showSpinner: false };

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
            rowId: this.props.index,
            sectionId: 1
        };
        if (this.props.item.nombre == null && this.props.item.apellido == null) {
            return (
                <Swipeout {...swipeOutSettings}>
                    <ListItem avatar>
                        <Left>
                            <Thumbnail source= {require('../../../../../assets/Images/invitado.jpg')} />
                        </Left>
                        <Body style={{ alignSelf: 'center', marginTop: '2.7%' }}>
                            <Text style={{ fontSize: 14 }}> {this.props.item.documento} </Text>
                        </Body>
                        <Right style={{ alignSelf: 'center'}}>
                            <Text style={{ fontSize: 11, color: 'gray' }}> {this.props.item.fechaDesde} </Text>
                            <Text style={{ fontSize: 11, color: 'gray' }}> {this.props.item.fechaHasta} </Text>
                        </Right>
                    </ListItem>
                </Swipeout>
            );
        } else {
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
        return (
            <View>
                {/* Descomentar para tener Spinner. */}
                {/* <Spinner visible={this.state.showSpinner} textContent={'Loading...'} textStyle={styles.spinnerTextStyle} /> */}
                <FlatList
                    //Aca cambiae por this.state.flatListData cuando tengas bien los datos.
                    data={flatListData}
                    renderItem={({ item, index }) => {
                        return <FlatListItem navigation={this.props.navigation} item={item} index={index} parentFlatList={this}></FlatListItem>;
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

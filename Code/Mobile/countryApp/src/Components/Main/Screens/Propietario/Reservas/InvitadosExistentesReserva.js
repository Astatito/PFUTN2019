import React, { Component } from 'react';
import { FlatList, Alert, StyleSheet, View } from 'react-native';
import { ListItem, Left, Body, Text, Right, Thumbnail, Button, Content } from 'native-base';
import Swipeout from 'react-native-swipeout';
import { LocalStorage } from '../../../../DataBase/Storage';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Database } from '../../../../DataBase/Firebase';
import Spinner from 'react-native-loading-spinner-overlay';

let selectedItems = [];

var flatListData = [
    {
        key: 'wulefb43oy',
        nombre: 'Alexis',
        apellido: 'Pagura',
        documento: '39611837',
        fechaDesde: '02/11/2018 20:00 hs',
        fechaHasta: '02/11/2018 21:00 hs',
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
    state = { showSpinner: false, isSelected: false};

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
                            selectedItems.splice(index,1)
                            this.setState({ isSelected: false});
                        } else {
                            selectedItems.push(this.props.item)
                            this.setState({ isSelected: true});
                        }
                        console.log(selectedItems)
                    }}>
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
        } else if (this.props.item.nombre == null && this.props.item.apellido == null && this.state.isSelected == true) {
            return (
                <Swipeout {...swipeOutSettings}>
                    <ListItem 
                    avatar
                    onPress={() => {
                        if (selectedItems.includes(this.props.item)) {
                            let index = selectedItems.indexOf(this.props.item);
                            selectedItems.splice(index,1)
                            this.setState({ isSelected: false});
                        } else {
                            selectedItems.push(this.props.item)
                            this.setState({ isSelected: true});
                        }
                        console.log(selectedItems)
                    }}>
                        <Left>
                            <Thumbnail
                                source= {require('../../../../../assets/Images/check-azul.png')}                          
                            />
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
        } else if (this.state.isSelected == false) {
            return (
                <Swipeout {...swipeOutSettings}>
                    <ListItem 
                    avatar
                    onPress={() => {
                        if (selectedItems.includes(this.props.item)) {
                            let index = selectedItems.indexOf(this.props.item);
                            selectedItems.splice(index,1)
                            this.setState({ isSelected: false});
                        } else {
                            selectedItems.push(this.props.item)
                            this.setState({ isSelected: true});
                        }
                        console.log(selectedItems)
                    }}>
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
        } else {
            return (
                <Swipeout {...swipeOutSettings}>
                    <ListItem 
                    avatar
                    onPress={() => {
                        if (selectedItems.includes(this.props.item)) {
                            let index = selectedItems.indexOf(this.props.item);
                            selectedItems.splice(index,1)
                            this.setState({ isSelected: false});
                        } else {
                            selectedItems.push(this.props.item)
                            this.setState({ isSelected: true});
                        }
                        console.log(selectedItems)
                    }}>
                        <Left>
                            <Thumbnail
                                source= {require('../../../../../assets/Images/check-azul.png')}                          
                            />
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
        selectedItems = [];
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
        //Lógica para obtener las invitaciones personales.
    };

    isFlatListItemSelected = ({ item, index }) => {
        console.log(item)
        console.log(index)
        return <FlatListItem navigation={this.props.navigation} item={item} index={index} parentFlatList={this}></FlatListItem>;
    }
    
    render() {

        return (
            <Content>
                <View>
                    {/* Descomentar para tener Spinner. */}
                    {/* <Spinner visible={this.state.showSpinner} textContent={'Loading...'} textStyle={styles.spinnerTextStyle} /> */}
                    <FlatList
                        //Reemplazar aca por this.state.flatListData
                        data={flatListData}
                        renderItem={({ item, index }) => {
                            // this.isFlatListItemSelected({ item, index });
                            return <FlatListItem navigation={this.props.navigation} item={item} index={index} isSelected={false} parentFlatList={this}></FlatListItem>;

                        }}></FlatList>
                        <View style={{ flexDirection: 'row', marginLeft: '10%' }}>
                            <View style={styles.buttons}>
                                <Button
                                    bordered
                                    success
                                    style={{ paddingHorizontal: '12%' }}
                                    onPress={() => {
                                        //Lógica para agregar un invitado existente a a reserva.
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

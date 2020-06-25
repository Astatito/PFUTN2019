import React, { Component } from 'react';
import { FlatList, StyleSheet, View, Alert } from 'react-native';
import { ListItem, Left, Body, Text, Thumbnail, Root, Toast, Right } from 'native-base';
import Swipeout from 'react-native-swipeout';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { LocalStorage } from '../../../DataBase/Storage';
import { Database } from '../../../DataBase/Firebase';
import Spinner from 'react-native-loading-spinner-overlay';
import moment from 'moment';

class FlatListItem extends Component {
    state = { showSpinner: false };

    componentWillMount() {
        this.setState({ usuario: this.props.usuario });
    }

    render() {
        const swipeOutSettings = {
            style: { backgroundColor: '#fff' },
            rowId: this.props.index,
            sectionId: 1,
        };

        return (
            <Swipeout {...swipeOutSettings}>
                <ListItem avatar>
                    <Left>
                        <Thumbnail source={require('../../../../assets/Images/notificaciones.png')} />
                    </Left>
                    <Body style={{ alignSelf: 'center', marginTop: 'auto' }}>
                        <Text style={{ fontSize: 13, fontWeight: 'bold' }}> {this.props.item.tipo} </Text>
                        <Text style={{ fontSize: 12 }}> {this.props.item.texto} </Text>
                    </Body>
                    <Right style={{ alignSelf: 'center', marginTop: 'auto' }}>
                        <Text style={{ fontSize: 11, color: 'gray', alignSelf: 'center', justifyContent: 'center' }}>
                            {this.props.item.fecha}
                        </Text>
                    </Right>
                </ListItem>
            </Swipeout>
        );
    }
}

export default class BasicFlatList extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            title: 'Notificaciones',
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

    componentWillMount() {
        this.setState({ showSpinner: true });

        LocalStorage.load({
            key: 'UsuarioLogueado',
        })
            .then((response) => {
                this.setState({ usuario: response });
                this.obtenerNotificaciones();
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
            this.obtenerNotificaciones();
        });

        this._unsubscribeSnapshot = this.props.navigation.addListener('didBlur', () => {
            this.snapshotNotificaciones();
        });
    }

    obtenerNotificaciones = () => {
        var refCountry = Database.collection('Country').doc(this.state.usuario.country);
        var refNotificaciones = refCountry.collection('Notificaciones');
        console.log(refNotificaciones);
        this.snapshotNotificaciones = refNotificaciones
            .where(
                'IdPropietario',
                '==',
                Database.doc('Country/' + this.state.usuario.country + '/Propietarios/' + this.state.usuario.datos)
            )
            .orderBy('Fecha', 'desc')
            .limit(15)
            .onSnapshot((snapshot) => {
                if (!snapshot.empty) {
                    // El propietario tiene notificaciones
                    var tempArray = [];
                    for (var i = 0; i < snapshot.docs.length; i++) {
                        var notificacion = {
                            key: snapshot.docs[i].id,
                            texto: snapshot.docs[i].data().Texto,
                            tipo: snapshot.docs[i].data().Tipo,
                            visto: snapshot.docs[i].data().Visto,
                            fecha: moment.unix(snapshot.docs[i].data().Fecha.seconds).format('D/M/YYYY HH:mm'),
                            // referencia: "?????"
                        };
                        tempArray.push(notificacion);
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
                <Root>
                    <View>
                        <Text style={styles.textDefault}> No hay notificaciones para mostrar. </Text>
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

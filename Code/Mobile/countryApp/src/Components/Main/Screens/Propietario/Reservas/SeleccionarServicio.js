import React, { Component } from 'react';
import { FlatList, Alert, StyleSheet, View } from 'react-native';
import { ListItem, Left, Body, Text, Right, Thumbnail } from 'native-base';
import Swipeout from 'react-native-swipeout';
import { LocalStorage } from '../../../../DataBase/Storage';
import { Database } from '../../../../DataBase/Firebase';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Spinner from 'react-native-loading-spinner-overlay';
import moment from 'moment';

class FlatListItem extends Component {
    state = { showSpinner: false };

    render() {
        const swipeOutSettings = {
            style: { backgroundColor: '#fff' }
        };
        return (
            <Swipeout {...swipeOutSettings}>
                <ListItem
                    avatar
                    onPress={() => {
                        Alert.alert(
                            'Atención',
                            '¿ Desea reservar el servicio ? ',
                            [
                                { text: 'Cancelar', onPress: () => console.log('Cancel pressed'), style: 'cancel' },
                                {
                                    text: 'Aceptar',
                                    onPress: () => {
                                        this.props.navigation.navigate('SeleccionarTurno', { servicio: this.props.item });
                                    }
                                }
                            ],
                            { cancelable: true }
                        );
                    }}>
                    <Left>
                        <Thumbnail source={require('../../../../../assets/Images/servicios.jpg')} />
                    </Left>
                    <Body style={{ alignSelf: 'center' }}>
                        <Text style={{ fontSize: 14, marginTop: '5.9%', justifyContent: 'center' }}> {this.props.item.nombre} </Text>
                    </Body>
                </ListItem>
            </Swipeout>
        );
    }
}

export default class BasicFlatList extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            title: 'Servicios',
            headerRight: <View></View>,
            headerLeft: <Icon style={{ paddingLeft: 10 }} onPress={() => navigation.goBack()} name="arrow-back" size={30} />
        };
    };

    componentWillMount() {
        this.setState({ showSpinner: true });
        LocalStorage.load({
            key: 'UsuarioLogueado'
        })
            .then(response => {
                this.setState({ usuario: response });
                this.obtenerServicios();
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

    obtenerServicios = () => {
        var refCountry = Database.collection('Country').doc(this.state.usuario.country);
        var refServicios = refCountry.collection('Servicios');

        refServicios.onSnapshot(snapshot => {
            if (!snapshot.empty) {
                var tempArray = [];
                for (var i = 0; i < snapshot.docs.length; i++) {
                    var servicio = {
                        key: snapshot.docs[i].id,
                        nombre: snapshot.docs[i].data().Nombre,
                        disponibilidad: snapshot.docs[i].data().Disponibilidad,
                        horaInicio: new Date(snapshot.docs[i].data().HoraInicio.seconds * 1000),
                        horaFin: new Date(snapshot.docs[i].data().HoraFin.seconds * 1000),
                        duracionTurno: snapshot.docs[i].data().DuracionTurno
                    };
                    tempArray.push(servicio);
                }
                this.setState({ showSpinner: false, flatListData: tempArray });
            } else {
                this.setState({ showSpinner: false, flatListData: [] });
            }
        });
    };

    componentDidMount() {
        setInterval(() => {
            this.setState({
                showSpinner: false
            });
        }, 3000);
    }

    render() {
        return (
            <View>
                {/* Descomentar para tener Spinner. */}
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

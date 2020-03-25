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
import Share from 'react-native-share'

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

    descartarInvitado = invitado => {
        if (invitado.estado == true) {
            // TODO: SE DEBE ELIMINAR TAMBIÉN LA INVITACIÓN PARA QUE NO PUEDA INGRESAR
        }

        var refCountry = Database.collection('Country').doc(this.state.usuario.country);
        var refPropietario = refCountry.collection('Propietarios').doc(this.state.usuario.datos);
        var refReserva = refPropietario.collection('Reservas').doc(invitado.reserva);
        var refInvitado = refReserva.collection('Invitados').doc(invitado.key);

        refInvitado.delete();
        return 0
    };

    confirmarInvitado = invitado => {
        // TODO: SE DEBE CREAR/ACTUALIZAR LA INVITACIÓN PARA QUE PUEDA INGRESAR

        var refCountry = Database.collection('Country').doc(this.state.usuario.country);
        var refPropietario = refCountry.collection('Propietarios').doc(this.state.usuario.datos);
        var refReserva = refPropietario.collection('Reservas').doc(invitado.reserva);
        var refInvitado = refReserva.collection('Invitados').doc(invitado.key);

        refInvitado.set(
            {
                Estado: true
            },
            { merge: true }
        );
        return 0
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
                                    onPress: () => {
                                        if (this.descartarInvitado(this.props.item) == 0) {
                                            Toast.show({
                                                text: 'Invitación eliminada exitosamente.',
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
                                    onPress: () => {
                                        if (this.confirmarInvitado(this.props.item) == 0 ) {
                                            Toast.show({
                                                text: 'Invitación confirmada exitosamente.',
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
                                        if (this.descartarInvitado(this.props.item) == 0) {
                                            Toast.show({
                                                text: 'Invitación eliminada exitosamente.',
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

    static navigationOptions = ({ navigation }) => {
        return {
            title: 'Invitados',
                headerLeft: <Icon style={{ paddingLeft: 10 }} onPress={() => navigation.goBack(null)} name="arrow-back" size={30} />,
                headerRight: (
                    <View style={styles.iconContainer}>
                        <IconEntypo style={{ paddingRight: 15 }} name="share" size={23} onPress={() => {
                            let shareOptions = {
                                title: 'Compartir',
                                message: 'Hola! Aquí te envío la invitación para mi evento.',
                                subject: 'Invitación a mi evento'
                                };
                                Share.open(shareOptions)
                        } }/>
                        <IconAntDesign style={{ paddingRight: 10 }} name="plus"size={25}
                        onPress={() => navigation.navigate('InvitadosExistentesReserva')}
                    />
                    </View>
                ),
                headerStyle: {
                    backgroundColor: '#1e90ff'
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                    textAlign: 'center',
                    flex: 1
                }
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
    
    //Funcion para compartir el link de invitacion de una reserva
    shareImage= () => {
    
        let shareOptions = {
        title: 'Compartir',
        message: 'Hola! Aquí te envío la invitación para mi evento.',
        subject: 'Invitación a mi evento'
        };
    
        Share.open(shareOptions)
        .then(res => {
            console.log(res);
        })
        .catch(err => {
            err && console.log(err);
        });
    
    };

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
                        estado: snapshot.docs[i].data().Estado,
                        documento: snapshot.docs[i].data().Documento,
                        tipoDocumento: snapshot.docs[i].data().TipoDocumento.id,
                        reserva: this.state.reserva.key
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
                <View>
                    <Text style={styles.textDefault}>Aún no hay invitados en esta reserva. </Text>
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
    },
    iconContainer: {
        flexDirection: "row",
        justifyContent: "space-evenly",
        width: 100
    }
});

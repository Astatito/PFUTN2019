import React, { Component } from 'react';
import { FlatList, Alert, StyleSheet, View } from 'react-native';
import { ListItem, Left, Body, Text, Thumbnail, Root, Toast } from 'native-base';
import Swipeout from 'react-native-swipeout';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { LocalStorage } from '../../../../DataBase/Storage';
import { Database } from '../../../../DataBase/Firebase';
import Spinner from 'react-native-loading-spinner-overlay';

var datosInvitado = {};

class FlatListItem extends Component {
    state = { showSpinner: false };

    componentWillMount() {
        this.setState({ usuario: this.props.usuario });
    }

    generarNotificacionIngreso = async (idPropietario, nombre, apellido) => {
        var refCountry = Database.collection('Country').doc(this.state.usuario.country);
        var refNotificaciones = refCountry.collection('Notificaciones');
        var notificacion = {
            Fecha: new Date(),
            Tipo: 'Ingreso',
            Texto: nombre + ' ' + apellido + ' ha ingresado al complejo.',
            IdPropietario: idPropietario,
            Visto: false,
        };
        await refNotificaciones.add(notificacion);
    };

    grabarIngreso = async (invitado, idPropietario) => {
        try {
            var refCountry = Database.collection('Country').doc(this.state.usuario.country);
            var refIngresos = refCountry.collection('Ingresos');
            var ingreso = {
                Nombre: invitado.nombre,
                Apellido: invitado.apellido,
                Documento: invitado.numeroDoc,
                TipoDocumento: Database.doc('TipoDocumento/' + invitado.tipoDoc),
                Descripcion: '',
                Egreso: true,
                Estado: true,
                Fecha: new Date(),
                IdEncargado: Database.doc('Country/' + this.state.usuario.country + '/Encargados/' + this.state.usuario.datos),
                IdPropietario: Database.doc('Country/' + this.state.usuario.country + '/Propietarios/' + idPropietario),
            };
            this.generarNotificacionIngreso(idPropietario, invitado.nombre, invitado.apellido);
            await refIngresos.add(ingreso);
            return 0;
        } catch (error) {
            console.log(error);
            return 1;
        }
    };

    render() {
        const swipeOutSettings = {
            style: { backgroundColor: '#fff' },
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
                            '¿ Desea visitar a este propietario ? ',
                            [
                                { text: 'Cancelar', onPress: () => console.log('Cancel pressed'), style: 'cancel' },
                                {
                                    text: 'Aceptar',
                                    onPress: () => {
                                        this.grabarIngreso(datosInvitado, this.props.item.key);
                                    },
                                },
                            ],
                            { cancelable: true }
                        );
                    }}>
                    <Left>
                        <Thumbnail source={require('../../../../../assets/Images/invitado.jpg')} />
                    </Left>
                    <Body style={{ alignSelf: 'center' }}>
                        <Text style={{ fontSize: 14 }}> {this.props.item.nombre + ' ' + this.props.item.apellido} </Text>
                    </Body>
                </ListItem>
            </Swipeout>
        );
    }
}

export default class BasicFlatList extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            title: 'Propietarios',
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

        const { navigation } = this.props;
        datosInvitado = navigation.getParam('invitado');
        const propietarios = navigation.getParam('propietarios');
        this.setState({ propietarios });

        LocalStorage.load({
            key: 'UsuarioLogueado',
        })
            .then((response) => {
                this.setState({ usuario: response });
                this.obtenerPropietarios(this.state.propietarios);
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

    obtenerPropietarios = async (propietarios) => {
        var refCountry = Database.collection('Country').doc(this.state.usuario.country);
        var refPropietarios = refCountry.collection('Propietarios');
        //Reemplazar por la lógica que corresponda.
        var tempArray = [];
        for (const key of propietarios) {
            prop = await refPropietarios.doc(key).get();
            var aux = {
                key: key,
                nombre: prop.data().Nombre,
                apellido: prop.data().Apellido,
            };
            tempArray.push(aux);
        }
        this.setState({ flatListData: tempArray });
    };

    render() {
        if (this.state.flatListData && this.state.flatListData.length == 0) {
            return (
                <Root>
                    <View>
                        <Text style={styles.textDefault}> No hay propietarios para mostrar. </Text>
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

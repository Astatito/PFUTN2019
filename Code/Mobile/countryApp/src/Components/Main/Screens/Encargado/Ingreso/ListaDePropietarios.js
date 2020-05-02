import React, { Component } from 'react';
import { FlatList, Alert, StyleSheet, View } from 'react-native';
import { ListItem, Left, Body, Text, Thumbnail, Root, Toast } from 'native-base';
import Swipeout from 'react-native-swipeout';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { LocalStorage } from '../../../../DataBase/Storage';
import { Database } from '../../../../DataBase/Firebase';
import Spinner from 'react-native-loading-spinner-overlay';

//FLATLIST DE PRUEBA : REEMPLAZAR LUEGO LOS FLATLISTDATA POR THIS.STATE.FLATLISTDATA !!
const flatListData = [
    {
        key: 'hwkd9729',
        nombre: 'Alexis',
        apellido: 'Pagura',
        documento: 39611837
    },
    {
        key: 'aosr8208',
        nombre: 'Fabian',
        apellido: 'Guidobaldi',
        documento: 39611837
    },
    {
        key: 'sneo9248',
        nombre: 'Ezequiel',
        apellido: 'Braicovich',
        documento: 39611837
    }

]
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
                                        // Navegar a donde corresponda y enviar los datos del propietario
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
                            <Text style={{ fontSize: 14 }}> {this.props.item.documento} </Text>
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
        LocalStorage.load({
            key: 'UsuarioLogueado',
        })
            .then((response) => {
                this.setState({ usuario: response });
                // this.obtenerPropietarios();
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
            this.obtenerPropietarios();
        });

        this._unsubscribeSnapshot = this.props.navigation.addListener('didBlur', () => {
            this.snapshotPropietarios();
        });
    }

    obtenerPropietarios = () => {
        var refCountry = Database.collection('Country').doc(this.state.usuario.country);
        var refInvitados = refCountry.collection('Invitados');
        //Reemplazar por la lógica que corresponda.
        this.snapshotPropietarios = refInvitados
            .where(
                'IdPropietario',
                '==',
                Database.doc('Country/' + this.state.usuario.country + '/Propietarios/' + this.state.usuario.datos)
            )
            .onSnapshot((snapshot) => {
                if (!snapshot.empty) {
                    //Logica ...
                    this.setState({ showSpinner: false, flatListData: tempArray });
                } else {
                    this.setState({ showSpinner: false, flatListData: [] });
                }
            });
    };

    render() {
        if (flatListData && flatListData.length == 0) {
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
                            data={flatListData}
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

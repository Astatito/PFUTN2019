import React, { Component } from 'react';
import { FlatList, StyleSheet, View, TextInput } from 'react-native';
import { ListItem, Left, Body, Text, Thumbnail, Root, Button, Toast, Content } from 'native-base';
import Swipeout from 'react-native-swipeout';
import { LocalStorage } from '../../../../DataBase/Storage';
import { Database } from '../../../../DataBase/Firebase';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Spinner from 'react-native-loading-spinner-overlay';

const LIGHT_GRAY = '#D3D3D3';
let selectedItem = [];

class FlatListItem extends Component {
    state = { showSpinner: false, isSelected: false };

    render() {
        const swipeOutSettings = {
            style: { backgroundColor: '#fff' },
        };
        if (this.state.isSelected == false) {
            return (
                <Swipeout {...swipeOutSettings}>
                    <ListItem
                        avatar
                        onPress={() => {
                            if (selectedItem.includes(this.props.item)) {
                                let index = selectedItem.indexOf(this.props.item);
                                selectedItem.splice(index, 1);
                                this.setState({ isSelected: false });
                            } else {
                                selectedItem.push(this.props.item);
                                this.setState({ isSelected: true });
                            }
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
        } else {
            return (
                <Swipeout {...swipeOutSettings}>
                    <ListItem
                        avatar
                        onPress={() => {
                            if (selectedItem.includes(this.props.item)) {
                                let index = selectedItem.indexOf(this.props.item);
                                selectedItem.splice(index, 1);
                                this.setState({ isSelected: false });
                            } else {
                                selectedItem.push(this.props.item);
                                this.setState({ isSelected: true });
                            }
                        }}>
                        <Left>
                            <Thumbnail source={require('../../../../../assets/Images/check-azul.png')} />
                        </Left>
                        <Body style={{ alignSelf: 'center' }}>
                            <Text style={{ fontSize: 14, marginTop: '5.9%', justifyContent: 'center' }}> {this.props.item.nombre} </Text>
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
            title: 'Servicios',
            headerRight: <View></View>,
            headerLeft: <Icon style={{ paddingLeft: 10 }} onPress={() => navigation.goBack()} name="arrow-back" size={30} />,
        };
    };

    state = { nombreReserva: '' };

    componentWillMount() {
        this.setState({ showSpinner: true });
        LocalStorage.load({
            key: 'UsuarioLogueado',
        })
            .then((response) => {
                this.setState({ usuario: response });
                this.obtenerServicios();
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

    obtenerServicios = async () => {
        var refCountry = Database.collection('Country').doc(this.state.usuario.country);
        var refServicios = refCountry.collection('Servicios');

        try {
            const snapshot = await refServicios.where('Estado', '==', true).get();
            if (!snapshot.empty) {
                var tempArray = [];
                for (var i = 0; i < snapshot.docs.length; i++) {
                    var servicio = {
                        key: snapshot.docs[i].id,
                        nombre: snapshot.docs[i].data().Nombre,
                        disponibilidad: snapshot.docs[i].data().Disponibilidad,
                        duracionTurno: snapshot.docs[i].data().DuracionTurno,
                        maxTurnos: snapshot.docs[i].data().TurnosMax,
                    };
                    tempArray.push(servicio);
                }
                this.setState({ flatListData: tempArray });
            } else {
                this.setState({ flatListData: [] });
            }
            return 0;
        } catch (error) {
            return 1;
        } finally {
            this.setState({ showSpinner: false });
        }
    };

    componentDidMount() {
        setInterval(() => {
            this.setState({
                showSpinner: false,
            });
        }, 3000);
    }

    componentWillUnmount() {
        selectedItem = [];
    }

    onBlur() {
        this.setState({ isFocused: false });
    }

    onFocus() {
        this.setState({ isFocused: true });
    }

    render() {
        return (
            <Root>
                <Content>
                    <Spinner visible={this.state.showSpinner} textContent={'Loading...'} textStyle={styles.spinnerTextStyle} />
                    <TextInput
                        style={styles.textInput}
                        placeholder="Ingrese el nombre de su reserva"
                        onChangeText={(nombreReserva) => this.setState({ nombreReserva })}
                        underlineColorAndroid={LIGHT_GRAY}
                        onFocus={() => this.onFocus()}
                        onBlur={() => this.onBlur()}
                        keyboardType={'default'}
                        maxLength={20}
                    />
                    <FlatList
                        style={{ marginLeft: '3%' }}
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

                    <View style={{ flexDirection: 'row', alignContent: 'space-between', justifyContent: 'center' }}>
                        <View style={styles.buttons}>
                            <Button
                                bordered
                                success
                                disabled={this.state.showSpinner}
                                style={{ paddingHorizontal: '5%' }}
                                onPress={async () => {
                                    this.setState({ showSpinner: true }, () => {
                                        if (this.state.nombreReserva === '') {
                                            Toast.show({
                                                text: 'Debe ingresar un nombre válido para la reserva.',
                                                buttonText: 'Aceptar',
                                                duration: 3000,
                                                position: 'bottom',
                                                type: 'warning',
                                            });
                                            this.setState({ showSpinner: false });
                                            return;
                                        }
                                        if (selectedItem.length !== 1) {
                                            Toast.show({
                                                text: 'Debe seleccionar un servicio.',
                                                buttonText: 'Aceptar',
                                                duration: 3000,
                                                position: 'bottom',
                                                type: 'warning',
                                            });
                                            this.setState({ showSpinner: false });
                                            return;
                                        }
                                        this.setState({ showSpinner: false });
                                        this.props.navigation.navigate('SeleccionarTurno', {
                                            servicio: selectedItem[0],
                                            nombreReserva: this.state.nombreReserva,
                                        });
                                    });
                                }}>
                                <Text>Aceptar</Text>
                            </Button>
                        </View>
                        <View style={styles.buttons}>
                            <Button
                                bordered
                                danger
                                disabled={this.state.showSpinner}
                                style={{ paddingHorizontal: '5%' }}
                                onPress={() => {
                                    this.props.navigation.goBack();
                                }}>
                                <Text>Cancelar</Text>
                            </Button>
                        </View>
                    </View>
                </Content>
            </Root>
        );
    }
}

const styles = StyleSheet.create({
    spinnerTextStyle: {
        fontSize: 20,
        fontWeight: 'normal',
        color: '#FFF',
    },
    textInput: {
        width: '80%',
        fontSize: 16,
        alignItems: 'flex-start',
        marginHorizontal: '7%',
        marginTop: '7%',
        marginVertical: '3%',
    },
    buttons: {
        alignItems: 'center',
        justifyContent: 'center',
        width: '40%',
        marginTop: '5%',
        marginBottom: '15%'
    },
});

import React, { Component } from 'react';
import { FlatList, Alert, StyleSheet, View, StatusBar } from 'react-native';
import { ListItem, Left, Body, Text, Right, Thumbnail, Button, Content, Toast, Root} from 'native-base';
import { LocalStorage } from '../../../../DataBase/Storage';
import { Database } from '../../../../DataBase/Firebase';
import Swipeout from 'react-native-swipeout';
import Calendar from '../../../../Common/Calendar';
import Spinner from 'react-native-loading-spinner-overlay';
import moment from 'moment';

let selectedItems = [];
var franjaAnterior = 0

class FranjaListItem extends Component {
    render () {
        return (
            <View style={{margin: '2%'}}>
                <ListItem itemDivider style={{ backgroundColor:'#A1EAC4', width:'100%',justifyContent:'center'}}>
                    <Text style={{fontSize:15, fontWeight:'bold', textAlign:'center'}}>Franja horaria #{this.props.franja} </Text>
                </ListItem>
            </View>
        )
    }
}

class FlatListItem extends Component {

    state = { showSpinner: false, selectedDate: '', isSelected: false, hayTurnos: null};

    render() {

        const swipeOutSettings = {
            style: { backgroundColor: '#fff' },
        };

        if (this.state.isSelected == false) {
                if (this.props.esNuevaFranja === false) {
                    return (
                        <Swipeout {...swipeOutSettings}>
                            <ListItem
                                avatar
                                onPress={() => {
                                    if (this.props.item.estado === 'Disponible') {
                                        if (selectedItems.includes(this.props.item)) {
                                            let index = selectedItems.indexOf(this.props.item);
                                            selectedItems.splice(index, 1);
                                            this.setState({ isSelected: false });
                                        } else {
                                            selectedItems.push(this.props.item);
                                            this.setState({ isSelected: true });
                                        }
                                    }
                                }}>
                                <Left>
                                    <Thumbnail source={require('../../../../../assets/Images/turnos.png')} />
                                </Left>
                                <Body style={{ alignSelf: 'center', marginTop: '1%' }}>
                                    <Text style={{ fontSize: 14, color: this.props.color }}> {this.props.item.estado} </Text>
                                </Body>
                                <Right style={{ alignSelf: 'center', flexDirection: 'row', marginTop: '1.9%' }}>
                                    <Text style={{ fontSize: 12, color: 'gray' }}> {this.props.item.desde + ' hs.'} </Text>
                                    <Text style={{ fontSize: 12, color: 'gray' }}> - </Text>
                                    <Text style={{ fontSize: 12, color: 'gray' }}> {this.props.item.hasta + ' hs.'} </Text>
                                </Right>
                            </ListItem>
                        </Swipeout>
                    );
                } else {
                    return (
                        <Swipeout {...swipeOutSettings}>
                            <FranjaListItem franja={this.props.franja}/>
                            <ListItem
                                avatar
                                onPress={() => {
                                    if (this.props.item.estado === 'Disponible') {
                                        if (selectedItems.includes(this.props.item)) {
                                            let index = selectedItems.indexOf(this.props.item);
                                            selectedItems.splice(index, 1);
                                            this.setState({ isSelected: false });
                                        } else {
                                            selectedItems.push(this.props.item);
                                            this.setState({ isSelected: true });
                                        }
                                    }
                                }}>
                                <Left>
                                    <Thumbnail source={require('../../../../../assets/Images/turnos.png')} />
                                </Left>
                                <Body style={{ alignSelf: 'center', marginTop: '1%' }}>
                                    <Text style={{ fontSize: 14, color: this.props.color }}> {this.props.item.estado} </Text>
                                </Body>
                                <Right style={{ alignSelf: 'center', flexDirection: 'row', marginTop: '1.9%' }}>
                                    <Text style={{ fontSize: 12, color: 'gray' }}> {this.props.item.desde + ' hs.'} </Text>
                                    <Text style={{ fontSize: 12, color: 'gray' }}> - </Text>
                                    <Text style={{ fontSize: 12, color: 'gray' }}> {this.props.item.hasta + ' hs.'} </Text>
                                </Right>
                            </ListItem>
                        </Swipeout>
                    );
                }
            } else {
                if (this.props.esNuevaFranja === false) {
                    return (
                        <Swipeout {...swipeOutSettings}>
                            <ListItem
                                avatar
                                onPress={() => {
                                    if (selectedItems.includes(this.props.item)) {
                                        let index = selectedItems.indexOf(this.props.item);
                                        selectedItems.splice(index, 1);
                                        this.setState({ isSelected: false });
                                    } else {
                                        selectedItems.push(this.props.item);
                                        this.setState({ isSelected: true });
                                    }
                                }}>
                                <Left>
                                    <Thumbnail source={require('../../../../../assets/Images/check-azul.png')} />
                                </Left>
                                <Body style={{ alignSelf: 'center', marginTop: '1%' }}>
                                    <Text style={{ fontSize: 14, color: this.props.color }}> {this.props.item.estado} </Text>
                                </Body>
                                <Right style={{ alignSelf: 'center', flexDirection: 'row', marginTop: '1.9%' }}>
                                    <Text style={{ fontSize: 12, color: 'gray' }}> {this.props.item.desde + ' hs.'} </Text>
                                    <Text style={{ fontSize: 12, color: 'gray' }}> - </Text>
                                    <Text style={{ fontSize: 12, color: 'gray' }}> {this.props.item.hasta + ' hs.'} </Text>
                                </Right>
                            </ListItem>
                        </Swipeout>
                    );
                } else {
                    return (
                        <Swipeout {...swipeOutSettings}>
                            <FranjaListItem franja={this.props.franja}/>
                            <ListItem
                                avatar
                                onPress={() => {
                                    if (selectedItems.includes(this.props.item)) {
                                        let index = selectedItems.indexOf(this.props.item);
                                        selectedItems.splice(index, 1);
                                        this.setState({ isSelected: false });
                                    } else {
                                        selectedItems.push(this.props.item);
                                        this.setState({ isSelected: true });
                                    }
                                }}>
                                <Left>
                                    <Thumbnail source={require('../../../../../assets/Images/check-azul.png')} />
                                </Left>
                                <Body style={{ alignSelf: 'center', marginTop: '1%' }}>
                                    <Text style={{ fontSize: 14, color: this.props.color }}> {this.props.item.estado} </Text>
                                </Body>
                                <Right style={{ alignSelf: 'center', flexDirection: 'row', marginTop: '1.9%' }}>
                                    <Text style={{ fontSize: 12, color: 'gray' }}> {this.props.item.desde + ' hs.'} </Text>
                                    <Text style={{ fontSize: 12, color: 'gray' }}> - </Text>
                                    <Text style={{ fontSize: 12, color: 'gray' }}> {this.props.item.hasta + ' hs.'} </Text>
                                </Right>
                            </ListItem>
                        </Swipeout>
                    );
                }
        }
    }
}

export default class BasicFlatList extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            header: null,
        };
    };

    componentWillMount() {
        const { navigation } = this.props;
        const servicio = navigation.getParam('servicio');
        const nombreReserva = navigation.getParam('nombreReserva');

        this.setState({ showSpinner: true, servicio: servicio, fechaSeleccionada: new Date(), nombreReserva: nombreReserva });
        LocalStorage.load({
            key: 'UsuarioLogueado',
        })
            .then((response) => {
                this.setState({ usuario: response, selectedDate: moment()});
                this.fechaSeleccionada(moment());
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

    onToastClosed = (reason) => {
        this.props.navigation.navigate('MisReservas');
    };

    addMinutes = (date, minutes) => {
        return new Date(date.getTime() + minutes * 60000);
    };

    generarTurnos = (dia) => {
        var franjas = this.state.servicio.disponibilidad[dia - 1].horarios.sort((a, b) => {
            return a.id - b.id;
        });
        var duracionTurno = this.state.servicio.duracionTurno;
        var tempArray = [];
        var key = 1;

        for (franja of franjas) {
            var desde = new Date(franja.desde.seconds * 1000);
            var hasta = new Date(franja.hasta.seconds * 1000);
            var diferencia = Math.ceil(Math.abs(hasta - desde) / 60000);
            var cantidadTurnos = diferencia / duracionTurno;

            var auxDate = moment(desde);

            for (var i = 1; i < cantidadTurnos + 1; i++) {
                var estado = 'Disponible';

                var desde = auxDate.format('HH:mm');
                auxDate.add(duracionTurno, 'minutes');
                var hasta = auxDate.format('HH:mm');

                var turno = {
                    key: key,
                    estado: estado,
                    desde: desde,
                    hasta: hasta,
                    franja: franja.id,
                };
                tempArray.push(turno);
                key++;
            }
        }
        this.setState({ showSpinner: false, tempArray: tempArray });
    };

    componentDidMount() {
        setInterval(() => {
            this.setState({
                showSpinner: false,
            });
        }, 4000);
    }

    fechaSeleccionada = async (fecha) => {
        franjaAnterior = 0
        var dia = moment(fecha).format('E');
        this.generarTurnos(dia);
        selectedItems = [];
        try {
            if (this.state.servicio.disponibilidad[dia - 1].horarios.length > 0) {
                this.setState({ fechaSeleccionada: fecha.toDate(), hayTurnos: true });
                await this.obtenerReservasPorDia(fecha);
            } else {
                this.setState({hayTurnos: false, showSpinner: false });
            }
        } catch (error) {
            console.log(error);
        } finally {
            setTimeout(() => {this.setState({ showSpinner: false })}, 1000)
        }
    };

    obtenerReservasPorDia = async (fecha) => {
        var refCountry = Database.collection('Country').doc(this.state.usuario.country);
        var refServicio = refCountry.collection('Servicios').doc(this.state.servicio.key);
        var refReservas = refServicio.collection('Reservas');

        var dia = moment(fecha).format('E');
        var franjas = this.state.servicio.disponibilidad[dia - 1].horarios.sort((a, b) => {
            return a.id - b.id;
        });

        var franjaInicio = new Date(franjas[0].desde.seconds * 1000);
        var franjaFin = new Date(franjas[franjas.length - 1].hasta.seconds * 1000);

        var desde = new Date(fecha.year(), fecha.month(), fecha.date(), franjaInicio.getHours(), franjaInicio.getMinutes());
        var hasta = new Date(fecha.year(), fecha.month(), fecha.date(), franjaFin.getHours(), franjaFin.getMinutes());

        try {
            const snapshot = await refReservas
                .where('Cancelado', '==', false)
                .where('FechaDesde', '>=', desde)
                .where('FechaDesde', '<=', hasta)
                .get();
            var reservas = [];
            if (!snapshot.empty) {
                for (var i = 0; i < snapshot.docs.length; i++) {
                    var reserva = {
                        desde: moment.unix(snapshot.docs[i].data().FechaDesde.seconds).format('HH:mm'),
                        hasta: moment.unix(snapshot.docs[i].data().FechaHasta.seconds).format('HH:mm'),
                    };
                    reservas.push(reserva);
                }
            }
            this.actualizarTurnos(reservas);
        } catch (error) {
            Toast.show({
                text: 'Lo siento, ocurrió un error inesperado.',
                buttonText: 'Aceptar',
                duration: 3000,
                position: 'bottom',
                type: 'danger',
            });
        } 
    };

    actualizarTurnos = (reservas) => {
        const arrayNow = moment().format('HH:mm').toString().split(':');
        const timeNow = arrayNow[0] * 60 + parseInt(arrayNow[1]) / 60;
        const dia = moment().format('D');
        var turnos = [];
        this.state.tempArray.map((turno) => {
            if (this.state.selectedDate.format('D') == dia) {
                const arrayDesde = turno.desde.toString().split(':');
                const timeTurno = arrayDesde[0] * 60 + parseInt(arrayDesde[1]) / 60;
                if (timeTurno > timeNow) {
                    turnos.push(turno);
                } 
            } else {
                turnos.push(turno);
            }
        });
        var turnosNuevos = turnos.filter((turno) => turno.estado !== 'No Disponible');
        if (turnosNuevos.length > 0) {
            if (reservas.length > 0) {
                for (var reserva of reservas) {
                    for (var i = 0; i < turnos.length; i++) {
                        if (turnos[i].desde >= reserva.desde && turnos[i].desde < reserva.hasta) {
                            turnos[i].estado = 'Reservado';
                        }
                    }
                }
            }
            this.setState({ hayTurnos: true });
        } else {
            this.setState({ hayTurnos: false });
        }

        this.setState({ flatListData: this.setParametersForList(turnos) });
    };

    setParametersForList = (turnos) => {
        turnos.map(item => {
            if (item.estado == 'Disponible') {
                item.color = 'green';
            } else if (item.estado == 'Reservado') {
                item.color = 'red'
            } 
            if (franjaAnterior === item.franja) {
                item.esNuevaFranja = false ;
            } else {
                item.esNuevaFranja = true
                franjaAnterior = item.franja
            }
        });
        return turnos
    }

    validarTurnos = (turnos) => {
        turnos.sort((a, b) => {
            return parseInt(a.key) - parseInt(b.key);
        });

        var compareValue = parseInt(turnos[turnos.length - 1].key) - parseInt(turnos[0].key) + 1;
        return turnos.length == compareValue;
    };

    validarFranjaHoraria = (turnos) => {
        return turnos.map((item) => item.franja).filter((value, index, self) => self.indexOf(value) === index).length === 1;
    };

    generarReserva = async () => {
        try {
            if (selectedItems.length > this.state.servicio.maxTurnos) {
                return 3;
            }

            if (!this.validarFranjaHoraria(selectedItems)) {
                return 4;
            }

            if (this.validarTurnos(selectedItems)) {
                var refCountry = Database.collection('Country').doc(this.state.usuario.country);
                var refServicio = refCountry.collection('Servicios').doc(this.state.servicio.key);
                var refReserva = refServicio.collection('Reservas').doc();
                var desde = selectedItems[0].desde.split(':');
                var hasta = selectedItems[selectedItems.length - 1].hasta.split(':');
                fechaDesde = new Date(this.state.fechaSeleccionada);
                fechaHasta = new Date(this.state.fechaSeleccionada);
                fechaDesde.setHours(parseInt(desde[0]), parseInt(desde[1]), parseInt(0));
                fechaHasta.setHours(parseInt(hasta[0]), parseInt(hasta[1]), parseInt(0));

                reserva = {
                    Cancelado: false,
                    FechaAlta: new Date(),
                    FechaDesde: fechaDesde,
                    FechaHasta: fechaHasta,
                    IdPropietario: Database.doc('Country/' + this.state.usuario.country + '/Propietarios/' + this.state.usuario.datos),
                    IdReservaServicio: null,
                    IdServicio: Database.doc('Country/' + this.state.usuario.country + '/Servicios/' + this.state.servicio.key),
                    Nombre: this.state.nombreReserva,
                    Servicio: this.state.servicio.nombre,
                };

                await refReserva.set(reserva);
                reserva.IdReservaServicio = Database.doc(
                    'Country/' + this.state.usuario.country + '/Servicios/' + this.state.servicio.key + '/Reservas/' + refReserva.id
                );
                refReserva = refCountry.collection('Propietarios').doc(this.state.usuario.datos).collection('Reservas');
                await refReserva.add(reserva);
                return 0;
            } else {
                return 1;
            }
        } catch (error) {
            console.log(error);
            return 2;
        } finally {
            this.setState({ showSpinner: false });
        }
    };

    render() {
        if (this.state.hayTurnos === false) {
            return (
                <Root>
                    <View>
                        <Spinner visible={this.state.showSpinner} textContent={'Loading...'} textStyle={styles.spinnerTextStyle} />
                        <Calendar
                            selectedDate={this.state.selectedDate}
                            onDateSelected={(date) => {
                                this.fechaSeleccionada(date), this.setState({ selectedDate: date, showSpinner: true });
                            }}
                        />
                        <Text style={styles.textDefault}> No hay turnos para mostrar. </Text>
                    </View>
                </Root>
            );
        } else {
            return (
                <Root>
                    <Content>
                        <View>
                            <Spinner visible={this.state.showSpinner} textContent={'Loading...'} textStyle={styles.spinnerTextStyle} />
                            <StatusBar backgroundColor="#1e90ff"></StatusBar>
                            <Calendar
                                selectedDate={this.state.selectedDate}
                                onDateSelected={(date) => {
                                    this.fechaSeleccionada(date), this.setState({ selectedDate: date, showSpinner: true });
                                }}
                            />

                            <FlatList
                                data={this.state.flatListData}
                                renderItem={({ item, index }) => {
                                    return <FlatListItem esNuevaFranja= {item.esNuevaFranja} franja={item.franja} color={item.color} item={item} index={index} parentFlatList={this} />;
                                }}
                            />

                            <View style={{ flexDirection: 'row', marginLeft: '10%' }}>
                                <View style={styles.buttons}>
                                    <Button
                                        bordered
                                        success
                                        disabled={this.state.showSpinner}
                                        style={{ paddingHorizontal: '8%' }}
                                        onPress={() => {
                                            Alert.alert(
                                                'Atención',
                                                '¿ Desea confirmar la reserva ? ',
                                                [
                                                    { text: 'Cancelar', onPress: () => console.log('Cancel pressed'), style: 'cancel' },
                                                    {
                                                        text: 'Aceptar',
                                                        onPress: async () => {
                                                            this.setState({ showSpinner: true }, async () => {
                                                                if (selectedItems.length == 0) {
                                                                    Toast.show({
                                                                        text: 'Debe seleccionar al menos un turno.',
                                                                        buttonText: 'Aceptar',
                                                                        duration: 3000,
                                                                        position: 'bottom',
                                                                        type: 'warning',
                                                                    });
                                                                    this.setState({ showSpinner: false });
                                                                    return;
                                                                }

                                                                const result = await this.generarReserva();
                                                                if (result == 0) {
                                                                    Toast.show({
                                                                        text: 'Reserva realizada exitosamente.',
                                                                        buttonText: 'Aceptar',
                                                                        duration: 3000,
                                                                        position: 'bottom',
                                                                        type: 'success',
                                                                        onClose: this.onToastClosed.bind(this),
                                                                    });
                                                                } else if (result == 1) {
                                                                    Toast.show({
                                                                        text: 'Los turnos seleccionados deben ser consecutivos.',
                                                                        buttonText: 'Aceptar',
                                                                        duration: 3000,
                                                                        position: 'bottom',
                                                                        type: 'warning',
                                                                    });
                                                                } else if (result == 2) {
                                                                    Toast.show({
                                                                        text: 'Lo siento, ocurrió un error inesperado.',
                                                                        buttonText: 'Aceptar',
                                                                        duration: 3000,
                                                                        position: 'bottom',
                                                                        type: 'danger',
                                                                        onClose: this.onToastClosed.bind(this),
                                                                    });
                                                                } else if (result == 3) {
                                                                    Toast.show({
                                                                        text:
                                                                            'No puede reservar más de ' +
                                                                            this.state.servicio.maxTurnos +
                                                                            ' turnos por reserva.',
                                                                        buttonText: 'Aceptar',
                                                                        duration: 3000,
                                                                        position: 'bottom',
                                                                        type: 'warning',
                                                                    });
                                                                } else if (result == 4) {
                                                                    Toast.show({
                                                                        text:
                                                                            'Todos los turnos deben pertenecer a la misma franja horaria.',
                                                                        buttonText: 'Aceptar',
                                                                        duration: 3000,
                                                                        position: 'bottom',
                                                                        type: 'warning',
                                                                    });
                                                                }
                                                            });
                                                        },
                                                    },
                                                ],
                                                { cancelable: true }
                                            );
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
                        </View>
                    </Content>
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
    buttons: {
        alignItems: 'center',
        justifyContent: 'center',
        width: '45%',
        marginTop: '3%',
        marginBottom: '15%',
    },
    textDefault: {
        marginTop: '55%',
        textAlign: 'center',
        fontSize: 14,
        color: '#8F8787',
        fontWeight: 'normal',
        fontStyle: 'normal',
    },
});

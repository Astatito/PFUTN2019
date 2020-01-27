import React, { Component } from 'react';
import { FlatList, Alert, StyleSheet, View , StatusBar} from 'react-native';
import { ListItem, Left, Body, Text, Right, Thumbnail, Button, Content} from 'native-base';
import { LocalStorage } from '../../../../DataBase/Storage';
import { Database } from '../../../../DataBase/Firebase';
import Swipeout from 'react-native-swipeout';
import Calendar from '../../../../Common/Calendar';
import Spinner from 'react-native-loading-spinner-overlay';
import moment from 'moment';

let selectedItems = [];

class FlatListItem extends Component {

    state = {showSpinner: false, selectedDate: '', isSelected: false };

    render() {
        const swipeOutSettings = {
            style: { backgroundColor: '#fff' }
        };
        if (this.state.isSelected == false) {
            return (
                <Swipeout {...swipeOutSettings}>
                    <ListItem avatar onPress= {() => {
                        if (this.props.item.estado==='Disponible') {
                            if (selectedItems.includes(this.props.item)) {
                                let index = selectedItems.indexOf(this.props.item);
                                selectedItems.splice(index,1)
                                this.setState({ isSelected: false});
                            } else {
                                selectedItems.push(this.props.item)
                                this.setState({ isSelected: true});
                            }
                        }
                        console.log(selectedItems)
                    }}>
                        <Left>
                            <Thumbnail source= {require('../../../../../assets/Images/turnos.png')} />
                        </Left>
                        <Body style={{ alignSelf: 'center', marginTop:'1%'}}>
                            
                            <Text style={{fontSize:14,color: 'green'}}> {this.props.item.estado} </Text>
                        </Body>
                        <Right style={{alignSelf:'center', flexDirection:'row', marginTop:'1.9%'}}>
                            <Text style={{fontSize:12, color:'gray'}}> {this.props.item.desde} </Text>
                            <Text style={{fontSize:12, color:'gray'}}> - </Text>
                            <Text style={{fontSize:12, color:'gray'}}> {this.props.item.hasta} </Text>
                        </Right>
                    </ListItem>
                </Swipeout>
            );
        } else {
            return (
                <Swipeout {...swipeOutSettings}>
                    <ListItem avatar onPress= {() => {
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
                            <Thumbnail source= {require('../../../../../assets/Images/check-azul.png')} />
                        </Left>
                        <Body style={{ alignSelf: 'center', marginTop:'1%'}}>
                            <Text style={{fontSize:14,color: 'green'}}> {this.props.item.estado} </Text>
                        </Body>
                        <Right style={{alignSelf:'center', flexDirection:'row', marginTop:'1.9%'}}>
                            <Text style={{fontSize:12, color:'gray'}}> {this.props.item.desde + ' hs.'} </Text>
                            <Text style={{fontSize:12, color:'gray'}}> - </Text>
                            <Text style={{fontSize:12, color:'gray'}}> {this.props.item.hasta + ' hs.'} </Text>
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
            header: null
        };
    };

    componentWillMount() {
        const { navigation } = this.props;
        const servicio = navigation.getParam('servicio');
        console.log(servicio);

        this.setState({ showSpinner: true, servicio: servicio });

        LocalStorage.load({
            key: 'UsuarioLogueado'
        })
            .then(response => {
                this.setState({ usuario: response });
                this.generarTurnos();
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

    addMinutes = (date, minutes) => {
        return new Date(date.getTime() + minutes * 60000);
    };

    generarTurnos = () => {
        var diferencia = Math.ceil(Math.abs(this.state.servicio.horaFin - this.state.servicio.horaInicio) / 60000);
        var duracionTurno = this.state.servicio.duracionTurno;
        var cantidadTurnos = diferencia / duracionTurno;

        var hora = this.state.servicio.horaInicio;
        var tempArray = [];

        var auxDate = moment(this.state.servicio.horaInicio);

        for (var i = 1; i < cantidadTurnos + 1; i++) {
            var key = 'Turno' + i;
            var estado = 'Disponible';

            var desde = auxDate.format('HH:mm');
            auxDate.add(duracionTurno, 'minutes');
            var hasta = auxDate.format('HH:mm');

            var turno = {
                key: key,
                estado: estado,
                desde: desde,
                hasta: hasta
            };
            tempArray.push(turno);
        }

        this.setState({ showSpinner: false, flatListData: tempArray });
    };

    componentDidMount() {
        setInterval(() => {
            this.setState({
                showSpinner: false
            });
        }, 3000);
    }

    fechaSeleccionada = fecha => {
        var dia = moment(fecha).format('E');
        if (this.state.servicio.disponibilidad[dia - 1]) {
            alert('Podes reservar negro!');
            this.obtenerReservasPorDia(fecha);
        } else {
            alert('No podes reservar hoy cabeza!');
        }
    };

    obtenerReservasPorDia = fecha => {
        var refCountry = Database.collection('Country').doc(this.state.usuario.country);
        var refServicio = refCountry.collection('Servicios').doc(this.state.servicio.key);
        var refReservas = refServicio.collection('Reservas');

        var desde = new Date(
            fecha.year(),
            fecha.month(),
            fecha.date(),
            this.state.servicio.horaInicio.getHours(),
            this.state.servicio.horaInicio.getMinutes()
        );

        var hasta = new Date(
            fecha.year(),
            fecha.month(),
            fecha.date(),
            this.state.servicio.horaFin.getHours(),
            this.state.servicio.horaFin.getMinutes()
        );

        refReservas
            .where('FechaDesde', '>=', desde)
            .where('FechaDesde', '<=', hasta)
            .get()
            .then(snapshot => {
                if (!snapshot.empty) {
                    console.log('Reservas encontradas.');
                    var reservas = [];

                    for (var i = 0; i < snapshot.docs.length; i++) {
                        var reserva = {
                            desde: moment.unix(snapshot.docs[i].data().FechaDesde.seconds).format('HH:mm'),
                            hasta: moment.unix(snapshot.docs[i].data().FechaHasta.seconds).format('HH:mm')
                        };
                        reservas.push(reserva);
                    }
                    this.actualizarTurnos(reservas);
                } else {
                    console.log('No se encontró ninguna reserva.');
                }
            })
            .catch(error => {
                this.setState({ showSpinner: false });
                Alert.alert('Atención', 'Ocurrió un error: ', error);
            });
    };
    actualizarTurnos = reservas => {
        var turnos = this.state.flatListData.map(turno => {
            return {
                key: turno.key,
                estado: 'Disponible',
                desde: turno.desde,
                hasta: turno.hasta
            };
        });

        for (var reserva of reservas) {
            for (var i = 0; i < turnos.length; i++) {
                if (turnos[i].desde >= reserva.desde && turnos[i].desde < reserva.hasta) {
                    turnos[i].estado = 'Ocupado';
                }
            }
        }

        this.setState({ flatListData: turnos });
    };

    render() {
        return (
            <Content>
                <View>
                {/* Descomentar para tener Spinner. */}
                <Spinner visible={this.state.showSpinner} textContent={'Loading...'} textStyle={styles.spinnerTextStyle} />
                <StatusBar backgroundColor="#1e90ff"></StatusBar>

                <Calendar onDateSelected={date => this.fechaSeleccionada(date)} />

                <FlatList
                    data={this.state.flatListData}
                    renderItem={({ item, index }) => {
                        return <FlatListItem item={item} index={index} parentFlatList={this} />;
                    }}
                />

                <View style={{ flexDirection: 'row', marginLeft: '10%' }}>
                    <View style={styles.buttons}>
                        <Button
                            bordered
                            success
                            style={{ paddingHorizontal: '8%' }}
                            onPress={() => {
                                //Lógica para agregar los turnos a una reserva.
                            }}>
                            <Text>Aceptar</Text>
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

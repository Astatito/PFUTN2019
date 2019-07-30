import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Header, Button, Card, CardSection, ButtonCancelar, Field } from '../Common';
import DateTimePicker from 'react-native-modal-datetime-picker';
import { Database } from '../Firebase';
import moment from 'moment';

class PruebaDTP extends Component {
    state = { fecha: new Date(), isDTPVisible: false }; // Inicializa el estado con un objeto Date que representa la fecha y hora actuales

    showDTP = () => {
        // Muestra el DTP.
        this.setState({ isDTPVisible: true });
    };

    handleDTP = datetime => {
        // Asigna el valor elegido al estado, y oculta el DTP.
        this.setState({
            fecha: new Date(datetime),
            isDTPVisible: false
        });
    };

    hideDTP = () => {
        // Oculta el DTP.
        this.setState({ isDTPVisible: false });
    };

    consoleFecha = () => {
        // Recupera la fecha 20/07/2019 de Firestore (en formato Timestamp), y muestra el objeto Date (Sat Jul 20 2019 00:00:00 GMT-0300)
        var dbRef = Database.collection('PruebaDate');
        var dbDoc = dbRef
            .doc('Prueba')
            .get()
            .then(doc => {
                if (doc.exists) {
                    console.log(doc.data().Fecha.toDate());
                } else {
                    console.log('No se encontró nada.');
                }
            })
            .catch(err => {
                console.log('Alto error');
            });
    };

    grabar = () => {
        // Graba la fecha en Firestore
        var fecha = this.state.fecha; // Obtiene la fecha del estado, y setea la hora 00:00:00
        fecha.setHours(0, 0, 0, 0);

        var dbRef = Database.collection('PruebaDate');
        dbRef.add({
            Fecha: fecha // La agrega a la base de datos
        });
    };

    render() {
        return (
            <View>
                <Header headerText="Welcome to CountryApp!" />
                <Card>
                    <CardSection>
                        <Text>{moment(this.state.fecha).format('DD/MM/YYYY')}</Text>
                    </CardSection>
                    <CardSection>
                        <Button onPress={this.showDTP}>Mostrar DTP</Button>
                        <Button onPress={this.consoleFecha}>Get Fecha (FS)</Button>
                        <Button onPress={this.grabar}>Grabar (FS)</Button>
                    </CardSection>
                </Card>
                <DateTimePicker isVisible={this.state.isDTPVisible} onConfirm={this.handleDTP} onCancel={this.hideDTP} />
            </View>
        );
    }
}
const styles = StyleSheet.create({
    botones: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '50%',
        justifyContent: 'flex-start',
        padding: 10
    },
    logueo: {
        textAlign: 'right',
        color: '#000000',
        padding: 8
    }
});
export default PruebaDTP;

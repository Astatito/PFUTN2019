//En este componente es donde se cargan los datos luego de escanear y se pueden modificar si es necesario.
//Los datos serían Nombre, Apellido, Numero de Documento y fecha de nacimiento. Más patente del auto.
import React, { Component } from 'react';
import { View, Text, StyleSheet, Picker } from 'react-native';
import { Header, Card, CardSection, Field, Button, ButtonCancelar } from '../../Common';
import { Database } from '../../Firebase';
import RNPickerSelect from 'react-native-picker-select';
import { ScrollView } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {DatePicker} from  'native-base';
class RegistroVisitante extends Component {
    state = { picker: '', tiposDocumento: [], documento: '' };

    componentWillMount() {
        const { navigation } = this.props;
        const esAcceso = navigation.getParam('esAcceso', false);

        if (esAcceso) {
            const tipoDoc = navigation.getParam('tipoDocumento');
            const numeroDoc = navigation.getParam('numeroDocumento');

            this.setearDatos(tipoDoc, numeroDoc);
        }
    }

    // TODO: extraer este metodo a un modulo aparte para evitar consultas repetitivas a la BD.
    obtenerPickers = () => {
        var dbRef = Database.collection('TipoDocumento');
        var dbDocs = dbRef
            .get()
            .then(snapshot => {
                var tiposDocumento = [];
                snapshot.forEach(doc => {
                    tiposDocumento.push({ value: doc.id, label: doc.data().Nombre });
                });
                this.setState({ tiposDocumento });
            })
            .catch(err => {
                console.log(err);
            });
    };

    setearDatos(tipo, numero) {
        this.setState({
            picker: tipo,
            documento: numero
        });
    }

    render() {
        if (this.state.tiposDocumento.length < 3) {
            this.obtenerPickers();
        }

        return (
            <ScrollView>
                <View style={{ padding: 5 }}>
                    <Text style={styles.logueo}>Ud. se ha logueado como : Encargado</Text>
                    <Header headerText="Registrar nuevo visitante"> </Header>
                    <Card>
                        <CardSection>
                            <Field placeholder="Eg. Juan Pablo" label="Nombre completo" hidden={false} />
                        </CardSection>
                        <CardSection>
                            <Field placeholder="Eg. Soria" label="Apellido" hidden={false} />
                        </CardSection>

                        <View style={styles.picker}>
                            <RNPickerSelect
                                selectedValue={this.state.picker}
                                onValueChange={(itemValue, itemIndex) => this.setState({ picker: itemValue })}
                                items={this.state.tiposDocumento}
                            />
                        </View>

                        <CardSection>
                            <Field
                                placeholder="Eg. 32645187"
                                label="Número de documento"
                                hidden={false}
                                value={this.state.documento}
                                onChangeText={documento => this.setState({ documento })}
                            />
                        </CardSection>
                        <CardSection>
                            <DatePicker
                                defaultDate={new Date(2018, 4, 4)}
                                minimumDate={new Date(2018, 1, 1)}
                                maximumDate={new Date(2018, 12, 31)}
                                locale={"en"}
                                timeZoneOffsetInMinutes={undefined}
                                modalTransparent={false}
                                animationType={"fade"}
                                androidMode={"default"}
                                placeHolderText="Select date"
                                textStyle={{ color: "green" }}
                                placeHolderTextStyle={{ color: "#d3d3d3" }}
                                onDateChange={this.setDate}
                                disabled={false}
                                />
                        </CardSection>
                        
                        <CardSection>
                            <Field placeholder="Eg. 491457" label="Teléfono fijo" hidden={false} />
                        </CardSection>
                        <CardSection>
                            <Field placeholder="Eg. +5493512071228" label="Celular" hidden={false} />
                        </CardSection>
                        <View style={styles.botones}>
                            <CardSection>
                                <Button>Aceptar</Button>
                            </CardSection>
                            <CardSection>
                                <ButtonCancelar>Cancelar</ButtonCancelar>
                            </CardSection>
                        </View>
                    </Card>
                </View>
            </ScrollView>
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
        paddingTop: 10
    },
    picker: {
        borderBottomWidth: 1,
        padding: 5,
        backgroundColor: '#fff',
        justifyContent: 'center',
        flexDirection: 'column',
        borderColor: '#ddd',
        position: 'relative',
        marginTop: 5,
        paddingLeft: 16
    }
});
export default RegistroVisitante;

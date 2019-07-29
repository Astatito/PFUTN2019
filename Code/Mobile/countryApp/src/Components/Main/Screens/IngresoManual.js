import React, { Component } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { Button, Card, CardSection, Header, Field, ButtonCancelar } from '../../Common';
import { Database } from '../../Firebase';
import RNPickerSelect from 'react-native-picker-select';
import { ScrollView } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/MaterialIcons';
class IngresoManual extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            title: 'Ingreso Manual',
            headerLeft: <Icon style={{ paddingLeft: 10 }} onPress={() => navigation.goBack()} name="arrow-back" size={30} />
        };
    };

    state = { picker: '', tiposDocumento: [], documento: '', showSpinner: false };

    // Para activar el spinner, solo agregas esto dentro de un then. this.setState({showSpinner: true});

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

    grabarIngreso = idPersona => {
        var dbRef = Database.collection('Accesos');
        dbRef.add({
            Fecha: new Date(),
            Persona: Database.doc('Personas/' + idPersona),
            Tipo: 'Ingreso'
        });
    };

    registrarNuevoVisitante = () => {
        this.props.navigation.navigate('RegistroVisitante', {
            esAcceso: true,
            tipoDocumento: this.state.picker,
            numeroDocumento: this.state.documento
        });
    };

    obtenerPersona = numeroDocumento => {
        var tipoDocumento = this.state.picker;

        var dbRef = Database.collection('Personas');
        var dbDoc = dbRef
            .where('Documento', '==', this.state.documento)
            .where('TipoDocumento', '==', Database.doc('TipoDocumento/' + tipoDocumento))
            .get()
            .then(snapshot => {
                if (snapshot.empty) {
                    console.log('No se encontró nada.');
                    this.registrarNuevoVisitante();
                }
                snapshot.forEach(doc => {
                    this.grabarIngreso(doc.id);
                    console.log('Ingreso registrado correctamente.');
                });
            })
            .catch(err => {
                console.log('Se rompio todo buscando: ' + this.state.documento);
            });
    };

    render() {
        if (this.state.tiposDocumento.length < 3) {
            this.obtenerPickers();
        }
        if (this.state.showSpinner) {
            return (
                <View style={styles.container}>
                    <ActivityIndicator size="large" color="#007aff" />
                    <Text style={{ color: '#000', textAlign: 'center', fontSize: 18 }}> Loading ... </Text>
                </View>
            );
        } else {
            return (
                <ScrollView>
                    <View style={styles.container}>
                        <Text style={styles.logueo}> Ud. se ha logueado como : Encargado </Text>
                        <Header headerText="Registrar nuevo ingreso"> </Header>
                        <Card>
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
                                    value={this.state.documento}
                                    hidden={false}
                                    onChangeText={documento => this.setState({ documento })}
                                />
                            </CardSection>
                            <View style={styles.botones}>
                                <CardSection>
                                    <Button
                                        onPress={() => {
                                            this.obtenerPersona(this.state.documento);
                                        }}>
                                        Aceptar
                                    </Button>
                                </CardSection>
                                <CardSection>
                                    <ButtonCancelar
                                        onPress={() => {
                                            this.props.navigation.goBack();
                                        }}>
                                        Cancelar
                                    </ButtonCancelar>
                                </CardSection>
                            </View>
                        </Card>
                    </View>
                </ScrollView>
            );
        }
    }
}
const styles = StyleSheet.create({
    container: {
        padding: 5
    },
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

export default IngresoManual;

import React, { Component } from 'react';
import { View, StyleSheet, TextInput, StatusBar } from 'react-native';
import { Database } from '../../Firebase';
import { ScrollView } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Content, Button,Text, Picker } from 'native-base';
import Spinner from 'react-native-loading-spinner-overlay';

const BLUE = '#428AF8'
const LIGHT_GRAY = '#D3D3D3'

class EgresoManual extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            title: 'Egreso Manual',
            headerLeft: <Icon style={{ paddingLeft: 10 }} onPress={() => navigation.goBack()} name="arrow-back" size={30} />
        };
    };
    
    state = { picker: '', tiposDocumento: [], documento: '', showSpinner: false, isFocused:false};

    // TODO: extraer este metodo a un modulo aparte para evitar consultas repetitivas a la BD.
    obtenerPickers = () => {
        var dbRef = Database.collection('TipoDocumento');
        var dbDocs = dbRef
            .get()
            .then(snapshot => {
                var tiposDocumento = [];
                snapshot.forEach(doc => {
                    tiposDocumento.push(doc.data().Nombre);
                });
                this.setState({ tiposDocumento });
            })
    };

    grabarEgreso = idPersona => {
        var dbRef = Database.collection('AccesosDB');
        dbRef.add({
            Fecha: new Date(),
            Persona: Database.doc('PersonasDB/' + idPersona),
            Tipo: 'Egreso'
        });
        alert('Egreso registrado correctamente.');
    };

    registrarNuevoVisitante = () => {
        this.props.navigation.navigate('RegistroVisitante', {
            esAcceso: true,
            tipoAcceso: 'Egreso',
            tipoDocumento: this.state.picker,
            numeroDocumento: this.state.documento
        });
    };

    obtenerPersona = numeroDocumento => {
        var tipoDocumento = this.state.picker;

        var dbRef = Database.collection('PersonasDB');
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
                    this.grabarEgreso(doc.id);
                    console.log('Egreso registrado correctamente.');
                });
            })
            .catch(err => {
                console.log('Se rompio todo buscando: ' + this.state.documento);
            });
    };

    handleFocus = event => {
        this.setState({isFocused:true});
        if(this.props.onFocus) {
            this.props.onFocus(event);
        }
    }
    handleBlur = event => {
        this.setState({isFocused:false});
        if (this.props.onBlur) {
            this.props.onBlur(event);
        }
    }

    render() {
        const {isFocused} = this.state
        
        if (this.state.tiposDocumento.length < 3) {
            this.obtenerPickers();
        }

        return (
            <ScrollView>
                <Content>
                <View style={styles.container}>
                    <Spinner
                            visible={this.state.showSpinner}
                            textContent={'Loading...'}
                            textStyle={styles.spinnerTextStyle}
                        />
                    <StatusBar backgroundColor='#1e90ff'></StatusBar>
                    <Text style={styles.header}> Registrar nuevo Egreso</Text>

                    <Picker
                        note
                        mode="dropdown"
                        style={styles.picker}
                        selectedValue={this.state.picker}
                        onValueChange={(itemValue, itemIndex) => this.setState({ picker: itemValue })}
                        >
                        <Picker.Item label='Tipo de documento' value='-1' color='#7B7C7E'  />
                        {this.state.tiposDocumento.map((item, index) => {
                        return (< Picker.Item label={item} value={item} key={index} />);
                        })}
                    </Picker>
                    
                    <TextInput
                        style={styles.textInput}
                        placeholder='Número de documento'
                        onChangeText= {(documento) => this.setState({documento})}
                        underlineColorAndroid={
                            isFocused ? BLUE : LIGHT_GRAY
                        }
                        onFocus = {this.handleFocus}
                        onBlur={this.handleBlur}
                        keyboardType={'numeric'}
                    />

                    <View style={{flexDirection:'row'}}>
                        <View style={styles.buttons}>
                        <Button bordered success style={{paddingHorizontal:'5%'}}>
                            <Text>Aceptar</Text>
                        </Button>
                        </View>
                        <View style={styles.buttons}>
                        <Button bordered danger style={{paddingHorizontal:'5%'}} onPress={() => {this.props.navigation.goBack()}}>
                            <Text>Cancelar</Text>
                        </Button>
                        </View>
                    </View>

                </View>
                </Content>
            </ScrollView>    
            )}
    }
const styles = StyleSheet.create({
    container: {
        alignItems:'center',
        justifyContent: 'center',
        backgroundColor:'#fff',
        marginHorizontal:'3%',
        marginVertical:'5%',
        flex:1
    },
    spinnerTextStyle: {
        fontSize: 20,
        fontWeight: 'normal',
        color: '#FFF'
      },
    header:{
        textAlign:'center',
        fontSize: 26,
        marginHorizontal:'5%',
        marginTop:'13%',
        color:'#08477A',
        fontWeight:'normal',
        fontStyle: 'normal'
    },
    picker : {
        width:'85%',
        fontSize: 18,
        marginTop:'15%',
        alignItems:'flex-start',
    },
    textInput: {
        width:'80%',
        fontSize: 16,
        alignItems:'flex-start',
        marginTop:'13%',    
    },
    buttons: {
        alignItems: 'center',
        justifyContent:'center',
        width:'45%',
        marginTop:'13%'
    }
});

export default EgresoManual;

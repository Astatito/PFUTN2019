import React, { Component } from 'react';
import { View, StyleSheet, TextInput, StatusBar, Alert } from 'react-native';
import { Database } from '../../Firebase';
import { ScrollView } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Content, Button,Text, Picker } from 'native-base';
import Spinner from 'react-native-loading-spinner-overlay';
import DateTimePicker from 'react-native-modal-datetime-picker';
import moment from 'moment';
import IconFontAwesome from 'react-native-vector-icons/FontAwesome';

const BLUE = '#428AF8'
const LIGHT_GRAY = '#D3D3D3'

class RegistroVisitante extends Component {

    static navigationOptions = ({ navigation }) => {
        return {
            title: 'Registrar visitante',
            headerLeft: <Icon style={{ paddingLeft: 10 }} onPress={() => navigation.goBack()} name="arrow-back" size={30} />
        };
    };

    state = {
        picker: '',
        tiposDocumento: [],
        documento: '',
        tipoAcceso: '',
        nombre: '',
        apellido: '',
        telefono: '',
        celular: '',
        isFocused:false,
        showSpinner: false,
        isVisible: false,
        esDesde:null,
        fechaDesde: moment(Date.now()).format('MMM Do YY '),
        fechaHasta: moment(Date.now()).format('MMM Do YY ')
    };

    componentWillMount() {
        const { navigation } = this.props;
        const esAcceso = navigation.getParam('esAcceso', false);

        if (esAcceso) {
            const tipoDoc = navigation.getParam('tipoDocumento');
            const numeroDoc = navigation.getParam('numeroDocumento');
            const tipoAcceso = navigation.getParam('tipoAcceso');
            this.setearDatos(tipoDoc, numeroDoc, tipoAcceso);
        }
    }

    componentDidMount() {
        Alert.alert(
            'Atención',
            'El visitante no está registrado; por favor, complete el siguiente formulario. ',
            [
                {text: 'Aceptar', onPress: () => console.log('Cancel pressed'), style: 'cancel'},
            ],
        )
    }

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

    setearDatos(tipo, numero, acceso) {
        this.setState({
            picker: tipo,
            documento: numero,
            tipoAcceso: acceso
        });
    }

    registrarDatos() {
        var idPersona = Database.collection('PersonasDB').doc().id;

        var dbRef = Database.collection('PersonasDB');
        dbRef.doc(idPersona).set({
            Nombre: this.state.nombre,
            Apellido: this.state.apellido,
            Documento: this.state.documento,
            FechaNacimiento: this.state.fechaNacimiento,
            Telefono: this.state.telefono,
            Celular: this.state.celular,
            TipoDocumento: Database.doc('TipoDocumento/' + this.state.picker)
        });

        var dbRef = Database.collection('AccesosDB');
        dbRef.add({
            Fecha: new Date(),
            Persona: Database.doc('PersonasDB/' + idPersona),
            Tipo: this.state.tipoAcceso
        });

        alert('Se registró el ' + this.state.tipoAcceso.toLowerCase() + ' del nuevo visitante correctamente.');
    }

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

    handlePicker = (datetime) => {
        if (this.state.esDesde == true ) {
            this.setState({
                isVisible: false,
                fechaDesde : moment(datetime).format('MMM Do YY')
            })
        } 
    }

    hidePicker = () => {
        this.setState({isVisible: false})
    }

    showPicker = () => {
        this.setState({isVisible: true})
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
                    <Text style={styles.header}> Registrar nuevo visitante</Text>

                    <TextInput
                        style={styles.textInput}
                        placeholder='Nombre'
                        onChangeText= {(documento) => this.setState({nombre})}
                        underlineColorAndroid={
                            isFocused ? BLUE : LIGHT_GRAY
                        }
                        onFocus = {this.handleFocus}
                        onBlur={this.handleBlur}
                        keyboardType={'default'}
                    />

                    <TextInput
                        style={styles.textInput}
                        placeholder='Apellido'
                        onChangeText= {(documento) => this.setState({apellido})}
                        underlineColorAndroid={
                            isFocused ? BLUE : LIGHT_GRAY
                        }
                        onFocus = {this.handleFocus}
                        onBlur={this.handleBlur}
                        keyboardType={'default'}
                    />

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

                    <View style={styles.datetime}>
                        <Text style={{alignSelf:'center', color: '#8F8787'}}>Fecha de nacimiento</Text>
                        <Text style={{alignSelf:'center', color:'#1e90ff', paddingHorizontal: '7%', fontSize:15}}> {this.state.fechaHasta} </Text>
                        <IconFontAwesome style={{alignSelf:'center'}} onPress={() => {this.showPicker() ; this.setState({esDesde:false})}} name="calendar" size={25} />
                    </View>

                    <DateTimePicker 
                        isVisible={this.state.isVisible}
                        onConfirm={this.handlePicker}
                        onCancel={this.hidePicker}
                        mode={'date'}
                        is24Hour={true}>
                    </DateTimePicker>

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
        );
    }
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
        marginTop:'7%',
        color:'#08477A',
        fontWeight:'normal',
        fontStyle: 'normal'
    },
    picker : {
        width:'85%',
        fontSize: 18,
        marginTop:'7%',
        alignItems:'flex-start',
    },
    textInput: {
        width:'82%',
        fontSize: 16,
        alignItems:'flex-start',
        marginTop:'7%',    
    },
    buttons: {
        alignItems: 'center',
        justifyContent:'center',
        width:'45%',
        marginTop:'7%'
    },
    datetime: {
        flexDirection:'row',
        alignItems:'flex-start',
        marginTop:'10%',
        width:'80%',

    }
});

export default RegistroVisitante;

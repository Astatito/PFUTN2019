import React, { Component } from 'react';
import { LocalStorage } from '../../Storage';
import { View, StyleSheet, TextInput, StatusBar } from 'react-native';
import { Database } from '../../Firebase';
import { ScrollView } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Content, Button,Text, Picker} from 'native-base';
import Spinner from 'react-native-loading-spinner-overlay';
import DateTimePicker from 'react-native-modal-datetime-picker';
import moment from 'moment';
import IconFontAwesome from 'react-native-vector-icons/FontAwesome';

const BLUE = '#428AF8'
const LIGHT_GRAY = '#D3D3D3'

// import Icon from 'react-native-vector-icons/EvilIcons';
class MiPerfil extends Component {
    static navigationOptions = {
        title: 'Actualizar Datos',
        headerRight: <View />,
}

state = {
    tiposDocumento: [],
    tipoAcceso: '',
    legajo: '69805',
    nombre: 'Juan',
    apellido: 'Perez',
    picker: '',
    documento: '39611837',
    fechaNacimiento: moment(Date.now()).format('MMM Do YY '),
    celular: '3512546785',
    isFocused:false,
    showSpinner: false,
    isVisible: false,
};

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
    this.setState({
        isVisible: false,
        fechaNacimiento : moment(datetime).format('MMM Do YY')
    })
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
                    <View style={styles.viewContainer}>
                        <Text style={styles.textLabel}>Legajo</Text>
                        <TextInput
                            style={{
                                width:'83%',
                                fontSize: 16,
                                alignItems:'flex-start',
                                marginTop:'5%'}}
                            placeholder='Legajo'
                            onChangeText= {(legajo) => this.setState({legajo})}
                            underlineColorAndroid={
                                isFocused ? BLUE : LIGHT_GRAY
                            }
                            onFocus = {this.handleFocus}
                            onBlur={this.handleBlur}
                            keyboardType={'numeric'}
                            value={this.state.legajo}
                        />
                    </View>

                    <View style={styles.viewContainer}>
                        <Text style={styles.textLabel}>Nombre</Text>
                        <TextInput  
                        style={styles.textInput}
                        placeholder='Nombre'
                        onChangeText= {(nombre) => this.setState({nombre})}
                        underlineColorAndroid={
                            isFocused ? BLUE : LIGHT_GRAY
                        }
                        onFocus = {this.handleFocus}
                        onBlur={this.handleBlur}
                        keyboardType={'default'}
                        value={this.state.nombre}
                    />
                    </View>
                    
                    <View style={styles.viewContainer}>
                        <Text style={styles.textLabel}>Apellido</Text>
                        <TextInput
                        style={styles.textInput}
                        placeholder='Apellido'
                        onChangeText= {(apellido) => this.setState({apellido})}
                        underlineColorAndroid={
                            isFocused ? BLUE : LIGHT_GRAY
                        }
                        onFocus = {this.handleFocus}
                        onBlur={this.handleBlur}
                        keyboardType={'default'}
                        value={this.state.apellido}
                    />
                    </View>
                    
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
                    
                    <View style={styles.viewContainer}>
                        <Text style={styles.textLabel}>Documento</Text>
                        <TextInput
                        style={{
                            width:'70%',
                            fontSize: 16,
                            alignItems:'flex-start',
                            marginTop:'5%'}}
                        placeholder='Número de documento'
                        onChangeText= {(documento) => this.setState({documento})}
                        underlineColorAndroid={
                            isFocused ? BLUE : LIGHT_GRAY
                        }
                        onFocus = {this.handleFocus}
                        onBlur={this.handleBlur}
                        keyboardType={'numeric'}
                        value={this.state.documento}
                        editable={false}
                    />
                    </View>

                    <View style={styles.datetime}>
                        <Text style={{alignSelf:'center', color: '#8F8787'}}>Fecha de nacimiento</Text>
                        <Text style={{alignSelf:'center', color:'#1e90ff', paddingHorizontal: '7%', fontSize:15}}> {this.state.fechaNacimiento} </Text>
                        <IconFontAwesome style={{alignSelf:'center'}} onPress={() => {this.showPicker() ; this.setState({fechaNacimiento:false})}} name="calendar" size={25} />
                    </View>

                    <DateTimePicker 
                        isVisible={this.state.isVisible}
                        onConfirm={this.handlePicker}
                        onCancel={this.hidePicker}
                        mode={'date'}
                        is24Hour={true}>
                    </DateTimePicker>

                    <View style={styles.viewContainer}>
                        <Text style={styles.textLabel}>Celular</Text>
                        <TextInput
                        style={styles.textInput}
                        placeholder='Celular'
                        onChangeText= {(celular) => this.setState({celular})}
                        underlineColorAndroid={
                            isFocused ? BLUE : LIGHT_GRAY
                        }
                        onFocus = {this.handleFocus}
                        onBlur={this.handleBlur}
                        keyboardType={'numeric'}
                        value={this.state.celular}
                    />
                    </View>
                    
                    <View style={{flexDirection:'row'}}>
                        <View style={styles.buttons}>
                        <Button bordered success style={{paddingHorizontal:'5%'}}>
                            <Text>Aceptar</Text>
                        </Button>
                        </View>
                        <View style={styles.buttons}>
                        <Button bordered danger style={{paddingHorizontal:'5%'}}>
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
        marginHorizontal:'2%',
        marginVertical:'5%',
        flexDirection:'column',
        flex:1
    },
    spinnerTextStyle: {
        fontSize: 20,
        fontWeight: 'normal',
        color: '#FFF'
      },
    picker : {
        width:'92%',
        fontSize: 18,
        marginTop:'5%',
        alignItems:'flex-start',
    },
    textInput: {
        width:'80%',
        fontSize: 16,
        alignItems:'flex-start',
        marginTop:'5%'
    },
    buttons: {
        alignItems: 'center',
        justifyContent:'center',
        width:'45%',
        marginTop:'6%'
    },
    datetime: {
        flexDirection:'row',
        alignItems:'flex-start',
        marginTop:'10%',
        width:'85%',
    },
    viewContainer: {
        flexDirection:'row',
        alignItems:'center',
        width:'85%',
    },   
    textLabel: {
        alignSelf:'center',
        color: '#8F8787',
        marginRight:'7%',
        marginTop:'5%'
    }
});

export default MiPerfil;

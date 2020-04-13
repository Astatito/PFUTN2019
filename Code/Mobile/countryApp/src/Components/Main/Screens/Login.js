import React, { Component } from 'react';
import { Text, View, StyleSheet, StatusBar, TextInput, TouchableOpacity, Image, KeyboardAvoidingView } from 'react-native';
import { Firebase, Database } from '../../DataBase/Firebase';
import { LocalStorage } from '../../DataBase/Storage';
import Spinner from 'react-native-loading-spinner-overlay';

class Login extends Component {
    state = { email: '', password: '', result: '', showSpinner: false };

    navigationOptions = () => {
        return {
            headerRight: <View />,
            headerStyle: {
                backgroundColor: '#1e90ff'
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
                textAlign: 'center',
                flex: 1
            }
        };
    };

    async onButtonPress() {
        this.setState({ showSpinner: true });
        try {
            Firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password)
            this.setState({ result: 'Logueo exitoso.' });
            const home = await this.logueoUsuario();
            if (home == 1) {
                this.props.navigation.navigate('Propietario')
            } else if (home == 2){
                this.props.navigation.navigate('Encargado')
            }
        } catch (error) {
            this.setState({ result: 'Falló la autenticación.' });
        } finally {
            this.setState({ showSpinner: false });
        }   
    }

    storeUsuario = (keyStore, obj) => {
        LocalStorage.save({
            key: keyStore,
            data: {
                usuario: obj.NombreUsuario,
                tipoUsuario: obj.TipoUsuario.id,
                country: obj.IdCountry.id,
                datos: obj.IdPersona.id
            }
        });
    };

    logueoUsuario = async () => {
        var dbRef = Database.collection('Usuarios');
        try {
            var doc = await dbRef.doc(this.state.email.toLowerCase()).get()
            this.setState({ result: 'Logueo exitoso.' });
            if (doc.exists) {
                this.storeUsuario('UsuarioLogueado', doc.data());
                switch (doc.data().TipoUsuario.id) {
                    case 'Propietario':
                        return 1
                    case 'Encargado':
                        return 2
                }
            }
        } catch (error) {
            
        } 
    };

    componentDidMount() {
        setInterval(() => {
            this.setState({
                showSpinner: false
            });
        }, 3000);
    }

    verificarTextInputs = async(inputArray) => {
        let someEmpty = false
        inputArray.forEach(text => {
            const inputError= text + 'Error'
            if (this.state[text] == '') {
                someEmpty = true
                this.setState({ [inputError] : '*Campo requerido', showSpinner: false  });
            } else {
                this.setState({ [inputError] : '' });
            }
        });
        return someEmpty
    }
    
    render() {
        return (
            <KeyboardAvoidingView behavior="height" style= {styles.wrapper}>
                <View style={styles.container}>
                    <Spinner visible={this.state.showSpinner} textContent={'Loading...'} textStyle={styles.spinnerTextStyle} />
                    <StatusBar backgroundColor="#96D0E8"></StatusBar>
                    <View style={{ height: 250, width: 250, backgroundColor: '#96D0E8', alignItems: 'center', justifyContent: 'center' }}>
                        <Image
                            source={require('../../../assets/Images/LogoTransparente.png')}
                            style={{ height: 250, width: 300, borderRadius: 0, marginBottom: 50 }}></Image>
                    </View>
                    <TextInput
                        style={styles.textInput}
                        placeholder="Usuario"
                        onChangeText={email => this.setState({ email })}
                        underlineColorAndroid="transparent"
                        maxLength={25}
                    />
                    <TextInput
                        style={styles.textInput}
                        placeholder="Contraseña"
                        onChangeText={password => this.setState({ password })}
                        underlineColorAndroid="transparent"
                        secureTextEntry={true}
                        maxLength={25}
                    />
                    <TouchableOpacity style={styles.btn} onPress={this.onButtonPress.bind(this)}>
                        <Text style={{ color: '#fff', fontSize: 18 }}>Log in</Text>
                    </TouchableOpacity>
                    <Text style={styles.result}>{this.state.result}</Text>
                </View>
            </KeyboardAvoidingView>
        );
    }
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1
    },
    spinnerTextStyle: {
        fontSize: 20,
        fontWeight: 'normal',
        color: '#FFF'
    },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#96D0E8',
        paddingLeft: '10%',
        paddingRight: '10%'
    },
    textInput: {
        alignSelf: 'stretch',
        padding: '5%',
        marginBottom: '10%',
        backgroundColor: '#fff'
    },
    btn: {
        alignSelf: 'stretch',
        padding: '5%',
        alignItems: 'center',
        backgroundColor: '#15692C'
    },
    result: {
        paddingTop: '10%',
        fontWeight: 'bold',
        color: '#35383D',
        alignSelf: 'flex-start'
    }
});
export default Login;

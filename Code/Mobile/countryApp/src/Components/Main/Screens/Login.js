import React, { Component } from 'react';
import { Text, View, StyleSheet, StatusBar, TextInput, TouchableOpacity, Image, KeyboardAvoidingView , Alert} from 'react-native';
import { Firebase, Database } from '../../DataBase/Firebase';
import { LocalStorage } from '../../DataBase/Storage';
import Spinner from 'react-native-loading-spinner-overlay';
import firebase from 'firebase/app';
import 'firebase/auth';

class Login extends Component {
    state = { email: '', password: '', result: '', showSpinner: false, passwordError: '', emailError: '' };

    navigationOptions = () => {
        return {
            headerRight: <View />,
            headerStyle: {
                backgroundColor: '#1e90ff',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
                textAlign: 'center',
                flex: 1,
            },
        };
    };

    onButtonPress = async () => {
        try {
            await Firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);
            await Firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password);
            this.setState({ result: 'Logueado con éxito.' });
            var home = await this.registrarUsuarioLogueado(this.state.email.toLowerCase());
        } catch (error) {
            switch (error.code) {
                case 'auth/user-not-found':
                    this.setState({ result: 'No existe el usuario.' });
                    break;
                case 'auth/wrong-password':
                    this.setState({ result: 'Contraseña incorrecta.' });
                    break;
                default:
                    this.setState({ result: 'Falló la autenticación.' });
                    break;
            }
        } finally {
            if (home == 1) {
                this.props.navigation.navigate('Propietario');
            } else if (home == 2) {
                this.props.navigation.navigate('Encargado');
            }
        }
    };

    storeUsuario = (keyStore, obj) => {
        LocalStorage.save({
            key: keyStore,
            data: {
                usuario: obj.NombreUsuario,
                tipoUsuario: obj.TipoUsuario.id,
                country: obj.IdCountry.id,
                datos: obj.IdPersona.id,
            },
        });
    };

    esUsuarioTemporal = async(email) => {
        this.setState({ showSpinner: true });
        var dbRef = Database.collection('UsuariosTemp');
        try {
            var doc = await dbRef.doc(email).get();
            console.log(doc)
            if (doc.exists) {
                this.setState({ showSpinner: false });
                Alert.alert('Atención', 'Bienvenido a LiveSafe, debe realizar el primer ingreso a través de nuestra web.');
                return true
            } else {
                return false
            }
        } catch (error) {
            this.setState({ result: 'Falló la autenticación.' });
        }
    }

    registrarUsuarioLogueado = async (email) => {
        var dbRef = Database.collection('Usuarios');
        try {
            var doc = await dbRef.doc(email).get();
            if (doc.exists) {
                this.storeUsuario('UsuarioLogueado', doc.data());
                switch (doc.data().TipoUsuario.id) {
                    case 'Propietario':
                        return 1;
                    case 'Encargado':
                        return 2;
                }
            }
        } catch (error) {
            this.setState({ result: 'Falló la autenticación.' });
        }
    };

    componentDidMount() {
        setInterval(() => {
            this.setState({
                showSpinner: false,
            });
        }, 5000);
    }

    verificarTextInputs = (inputArray) => {
        let someEmpty = false;
        inputArray.forEach((text) => {
            const inputError = text + 'Error';
            if (this.state[text] == '') {
                someEmpty = true;
                this.setState({ [inputError]: '*Campo requerido', showSpinner: false });
            } else {
                this.setState({ [inputError]: '' });
            }
        });
        return someEmpty;
    };

    validateEmail = (email) => {
        var regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (regex.test(email)) {
            this.setState({ emailError: '' });
            return false;
        } else {
            this.setState({ emailError: '*No es un formato de email válido.', showSpinner: false });
            return true;
        }
    };

    render() {
        return (
                <KeyboardAvoidingView behavior="height" style={styles.wrapper}>
                    <View style={styles.container}>
                        <Spinner visible={this.state.showSpinner} textContent={'Loading...'} textStyle={styles.spinnerTextStyle} />
                        <StatusBar backgroundColor="#96D0E8"></StatusBar>
                        <View
                            style={{ height: 250, width: 250, backgroundColor: '#96D0E8', alignItems: 'center', justifyContent: 'center' }}>
                            <Image
                                source={require('../../../assets/Images/LogoTransparente.png')}
                                style={{ height: 250, width: 300, borderRadius: 0, marginBottom: 50 }}></Image>
                        </View>
                        <TextInput
                            style={styles.textInput}
                            placeholder="Usuario"
                            onChangeText={(email) => this.setState({ email })}
                            underlineColorAndroid="transparent"
                            maxLength={40}
                        />
                        <Text style={styles.error}>{this.state.emailError}</Text>
                        <TextInput
                            style={styles.textInput}
                            placeholder="Contraseña"
                            onChangeText={(password) => this.setState({ password })}
                            underlineColorAndroid="transparent"
                            secureTextEntry={true}
                            maxLength={25}
                        />
                        <Text style={styles.error}>{this.state.passwordError}</Text>
                        <TouchableOpacity
                            style={styles.btn}
                            onPress={async () => {
                                const emailFormat = this.validateEmail(this.state.email);
                                const textInputs = this.verificarTextInputs(['password']);
                                const usuarioTemp = await this.esUsuarioTemporal(this.state.email);
                                if (emailFormat == true || textInputs == true || usuarioTemp == true) {
                                    return;
                                }
                                await this.onButtonPress();
                                this.setState({ showSpinner: false });
                            }}>
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
        flex: 1,
    },
    spinnerTextStyle: {
        fontSize: 20,
        fontWeight: 'normal',
        color: '#FFF',
    },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#96D0E8',
        paddingLeft: '10%',
        paddingRight: '10%',
    },
    textInput: {
        alignSelf: 'stretch',
        padding: '5%',
        marginBottom: '3%',
        marginTop: '5%',
        backgroundColor: '#fff',
    },
    btn: {
        alignSelf: 'stretch',
        padding: '5%',
        alignItems: 'center',
        backgroundColor: '#15692C',
        marginTop: '5%',
    },
    result: {
        paddingTop: '10%',
        fontWeight: 'bold',
        color: '#35383D',
        alignSelf: 'flex-start',
    },
    error: {
        color: 'red',
        alignSelf: 'flex-start',
        fontSize: 12,
        fontWeight: 'bold',
    },
});
export default Login;

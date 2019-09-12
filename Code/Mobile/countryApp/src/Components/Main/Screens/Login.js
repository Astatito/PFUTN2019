import React, { Component } from 'react';
import { Text, View,StyleSheet, StatusBar,TextInput,TouchableOpacity,Image} from 'react-native';
import { Firebase, Database } from '../../Firebase';
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
    }

    onButtonPress() {
        this.setState({ showSpinner: true });
        Firebase.auth()
            .signInWithEmailAndPassword(this.state.email, this.state.password)
            .then(() => {
                this.setState({ result: 'Logueo exitoso.' });
                this.logueoUsuario();
            })
            .catch(() => {
                this.setState({ result: 'Falló la autenticación.' });
                this.setState({ showSpinner: false });
            });
    }

    logueoUsuario = () => {
        var dbRef = Database.collection('UsuariosBD');
        var dbDoc = dbRef
            .doc(this.state.email.toLowerCase())
            .get()
            .then(doc => {
                if (doc.exists) {
                    switch (doc.data().TipoUsuario.id) {
                        case 'Propietario':
                            this.props.navigation.navigate('Propietario');
                            this.setState({ showSpinner: false });
                            break;
                        case 'Encargado':
                            this.props.navigation.navigate('Encargado');
                            this.setState({ showSpinner: false });
                            break;
                    }
                } 
            })
    };

    componentDidMount() {
        setInterval(() => {
          this.setState({
            showSpinner: false
          });
        }, 3000);
      }

    render() {
            return (
                    <View style={styles.container}>
                        <Spinner
                            visible={this.state.showSpinner}
                            textContent={'Loading...'}
                            textStyle={styles.spinnerTextStyle}
                        />
                        <StatusBar backgroundColor='#96D0E8'></StatusBar>
                        <Text style={styles.header}> -  LOGIN  -  </Text>
                        
                        <View style={{ height:250, width:250, backgroundColor: '#96D0E8', alignItems:'center',justifyContent:'center'}}>
                            <Image source={require('../../Logo/LogoTransparente.png')} style={{height:250, width:300, borderRadius:0, marginBottom:50}}></Image>
                        </View>
                        <TextInput
                            style={styles.textInput}
                            placeholder='Usuario'
                            onChangeText= {(email) => this.setState({email})}
                            underlineColorAndroid='transparent'
                        />
                        <TextInput
                            style={styles.textInput}
                            placeholder='Contraseña'
                            onChangeText= {(password) => this.setState({password})}
                            underlineColorAndroid='transparent'
                            secureTextEntry={true}
                        />
                        <TouchableOpacity
                            style={styles.btn}
                            onPress={this.onButtonPress.bind(this)}>
                            <Text style={{color:'#fff', fontSize:18}}>Log in</Text>
                        </TouchableOpacity>
                        <Text style={styles.result}>{this.state.result}</Text>
                    </View>
            );
        }
    }

const styles = StyleSheet.create({
    wrapper: {
        flex:1
    },
    spinnerTextStyle: {
        fontSize: 20,
        fontWeight: 'normal',
        color: '#FFF'
      },
    container: {
        flex: 1,
        alignItems:'center',
        justifyContent: 'center',
        backgroundColor:'#96D0E8',
        paddingLeft: 40,
        paddingRight: 40
    },
    header:{
        fontSize: 30,
        marginBottom:30,
        color:'#35383D',
        fontWeight:'bold',
        fontStyle: 'italic',
        
    },
    textInput:{
        alignSelf:'stretch',
        padding:16,
        marginBottom: 20,
        backgroundColor:'#fff'
    },
    btn: {
        alignSelf:'stretch',
        padding:20,
        alignItems:'center',
        backgroundColor:'#15692C'
    },
    result: {
        paddingTop:15,
         fontWeight:'bold',
         color:'#35383D',
         alignSelf:'flex-start'
    }
});
export default Login;

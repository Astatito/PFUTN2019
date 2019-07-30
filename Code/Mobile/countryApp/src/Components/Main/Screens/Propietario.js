import React, { Component } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Header, Button, Card, CardSection } from '../../Common';
import Logo from '../../Logo/Logo.jpeg';
class Propietario extends Component {
    static navigationOptions = {
        title: 'Home'
    };

    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.logueo}>Ud. se ha logueado como : Propietario</Text>
                <Header headerText="Bienvenido de nuevo !"> </Header>
                <Image style={{ width: '100%', height: '60%', paddingTop: 90 }} source={require('../../Logo/NuevoLogo.jpg')} />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    logueo: {
        textAlign: 'right',
        color: '#000000',
        paddingTop: 10,
        paddingBottom: 5
    },
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        padding: 10
    }
});
export default Propietario;

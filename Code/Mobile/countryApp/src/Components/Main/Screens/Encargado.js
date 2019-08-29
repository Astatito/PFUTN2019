import React, { Component } from 'react';
import { View, StyleSheet, Image, StatusBar } from 'react-native';
import {Text, Content} from 'native-base';

class Encargado extends Component {
    static navigationOptions = {
        title: 'Home'
    };

    render() {
        return (
            <Content>
                <View style={styles.container}>
                    <Text style={styles.logueo}>Ud. se ha logueado como : Encargado</Text>
                    <StatusBar backgroundColor='#1e90ff'></StatusBar>
                    <Text style={styles.header}> Bienvenido de nuevo !</Text>
                    <View style={{ height:380, width: 380, backgroundColor: '#fff', alignItems:'center',justifyContent:'center'}}>
                            <Image source={require('../../Logo/LogoTransparente.png')} style={{height:380, width:380, borderRadius:0}}></Image>
                    </View>
                </View>
            </Content>
            
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems:'center',
        justifyContent: 'center',
        backgroundColor:'#fff',
        paddingLeft: 10,
        paddingRight: 10
    },
    logueo: {
        textAlign: 'right',
        alignSelf: 'flex-end',
        paddingTop:28,
        color: '#000'
    },
    header:{
        fontSize: 28,
        marginBottom:10,
        marginTop:30,
        color:'#35383D',
        fontWeight:'normal',
        fontStyle: 'normal'
    }
});
export default Encargado;

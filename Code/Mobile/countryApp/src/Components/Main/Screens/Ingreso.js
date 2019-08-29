import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { Content, Button, Icon, Text } from 'native-base';
import { ScrollView } from 'react-native-gesture-handler';

class Ingreso extends Component {
    static navigationOptions = {
        title: 'Nuevo Ingreso'
    };

    render() {
        return (
            <ScrollView>
                <Content >
                    <View style={styles.container}>
                        <Text style={styles.logueo}>Ud. se ha logueado como : Encargado</Text>
                        <Text style={styles.header}> ¿Escáner o registro manual?</Text>
                        <View style={styles.button}>
                            <Button iconLeft bordered success large style={{padding:50}}>
                                <Icon name='camera' />
                                <Text>Escáner</Text>
                            </Button>
                        </View>
                        <View style={styles.button}>
                            <Button iconLeft bordered primary large style={{padding:50}}>
                                <Icon name='search' />
                                <Text>Manual</Text>
                            </Button>
                        </View>
                    </View>
                </Content>
            </ScrollView>
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
        fontSize: 26,
        marginBottom:85,
        marginTop:50,
        color:'#35383D',
        fontWeight:'normal',
        fontStyle: 'normal'
    },
    button:{
        alignSelf:'center',
        marginBottom:85,
        alignItems:'center',
    },
});

export default Ingreso;

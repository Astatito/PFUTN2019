import React , {Component} from 'react';
import {View,Text,StyleSheet} from 'react-native';
import {Header,Button,Card,CardSection} from '../../Common';

// import Ingreso from '../Acceso/Ingreso';
// import Egreso from '../Acceso/Egreso';

class Encargado extends Component {
    render () {
        return (
            <View style={styles.container}>
                <Text style={styles.logueo}> Ud. se ha logueado como : Encargado </Text> 
                <Header headerText="Bienvenido de nuevo !"> </Header> 
                <Card>
                    <View style={styles.botones}>
                        <View style={styles.cards}>
                        <CardSection>
                            <Button> Mi perfil </Button>
                        </CardSection>
                        </View>
                        <View style={styles.cards}>
                        <CardSection>
                            <Button> Nuevo Ingreso </Button>
                        </CardSection>
                        </View>
                        <View style={styles.cards}>
                        <CardSection>
                            <Button> Nuevo Egreso </Button>
                        </CardSection>
                        </View>
                        <View style={styles.cards}>
                        <CardSection>
                            <Button> Cerrar Sesión </Button>
                        </CardSection>
                        </View>
                    </View>
                    
                </Card>
            </View>
        );
    }
}

const styles= StyleSheet.create({
    logueo: {
        textAlign: 'right',
        color: '#000000',
        padding:8
    },
    botones: {
        flexDirection: 'column',
        width:'100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    cards: {
        width:'70%',
        padding:30,
        
    }
})
export default Encargado;


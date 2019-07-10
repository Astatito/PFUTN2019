import React , {Component} from 'react';
import {View,Text,StyleSheet} from 'react-native';
import {Header,Button,Card,CardSection,ButtonCancelar,Field} from '../Common';

class PruebaFirebase extends Component {
    render() {
        return (
            <View>
                <Text style={styles.logueo}> Ud. se ha logueado como : Admin </Text>
                <Header headerText='Prueba con Firebase'> </Header> 
                <Card>
                    <CardSection>
                        <Field
                            placeholder="ID de usuario"
                            label="ID Usuario"
                            hidden={false}
                        />
                    </CardSection>
                    <CardSection>
                        <Field
                            placeholder="Password"
                            label="Password"
                            hidden={true}
                        />
                    </CardSection>
                    <View style={styles.botones}>
                        <CardSection>
                            <Button>Aceptar</Button>
                        </CardSection>
                        <CardSection>
                            <ButtonCancelar>Cancelar</ButtonCancelar>
                        </CardSection>
                    </View>
                    
                </Card>
            </View>
        );
    }
}
const styles= StyleSheet.create({
    botones: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '50%',
        justifyContent: 'flex-start',
        padding:10
    },
    logueo: {
        textAlign: 'right',
        color: '#000000',
        padding:8
    }
});
export default PruebaFirebase;
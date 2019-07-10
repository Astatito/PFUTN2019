//En este componente es donde se cargan los datos luego de escanear y se pueden modificar si es necesario.
//Los datos serían Nombre, Apellido, Numero de Documento y fecha de nacimiento. Más patente del auto.
import React, {Component} from 'react';
import {View,Text,StyleSheet} from 'react-native';
import {Header,Card,CardSection,Field,Button,ButtonCancelar } from '../../Common';
class RegistroVisitante extends Component {
    render () {
        return (
            <View >
                <Text style={styles.logueo}> Ud. se ha logueado como : Encargado </Text> 
                <Header headerText="Registrar nuevo visitante"> </Header> 
                <Card>
                    <CardSection>
                        <Field
                            placeholder="Eg. Juan Pablo"
                            label="Nombre completo"
                            hidden={false}
                        />
                    </CardSection>
                    <CardSection>
                        <Field
                            placeholder="Eg. Soria"
                            label="Apellido"
                            hidden={false}
                        />
                    </CardSection>
                    <CardSection>
                        <Field
                            placeholder="Eg. DNI, Pasaporte"
                            label="Tipo de documento"
                            hidden={false}
                        />
                    </CardSection>
                    <CardSection>
                        <Field
                            placeholder="Eg. 32645187"
                            label="Número de documento"
                            hidden={false}
                        />
                    </CardSection>
                    <CardSection>
                        <Field
                            placeholder="Eg. 02/11/1992"
                            label="Fecha de nacimiento"
                            hidden={false}
                        />
                    </CardSection>
                    <CardSection>
                        <Field
                            placeholder="Eg. 491457"
                            label="Teléfono fijo"
                            hidden={false}
                        />
                    </CardSection>
                    <CardSection>
                        <Field
                            placeholder="Eg. +5493512071228"
                            label="Celular"
                            hidden={false}
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
export default RegistroVisitante;
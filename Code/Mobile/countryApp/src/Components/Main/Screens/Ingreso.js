import React, { Component } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { Button, Card, CardSection, Header } from '../../Common';
import { ScrollView } from 'react-native-gesture-handler';

class Ingreso extends Component {
    static navigationOptions = {
        title: 'Nuevo Ingreso'
    };

    render() {
        return (
            <ScrollView>
                <View style={styles.container}>
                    <Text style={styles.logueo}>
                        
                        Ud. se ha logueado como : Encargado
                    </Text>
                    <Header headerText="¿Escaner o registro manual?" />
                    <Card>
                        <View style={styles.botones}>
                            <CardSection>
                                <Button
                                    onPress={() =>
                                        this.props.navigation.navigate(
                                            'Escaner',
                                            { tipo: 'Ingreso' }
                                        )
                                    }
                                >
                                    
                                    Escaner
                                </Button>
                            </CardSection>
                            <CardSection>
                                <Button
                                    onPress={() =>
                                        this.props.navigation.navigate(
                                            'IngresoManual'
                                        )
                                    }
                                >
                                    
                                    Registro Manual
                                </Button>
                            </CardSection>
                        </View>
                    </Card>
                </View>
            </ScrollView>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        padding: 5
    },
    logueo: {
        textAlign: 'right',
        color: '#000000',
        paddingTop: 10
    },
    botones: {
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
        justifyContent: 'center',
        padding: 5
    }
});

export default Ingreso;

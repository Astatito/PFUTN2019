import React, { Component } from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import { Content, Button, Icon, Text } from 'native-base';
import { ScrollView } from 'react-native-gesture-handler';

class Egreso extends Component {
    static navigationOptions = {
        title: 'Nuevo Egreso'
    };

    render() {
        return (
            <ScrollView>
                <Content>
                    <View style={styles.container}>
                        <StatusBar backgroundColor="#1e90ff"></StatusBar>
                        <Text style={styles.header}> ¿Escáner o registro manual?</Text>
                        <View style={styles.button}>
                            <Button
                                iconLeft
                                bordered
                                success
                                large
                                style={{ padding: '10%' }}
                                onPress={() => this.props.navigation.navigate('Escaner', { esIngreso: false })}>
                                <Icon name="camera" />
                                <Text>Escáner</Text>
                            </Button>
                        </View>
                        <View style={styles.button}>
                            <Button
                                iconLeft
                                bordered
                                primary
                                large
                                style={{ padding: '10%' }}
                                onPress={() => this.props.navigation.navigate('EgresoManual')}>
                                <Icon name="search" />
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
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
        marginLeft: '3%',
        marginRight: '3%'
    },
    header: {
        fontSize: 26,
        marginBottom: '25%',
        marginTop: '20%',
        color: '#08477A',
        fontWeight: 'normal',
        fontStyle: 'normal'
    },
    button: {
        alignSelf: 'center',
        marginBottom: '25%',
        alignItems: 'center'
    }
});

export default Egreso;

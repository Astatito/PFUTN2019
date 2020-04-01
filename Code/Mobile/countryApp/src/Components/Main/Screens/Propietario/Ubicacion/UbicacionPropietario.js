import React, { Component } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import Share from 'react-native-share';
import RNFetchBlob from 'rn-fetch-blob';
import { Text, Button, Root, Toast } from 'native-base';

class MiUbicacion extends Component {
    static navigationOptions = {
        title: 'Mi Ubicación',
        headerRight: <View />
    };

    shareImage = async () => {

        share = async base64image => {
            let shareOptions = {
                title: 'Compartir',
                url: base64image,
                message: 'Hola! Aquí te envío el mapa del country MartinDale.',
                subject: 'Mapa del country - MartinDale'
            };
            try {
                await Share.open(shareOptions);
            } catch (error) {
            }
        };

        try {
            const resp = await RNFetchBlob.fetch('GET', `http://www.malubaibiene.com.ar/images/Plano_Martindale.jpg`)
            let base64image = resp.data;
            share('data:image/png;base64,' + base64image);
            return 0
        } catch (error) {
            return 1
        } 
    };

    render() {
        return (
            <Root>
                <View style={styles.container}>
                    <Image style={{ width: '100%', height: '73%' }} source={require('../../../../../assets/Images/ubicacionhome.jpg')} />

                    <View style={{ padding: '5%', width: '100%' }}>
                        <View style={{ padding: '2%' }}>
                            <Button
                                bordered
                                primary
                                block
                                onPress={() => {
                                    this.props.navigation.navigate('ModalForImage', { visible: true });
                                }}>
                                <Text>Ver Ubicación</Text>
                            </Button>
                        </View>

                        <View style={{ padding: '2%' }}>
                            <Button
                                bordered
                                primary
                                block
                                onPress={async () => {
                                    result = await this.shareImage();
                                    if (result == 1) {
                                        Toast.show({
                                            text: "Lo siento, ocurrió un error inesperado.",
                                            buttonText: "Aceptar",
                                            duration: 3000,
                                            position: "bottom",
                                            type: "danger"
                                        })
                                    }
                                }}>
                                <Text>Compartir</Text>
                            </Button>
                        </View>
                    </View>
                </View>
            </Root>
            
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
        paddingLeft: '4%',
        paddingRight: '4%',
        paddingTop: '4%'
    }
});

export default MiUbicacion;

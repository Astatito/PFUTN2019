import React, { Component } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import Share from 'react-native-share';
import RNFetchBlob from 'rn-fetch-blob';
import { Text, Button, Root, Toast } from 'native-base';
import { Database, Storage } from '../../../../DataBase/Firebase';
import { LocalStorage } from '../../../../DataBase/Storage';

class MiUbicacion extends Component {
    static navigationOptions = {
        title: 'Mi Ubicación',
        headerRight: <View />,
    };

    urlImagen = ''
    nombreCountry = ''

    componentWillMount() {
        LocalStorage.load({
            key: 'UsuarioLogueado',
        })
            .then(async (usuario) => {
                const path = await this.obtenerPath(usuario.country);
                urlImagen = await Storage.ref().child(path).getDownloadURL()
            })
            .catch((error) => {
                Toast.show({
                    text: 'La key solicitada no existe.',
                    buttonText: 'Aceptar',
                    duration: 3000,
                    position: 'bottom',
                    type: 'danger',
                });
            });
    }

    obtenerPath = async (country) => {
        const refCountry = Database.collection('Country').doc(country);
        const doc = await refCountry.get();
        const path = doc.data().Imagen;
        nombreCountry = doc.data().Nombre
        return path;
    };

    shareImage = async () => {
        try {
            const resp = await RNFetchBlob.fetch('GET', urlImagen);
            let base64image = resp.data;
            const url = 'data:image/png;base64,' + base64image
            let shareOptions = {
                title: 'Compartir',
                url: url,
                message: 'Hola! Aquí te envío el mapa del country ' + nombreCountry + ' .',
                subject: 'Mapa del country - MartinDale',
            };
            await Share.open(shareOptions);
        } catch (error) {
            console.log(error)
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
                                            text: 'Lo siento, ocurrió un error inesperado.',
                                            buttonText: 'Aceptar',
                                            duration: 3000,
                                            position: 'bottom',
                                            type: 'danger',
                                        });
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
        paddingTop: '4%',
    },
});

export default MiUbicacion;

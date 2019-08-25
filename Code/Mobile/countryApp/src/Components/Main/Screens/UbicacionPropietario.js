import React, { Component } from 'react';
import { View, Image, StyleSheet} from 'react-native';
import { Button, CardSection} from '../../Common';
import Share from 'react-native-share'
import RNFetchBlob from 'rn-fetch-blob';

class MiUbicacion extends Component {
    
    static navigationOptions = {
        title: 'Mi Ubicación',
        headerRight: <View />
    };

    shareImage= () => {
        console.log('llego')
        RNFetchBlob.fetch('GET', `http://www.malubaibiene.com.ar/images/Plano_Martindale.jpg`)
          .then(resp => {
            console.log('response : ', resp);
            console.log(resp.data);
            let base64image = resp.data;
            share('data:image/png;base64,' + base64image);
          })
          .catch(err => errorHandler(err));
        
        share = base64image => {
          console.log('base64image : ', base64image);
          let shareOptions = {
            title: 'Country MartinDale.',
            url: base64image,
            message: 'Hola! Aquí te envío el mapa del country MartinDale.',
            subject: 'Mapa del country - MartinDale'
          };
        
          Share.open(shareOptions)
            .then(res => {
              console.log(res);
            })
            .catch(err => {
              err && console.log(err);
            });
        };
        };
    

    render() {
        
        return (
            <View style={styles.container}>
                <Image style={{ width: '95%', height: '75%' }} source={require('../../Logo/ubicacionhome.jpg')} />
                <CardSection>
                    <Button onPress={() => {
                        this.props.navigation.navigate('ModalForImage',{visible:true})
                    }}> Ver Ubicación </Button>
                </CardSection>
                <CardSection>
                            <Button onPress={() => {this.shareImage()}}> Compartir </Button>
                </CardSection>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
});

export default MiUbicacion;

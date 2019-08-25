import React, { Component } from 'react';
import { Text, View, Modal, TouchableHighlight, BackHandler} from 'react-native';
import { Button, CardSection} from '../../Common';
import {ImageViewer} from 'react-native-image-zoom-viewer'
import Share from 'react-native-share'
import RNFetchBlob from 'rn-fetch-blob';

const image = [
    {
        props: {
            // Or you can set source directory.
            url: '',
            source: require('../../Logo/countrymapa.jpg')
        }
    }
]

class MiUbicacion extends Component {
    state= {
        modalVisible:false,
        };

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

     setModalVisible = visible => {
        this.setState({modalVisible: visible});
      }

    render() {
        return (
            <View
                style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                <Text>Bienvenido a mi Ubicación!</Text>
                
                <Modal visible={this.state.modalVisible} transparent={true}>
                    <ImageViewer imageUrls={image}/>
                    <TouchableHighlight
                        onPress={() => {
                            this.setModalVisible(!this.state.modalVisible);
                        }}>
                        <Text>Hide Modal</Text>
                    </TouchableHighlight>
                </Modal>
                
                <CardSection>
                    <Button onPress={() => {
                        this.setModalVisible(!this.state.modalVisible);
                    }}> Ver Ubicación </Button>
                </CardSection>
                <CardSection>
                            <Button onPress={() => {this.shareImage()}}> Compartir </Button>
                </CardSection>
            </View>
        );
    }
}

export default MiUbicacion;

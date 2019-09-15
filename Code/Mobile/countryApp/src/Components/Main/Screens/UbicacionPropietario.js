import React, { Component } from 'react';
import { View, Image, StyleSheet} from 'react-native';
import Share from 'react-native-share'
import RNFetchBlob from 'rn-fetch-blob';
import {Text, Button} from 'native-base'
class MiUbicacion extends Component {
    
    static navigationOptions = {
        title: 'Mi Ubicación',
        headerRight: <View />
    };

    shareImage= () => {
        RNFetchBlob.fetch('GET', `http://www.malubaibiene.com.ar/images/Plano_Martindale.jpg`)
          .then(resp => {
            let base64image = resp.data;
            share('data:image/png;base64,' + base64image);
          })
          .catch(err => errorHandler(err));
        
        share = base64image => {
          let shareOptions = {
            title: 'Compartir',
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
                <Image style={{ width: '100%', height: '73%' }} source={require('../../Logo/ubicacionhome.jpg')} />

                <View style={{padding:'5%', width: '100%'}}>

                  <View style={{padding:'2%'}}>
                    <Button  bordered primary block onPress={() => {
                        this.props.navigation.navigate('ModalForImage',{visible:true})
                    }}> 
                        <Text>Ver Ubicación</Text> 
                    </Button>
                  </View>

                  <View style={{padding:'2%'}}>
                    <Button bordered primary block onPress={() => {this.shareImage()}}>
                        <Text>Compartir</Text>
                    </Button>
                  </View>

                </View>
                
                
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems:'center',
      justifyContent: 'center',
      backgroundColor:'#fff',
      paddingLeft: '4%',
      paddingRight:'4%',
      paddingTop:'4%'
    }
});

export default MiUbicacion;

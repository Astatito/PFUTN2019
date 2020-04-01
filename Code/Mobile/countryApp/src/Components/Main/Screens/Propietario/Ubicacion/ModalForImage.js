import React, { Component } from 'react';
import { Modal } from 'react-native';
import {ImageViewer} from 'react-native-image-zoom-viewer'

const image = [
    {
        props: {
            source: require('../../../../../assets/Images/countrymapa.jpg')
        }
    }
]

class ModalForImage extends Component {
    static navigationOptions = {
        header:null
    };
    state= {
        modalVisible:true,
    };
    render() {
        return (
            <Modal onRequestClose={() => {
                this.props.navigation.goBack()
                this.setState({modalVisible: false})
            }}  
            visible={this.state.modalVisible} transparent={true}>
                <ImageViewer imageUrls={image}/>
            </Modal>
        );
    }
}

export default ModalForImage ;

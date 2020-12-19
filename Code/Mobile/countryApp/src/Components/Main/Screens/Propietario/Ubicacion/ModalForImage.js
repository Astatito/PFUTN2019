import React, { Component } from 'react';
import { Modal } from 'react-native';
import {ImageViewer} from 'react-native-image-zoom-viewer'

class ModalForImage extends Component {

    static navigationOptions = {
        header:null
    };

    state= {
        modalVisible:true,
        url: ''
    };

    componentWillMount () {
        const { navigation } = this.props;
        const url = navigation.getParam('url');
        this.setState({url: url})
    }

    getUrl = () => {
        const image = [
            {
                url : this.state.url
            }
        ]
        return image
    }

    render() {
        return (
            <Modal onRequestClose={() => {
                this.props.navigation.goBack()
                this.setState({modalVisible: false})
            }}  
            visible={this.state.modalVisible} transparent={true}>
                <ImageViewer imageUrls={this.getUrl()}/>
            </Modal>
        );
    }
}

export default ModalForImage ;

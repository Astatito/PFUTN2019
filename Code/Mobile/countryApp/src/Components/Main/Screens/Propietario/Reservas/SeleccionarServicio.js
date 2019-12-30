import React, { Component } from 'react';
import { FlatList, Alert, StyleSheet, View } from 'react-native';
import { ListItem, Left, Body, Text, Right, Thumbnail } from 'native-base';
import Swipeout from 'react-native-swipeout';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Spinner from 'react-native-loading-spinner-overlay';

var flatListData = [
    {
        key: 'f3hf83fh',
        nombre: 'Cancha de fútbol #1'
    },
    {
        key: 'r48hrh4e',
        nombre: 'Cancha de fútbol #2'
    },
    {
        key: 'rfehre4e',
        nombre: 'Club House'
    },
    {
        key: 'e38hrh4e',
        nombre: 'Cancha de golf #1'
    },
];

class FlatListItem extends Component {

    state = {showSpinner: false };

    render() {
        const swipeOutSettings = {
            style: { backgroundColor: '#fff' }
        };
            return (
                <Swipeout {...swipeOutSettings}>
                    <ListItem avatar onPress= {() => {
                        Alert.alert(
                            'Atención',
                            '¿ Desea reservar el servicio ? ',
                            [
                                { text: 'Cancelar', onPress: () => console.log('Cancel pressed'), style: 'cancel' },
                                {
                                    text: 'Aceptar',
                                    onPress: () => {
                                        this.props.navigation.navigate('SeleccionarTurno');

                                    }
                                }
                            ],
                            { cancelable: true }
                        );
                    }}>
                        <Left>
                            <Thumbnail
                                source={{
                                    uri:
                                        'https://i0.pngocean.com/files/985/518/496/vector-graphics-calendar-clip-art-illustration-computer-icons-calendar-icon.jpg'
                                }}
                            />
                        </Left>
                        <Body style={{ alignSelf: 'center' }}>
                            <Text style={{ fontSize: 14, marginTop: '5.9%', justifyContent:'center' }}> {this.props.item.nombre} </Text>
                        </Body>
                    </ListItem>
                </Swipeout>
            );
    }
}

export default class BasicFlatList extends Component {

    static navigationOptions = ({ navigation }) => {
        return {
            title: 'Servicios',
            headerRight: <View></View>,
            headerLeft: <Icon style={{ paddingLeft: 10 }} onPress={() => navigation.goBack()} name="arrow-back" size={30} />,
        };
    };

    componentWillMount() {
        this.setState({ showSpinner: true });
    }

    componentDidMount() {
        setInterval(() => {
            this.setState({
                showSpinner: false
            });
        }, 3000);
    }

    render() {
        return (
            <View>
                {/* Descomentar para tener Spinner. */}
                {/* <Spinner visible={this.state.showSpinner} textContent={'Loading...'} textStyle={styles.spinnerTextStyle} /> */}
                <FlatList
                data={flatListData}
                renderItem={({ item, index }) => {
                    return <FlatListItem navigation={this.props.navigation} item={item} index={index} parentFlatList={this}></FlatListItem>;
                }}>
                </FlatList>
            </View>
            
        );
    }
}

const styles = StyleSheet.create({
    spinnerTextStyle: {
        fontSize: 20,
        fontWeight: 'normal',
        color: '#FFF'
    }
});

import React, { Component } from 'react';
import { FlatList, Alert, StyleSheet, View } from 'react-native';
import { ListItem, Left, Body, Text, Right, Thumbnail } from 'native-base';
import Swipeout from 'react-native-swipeout';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { LocalStorage } from '../../Storage';
import { Database } from '../../Firebase';
import moment from 'moment';
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
    state = { activeRowKey: null, showSpinner: false };

    render() {
        const swipeOutSettings = {
            autoClose: true,
            style: { backgroundColor: '#fff' },
            onClose: (secId, rowId, direction) => {
                if (this.state.activeRowKey != null) {
                    this.setState({ activeRowKey: null });
                }
            },
            onOpen: (secId, rowId, direction) => {
                Alert.alert(
                    'Atención',
                    'Desea reservar el servicio ? ',
                    [
                        { text: 'Cancelar', onPress: () => console.log('Cancel pressed'), style: 'cancel' },
                        {
                            text: 'Aceptar',
                            onPress: () => {
                                this.props.navigation.navigate('NuevaReserva')
                            }
                        }
                    ],
                    { cancelable: true }
                );
            },
            rowId: this.props.index,
            sectionId: 1
        };
            return (
                <Swipeout {...swipeOutSettings}>
                    <ListItem avatar onPress= {() => console.log('YAYA')}>
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

    constructor(props) {
        super(props);
        state = { deletedRowKey: null };
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
                {/* <Spinner visible={this.state.showSpinner} textContent={'Loading...'} textStyle={styles.spinnerTextStyle} /> */}
                <FlatList
                data={flatListData}
                renderItem={({ item, index }) => {

                    return <FlatListItem item={item} index={index} parentFlatList={this}></FlatListItem>;
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

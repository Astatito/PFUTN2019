import React, { Component } from 'react';
import { FlatList, Alert, StyleSheet, View , StatusBar} from 'react-native';
import { ListItem, Left, Body, Text, Right, Thumbnail } from 'native-base';
import Swipeout from 'react-native-swipeout';
import Calendar from '../../../../Common/Calendar';
import Spinner from 'react-native-loading-spinner-overlay';

var flatListData = [
    {
        key: 'f3hf83fh',
        estado: 'Disponible',
        desde: '16:00 hs',
        hasta: '17:00 hs'
    },
    {
        key: 'r48hrh4e',
        estado: 'Disponible',
        desde: '17:00 hs',
        hasta: '18:00 hs'
    },
    {
        key: 'rfehre4e',
        estado: 'Disponible',
        desde: '18:00 hs',
        hasta: '19:00 hs'
    },
    {
        key: 'e38hrh4e',
        estado: 'Reservado',
        desde: '19:00 hs',
        hasta: '20:00 hs'
    },
];

class FlatListItem extends Component {

    state = {showSpinner: false, selectedDate: '' };

    render() {
        const swipeOutSettings = {
            style: { backgroundColor: '#fff' }
        };
            return (
                <Swipeout {...swipeOutSettings}>
                    <ListItem avatar onPress= {() => {
                        if (this.props.item.estado === 'Disponible') {
                            Alert.alert(
                                'Atención',
                                '¿ Desea reservar el turno ? ',
                                [
                                    { text: 'Cancelar', onPress: () => console.log('Cancel pressed'), style: 'cancel' },
                                    {
                                        text: 'Aceptar',
                                        onPress: () => {
                                            //Funcion que registra el turno en la BD.
                                        }
                                    }
                                ],
                                { cancelable: true }
                            );
                        } else {
                            Alert.alert(
                                'Atención',
                                'Lo siento, este turno no está disponible.',
                                [
                                    {
                                        text: 'Aceptar',
                                        onPress: () => {
                                            console.log('Este turno no se pudo reservar', this.props.item.key)
                                        }
                                    }
                                ],
                                { cancelable: true }
                            );
                        }
                    }}>
                        <Left>
                            <Thumbnail source={{ uri: 'https://cdn.pixabay.com/photo/2016/09/16/09/20/alarm-1673577_960_720.png' }} />
                        </Left>
                        <Body style={{ alignSelf: 'center', marginTop:'1%'}}>
                            <Text style={{fontSize:14,color: 'green'}}> {this.props.item.estado} </Text>
                        </Body>
                        <Right style={{alignSelf:'center', flexDirection:'row', marginTop:'1.9%'}}>
                            <Text style={{fontSize:12, color:'gray'}}> {this.props.item.desde} </Text>
                            <Text style={{fontSize:12, color:'gray'}}> - </Text>
                            <Text style={{fontSize:12, color:'gray'}}> {this.props.item.hasta} </Text>
                        </Right>
                    </ListItem>
                </Swipeout>
            );
    }
}

export default class BasicFlatList extends Component {

    static navigationOptions = ({ navigation }) => {
        return {
            header: null
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
                <StatusBar backgroundColor='#1e90ff' ></StatusBar>

                <Calendar
                     onDateSelected={date => console.log('Date Selected', date)}

                />

                <FlatList
                    data= {flatListData}
                    renderItem = {({item,index}) => {
                        return(
                            <FlatListItem item={item} index={index} parentFlatList={this}/>
                        )
                    }}
                />
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

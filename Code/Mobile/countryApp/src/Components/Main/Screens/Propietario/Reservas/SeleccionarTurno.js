import React, { Component } from 'react';
import { FlatList, Alert, StyleSheet, View , StatusBar} from 'react-native';
import { ListItem, Left, Body, Text, Right, Thumbnail, Button, Content} from 'native-base';
import Swipeout from 'react-native-swipeout';
import Calendar from '../../../../Common/Calendar';
import Spinner from 'react-native-loading-spinner-overlay';

let selectedItems = [];

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

    state = {showSpinner: false, selectedDate: '', isSelected: false };

    render() {
        const swipeOutSettings = {
            style: { backgroundColor: '#fff' }
        };
        if (this.state.isSelected == false) {
            return (
                <Swipeout {...swipeOutSettings}>
                    <ListItem avatar onPress= {() => {
                        if (this.props.item.estado==='Disponible') {
                            if (selectedItems.includes(this.props.item)) {
                                let index = selectedItems.indexOf(this.props.item);
                                selectedItems.splice(index,1)
                                this.setState({ isSelected: false});
                            } else {
                                selectedItems.push(this.props.item)
                                this.setState({ isSelected: true});
                            }
                        }
                        console.log(selectedItems)
                    }}>
                        <Left>
                            <Thumbnail source= {require('../../../../../assets/Images/turnos.png')} />
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
        } else {
            return (
                <Swipeout {...swipeOutSettings}>
                    <ListItem avatar onPress= {() => {
                            if (selectedItems.includes(this.props.item)) {
                                let index = selectedItems.indexOf(this.props.item);
                                selectedItems.splice(index,1)
                                this.setState({ isSelected: false});
                            } else {
                                selectedItems.push(this.props.item)
                                this.setState({ isSelected: true});
                            }
                            console.log(selectedItems)
                    }}>
                        <Left>
                            <Thumbnail source= {require('../../../../../assets/Images/check-azul.png')} />
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
            <Content>
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

                <View style={{ flexDirection: 'row', marginLeft: '10%' }}>
                    <View style={styles.buttons}>
                        <Button
                            bordered
                            success
                            style={{ paddingHorizontal: '8%' }}
                            onPress={() => {
                                //Lógica para agregar los turnos a una reserva.
                            }}>
                            <Text>Aceptar</Text>
                        </Button>
                    </View>
                    <View style={styles.buttons}>
                        <Button
                            bordered
                            danger
                            style={{ paddingHorizontal: '5%' }}
                            onPress={() => {
                                this.props.navigation.goBack();
                            }}>
                            <Text>Cancelar</Text>
                        </Button>
                    </View>
                </View>
                </View>
            </Content>
            
        );
    }
}

const styles = StyleSheet.create({
    spinnerTextStyle: {
        fontSize: 20,
        fontWeight: 'normal',
        color: '#FFF'
    },
    buttons: {
        alignItems: 'center',
        justifyContent: 'center',
        width: '45%',
        marginVertical: '5%'
    }
});

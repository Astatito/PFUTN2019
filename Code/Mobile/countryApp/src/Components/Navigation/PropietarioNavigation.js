// Para que funcione correctamente hay que respetar exactamente el orden en el que están los stacks y los drawers.
// Se lee de abajo hacia arriba.

import React from 'react';
import Propietario from '../Main/Screens/Propietario/Propietario';
import PropietarioPerfil from '../Main/Screens/Propietario/PropietarioPerfil';
import UbicacionPropietario from '../Main/Screens/Propietario/Ubicacion/UbicacionPropietario';
import Invitaciones from '../Main/Screens/Propietario/Invitaciones/Invitaciones';
import NuevoInvitado from '../Main/Screens/Propietario/Invitaciones/NuevoInvitado';
import MisReservas from '../Main/Screens/Propietario/Reservas/MisReservas';
import DatosReserva from '../Main/Screens/Propietario/Reservas/DatosReserva';
import InvitadosReserva from '../Main/Screens/Propietario/Reservas/InvitadosReserva';
import SeleccionarTurno from '../Main/Screens/Propietario/Reservas/SeleccionarTurno';
import SeleccionarServicio from '../Main/Screens/Propietario/Reservas/SeleccionarServicio';
import ModalForImage from '../Main/Screens/Propietario/Ubicacion/ModalForImage';
import IconEvil from 'react-native-vector-icons/EvilIcons';
import IconEntypo from 'react-native-vector-icons/Entypo';
import IconIonicons from 'react-native-vector-icons/Ionicons';
import IconAntDesign from 'react-native-vector-icons/AntDesign';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { View, Text, ScrollView, StyleSheet, Image } from 'react-native';
import { createDrawerNavigator, createBottomTabNavigator, createStackNavigator, DrawerItems, SafeAreaView } from 'react-navigation';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { LocalStorage } from '../DataBase/Storage';

// Este es el custom drawer que permite agregarle cosas al drawer original.
const CustomDrawerContentComponent = props => (
    <ScrollView>
        <SafeAreaView style={styles.container} forceInset={{ top: 'always', horizontal: 'never' }}>
            <View style={{ height: 150, backgroundColor: 'white', alignItems: 'center', justifyContent: 'center' }}>
                <Image source={require('../../assets/Logo/propietario.jpg')} style={{ height: 120, width: 120, borderRadius: 60 }}></Image>
            </View>
            <DrawerItems {...props} />
            <Text style= {{marginTop:'45%'}}> </Text>
            <TouchableOpacity
                onPress={() => {
                    props.navigation.closeDrawer();
                    LocalStorage.remove({ key: 'UsuarioLogueado' });
                    props.navigation.navigate('Login');
                }} style={{flex:1,flexDirection:'row'}}>
                <IconEntypo name= "log-out" style={{fontSize:25,paddingLeft:'6%',paddingTop:'5%', color:'gray'}}></IconEntypo>
                <Text
                    style={{
                        paddingTop: '7%',
                        paddingLeft: '8%',
                        color: '#000',
                        fontWeight: 'bold'
                    }}>
                    Cerrar Sesión
                </Text>
            </TouchableOpacity>
        </SafeAreaView>
    </ScrollView>
);

// Stack - El stack navigator para el home del propietario
const PropietarioStackNavigator = createStackNavigator(
    {
        Propietario: Propietario
    },
    {
        defaultNavigationOptions: ({ navigation }) => {
            return {
                headerLeft: <IconEvil style={{ paddingLeft: 10 }} onPress={() => navigation.openDrawer()} name="navicon" size={30} />,
                headerRight: <View />,
                headerStyle: {
                    backgroundColor: '#1e90ff'
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                    textAlign: 'center',
                    flex: 1
                }
            };
        }
    }
);

// Tab Navigator - Este es el Tab Navigator de Registros.
const PropietarioTabNavigator = createBottomTabNavigator({
    Home: {
        screen: PropietarioStackNavigator,
        navigationOptions: {
            tabBarIcon: ({ tintColor }) => <IconEntypo name="home" size={24} color="#346ECD" />
        }
    }
});

// Stack - El stack navigator para el apartado MiPerfil.
const PropietarioPerfilStackNavigator = createStackNavigator(
    {
        PropietarioPerfil: PropietarioPerfil
    },
    {
        defaultNavigationOptions: ({ navigation }) => {
            return {
                headerLeft: <IconEvil style={{ paddingLeft: 10 }} onPress={() => navigation.openDrawer()} name="navicon" size={30} />,
                headerRight: <View />,
                headerStyle: {
                    backgroundColor: '#1e90ff'
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                    textAlign: 'center',
                    flex: 1
                }
            };
        }
    }
);

// Stack - El stack navigator para el apartado de mi ubicación.
const PropietarioUbicacionStackNavigator = createStackNavigator(
    {
        UbicacionPropietario: UbicacionPropietario,
        ModalForImage: ModalForImage
    },
    {
        defaultNavigationOptions: ({ navigation }) => {
            return {
                headerLeft: <IconEvil style={{ paddingLeft: 10 }} onPress={() => navigation.openDrawer()} name="navicon" size={30} />,
                headerRight: <View />,
                headerStyle: {
                    backgroundColor: '#1e90ff'
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                    textAlign: 'center',
                    flex: 1
                }
            };
        }
    }
);

// Stack - El stack navigator para el apartado de mi ubicación.
const InvitadosReservaStackNavigator = createStackNavigator(
    {
        InvitadosReserva: InvitadosReserva
    },
    {
        defaultNavigationOptions: ({ navigation }) => {
            return {
                title: 'Invitados',
                headerRight: <View></View>,
                headerLeft: <Icon style={{ paddingLeft: 10 }} onPress={() => navigation.navigate('MisReservas')} name="arrow-back" size={30} />,
                headerStyle: {
                    backgroundColor: '#1e90ff'
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                    textAlign: 'center',
                    flex: 1
                },
            };
        }
    }
);
// Stack - El stack navigator para el apartado de mi ubicación.
const DatosReservaStackNavigator = createStackNavigator(
    {
        DatosReserva: DatosReserva
    },
    {
        defaultNavigationOptions: ({ navigation }) => {
            return {
                title: 'Reserva',
                headerRight: <View></View>,
                headerLeft: <Icon style={{ paddingLeft: 10 }} onPress={() => navigation.navigate('MisReservas')} name="arrow-back" size={30} />,
                headerStyle: {
                    backgroundColor: '#1e90ff'
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                    textAlign: 'center',
                    flex: 1
                }
            };
        }
    }
);

//TabNavigator para el manejo de la reserva e invitados de la misma.
const PropietarioReservaTabNavigator = createBottomTabNavigator({
    'Mis Invitados': {
        screen: InvitadosReserva,
        navigationOptions: {
            title:'Invitados',
            headerRight: <View></View>,
            headerLeft: <Icon style={{ paddingLeft: 10 }} onPress={() => navigation.goBack()} name="arrow-back" size={30} />,
            tabBarIcon: ({ tintColor }) => <IconAntDesign name="addusergroup" style={{ fontSize: 25, color: tintColor }}/>,
        }
    },
    'Datos de reserva': {
        screen: DatosReserva,
        navigationOptions: {
            title:'Reserva',
            headerRight: <View></View>,
            headerLeft: <Icon style={{ paddingLeft: 10 }} onPress={() => navigation.goBack()} name="arrow-back" size={30} />,
            tabBarIcon: ({ tintColor }) => <IconEntypo name="text-document" style={{ fontSize: 25, color: tintColor }} color="#346ECD" />,
        }
    },

});

// Stack - El stack navigator para el apartado de reserva de eventos.
const PropietarioEventosStackNavigator = createStackNavigator(
    {
        MisReservas: MisReservas,
        InformacionReserva: PropietarioReservaTabNavigator,
        SeleccionarServicio: SeleccionarServicio,
        SeleccionarTurno: SeleccionarTurno,
    },
    {
        defaultNavigationOptions: ({ navigation }) => {
            return {
                headerStyle: {
                    backgroundColor: '#1e90ff'
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                    textAlign: 'center',
                    flex: 1
                }
            };
        }
    }
);

// Stack - El stack navigator para el apartado de invitaciones.
const PropietarioInvitacionesStackNavigator = createStackNavigator(
    {
        Invitaciones: Invitaciones,
        NuevoInvitado: NuevoInvitado
    },
    {
        defaultNavigationOptions: ({ navigation }) => {
            return {
                headerLeft: <IconEvil style={{ paddingLeft: 10 }} onPress={() => navigation.openDrawer()} name="navicon" size={30} />,
                headerRight: (
                    <IconAntDesign
                        style={{ paddingRight: 10 }}
                        name="plus"
                        size={25}
                        onPress={() => navigation.navigate('NuevoInvitado')}
                    />
                ),
                headerStyle: {
                    backgroundColor: '#1e90ff'
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                    textAlign: 'center',
                    flex: 1
                }
            };
        }
    }
);

//Este es el Drawer del Encargado. Registros, Mi Perfil, Eventos y Cerrar Sesión son las opciones que figuran en el menú lateral de la pantalla Encargado.
const PropietarioNavigation = createDrawerNavigator(
    {
        Registros: {
            screen: PropietarioTabNavigator,
            navigationOptions: {
                drawerIcon: ({ tintColor }) => <IconEntypo name="home" style={{ fontSize: 25, color: tintColor }}></IconEntypo>
            }
        },
        'Mi Perfil': {
            screen: PropietarioPerfilStackNavigator,
            navigationOptions: {
                drawerIcon: ({ tintColor }) => <IconEntypo name="user" style={{ fontSize: 25, color: tintColor }}></IconEntypo>
            }
        },
        'Mi Ubicación': {
            screen: PropietarioUbicacionStackNavigator,
            navigationOptions: {
                drawerIcon: ({ tintColor }) => <IconEntypo name="location-pin" style={{ fontSize: 25, color: tintColor }}></IconEntypo>
            }
        },
        Eventos: {
            screen: PropietarioEventosStackNavigator,
            navigationOptions: {
                drawerIcon: ({ tintColor }) => <IconIonicons name="ios-people" style={{ fontSize: 25, color: tintColor }}></IconIonicons>
            }
        },
        Invitaciones: {
            screen: PropietarioInvitacionesStackNavigator,
            navigationOptions: {
                drawerIcon: ({ tintColor }) => (
                    <IconAntDesign name="addusergroup" style={{ fontSize: 25, color: tintColor }}></IconAntDesign>
                )
            }
        }
    },
    {
        contentComponent: CustomDrawerContentComponent,
        contentOptions: {
            activeTintColor: '#346ECD'
        }
    }
);

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
});

export default PropietarioNavigation;

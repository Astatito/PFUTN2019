// Para que funcione correctamente hay que respetar exactamente el orden en el que están los stacks y los drawers.
// Se lee de abajo hacia arriba.

import React from 'react';
import Propietario from '../Main/Screens/Propietario/Propietario';
import PropietarioPerfil from '../Main/Screens/Propietario/PropietarioPerfil';
import UbicacionPropietario from '../Main/Screens/Propietario/Ubicacion/UbicacionPropietario';
import Invitaciones from '../Main/Screens/Propietario/Invitaciones/Invitaciones';
import NuevoInvitado from '../Main/Screens/Propietario/Invitaciones/NuevoInvitado';
import MisReservas from '../Main/Screens/Propietario/Reservas/MisReservas';
import ReservasFinalizadas from '../Main/Screens/Propietario/Reservas/ReservasFinalizadas';
import DatosReserva from '../Main/Screens/Propietario/Reservas/DatosReserva';
import InvitadosReserva from '../Main/Screens/Propietario/Reservas/InvitadosReserva';
import NuevoInvitadoReserva from '../Main/Screens/Propietario/Reservas/NuevoInvitadoReserva';
import InvitadosExistentesReserva from '../Main/Screens/Propietario/Reservas/InvitadosExistentesReserva';
import SeleccionarTurno from '../Main/Screens/Propietario/Reservas/SeleccionarTurno';
import SeleccionarServicio from '../Main/Screens/Propietario/Reservas/SeleccionarServicio';
import ModalForImage from '../Main/Screens/Propietario/Ubicacion/ModalForImage';
import IconEvil from 'react-native-vector-icons/EvilIcons';
import IconEntypo from 'react-native-vector-icons/Entypo';
import IconIonicons from 'react-native-vector-icons/Ionicons';
import IconAntDesign from 'react-native-vector-icons/AntDesign';
import Icon from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { View, Text, ScrollView, StyleSheet, Image, Alert } from 'react-native';
import { createDrawerNavigator, createBottomTabNavigator, createStackNavigator, DrawerItems, SafeAreaView } from 'react-navigation';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { LocalStorage } from '../DataBase/Storage';
import ModificarInvitado from '../Main/Screens/Propietario/Invitaciones/ModificarInvitado';
import Share from 'react-native-share'

//Funcion para compartir el link de invitacion de una reserva
shareImage= () => {
    
      let shareOptions = {
        title: 'Compartir',
        message: 'Hola! Aquí te envío la invitación para mi evento.',
        subject: 'Invitación a mi evento'
      };
    
      Share.open(shareOptions)
        .then(res => {
          console.log(res);
        })
        .catch(err => {
          err && console.log(err);
        });
    
};

// Este es el custom drawer que permite agregarle cosas al drawer original.
const CustomDrawerContentComponent = props => (
    <ScrollView>
        <SafeAreaView style={styles.container} forceInset={{ top: 'always', horizontal: 'never' }}>
            <View style={{ height: 150, backgroundColor: 'white', alignItems: 'center', justifyContent: 'center' }}>
                <Image source={require('../../assets/Images/propietario.jpg')} style={{ height: 120, width: 120, borderRadius: 60 }}></Image>
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

// Tab Navigator - Este es el Tab Navigator de Home.
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

// Stack - El stack navigator para el apartado MiPerfil.
const PropietarioEventosInvitadosStackNavigator = createStackNavigator(
    {
        InvitadosReserva : InvitadosReserva
    },
    {
        defaultNavigationOptions: ({ navigation }) => {
            return {
                title: 'Invitados',
                headerLeft: <Icon style={{ paddingLeft: 10 }} onPress={() => navigation.goBack(null)} name="arrow-back" size={30} />,
                headerRight: (
                    <View style={styles.iconContainer}>
                        <IconEntypo style={{ paddingRight: 15 }} name="share" size={23} onPress={() => {this.shareImage()}}/>
                        <IconAntDesign style={{ paddingRight: 10 }} name="plus"size={25}
                        onPress={() => navigation.navigate('InvitadosExistentesReserva')}
                    />
                    </View>
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

// Stack - El stack navigator para el apartado MiPerfil.
const PropietarioDatosReservaStackNavigator = createStackNavigator(
    {
        DatosReserva : DatosReserva
    },
    {
        defaultNavigationOptions: ({ navigation }) => {
            return {
                title: 'Reserva',
                headerLeft: <Icon style={{ paddingLeft: 10 }} onPress={() => navigation.goBack(null)} name="arrow-back" size={30} />,
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

//TabNavigator para el manejo de la reserva e invitados de la misma.
const PropietarioReservaTabNavigator = createBottomTabNavigator({
    'Mis Invitados': {
        screen: PropietarioEventosInvitadosStackNavigator,
        navigationOptions: {
            title:'Invitados',
            tabBarIcon: ({ tintColor }) => <IconAntDesign name="addusergroup" style={{ fontSize: 25, color: tintColor }}/>,
        }
    },
    'Datos de reserva': {
        screen: PropietarioDatosReservaStackNavigator,
        navigationOptions: {
            title:'Reserva',
            headerRight: <View></View>,
            tabBarIcon: ({ tintColor }) => <IconEntypo name="text-document" style={{ fontSize: 25, color: tintColor }} color="#346ECD" />,
        }
    },

});

// Stack - El stack navigator para las reservas activas.
const PropietarioReservasActivasStackNavigator = createStackNavigator(
    {
        ReservasPendientes : MisReservas
    },
    {
        defaultNavigationOptions: ({ navigation }) => {
            return {
                title: 'Mis Reservas',
                headerLeft: <IconEvil style={{ paddingLeft: 10 }} onPress={() => navigation.openDrawer()} name="navicon" size={30} />,
                headerRight: <IconAntDesign style={{ paddingRight: 10 }} name="plus" size={25} onPress={() => navigation.navigate('SeleccionarServicio')}/>,
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

// Stack - El stack navigator para las reservas finalizadas.
const PropietarioReservasFinalizadasStackNavigator = createStackNavigator(
    {
        ReservasFinalizadas : ReservasFinalizadas
    },
    {
        defaultNavigationOptions: ({ navigation }) => {
            return {
                title: 'Mis Reservas',
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

//TabNavigator para el manejo de las reservas pendientes y pasadas.
const PropietarioMisReservasTabNavigator = createBottomTabNavigator({
    'Activas': {
        screen: PropietarioReservasActivasStackNavigator,
        navigationOptions: {
            title:'Activas',
            tabBarIcon: ({ tintColor }) => <MaterialCommunityIcons name="account-group" style={{ fontSize: 30, color: tintColor }}/>,
        }
    },
    'Finalizadas': {
        screen: PropietarioReservasFinalizadasStackNavigator,
        navigationOptions: {
            title:'Finalizadas',
            tabBarIcon: ({ tintColor }) => <IconAntDesign name="book" style={{ fontSize: 25, color: tintColor }}/>,
        }
    }},
    {
        initialRouteName: "Activas"
    }
    );

// Stack - El stack navigator para el apartado de reserva de eventos.
const PropietarioEventosStackNavigator = createStackNavigator(
    {
        MisReservas: {
            screen: PropietarioMisReservasTabNavigator,
            navigationOptions: {
            header: null
            }
        },
        InvitadosReserva: InvitadosReserva,
        DatosReserva: DatosReserva,
        InformacionReserva: {
            screen: PropietarioReservaTabNavigator,
            navigationOptions: {
            header: null
            }
        },
        SeleccionarServicio: SeleccionarServicio,
        SeleccionarTurno: SeleccionarTurno,
        NuevoInvitadoReserva: NuevoInvitadoReserva,
        InvitadosExistentesReserva: InvitadosExistentesReserva
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
        ModificarInvitado: ModificarInvitado,
        NuevoInvitado: NuevoInvitado,
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

//Este es el Drawer del Encargado. Home, Mi Perfil, Eventos y Cerrar Sesión son las opciones que figuran en el menú lateral de la pantalla Encargado.
const PropietarioNavigation = createDrawerNavigator(
    {
        Home: {
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
    },
    iconContainer: {
        flexDirection: "row",
        justifyContent: "space-evenly",
        width: 100
    }
});


export default PropietarioNavigation;

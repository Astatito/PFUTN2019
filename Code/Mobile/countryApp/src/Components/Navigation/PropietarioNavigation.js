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
import InvitadosExistentesReserva from '../Main/Screens/Propietario/Reservas/InvitadosExistentesReserva';
import SeleccionarTurno from '../Main/Screens/Propietario/Reservas/SeleccionarTurno';
import SeleccionarServicio from '../Main/Screens/Propietario/Reservas/SeleccionarServicio';
import ModalForImage from '../Main/Screens/Propietario/Ubicacion/ModalForImage';
import IconEvil from 'react-native-vector-icons/EvilIcons';
import IconEntypo from 'react-native-vector-icons/Entypo';
import IconIonicons from 'react-native-vector-icons/Ionicons';
import IconAntDesign from 'react-native-vector-icons/AntDesign';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Toast, Root } from 'native-base'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { View, Text, ScrollView, StyleSheet, Image } from 'react-native';
import { createDrawerNavigator, createBottomTabNavigator, createStackNavigator, DrawerItems, SafeAreaView } from 'react-navigation';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { LocalStorage } from '../DataBase/Storage';
import { Firebase } from '../DataBase/Firebase';
import ModificarInvitado from '../Main/Screens/Propietario/Invitaciones/ModificarInvitado';
import CambiarContraseña from '../Main/Screens/CambiarContraseña';
import Notificaciones from '../Main/Screens/Propietario/Notificaciones';

// Este es el custom drawer que permite agregarle cosas al drawer original.
const CustomDrawerContentComponent = (props) => (
    <Root>
        <ScrollView contentContainerStyle={{ flex: 1, flexDirection: 'column', justifyContent: 'space-between' }}>
            <SafeAreaView forceInset={{ top: 'always', horizontal: 'never' }}>
                <View style={{ height: '35%', backgroundColor: 'white', alignItems: 'center', justifyContent: 'center' }}>
                    <Image
                        source={require('../../assets/Images/propietario.jpg')}
                        style={{ height: 120, width: 120, borderRadius: 60 }}></Image>
                </View>
                <DrawerItems {...props} />
            </SafeAreaView>
            <SafeAreaView>
                <TouchableOpacity
                    onPress={() => {
                        Firebase.auth()
                            .signOut()
                            .then(() => {
                                props.navigation.closeDrawer();
                                LocalStorage.remove({ key: 'UsuarioLogueado' });
                                props.navigation.navigate('Login');
                            })
                            .catch((error) => {
                                Toast.show({
                                    text: "Lo siento, ocurrió un error inesperado.",
                                    buttonText: "Aceptar",
                                    duration: 3000,
                                    position: "bottom",
                                    type: "danger",
                                })
                            });
                    }}>
                    <View style={styles.item}>
                        <View style={styles.iconContainer}>
                            <IconEntypo name="log-out" style={{ fontSize: 25, paddingLeft: '6%', paddingTop: '5%', color: 'gray' }}></IconEntypo>
                        </View>
                        <Text style={styles.label}>Cerrar Sesión</Text>
                    </View>
                </TouchableOpacity>
            </SafeAreaView>
        </ScrollView>
    </Root>
);

const CambiarContraseñaStackNavigator = createStackNavigator(
    {
        CambiarContraseña: CambiarContraseña,
    },
    {
        defaultNavigationOptions: ({ navigation }) => {
            return {
                title: 'Actualizar contraseña',
                headerRight: <View></View>,
                headerLeft: <IconEvil style={{ paddingLeft: 10 }} onPress={() => navigation.openDrawer()} name="navicon" size={30} />,
                headerStyle: {
                    backgroundColor: '#1e90ff',
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                    textAlign: 'center',
                    flex: 1,
                },
            };
        },
    }
);


// Stack - El stack navigator para el apartado MiPerfil.
const PropietarioPerfilStackNavigator = createStackNavigator(
    {
        PropietarioPerfil: PropietarioPerfil,
    },
    {
        defaultNavigationOptions: ({ navigation }) => {
            return {
                headerLeft: <IconEvil style={{ paddingLeft: 10 }} onPress={() => navigation.openDrawer()} name="navicon" size={30} />,
                headerRight: <View />,
                headerStyle: {
                    backgroundColor: '#1e90ff',
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                    textAlign: 'center',
                    flex: 1,
                },
            };
        },
    }
);

// Stack - El stack navigator para el apartado de mi ubicación.
const PropietarioUbicacionStackNavigator = createStackNavigator(
    {
        UbicacionPropietario: UbicacionPropietario,
        ModalForImage: ModalForImage,
    },
    {
        defaultNavigationOptions: ({ navigation }) => {
            return {
                headerLeft: <IconEvil style={{ paddingLeft: 10 }} onPress={() => navigation.openDrawer()} name="navicon" size={30} />,
                headerRight: <View />,
                headerStyle: {
                    backgroundColor: '#1e90ff',
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                    textAlign: 'center',
                    flex: 1,
                },
            };
        },
    }
);

// Stack - El stack navigator para el apartado MiPerfil.
const PropietarioEventosInvitadosStackNavigator = createStackNavigator({
    InvitadosReserva: InvitadosReserva,
});

// Stack - El stack navigator para el apartado MiPerfil.
const PropietarioDatosReservaStackNavigator = createStackNavigator(
    {
        DatosReserva: DatosReserva,
    },
    {
        defaultNavigationOptions: ({ navigation }) => {
            return {
                title: 'Reserva',
                headerLeft: <Icon style={{ paddingLeft: 10 }} onPress={() => navigation.goBack(null)} name="arrow-back" size={30} />,
                headerRight: <View />,
                headerStyle: {
                    backgroundColor: '#1e90ff',
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                    textAlign: 'center',
                    flex: 1,
                },
            };
        },
    }
);

//TabNavigator para el manejo de la reserva e invitados de la misma.
const PropietarioReservaTabNavigator = createBottomTabNavigator({
    'Mis Invitados': {
        screen: PropietarioEventosInvitadosStackNavigator,
        navigationOptions: {
            title: 'Invitados',
            tabBarIcon: ({ tintColor }) => <IconAntDesign name="addusergroup" style={{ fontSize: 25, color: tintColor }} />,
        },
    },
    'Datos de reserva': {
        screen: PropietarioDatosReservaStackNavigator,
        navigationOptions: {
            title: 'Reserva',
            headerRight: <View></View>,
            tabBarIcon: ({ tintColor }) => <IconEntypo name="text-document" style={{ fontSize: 25, color: tintColor }} color="#346ECD" />,
        },
    },
});

// Stack - El stack navigator para las reservas activas.
const PropietarioReservasActivasStackNavigator = createStackNavigator(
    {
        ReservasPendientes: MisReservas,
    },
    {
        defaultNavigationOptions: ({ navigation }) => {
            return {
                title: 'Mis Reservas',
                headerLeft: <IconEvil style={{ paddingLeft: 10 }} onPress={() => navigation.openDrawer()} name="navicon" size={30} />,
                headerRight: (
                    <IconAntDesign
                        style={{ paddingRight: 10 }}
                        name="plus"
                        size={25}
                        onPress={() => navigation.navigate('SeleccionarServicio')}
                    />
                ),
                headerStyle: {
                    backgroundColor: '#1e90ff',
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                    textAlign: 'center',
                    flex: 1,
                },
            };
        },
    }
);

// Stack - El stack navigator para las reservas finalizadas.
const PropietarioReservasFinalizadasStackNavigator = createStackNavigator(
    {
        ReservasFinalizadas: ReservasFinalizadas,
    },
    {
        defaultNavigationOptions: ({ navigation }) => {
            return {
                title: 'Mis Reservas',
                headerLeft: <IconEvil style={{ paddingLeft: 10 }} onPress={() => navigation.openDrawer()} name="navicon" size={30} />,
                headerRight: <View />,
                headerStyle: {
                    backgroundColor: '#1e90ff',
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                    textAlign: 'center',
                    flex: 1,
                },
            };
        },
    }
);

//TabNavigator para el manejo de las reservas pendientes y pasadas.
const PropietarioMisReservasTabNavigator = createBottomTabNavigator(
    {
        Activas: {
            screen: PropietarioReservasActivasStackNavigator,
            navigationOptions: {
                title: 'Activas',
                tabBarIcon: ({ tintColor }) => <MaterialCommunityIcons name="account-group" style={{ fontSize: 30, color: tintColor }} />,
            },
        },
        Finalizadas: {
            screen: PropietarioReservasFinalizadasStackNavigator,
            navigationOptions: {
                title: 'Finalizadas',
                tabBarIcon: ({ tintColor }) => <IconAntDesign name="book" style={{ fontSize: 25, color: tintColor }} />,
            },
        },
    },
    {
        initialRouteName: 'Activas',
    }
);

// Stack - El stack navigator para el apartado de reserva de eventos.
const PropietarioEventosStackNavigator = createStackNavigator(
    {
        MisReservas: {
            screen: PropietarioMisReservasTabNavigator,
            navigationOptions: {
                header: null,
            },
        },
        InvitadosReserva: InvitadosReserva,
        DatosReserva: DatosReserva,
        InformacionReserva: {
            screen: PropietarioReservaTabNavigator,
            navigationOptions: {
                header: null,
            },
        },
        SeleccionarServicio: SeleccionarServicio,
        SeleccionarTurno: SeleccionarTurno,
        InvitadosExistentesReserva: InvitadosExistentesReserva,
    },
    {
        defaultNavigationOptions: ({ navigation }) => {
            return {
                headerStyle: {
                    backgroundColor: '#1e90ff',
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                    textAlign: 'center',
                    flex: 1,
                },
            };
        },
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
                    backgroundColor: '#1e90ff',
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                    textAlign: 'center',
                    flex: 1,
                },
            };
        },
    }
);

// Stack - El stack navigator para el home del propietario
const PropietarioStackNavigator = createStackNavigator(
    {
        Propietario: Propietario,
        Notificaciones: Notificaciones,
        InformacionReserva: {
            screen: PropietarioReservaTabNavigator,
            navigationOptions: {
                header: null,
            },
        },
    },
    {
        defaultNavigationOptions: ({ navigation }) => {
            return {
                headerLeft: <IconEvil style={{ paddingLeft: 10 }} onPress={() => navigation.openDrawer()} name="navicon" size={30} />,
                headerRight: <View />,
                headerStyle: {
                    backgroundColor: '#1e90ff',
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                    textAlign: 'center',
                    flex: 1,
                },
            };
        },
    }
);

const PropietarioNavigation = createDrawerNavigator(
    {
        Home: {
            screen: PropietarioStackNavigator,
            navigationOptions: {
                drawerIcon: ({ tintColor }) => <IconEntypo name="home" style={{ fontSize: 25, color: tintColor }}></IconEntypo>,
            },
        },
        'Mi Perfil': {
            screen: PropietarioPerfilStackNavigator,
            navigationOptions: {
                drawerIcon: ({ tintColor }) => <IconEntypo name="user" style={{ fontSize: 25, color: tintColor }}></IconEntypo>,
            },
        },
        'Mi Ubicación': {
            screen: PropietarioUbicacionStackNavigator,
            navigationOptions: {
                drawerIcon: ({ tintColor }) => <IconEntypo name="location-pin" style={{ fontSize: 25, color: tintColor }}></IconEntypo>,
            },
        },
        Eventos: {
            screen: PropietarioEventosStackNavigator,
            navigationOptions: {
                drawerIcon: ({ tintColor }) => <IconIonicons name="ios-people" style={{ fontSize: 25, color: tintColor }}></IconIonicons>,
            },
        },
        Invitaciones: {
            screen: PropietarioInvitacionesStackNavigator,
            navigationOptions: {
                drawerIcon: ({ tintColor }) => (
                    <IconAntDesign name="addusergroup" style={{ fontSize: 25, color: tintColor }}></IconAntDesign>
                ),
            },
        },
        Contraseña: {
            screen: CambiarContraseñaStackNavigator,
            navigationOptions: {
                drawerIcon: ({ tintColor }) => (
                    <IconEntypo name="key" style={{ fontSize: 25, paddingLeft: '6%', paddingTop: '5%', color: 'gray' }}></IconEntypo>
                ),
            },
        }
    },
    {
        contentComponent: CustomDrawerContentComponent,
        contentOptions: {
            activeTintColor: '#346ECD',
        },
    }
);

const styles = StyleSheet.create({
    item: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    label: {
        marginHorizontal: 16,
        marginVertical: 26,
        fontWeight: 'bold',
        color: 'rgba(0, 0, 0, .87)'
    },
    iconContainer: {
        marginHorizontal: 16,
        width: 24,
        alignItems: 'center',
    },
    icon: {
        width: 24,
        height: 24,
    },
});

export default PropietarioNavigation;

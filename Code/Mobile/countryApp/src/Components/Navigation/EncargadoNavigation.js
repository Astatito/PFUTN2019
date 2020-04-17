// Para que funcione correctamente hay que respetar exactamente el orden en el que están los stacks y los drawers.
// Se lee de abajo hacia arriba.

import React from 'react';
import Encargado from '../Main/Screens/Encargado/Encargado';
import Ingreso from '../Main/Screens/Encargado/Ingreso/Ingreso';
import IngresoManual from '../Main/Screens/Encargado/Ingreso/IngresoManual';
import Egreso from '../Main/Screens/Encargado/Egreso/Egreso';
import EgresoManual from '../Main/Screens/Encargado/Egreso/EgresoManual';
import EncargadoPerfil from '../Main/Screens/Encargado/EncargadoPerfil';
import Escaner from '../Main/Screens/Encargado/Escaner';
import RegistroVisitante from '../Main/Screens/Encargado/Ingreso/RegistroVisitante';
import IconEvil from 'react-native-vector-icons/EvilIcons';
import IconEntypo from 'react-native-vector-icons/Entypo';
import IconCommunity from 'react-native-vector-icons/MaterialCommunityIcons';
import { Toast, Root } from 'native-base'
import { View, Text, ScrollView, StyleSheet, Image } from 'react-native';
import { createDrawerNavigator, createBottomTabNavigator, createStackNavigator, DrawerItems, SafeAreaView } from 'react-navigation';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { LocalStorage } from '../DataBase/Storage';
import { Firebase } from '../DataBase/Firebase';

// Este es el custom drawer que permite agregarle cosas al drawer original.
const CustomDrawerContentComponent = (props) => (
    <Root>
        <ScrollView contentContainerStyle={{ flex: 1, flexDirection: 'column', justifyContent: 'space-between' }}>
            <SafeAreaView forceInset={{ top: 'always', horizontal: 'never' }}>
                <View style={{ height: '45%', backgroundColor: 'white', alignItems: 'center', justifyContent: 'center' }}>
                    <Image source={require('../../assets/Images/guardia.jpg')} style={{ height: 120, width: 120, borderRadius: 60 }}></Image>
                </View>
                <DrawerItems {...props} />
            </SafeAreaView>
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
        </ScrollView>
    </Root>
);

// Stack 1 - El stack navigator para el home del encargado.
const EncargadoStackNavigator = createStackNavigator(
    {
        Encargado: Encargado,
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

//Stack 2 - IngresoStackNavigator
const IngresoStackNavigator = createStackNavigator(
    {
        Ingreso: Ingreso,
        IngresoManual: IngresoManual,
        Escaner: Escaner,
        RegistroVisitante: RegistroVisitante,
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

//Stack 3 - EgresoStackNavigator
const EgresoStackNavigator = createStackNavigator(
    {
        Egreso: Egreso,
        EgresoManual: EgresoManual,
        Escaner: Escaner,
        RegistroVisitante,
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

//Este es el Tab Navigator. El titulo superior que se encuentra en la franja azul se pone automáticamente.

const EncargadoTabNavigator = createBottomTabNavigator({
    Home: {
        screen: EncargadoStackNavigator,
        navigationOptions: {
            tabBarIcon: ({ tintColor }) => <IconEntypo name="home" size={24} color="#346ECD" />,
        },
    },
    'Nuevo Ingreso': {
        screen: IngresoStackNavigator,
        navigationOptions: {
            tabBarIcon: ({ tintColor }) => <IconCommunity name="run" size={24} color="#346ECD" />,
        },
    },
    'Nuevo Egreso': {
        screen: EgresoStackNavigator,
        navigationOptions: {
            tabBarIcon: ({ tintColor }) => <IconCommunity name="exit-run" size={24} color="#346ECD" />,
        },
    },
});

// Stack - El stack navigator para el apartado MiPerfil.
const EncargadoPerfilStackNavigator = createStackNavigator(
    {
        EncargadoPerfil: EncargadoPerfil,
        Encargado: Encargado,
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

//Este es el Drawer del Encargado. Registros, Mi Perfil y Cerrar Sesión son las opciones que figuran en el menú lateral de la pantalla Encargado.
// Este drawer a su vez tiene un TabNavigator y un Stack..
const EncargadoNavigation = createDrawerNavigator(
    {
        Registros: {
            screen: EncargadoTabNavigator,
            navigationOptions: {
                drawerIcon: ({ tintColor }) => <IconEntypo name="home" style={{ fontSize: 25, color: tintColor }}></IconEntypo>,
            },
        },
        'Mi Perfil': {
            screen: EncargadoPerfilStackNavigator,
            navigationOptions: {
                drawerIcon: ({ tintColor }) => <IconEntypo name="user" style={{ fontSize: 25, color: tintColor }}></IconEntypo>,
            },
        },
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
        margin: 16,
        fontWeight: 'bold',
        color: 'rgba(0, 0, 0, .87)',
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

export default EncargadoNavigation;

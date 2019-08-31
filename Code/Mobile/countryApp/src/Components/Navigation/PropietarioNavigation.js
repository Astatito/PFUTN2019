// Para que funcione correctamente hay que respetar exactamente el orden en el que están los stacks y los drawers.
// Se lee de abajo hacia arriba.

import React from 'react';
import Propietario from '../Main/Screens/Propietario';
import PropietarioPerfil from '../Main/Screens/PropietarioPerfil';
import UbicacionPropietario from '../Main/Screens/UbicacionPropietario';
import Reservas from '../Main/Screens/Reservas';
import Invitaciones from '../Main/Screens/Invitaciones';
import ModalForImage from '../Main/Screens/ModalForImage';
import IconEvil from 'react-native-vector-icons/EvilIcons';
import IconEntypo from 'react-native-vector-icons/Entypo';
import IconIonicons from 'react-native-vector-icons/Ionicons';
import IconAntDesign from 'react-native-vector-icons/AntDesign';
import { View, Text, ScrollView, StyleSheet, Image } from 'react-native';
import { createDrawerNavigator, createBottomTabNavigator, createStackNavigator, DrawerItems, SafeAreaView } from 'react-navigation';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Icon } from 'react-native-elements';

// Este es el custom drawer que permite agregarle cosas al drawer original.
const CustomDrawerContentComponent = props => (
    <ScrollView>
        <SafeAreaView style={styles.container} forceInset={{ top: 'always', horizontal: 'never' }}>
            <View style={{height: 150, backgroundColor: 'white', alignItems:'center',justifyContent:'center'}}>
                <Image source={require('../Logo/propietario.jpg')} style={{height:120, width:120, borderRadius:60}}></Image>
            </View>
            <DrawerItems {...props} />
            <TouchableOpacity
                onPress={() => {
                    props.navigation.closeDrawer();
                    props.navigation.navigate('Login');
                }} style={{flex:1,flexDirection:'row'}}>
                <IconEntypo name= "log-out" style={{fontSize:25,paddingLeft:18,paddingTop:300, color:'gray'}}></IconEntypo>
                <Text
                    style={{
                        paddingTop: 305,
                        paddingLeft: 30,
                        color: '#000',
                        fontWeight: 'bold'
                    }}>
                    Cerrar Sesión
                </Text>
            </TouchableOpacity>
        </SafeAreaView>
    </ScrollView>
);

// Stack - El stack navigator para el home del encargado.
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
            tabBarIcon: ({ tintColor }) => (
              <IconEntypo name="home" size={24} color="#346ECD" />
            )
          },
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
        UbicacionPropietario : UbicacionPropietario,
        ModalForImage : ModalForImage
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

// Stack - El stack navigator para el apartado de reserva de eventos.
const PropietarioEventosStackNavigator = createStackNavigator(
    {
        Reservas: Reservas
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

// Stack - El stack navigator para el apartado de invitaciones.
const PropietarioInvitacionesStackNavigator = createStackNavigator(
    {
        Invitaciones : Invitaciones,
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

// Tab Navigator - Este es el Tab Navigator de Eventos.
const PropietarioEventosTabNavigator = createBottomTabNavigator({
    Reservas: {
        screen: PropietarioEventosStackNavigator,
        navigationOptions: {
            tabBarIcon: ({ tintColor }) => (
              <IconIonicons name="ios-list" size={24} color="#346ECD" />
            )
          },
    },
    Invitaciones: {
        screen: PropietarioInvitacionesStackNavigator,
        navigationOptions: {
            tabBarIcon: ({ tintColor }) => (
              <IconAntDesign name="addusergroup" size={24} color="#346ECD" />
            )
          },
    }
});

//Este es el Drawer del Encargado. Registros, Mi Perfil, Eventos y Cerrar Sesión son las opciones que figuran en el menú lateral de la pantalla Encargado.
const PropietarioNavigation = createDrawerNavigator(
    {
        Registros: {
            screen: PropietarioTabNavigator,
            navigationOptions:{
                drawerIcon : ({tintColor}) => (
                    <IconEntypo name= "home" style={{fontSize:25,color: tintColor}}></IconEntypo>
                ),
            }
        },
        'Mi Perfil': {
            screen: PropietarioPerfilStackNavigator,
            navigationOptions:{
                drawerIcon : ({tintColor}) => (
                    <IconEntypo name= "user" style={{fontSize:25,color: tintColor}}></IconEntypo>
                ),
            }
        },
        'Mi Ubicación' : {
            screen: PropietarioUbicacionStackNavigator,
            navigationOptions:{
                drawerIcon : ({tintColor}) => (
                    <IconEntypo name= "location-pin" style={{fontSize:25,color: tintColor}}></IconEntypo>
                ),
            }
        },
        'Eventos' : {
            screen: PropietarioEventosTabNavigator,
            navigationOptions:{
                drawerIcon : ({tintColor}) => (
                    <IconIonicons name= "ios-people" style={{fontSize:25,color: tintColor}}></IconIonicons>
                ),
            }
        }
    },
    {
        contentComponent: CustomDrawerContentComponent,
        contentOptions : {
            activeTintColor:'#346ECD'
        }
    }
);

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
});

export default PropietarioNavigation;
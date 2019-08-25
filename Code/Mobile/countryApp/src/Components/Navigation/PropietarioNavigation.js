// Para que funcione correctamente hay que respetar exactamente el orden en el que están los stacks y los drawers.
// Se lee de abajo hacia arriba.

import React from 'react';
import Propietario from '../Main/Screens/Propietario';
import PropietarioPerfil from '../Main/Screens/PropietarioPerfil';
import UbicacionPropietario from '../Main/Screens/UbicacionPropietario';
import Icon from 'react-native-vector-icons/EvilIcons';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { createDrawerNavigator, createBottomTabNavigator, createStackNavigator, DrawerItems, SafeAreaView } from 'react-navigation';
import { TouchableOpacity } from 'react-native-gesture-handler';

// Este es el custom drawer que permite agregarle cosas al drawer original.
const CustomDrawerContentComponent = props => (
    <ScrollView>
        <SafeAreaView style={styles.container} forceInset={{ top: 'always', horizontal: 'never' }}>
            <DrawerItems {...props} />
            <TouchableOpacity
                onPress={() => {
                    props.navigation.closeDrawer();
                    props.navigation.navigate('Login');
                }}>
                <Text
                    style={{
                        paddingTop: 12,
                        paddingLeft: 12,
                        color: '#000',
                        fontWeight: 'bold'
                    }}>
                    Cerrar Sesión
                </Text>
            </TouchableOpacity>
        </SafeAreaView>
    </ScrollView>
);

// Stack 1 - El stack navigator para el home del encargado.
const PropietarioStackNavigator = createStackNavigator(
    {
        Propietario: Propietario
    },
    {
        defaultNavigationOptions: ({ navigation }) => {
            return {
                headerLeft: <Icon style={{ paddingLeft: 10 }} onPress={() => navigation.openDrawer()} name="navicon" size={30} />,
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

//Este es el Tab Navigator. El titulo superior que se encuentra en la franja azul se pone automáticamente.

const PropietarioTabNavigator = createBottomTabNavigator({
    Home: {
        screen: PropietarioStackNavigator
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
                headerLeft: <Icon style={{ paddingLeft: 10 }} onPress={() => navigation.openDrawer()} name="navicon" size={30} />,
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
        UbicacionPropietario : UbicacionPropietario
    },
    {
        defaultNavigationOptions: ({ navigation }) => {
            return {
                headerLeft: <Icon style={{ paddingLeft: 10 }} onPress={() => navigation.openDrawer()} name="navicon" size={30} />,
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
//Este es el Drawer del Encargado. Registros, Mi Perfil y Cerrar Sesión son las opciones que figuran en el menú lateral de la pantalla Encargado.
// Este drawer a su vez tiene un TabNavigator y un Stack..
const PropietarioNavigation = createDrawerNavigator(
    {
        Registros: {
            screen: PropietarioTabNavigator
        },
        'Mi Perfil': {
            screen: PropietarioPerfilStackNavigator
        },
        'Mi ubicación' : {
            screen: PropietarioUbicacionStackNavigator
        }
    },
    {
        contentComponent: CustomDrawerContentComponent
    }
);

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
});

export default PropietarioNavigation;

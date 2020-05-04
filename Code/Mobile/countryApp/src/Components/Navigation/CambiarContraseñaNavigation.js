import React from 'react';
import CambiarContraseña from '../Main/Screens/CambiarContraseña';
import { createStackNavigator } from 'react-navigation';
import { View } from 'react-native';
import IconEvil from 'react-native-vector-icons/EvilIcons';

// Stack - El stack navigator para el cambio de contraseña
const CambiarContraseñaStackNavigator = createStackNavigator(
    {
        CambiarContraseña: CambiarContraseña,
    },
    {
        defaultNavigationOptions: ({ navigation }) => {
            return {
                title: 'Actualizar contraseña',
                headerRight: <View></View>,
                headerLeft: <IconEvil style={{ paddingLeft: 10 }} onPress={() => navigation.navigate('Propietario')} name="navicon" size={30} />,
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

export default CambiarContraseñaStackNavigator
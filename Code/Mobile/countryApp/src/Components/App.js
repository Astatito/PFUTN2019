import React, {Component} from 'react';
import Login from './Main/Login';
import Encargado from './Main/Screens/Encargado';
import EncargadoPerfil from './Main/Screens/EncargadoPerfil';
import Egreso from './Main/Acceso/Egreso';
import RegistroVisitante from './Main/Screens/RegistroVisitante';
import Propietario from './Main/Screens/Propietario';
import Icon from 'react-native-vector-icons/EvilIcons';
import {View, Text, StyleSheet} from 'react-native';
import {
    createSwitchNavigator,
    createAppContainer,
    createDrawerNavigator,
    createBottomTabNavigator,
    createStackNavigator
  } from 'react-navigation';

class App extends Component {

    render() {
        return (
            <AppContainer></AppContainer>
        );
    }
}
export default App

//El stack navigator para el apartado MiPerfil.
const EncargadoPerfilStackNavigator = createStackNavigator(
  {
    EncargadoPerfil: EncargadoPerfil
  },
  {
    defaultNavigationOptions: ({ navigation }) => {
      return {
        headerLeft: (
          <Icon
            style={{ paddingLeft: 10 }}
            onPress={() => navigation.openDrawer()}
            name="navicon"
            size={30}
          />
        ),
        headerRight: <View></View>,
        headerStyle: {
              backgroundColor: '#1e90ff'
          }, 
        headerTintColor: '#fff',
        headerTitleStyle: {
          textAlign: 'center',
          flex:1,
      }
      };
    }
  }
);

//Este es el Tab Navigator. El titulo superior que se encuentra en la franja azul se pone automáticamente.
const EncargadoTabNavigator = createBottomTabNavigator(

    {   'Home': {
            screen: Encargado 
        },

        'Nuevo Ingreso': {
            screen: RegistroVisitante
        },

        'Nuevo Egreso': {
            screen: Egreso
        }
    },
    {
      navigationOptions: ({ navigation }) => {
        const { routeName } = navigation.state.routes[navigation.state.index];
        return {
          headerTitle: routeName
        };
      }
    }
  );

//Este Stack Navigator tiene un TabNavigator.
const EncargadoStackNavigator = createStackNavigator(
    {
      EncargadoTabNavigator: EncargadoTabNavigator
    },
    {
      defaultNavigationOptions: ({ navigation }) => {
        return {
          headerLeft: (
            <Icon
              style={{ paddingLeft: 10 }}
              onPress={() => navigation.openDrawer()}
              name="navicon"
              size={30}
            />
          ),
          headerRight: <View></View>,
          headerStyle: {
                backgroundColor: '#1e90ff'
            }, 
          headerTintColor: '#fff',
          headerTitleStyle: {
            textAlign: 'center',
            flex:1,
        }
        };
      }
    }
  );

//Este es el Drawer del Encargado. Registros, Mi Perfil y Cerrar Sesión son las opciones que figuran en el menú lateral de la pantalla Encargado.
// Este drawer a su vez tiene dos StackNavigator.  
const EncargadoDrawer = createDrawerNavigator({
    'Registros': {
        screen: EncargadoStackNavigator
      },
    'Mi Perfil' : {
        screen: EncargadoPerfilStackNavigator
    },
    'Cerrar Sesión' :{
      screen: Login    
  }
  }
  );

// Acá es dónde se registran todas las pantallas para poder acceder desde cualquier componenente. Todas las pantallas que vamos haciendo hay que registrarlas acá.
const AppSwitchNavigator = createSwitchNavigator({
  Encargado: { screen: EncargadoDrawer },  
  Propietario: {screen: Propietario},  
    
    
    RegistroVisitante: {screen: RegistroVisitante},
    Login: { screen: Login }
    
  });

const AppContainer = createAppContainer(AppSwitchNavigator);

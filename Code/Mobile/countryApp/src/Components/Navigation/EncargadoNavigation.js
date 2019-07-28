// Para que funcione correctamente hay que respetar exactamente el orden en el que están los stacks y los drawers.
// Se lee de abajo hacia arriba.

import React from 'react';
import Encargado from '../Main/Screens/Encargado';
import Ingreso from '../Main/Screens/Ingreso';
import IngresoManual from '../Main/Screens/IngresoManual';
import Egreso from '../Main/Screens/Egreso';
import EgresoManual from '../Main/Screens/EgresoManual';
import EncargadoPerfil from '../Main/Screens/EncargadoPerfil';
import Escaner from '../Main/Escaner';
import RegistroVisitante from '../Main/Screens/RegistroVisitante';
import Icon from 'react-native-vector-icons/EvilIcons';
import {View, Text,ScrollView, StyleSheet} from 'react-native';
import {createDrawerNavigator,createBottomTabNavigator,
        createStackNavigator,DrawerItems,SafeAreaView} from 'react-navigation';
import { TouchableOpacity } from 'react-native-gesture-handler';

// Este es el custom drawer que permite agregarle cosas al drawer original.
const CustomDrawerContentComponent = props => (
  <ScrollView>
    <SafeAreaView style={styles.container} forceInset={{ top: 'always', horizontal: 'never' }}>
      <DrawerItems {...props} />
        <TouchableOpacity onPress={
        () => { props.navigation.closeDrawer() 
                props.navigation.navigate('Login')
      }} >
          <Text style={{paddingTop:12 ,paddingLeft:12,color:'#000', fontWeight:'bold'}}> Cerrar Sesión </Text>
        </TouchableOpacity>
    </SafeAreaView>
  </ScrollView>
);

// Stack 1 - El stack navigator para el home del encargado.
const EncargadoStackNavigator = createStackNavigator(
  {
    Encargado: Encargado
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

//Stack 2 - IngresoStackNavigator
const IngresoStackNavigator = createStackNavigator(
    {
      Ingreso: Ingreso,
      IngresoManual: IngresoManual,
      Escaner: Escaner,
      RegistroVisitante, RegistroVisitante
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
    },
    );

//Stack 3 - EgresoStackNavigator
const EgresoStackNavigator = createStackNavigator(
    {
      Egreso: Egreso,
      EgresoManual: EgresoManual,
      Escaner: Escaner,
      RegistroVisitante, RegistroVisitante
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
    });

//Este es el Tab Navigator. El titulo superior que se encuentra en la franja azul se pone automáticamente.
// Este Tab tiene tres Stacks.
const EncargadoTabNavigator = createBottomTabNavigator({
    'Home': {
        screen: EncargadoStackNavigator
    },
    'Nuevo Ingreso': {
        screen: IngresoStackNavigator
    },
    'Nuevo Egreso': {
        screen: EgresoStackNavigator
    }},
  );

// Stack - El stack navigator para el apartado MiPerfil.
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

//Este es el Drawer del Encargado. Registros, Mi Perfil y Cerrar Sesión son las opciones que figuran en el menú lateral de la pantalla Encargado.
// Este drawer a su vez tiene un TabNavigator y un Stack..  
const EncargadoNavigation = createDrawerNavigator({
    'Registros': {
        screen: EncargadoTabNavigator
      },
    'Mi Perfil' : {
        screen: EncargadoPerfilStackNavigator
      },
  },
  {
    contentComponent: CustomDrawerContentComponent
  });

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
  });

  export default EncargadoNavigation;










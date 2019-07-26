import React from 'react';
import Encargado from '../Main/Screens/Encargado';
import EncargadoPerfil from '../Main/Screens/EncargadoPerfil';
import Egreso from '../Main/Acceso/Egreso';
import RegistroVisitante from '../Main/Screens/RegistroVisitante';
import Icon from 'react-native-vector-icons/EvilIcons';
import {View, Text,ScrollView, StyleSheet} from 'react-native';
import {createDrawerNavigator,createBottomTabNavigator,
        createStackNavigator,DrawerItems,SafeAreaView} from 'react-navigation';
import { TouchableOpacity } from 'react-native-gesture-handler';

// Stack 2 - El stack navigator para el apartado MiPerfil.
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

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
  });

//Este es el Tab Navigator del Stack1. El titulo superior que se encuentra en la franja azul se pone automáticamente.
const EncargadoTabNavigator = createBottomTabNavigator({
    'Home': {
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

//Stack1 - Este Stack Navigator tiene un TabNavigator.
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
const EncargadoNavigation = createDrawerNavigator({
    'Registros': {
        screen: EncargadoStackNavigator
      },
    'Mi Perfil' : {
        screen: EncargadoPerfilStackNavigator
      },
  },
  {
    contentComponent: CustomDrawerContentComponent
  });

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

  export default EncargadoNavigation;










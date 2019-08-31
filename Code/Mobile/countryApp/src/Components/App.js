import React, { Component } from 'react';
import {View} from 'react-native'
import Login from './Main/Screens/Login';
import EncargadoNavigation from './Navigation/EncargadoNavigation';
import PropietarioNavigation from './Navigation/PropietarioNavigation';
import RegistrarVisitante from './Main/Screens/RegistroVisitante';
import { createSwitchNavigator, createAppContainer } from 'react-navigation';

class App extends Component {
    render() {
        return <AppContainer />;
    }
}
export default App;

// La que se encuentra primero es la que se ejecuta.

const AppSwitchNavigator = createSwitchNavigator({

    Propietario: { screen: PropietarioNavigation },
    Encargado: { screen: EncargadoNavigation },
    Login: { screen: Login},
    RegistrarVisitante: {screen: RegistrarVisitante },
    
   
    
});

const AppContainer = createAppContainer(AppSwitchNavigator);

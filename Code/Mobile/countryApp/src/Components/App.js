import React, { Component } from 'react';
import RegistroVisitante from './Main/Screens/RegistroVisitante'
import Login from './Main/Screens/Login';
import EncargadoNavigation from './Navigation/EncargadoNavigation';
import PropietarioNavigation from './Navigation/PropietarioNavigation';
import { createSwitchNavigator, createAppContainer } from 'react-navigation';

class App extends Component {
    render() {
        return <AppContainer />;
    }
}
export default App;

// La que se encuentra primero es la que se ejecuta.

const AppSwitchNavigator = createSwitchNavigator({
    Encargado: { screen: EncargadoNavigation },
    Login: { screen: Login },
    Propietario: { screen: PropietarioNavigation },
});

const AppContainer = createAppContainer(AppSwitchNavigator);

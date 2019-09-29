import React, { Component } from 'react';
import Login from './Main/Screens/Login';
import RegistroVisitante from './Main/Screens/RegistroVisitante'
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
    Propietario: { screen: PropietarioNavigation },
    Encargado: { screen: EncargadoNavigation },
    Login: { screen: Login },
});

const AppContainer = createAppContainer(AppSwitchNavigator);

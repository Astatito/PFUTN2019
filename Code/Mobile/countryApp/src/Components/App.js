import React, { Component } from 'react';
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
    RegistrarVisitante: {screen: RegistrarVisitante },
    Encargado: { screen: EncargadoNavigation },
    Propietario: { screen: PropietarioNavigation },
    Login: { screen: Login },
    
});

const AppContainer = createAppContainer(AppSwitchNavigator);

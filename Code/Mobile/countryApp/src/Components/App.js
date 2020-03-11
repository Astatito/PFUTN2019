import React, { Component } from 'react';
import Login from './Main/Screens/Login';
import EncargadoNavigation from './Navigation/EncargadoNavigation';
import PropietarioNavigation from './Navigation/PropietarioNavigation';
import { createSwitchNavigator, createAppContainer } from 'react-navigation';
import ModificarInvitado from './Main/Screens/Propietario/Invitaciones/ModificarInvitado'
import PropietarioPerfil from './Main/Screens/Propietario/PropietarioPerfil'
class App extends Component {
    render() {
        return <AppContainer />;
    }
}
export default App;

// La que se encuentra primero es la que se ejecuta.
const AppSwitchNavigator = createSwitchNavigator({
    Login: { screen: Login },
    Propietario: { screen: PropietarioNavigation },
    Encargado: { screen: EncargadoNavigation }
});

const AppContainer = createAppContainer(AppSwitchNavigator);

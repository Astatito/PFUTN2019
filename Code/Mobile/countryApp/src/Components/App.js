import React, { Component } from 'react';
import Login from './Main/Screens/Login';
import EncargadoNavigation from './Navigation/EncargadoNavigation';
import NuevaReserva from './Main/Screens/NuevaReserva';
import PropietarioNavigation from './Navigation/PropietarioNavigation';
import { createSwitchNavigator, createAppContainer } from 'react-navigation';
import SeleccionarServicio from './Main/Screens/SeleccionarServicio';
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
    SeleccionarServicio: { screen: SeleccionarServicio },
    NuevaReserva: { screen: NuevaReserva },

    Encargado: { screen: EncargadoNavigation }
});

const AppContainer = createAppContainer(AppSwitchNavigator);

import React, { Component } from 'react';
import Login from './Main/Screens/Login';
import Loading from './Main/Screens/Loading';
import EncargadoNavigation from './Navigation/EncargadoNavigation';
import PropietarioNavigation from './Navigation/PropietarioNavigation';
import { createSwitchNavigator, createAppContainer } from 'react-navigation';

class App extends Component {
    constructor() {
        super();

        global.tiposDocumento = [
            { id: 'DocumentoDeIdentidad', nombre: 'Documento de Identidad' },
            { id: 'LicenciaDeConducir', nombre: 'Licencia de Conducir' },
            { id: 'Pasaporte', nombre: 'Pasaporte' },
        ];
    }

    render() {
        return <AppContainer />;
    }
}
export default App;

// La que se encuentra primero es la que se ejecuta.
const AppSwitchNavigator = createSwitchNavigator({
    Loading: { screen: Loading},
    Login: { screen: Login },
    Propietario: { screen: PropietarioNavigation },
    Encargado: { screen: EncargadoNavigation },
});


const AppContainer = createAppContainer(AppSwitchNavigator);

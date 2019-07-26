import React, {Component} from 'react';
import Login from './Main/Screens/Login';
import EncargadoNavigation from './Navigation/EncargadoNavigation';
import Propietario from './Main/Screens/Propietario';
import {createSwitchNavigator,createAppContainer} from 'react-navigation';
import IngresoManual from './Main/Screens/IngresoManual';
import EgresoManual from './Main/Screens/EgresoManual';
import Ingreso from './Main/Screens/Ingreso';
import Egreso from './Main/Screens/Egreso';

class App extends Component {
    render() {
        return (
            <AppContainer></AppContainer>
        );
    }
}
export default App

// Acá es dónde se registran todas las pantallas para poder acceder desde cualquier componenente. 
//Todas las pantallas que vamos haciendo hay que registrarlas acá.
// La que se encuentra primero es la que se ejecuta.

const AppSwitchNavigator = createSwitchNavigator({
    Encargado: { screen: EncargadoNavigation },  
    Propietario: {screen: Propietario},  
    Login: {screen: Login},
    IngresoManual: {screen: IngresoManual},
    EgresoManual: {screen: EgresoManual},
    Ingreso : {screen: Ingreso},
    Egreso: {screen: Egreso}
  });

const AppContainer = createAppContainer(AppSwitchNavigator);


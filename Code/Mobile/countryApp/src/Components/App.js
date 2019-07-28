import React, {Component} from 'react';
import Login from './Main/Screens/Login';
import EncargadoNavigation from './Navigation/EncargadoNavigation';
import Propietario from './Main/Screens/Propietario';
import {createSwitchNavigator,createAppContainer} from 'react-navigation';
import RegistroVisitante from './Main/Screens/RegistroVisitante'
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
    Login: {screen: Login},
    Encargado: { screen: EncargadoNavigation },  
    Propietario: {screen: Propietario},  
    RegistroVisitante: {screen: RegistroVisitante}
  });

const AppContainer = createAppContainer(AppSwitchNavigator);


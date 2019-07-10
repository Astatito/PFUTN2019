import React, {Component} from 'react';
import Login from './Main/Login';
import Encargado from './Main/Home/Encargado';
import RegistroVisitante from './Main/Home/RegistroVisitante';
import PruebaFirebase from './Main/PruebaFirebase';

class App extends Component {

    render() {
        return (
            <Login></Login>
            // <Encargado/>
            // <RegistroVisitante></RegistroVisitante>
            // <PruebaFirebase></PruebaFirebase>
        );
    }
}
export default App;

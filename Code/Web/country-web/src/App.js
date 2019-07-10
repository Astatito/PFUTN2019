import React, { Component } from 'react';
import Login from "./componente/PantallaPrincipal/Login";
import "./estilo.css";
import firebase from 'firebase'; 
import 'firebase/database'
import { DB_CONFIG } from './config/config';
import Inicio from "./componente/AdministracionAdministrador/InicioAdministrador";
import Router from './componente/router';
import InicioAdministrador from './componente/AdministracionAdministrador/InicioAdministrador';

// para probar encabezado poner <Encabezado></Encabezado>
// <h1 className="display-3 text-center">Come in </h1>

//<Router></Router>
class App extends Component{

  render(){
    return(
      <div className="app container-fluid ">        
        
        <InicioAdministrador></InicioAdministrador>
      </div>
        



    );
  }
}

export default App;

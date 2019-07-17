import React, { Component } from 'react';
import Login from "./componente/PantallaPrincipal/Login";
import "./estilo.css";
import firebase from 'firebase'; 
import 'firebase/database'
import { DB_CONFIG } from './config/config';
import Inicio from "./componente/AdministracionAdministrador/InicioAdministrador";
import Router from './componente/router';
import InicioAdministrador from './componente/AdministracionAdministrador/InicioAdministrador';
import AltaServicio from "./componente/Servicio/AltaServicio"



class App extends Component{

  traerEncabezado(){
    
  }

  render(){

    return(
      <div className="app container-fluid ">        
        <Router></Router>
      </div>
    );
  }
}

export default App;

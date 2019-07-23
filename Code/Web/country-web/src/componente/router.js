import React, {Component} from 'react'
import { Switch, Route } from 'react-router-dom'
import Login from './PantallaPrincipal/Login'
import EditarPropietario from './AdministracionPropietario/EditarPropietario'
import AltaPropietario from './AdministracionPropietario/AltaPropietario'
import InicioPropietario from './AdministracionPropietario/PrincipalPropietario'
import InicioAdministrador from './AdministracionAdministrador/InicioAdministrador';
import Perfil from "./Perfil/Perfil";
import AltaServicio from "./Servicio/GenerarServicio/AltaServicio"
import EditarServicio from './Servicio/GenerarServicio/EditarServicio'
import PrincipalCountry from './AdministracionCountry/PrincipalCountry';
import AltaCountry from './AdministracionCountry/AltaCountry';
import EditarCountry from './AdministracionCountry/EditarCountry';
import {Firebase} from "../config/config";
import AltaAdministrador from './AdministracionAdministrador/AltaAdministrador';
import EditarAdministrador from './AdministracionAdministrador/EditarAdministrador'
import AltaEncargado from './AdministracionEncargadoIngresoEgreso/AltaEncargado';
import EditarEncargado from './AdministracionEncargadoIngresoEgreso/EditarEncargado'

//           <Route exact path='/' component={Login}/>
const valor = false;

Firebase.auth().onAuthStateChanged((user) => {

    if (user) {
        const valor = true;

    } else {
        const valor = false;

    }
})   



    const Router = () => (
       <main>
           <Switch>
                <Route exact path='/' component={Login}/>
               <Route  path='/propietario' component={InicioPropietario}/>
               <Route path='/administrador' component={InicioAdministrador}/>
               <Route path='/perfil' component={Perfil}/>
               <Route path='/country' component={PrincipalCountry}/>
               <Route path='/altaCountry' component={AltaCountry}/>
               <Route path='/editarCountry/:id' component={EditarCountry}/>
               <Route path='/altaPropietario' component={AltaPropietario}/>
               <Route path='/editarPropietario/:id' component={EditarPropietario}/>
               <Route path='/altaAdministrador' component={AltaAdministrador}/>
               <Route path='/editarAdministrador/:id' component={EditarAdministrador}/>
               <Route path='/altaEncargado' component={AltaEncargado}/>
               <Route path='/editarEncargado/:id' component={EditarEncargado}/>
               <Route path='/altaServicio' component={AltaServicio}/>
               <Route path='/editarServicio/:id' component={EditarServicio}/>

           </Switch>
       </main>
    )



export default Router

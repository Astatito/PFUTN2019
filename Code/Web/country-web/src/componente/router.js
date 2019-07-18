import React from 'react'
import { Switch, Route } from 'react-router-dom'
import Login from './PantallaPrincipal/Login'
import AltaPropietario from './AdministracionPropietario/AltaPropietario'
import InicioAdministrador from './AdministracionAdministrador/InicioAdministrador';
import Perfil from "./Perfil/Perfil";
import AltaServicio from "./Servicio/AltaServicio"
import PrincipalCountry from './AdministracionCountry/PrincipalCountry';
import AltaCountry from './AdministracionCountry/AltaCountry';
import EditarCountry from './AdministracionCountry/EditarCountry';

//           <Route exact path='/' component={Login}/>


const Router = () => (
   <main>
       <Switch>
            <Route exact path='/' component={Login}/>
           <Route  path='/propietario' component={AltaPropietario}/>
           <Route path='/Administrador' component={InicioAdministrador}/>
           <Route path='/perfil' component={Perfil}/>
           <Route path='/servicio' component={AltaServicio}/>
           <Route path='/country' component={PrincipalCountry}/>
           <Route path='/altaCountry' component={AltaCountry}/>
           <Route path='/editarCountry/:id' component={EditarCountry}/>

       </Switch>
   </main>
)

export default Router

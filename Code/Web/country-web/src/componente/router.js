import React from 'react'
import { Switch, Route } from 'react-router-dom'
import Login from './PantallaPrincipal/Login'
import AltaPropietario from './AdministracionPropietario/AltaPropietario'
import InicioAdministrador from './AdministracionAdministrador/InicioAdministrador';
import Perfil from "./Perfil/Perfil";
import AltaServicio from "./Servicio/AltaServicio"
import AltaCountry from "./AdministracionCountry/AltaCountry"

//           <Route exact path='/' component={Login}/>


const Router = () => (
   <main>
       <Switch>
            <Route exact path='/' component={Login}/>
           <Route  path='/propietario' component={AltaPropietario}/>
           <Route path='/inicioAdm' component={InicioAdministrador}/>
           <Route path='/perfil' component={Perfil}/>
           <Route path='/servicio' component={AltaServicio}/>
           <Route path='/altaCountry' component={AltaCountry}/>

       </Switch>
   </main>
)

export default Router

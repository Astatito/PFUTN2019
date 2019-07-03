import React from 'react'
import { Switch, Route } from 'react-router-dom'
import Login from './PantallaPrincipal/Login'
import AltaPropietario from './AdministracionPropietario/AltaPropietario'
import InicioAdministrador from './AdministracionAdministrador/InicioAdministrador';


const Router = () => (
   <main>
       <Switch>
           
           <Route exact path='/' component={Login}/>
           <Route path='/propietarios' component={AltaPropietario}/>
           <Route path='/inicioAdm' component={InicioAdministrador}/>
       </Switch>
   </main>
)

export default Router

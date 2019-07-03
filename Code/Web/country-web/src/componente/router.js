import React from 'react'
import { Switch, Route } from 'react-router-dom'
import Login from './login/Login'
import Home from './home'
import AltaPropietario from './Alta/AltaPropietario'


const Router = () => (
   <main>
       <Switch>
           <Route exact path='/' component={Home}/>
           <Route path='/login' component={Login}/>
           <Route path='/propietarios' component={AltaPropietario}/>
       </Switch>
   </main>
)

export default Router

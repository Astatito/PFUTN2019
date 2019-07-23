import React, { Component } from 'react';
import "../Style/Alta.css"
import PrincipalPropietario from '../AdministracionPropietario/PrincipalPropietario'
import PrincipalEncargado from '../AdministracionEncargadoIngresoEgreso/PrincipalEncargado'
import { Link } from 'react-router-dom'
import { Database } from '../../config/config'
import PrincipalServicio from '../Servicio/GenerarServicio/PrincipalServicio';



class InicioAdministrador extends Component{

    constructor(props) {
        super(props);
        this.state = { 
            propietariosList: [ ]
                    }; }
    
    render(){
        return(
            <div className="app container-fluid ">
                <PrincipalServicio></PrincipalServicio>
                <PrincipalPropietario></PrincipalPropietario>
                <PrincipalEncargado></PrincipalEncargado>
            </div>

    )}
}

export default InicioAdministrador;
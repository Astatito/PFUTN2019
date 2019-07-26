import React, { Component } from 'react';
import "../Style/Alta.css"

import EditarInvitado from '../AdministracionInvitados/EditarInvitado';



class InicioAdministrador extends Component{

    constructor(props) {
        super(props);
    }
        

    render(){
        return(
            <div className="app container-fluid ">
                <EditarInvitado></EditarInvitado>
            </div>

    )}
}

export default InicioAdministrador;
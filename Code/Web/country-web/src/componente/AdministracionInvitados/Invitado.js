import React, { Component } from 'react';
import "../Style/Alta.css";
import {Database} from '../../config/config';
import { Link } from 'react-router-dom'
import ModalEliminar from '../ModalEliminar';

class Invitado extends Component{

    constructor(props){
        super(props);
        this.idPersona = props.idPersona;   
        this.grupo = props.grupo;
        this.nombre = props.nombre;
        this.apellido = props.apellido;
        this.estado = props.estado;
        this.urlEditar = '/editarInvitado/' + props.idPersona;
        this.eliminar = this.eliminar.bind(this);
    }

    eliminar(){
        Database.collection('Personas').doc(this.idPersona).delete()
            .then(
                this.props.act(this.idPersona)
            )
            .catch(err => {
                //En caso de error, hacer esto...
            })
    }

    render(){

        return(

            <tr class="table-light">
                <th scope="row">{this.nombre}, {this.apellido}</th>
                <td>{this.grupo}</td>
                <td> {this.estado?'Activo':'Inactivo'}</td>
                <td> <Link to={this.urlEditar} type="button" className="btn btn-primary"
                >Editar</Link> </td>
                <td> <button className="btn btn-primary" onClick={this.eliminar} >Eliminar</button> </td>
            </tr>


        );
    }
}

export default Invitado;
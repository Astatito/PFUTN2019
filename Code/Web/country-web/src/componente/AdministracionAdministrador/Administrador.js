import React, { Component } from 'react';
import "../Style/Alta.css";
import {Database} from '../../config/config';
import { Link } from 'react-router-dom'




class Administrador extends Component{

    constructor(props){
        super(props);
        
        this.idAdministrador = props.idAdministrador;
        this.nombre = props.nombre;
        this.apellido = props.apellido;
        this.legajo = props.legajo;
        this.documento = props.documento;
        this.celular = props.celular;
        this.urlEditar = '/editarAdministrador/' + props.idAdministrador;
        this.eliminar = this.eliminar.bind(this);
    }

    eliminar(){
        console.log(this.nombre)
        Database.collection('Administradores').doc(this.idAdministrador).delete()
            .then( console.log('Elimino'))
            .catch(err => {
                //En caso de error, hacer esto...
            })
    }

    render(){

        return(

            <tr class="table-light">
                <th scope="row">{this.nombre}, {this.apellido}</th>
                <td>{this.documento}</td>
                <td> {this.legajo}</td>
                <td>{this.celular}</td>
                <td> <Link to={this.urlEditar} type="button" className="btn btn-primary"
                >Editar</Link> </td>
                <td> <button className="btn btn-primary" onClick={this.eliminar} >Eliminar</button> </td>
            </tr>


        );
    }
}

export default Administrador;
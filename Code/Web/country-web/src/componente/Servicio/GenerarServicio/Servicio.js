import React, { Component } from 'react';
import "../../Style/Alta.css";
import {Database} from '../../../config/config';
import { Link } from 'react-router-dom'




class Servicio extends Component{

    constructor(props){
        super(props);
        
        this.idServicio = props.idServicio;
        this.nombre = props.nombre;
        this.disponibilidad = props.disponibilidad;
        this.estado = props.estado;
        this.urlEditar = '/editarServicio/' + props.idServicio;
        this.eliminar = this.eliminar.bind(this);
    }

    eliminar(){
        console.log(this.nombre)
        Database.collection('Servicios').doc(this.idServicio).delete()
            .then( console.log('Elimino'))
            .catch(err => {
                //En caso de error, hacer esto...
            })
    }

    render(){

        return(

            <tr class="table-light">
                <th scope="row">{this.nombre}</th>
                <td>{this.estado?'Disponible':'No Disponible'}</td>
                <td> {this.disponibilidad}</td>
                <td> <Link to={this.urlEditar} type="button" className="btn btn-primary"
                >Editar</Link> </td>
                <td> <button className="btn btn-primary" onClick={this.eliminar} >Eliminar</button> </td>
            </tr>


        );
    }
}

export default Servicio;
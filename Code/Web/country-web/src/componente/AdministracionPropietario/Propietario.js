import React, { Component } from 'react';
import "../Style/Alta.css";
import Editar from "../Img/Editar.png"
import Eliminar from "../Img/Eliminar.png"
import {Database} from '../../config/config';
import { Link } from 'react-router-dom'




class Propietario extends Component{

    constructor(props){
        super(props);

        this.nombre = props.nombre;
        this.apellido = props.apellido;
        this.numero = props.numero;
        this.titular = props.titular;
        this.celular = props.celular;
        this.urlEditar = '/editarPropietario/' + props.idPropietario;
        this.eliminar = this.eliminar.bind(this);
    }

    eliminar(){
        console.log(this.nombre)
        Database.collection('Propietarios').doc(this.nombre).delete()
            .then( console.log('Elimino'))
            .catch(err => {
                //En caso de error, hacer esto...
            })
    }

    render(){

        return(

            <tr class="table-light">
                <th scope="row">{this.nombre}, {this.apellido}</th>
                <td>{this.celular}</td>
                <td> {this.titular?'Si':'No'}</td>
                <td>{this.celular}</td>
                <td> <Link to={this.urlEditar} type="button" className="btn btn-primary"
                >Editar</Link> </td>
                <td> <button className="btn" onClick={this.eliminar} >Eliminar</button> </td>
            </tr>


        );
    }
}

export default Propietario;
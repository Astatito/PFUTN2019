import React, { Component } from 'react';
import "../Style/Alta.css";
import Editar from "../Img/Editar.png"
import Eliminar from "../Img/Eliminar.png"
import {Database} from '../../config/config';
import { Link } from 'react-router-dom'




class Country extends Component{

    constructor(props){
        super(props);
       
        this.nombre = props.nombre;
        this.calle = props.calle;
        this.numero = props.numero;
        this.titular = props.titular;
        this.celular = props.celular;
        this.urlEditar = '/editarCountry/' + props.nombre; 
        this.eliminar = this.eliminar.bind(this);
    }

    eliminar(){
        console.log(this.nombre)
       Database.collection('Barrios').doc(this.nombre).delete()
            .then( console.log('Elimino'))
            .catch(err => {
                //En caso de error, hacer esto...
            })
    }

    render(){
       
        return(          
           
                    <tr class="table-light">
                    <th scope="row">{this.nombre}</th>
                    <td>{this.calle}</td>
                    <td>{this.numero}</td>
                    <td> {this.titular}</td>
                    <td>{this.celular}</td>
                    <td> <Link to={this.urlEditar} type="button" className="btn btn-primary" 
                        >Editar</Link> </td>
                    <td> <button className="btn" onClick={this.eliminar} >Eliminar</button> </td>
                    </tr>

               
    );
    }
}

export default Country;
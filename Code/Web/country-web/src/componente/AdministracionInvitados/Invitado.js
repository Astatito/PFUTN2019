import React, { Component } from 'react';
import "../Style/Alta.css";
import {Database} from '../../config/config';
import EditarInvitado from './EditarInvitado'
import ModalEliminar from '../ModalEliminar';
import Modal from 'react-bootstrap/Modal'
import {Link} from 'react-router-dom'

class Invitado extends Component{

    constructor(props){
        super(props);
        this.state = {
            show : false
        }
        this.idPersona = props.idPersona;   
        this.grupo = props.grupo;
        this.nombre = props.nombre;
        this.apellido = props.apellido;
        this.estado = props.estado;
        this.documento = props.documento;
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
        const {show} = this.state;
        
        const handleClose = () => this.setState({show:false});
        const handleShow = () => this.setState({show: true});
        return(

            <tr class="table-light">
                <th scope="row" >{this.documento}</th>
                <td >{this.nombre}, {this.apellido}</td>
                <td>{this.grupo}</td>
                <td> {this.estado?'Activo':'Inactivo'}</td>
                {/* <td> <button  type="button" className="btn btn-primary"  
                        onClick={handleShow}
                        >Editar</button>
                        <Modal show={show} onHide={handleClose}>
                            <Modal.Header closeButton>
                            <Modal.Title>Editar Invitado</Modal.Title>
                            </Modal.Header>
                            <Modal.Body><EditarInvitado  idInvitado={this.idPersona} cerrar={handleClose} ></EditarInvitado> </Modal.Body>
                
                        </Modal> </td> */}
                       <td> <Link to={this.urlEditar} type="button" className="btn btn-primary"
                >Editar</Link></td>
                <td> <ModalEliminar nombre='Invitado' elemento={this.nombre} borrar={this.eliminar} ></ModalEliminar> </td>
            </tr>


        );
    }
}

export default Invitado;
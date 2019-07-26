import React, { Component } from 'react';
import "../Style/Alta.css";
import { Database } from "../../config/config";
import { Link } from 'react-router-dom'
import Invitado from "./Invitado";


class PrincipalInvitados extends Component{

    constructor(){
        super();
        this.state= {
            invitados: [],
            idPropietario: '',
            idCountry: '',
        }
        this.actualizar = this.actualizar.bind(this)
    }

    async componentDidMount(){
        const { invitados } = this.state;
        await Database.collection('Personas').get().then(querySnapshot => {
            querySnapshot.forEach(doc => {
                if(doc.data().Usuario === localStorage.getItem('mail')){
                    this.state.idCountry = doc.data().IdCountry
                    this.state.idPropietario = doc.id
                    
                }
            });
        })
        await Database.collection('Personas').get().then(querySnapshot => {
            querySnapshot.forEach(doc => {
                if(doc.data().IdTipoPersona.id === 'Invitado'&& 
                doc.data().IdPropietario.id === this.state.idPropietario){
                this.state.invitados.push(
                    [doc.data(), doc.id]
                );console.log('object :', doc.id);
            }
            });
        });
        this.setState({invitados});

    }

    actualizar(id){
        const {invitados}=this.state;
        this.state.invitados.map( valor => {
            if(valor[1]== id){
                invitados.splice(invitados.indexOf(valor),1)            }
        })
        this.setState({invitados});
        this.render();
    }

    render(){
        return(
            <div className="col-12">

                <div className="row ">
                    <div className="col-1"></div>
                    <div className="col-5">
                        <label className="h2">Invitados</label>
                    </div>
                    <div className="col-5 izquierda">
                        <input className = "mr-sm-2 borde-button" control de formulario  tipo = "texto" placeholder = "Buscar"/>
                        <Link to='/altaInvitado' type="button" className="btn btn-primary" type="submit" >Nuevo Invitado</Link>
                    </div>

                </div>

                <div className="row">

                    <div className="col-md-1"></div>
                    <div className="col-md-10 ">

                        <br></br>

                        <table className="table table-hover  ">
                            <thead >
                            <tr>
                                <th scope="col">Apellido y Nombre </th>
                                <th scope="col">Grupo</th>
                                <th scope="col">Estado</th>
                                <th scope="col">Editar</th>
                                <th scope="col">Eliminar</th>
                            </tr>
                            </thead>

                            <tbody>
                            {
                                this.state.invitados.map( invitados => {
                                        return(

                                            <Invitado
                                                idPersona = {invitados[1]}
                                                grupo = {invitados[0].Grupo}
                                                nombre = {invitados[0].Nombre}
                                                apellido = {invitados[0].Apellido}
                                                estado = {invitados[0].Estado}
                                                act = {this.actualizar}
                                            >
                                            </Invitado>
                                        )
                                    }

                                )

                            }

                            </tbody>
                        </table>
                    </div>
                    <div className="col-md-1"></div>
                </div>
                <div>
                    < hr className="my-4"></hr>
                </div>
                <div className="espacio"></div>
            </div>
        );
    }
}

export default PrincipalInvitados;
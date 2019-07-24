import React, { Component } from 'react';
import "../Style/Alta.css";
import { Database } from "../../config/config";
import { Link } from 'react-router-dom'
import Propietario from "./Propietario";


class PrincipalPropietario extends Component{

    constructor(){
        super();
        this.state= {
            propietarios: []
        }

    }

    async componentDidMount(){
        const { propietarios } = this.state;
        await Database.collection('Propietarios').get().then(querySnapshot => {
            querySnapshot.forEach(doc => {

                this.state.propietarios.push(
                    [doc.data(), doc.id]
                )

            });
        });
        this.setState({propietarios});
        console.log(this.state.propietarios);
    }

    render(){
        return(
            <div className="col-12">

                <div className="row ">
                    <div className="col-1"></div>
                    <div className="col-5">
                        <label className="h2">Propietario</label>
                    </div>
                    <div className="col-5 izquierda">
                        <input className = "mr-sm-2 borde-button" control de formulario  tipo = "texto" placeholder = "Buscar"/>
                        <Link to='/altaPropietario' type="button" className="btn btn-primary" type="submit" >Nuevo Propietario</Link>
                    </div>

                </div>

                <div className="row">

                    <div className="col-md-1"></div>
                    <div className="col-md-10 ">

                        <br></br>

                        <table className="table table-hover  ">
                            <thead >
                            <tr>
                                <th scope="col">Nombre y Apellido</th>
                                <th scope="col">Documento</th>
                                <th scope="col">Titular</th>
                                <th scope="col">Celular</th>
                                <th scope="col">Editar</th>
                                <th scope="col">Eliminar</th>
                            </tr>
                            </thead>

                            <tbody>
                            {

                                this.state.propietarios.map( propietario => {
                                        return(

                                            <Propietario
                                                idPropietario = {propietario[1]}
                                                nombre = {propietario[0].Nombre}
                                                apellido = {propietario[0].Apellido}
                                                numero = {propietario[0].Numero}
                                                titular = {propietario[0].Titular}
                                                celular = {propietario[0].Celular}
                                                documento = {propietario[0].Documento}
                                            >
                                            </Propietario>
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

export default PrincipalPropietario;
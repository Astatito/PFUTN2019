import React, { Component } from 'react';
import "../Style/Alta.css";
import { Database } from "../../config/config";
import Ingreso from "./Ingreso";
import {Link} from 'react-router-dom'
import Modal from 'react-bootstrap/Modal'
import Select from 'react-select'


class PrincialIngreso extends Component{

    constructor(){
        super();
        this.state= {
            ingresos: [],
            invitadoTemp: [],
            idCountry: '',
            idEncargado: '',
            hora: '',
            estado: false,
            show:'',
            tipoDocumento: '',
            documento: '',
            tipoD: [],
            busqueda: true,
           virgen: false,
           mensaje: '',
           observacion: false,
        }
        this.actualizar = this.actualizar.bind(this)
        this.ChangeSelect = this.ChangeSelect.bind(this)
        this.ChangeDocumento = this.ChangeDocumento.bind(this)
        this.registrar = this.registrar.bind(this)
        this.buscar = this.buscar.bind(this)

    }

    async componentDidMount(){
        const { ingresos } = this.state;
        await Database.collection('Encargados').get().then(querySnapshot => {
            querySnapshot.forEach(doc => {
                if(doc.data().Usuario === localStorage.getItem('mail')){
                    this.state.idCountry = doc.data().IdCountry;
                    this.state.idEncargado = doc.id;
                }
            });
        });
        await Database.collection('Ingresos').get().then(querySnapshot => {
            querySnapshot.forEach(doc => {
                if(doc.data().IdCountry.id == this.state.idCountry.id){
                this.state.ingresos.push(
                    [doc.data(), doc.id]
                )}

            });
        });
        this.setState({ingresos});
        await Database.collection('TipoDocumento').get().then(querySnapshot => {
            querySnapshot.forEach(doc => {
                this.state.tipoD.push(
                    {value: doc.id, label: doc.data().Nombre}
                )
            });
        });
    }



    ChangeSelect(value){
        this.setState({tipoDocumento : value});
    }

    ChangeDocumento(event) {
        this.setState({documento : event.target.value});
    }

    async buscar(){
       await Database.collection('Personas').get().then(querySnapshot => {
            querySnapshot.forEach(doc => {
                if(doc.data().Nombre != '' && doc.data().Documento === this.state.documento && 
                doc.data().TipoDocumento.id === this.state.tipoDocumento.valueOf().value){
                    this.state.invitadoTemp.push(doc.data(), doc.id)
                    this.setState({
                        virgen: false, mensaje: doc.data().Apellido + ', ' + doc.data().Nombre
                    })
                } else if (doc.data().Documento === this.state.documento && 
                doc.data().TipoDocumento.id === this.state.tipoDocumento.valueOf().value){
                    this.state.invitadoTemp.push(doc.data(), doc.id)
                    this.setState({
                        virgen: true, mensaje: 'Falta autentificar visitante' 
                    });     
                }
            });
        });
        
        if(this.state.invitadoTemp.length == 0){
            this.setState({mensaje: 'La persona no se encuentra registrada en el sistema. Que rebote'})
        }
        await this.buscarEnIngresos();
      this.setState({ busqueda : false})
    }

    registrar(){
       Database.collection('Ingresos').add({
           Nombre: this.state.invitadoTemp[0].Nombre,
           Apellido: this.state.invitadoTemp[0].Apellido,
           TipoDocumento: this.state.invitadoTemp[0].TipoDocumento,
           Documento: this.state.invitadoTemp[0].Documento,
           Hora: new Date(),
           IdCountry: this.state.invitadoTemp[0].IdCountry,
           IdPropietario: this.state.invitadoTemp[0].IdPropietario?this.state.invitadoTemp[0].IdPropietario:'',
           IdTipoPersona: this.state.invitadoTemp[0].IdPropietario? Database.doc('Personas/Invitado'):Database.doc('Personas/Propietario'),
           Egreso: false,
           Estado: this.state.estado,
           IdEncargado: Database.doc('Encargados/' + this.state.idEncargado),
       });  
       this.setState({show:false, tipoDocumento:'', documento: '',
       virgen:false, busqueda:true,invitadoTemp: [], mensaje:'', observacion:false });
       this.setState({ingresos: []})
       this.render();
    }


    async buscarEnIngresos(){
        await Database.collection('Ingresos').orderBy('Hora', 'asc').get().then(querySnapshot => {
            querySnapshot.forEach(doc => {
                if(doc.data().Documento === this.state.documento && 
                doc.data().TipoDocumento.id === this.state.tipoDocumento.valueOf().value && !doc.data().Egreso
               ){
                     this.setState({observacion: true})
                } else if(doc.data().Documento === this.state.documento && 
                    doc.data().TipoDocumento.id === this.state.tipoDocumento.valueOf().value && doc.data().Egreso){
                        this.setState({observacion: false})
                }

            });
        });
    }


    actualizar(id){
        const {ingresos}=this.state;
        this.state.ingresos.map( valor => {
            if(valor[1]== id){
                ingresos.splice(ingresos.indexOf(valor),1)
            }
        })
        this.setState({ingresos});
        this.render();
    }

    render(){
        const {show} = this.state;
        const handleClose = () => this.setState({show:false, tipoDocumento:'', documento: '',
         virgen:false, busqueda:true,invitadoTemp: [], mensaje:'', observacion:false  });
        const handleShow = () => {this.setState({show: true});localStorage.setItem('editarInvitado', 'Ingreso');
        localStorage.setItem('idEncargado', this.state.idEncargado);};
        return(
            <div className="col-12">

                <div className="row ">
                    <div className="col-1"></div>
                    <div className="col-5">
                        <label className="h2">Ingresos</label>
                    </div>
                    <div className="col-5 izquierda">
                        <input className = "mr-sm-2 borde-button" control de formulario  tipo = "texto" placeholder = "Buscar"/>
                        <button  type="button" className="btn btn-primary"  
                        onClick={handleShow }
                        >Nuevo Ingreso</button>
                        <Modal show={show} onHide={handleClose}>
                            <Modal.Header closeButton>
                            <Modal.Title>Buscar persona</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                            <div className = "form-group"  >
                                <label for = "TipoDocumento">  Tipo Documento  </label>
                                    <Select
                                        className="select-documento"
                                        classNamePrefix="select"
                                        value={this.state.tipoDocumento}
                                        isDisabled={!this.state.busqueda}
                                        isLoading={false}
                                        isClearable={true}
                                        isSearchable={true}
                                        options={this.state.tipoD}
                                        onChange={this.ChangeSelect.bind(this)}
                
                                    />
                            </div>
                            <div className = "form-group" >
                                <label for = "NumeroDocumento">  Numero de Documento  </label>
                                <input type = "document" className = "form-control"   placeholder = "Document number"
                                value = {this.state.documento}
                                onChange={this.ChangeDocumento}
                               disabled={!this.state.busqueda}
                                />
                            </div>
                            <div className = "form-group" >
                            <label  hidden={!this.state.observacion} >{this.state.mensaje2}</label>
                            <textarea   className = "form-control" placeholder = "Observation"
                                value = {this.state.descripcion}
                                onChange={this.ChangeDescripcion}
                               hidden={!this.state.observacion}
                                ></textarea>
                            </div>
                            </Modal.Body>
                            <Modal.Footer>
                            {this.state.busqueda && (
                                <div>
                                    <button variant="secondary" onClick={handleClose} class="btn btn-danger">
                                        Cancelar
                                    </button>
                                    <button variant="primary" onClick={this.buscar} class="btn btn-success">
                                        Buscar
                                    </button>
                                </div>)
                            }
                            {!this.state.busqueda && (<>
                                
                                <div hidden = {this.state.invitadoTemp.length ==0 }>
                                    <label className=''>{this.state.mensaje}</label>
                                    <Link to={this.state.virgen?('/editarInvitado/' + this.state.invitadoTemp[1]):this.registrar} variant="primary"
                                     onClick={this.state.virgen?this.autenticar:this.registrar} class="btn btn-success">
                                        {this.state.virgen?'Autentificar':'Registrar'}
                                    </Link>
                                </div>
                                <div hidden = {this.state.invitadoTemp.length !=0 }>
                                    <label className=''>{ this.state.mensaje }</label>
                                    <Link to={'/altaInvitado'} type="button" className="btn btn-success">Nuevo Invitado</Link>
                                </div></>
                                )} 
                            </Modal.Footer>
                        </Modal>
                        
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
                                <th scope="col">Persona</th>
                                <th scope="col">Fecha y Hora</th>
                                <th scope="col">Observacion</th>
                                <th scope="col">Cancelar</th>
                            </tr>
                            </thead>

                            <tbody>
                            {

                                this.state.ingresos.map( ingresos => {
                                        return(

                                            <Ingreso
                                                idIngreso = {ingresos[1]}
                                                nombre = {ingresos[0].Nombre}
                                                apellido = {ingresos[0].Apellido}
                                                persona = {ingresos[0].IdTipoPersona.id}
                                                documento = {ingresos[0].Documento}
                                                descripcion = {ingresos[0].Descripcion}
                                                hora = {ingresos[0].Hora}
                                                act = {this.actualizar}
                                            >
                                            </Ingreso>
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

export default PrincialIngreso;
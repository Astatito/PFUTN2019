import React, { Component } from 'react';
import "../Style/Alta.css";
import "../Style/Estilo.css";
import { Database } from "../../config/config";
import Egresos from "./Egresos";
import {Link} from 'react-router-dom'
import Modal from 'react-bootstrap/Modal'
import Select from 'react-select'
import EditarInvitado from '../AdministracionInvitados/EditarInvitado'

class PrincialEgreso extends Component{

    constructor(){
        super();
        this.state= {
            egresos: [],
            invitadoTemp: [],
            idCountry: '',
            idEncargado: '',
            hora: '',
            show:'',
            tipoDocumento: '',
            documento: '',
            tipoD: [],
            busqueda: true,
            mensaje: '',
            mensaje2: '',
           descripcion: '',
           observacion: true,
           virgen: false,
           noExisteInvitado: false,
        }
        this.actualizar = this.actualizar.bind(this)
        this.ChangeSelect = this.ChangeSelect.bind(this)
        this.ChangeDocumento = this.ChangeDocumento.bind(this)
        this.ChangeDescripcion = this.ChangeDescripcion.bind(this)
        this.registrar = this.registrar.bind(this)
        this.buscar = this.buscar.bind(this)
        this.seteoEgreso = this.seteoEgreso.bind(this)
        this.buscarPersonas = this.buscarPersonas.bind(this)
    }

    async componentDidMount(){
        const { egresos } = this.state;
        await Database.collection('Encargados').get().then(querySnapshot => {
            querySnapshot.forEach(doc => {
                if(doc.data().Usuario === localStorage.getItem('mail')){
                    this.state.idCountry = doc.data().IdCountry;
                    this.state.idEncargado = doc.id;
                }
            });
        });
        await Database.collection('Egresos').get().then(querySnapshot => {
            querySnapshot.forEach(doc => {
                if(doc.data().IdCountry.id == this.state.idCountry.id){
                this.state.egresos.push(
                    [doc.data(), doc.id]
                )}

            });
        });
        this.setState({egresos});
        await Database.collection('TipoDocumento').get().then(querySnapshot => {
            querySnapshot.forEach(doc => {
                this.state.tipoD.push(
                    {value: doc.id, label: doc.data().Nombre}
                )
            });
        });//.where('Egreso','==',true)this.state.invitadoTemp.push(querySnapshot.docs[0].data(), querySnapshot.docs[0].id) 
        
    }

    ChangeDescripcion(event){
        this.setState({descripcion : event.target.value});
    }

    ChangeSelect(value){
        this.setState({tipoDocumento : value});
    }

    ChangeDocumento(event) {
        this.setState({documento : event.target.value});
    }

    async buscar(){
        
       await Database.collection('Ingresos').orderBy('Hora', 'asc').get().then(querySnapshot => {
            querySnapshot.forEach(doc => {
                if(doc.data().Documento === this.state.documento && 
                doc.data().TipoDocumento.id === this.state.tipoDocumento.valueOf().value){
                    this.setState({
                        mensaje: doc.data().Apellido + ', ' + doc.data().Nombre,
                    })
                     if (!doc.data().Egreso){     
                       
                        this.state.invitadoTemp = [doc.data(), doc.id]
                        this.setState({
                        observacion: true,
                    }); 
                    } else{
                        
                        this.state.invitadoTemp = [doc.data(), doc.id]
                        this.setState({
                            mensaje2: 'No se encuentra ingreso de ' + doc.data().Apellido + '. Indique observaciones.'
                        })
                        this.setState({observacion: false});
                    }
                  
                    
                
            }});
        });
       
        // if(this.state.invitadoTemp[0].Egreso){}
        // this.setState({
        //     mensaje2: 'No se encuentra ingreso de ' + doc.data().Apellido + '. Indique observaciones.'
        // })
        // this.setState({observacion: false});
        if(this.state.invitadoTemp.length == 0){
       
            await this.buscarPersonas();
        }
        this.setState({ busqueda : false})
    }

    buscarPersonas(){
       Database.collection('Personas').get().then(querySnapshot => {
            querySnapshot.forEach(doc => {
                if(doc.data().Documento === this.state.documento && 
                doc.data().TipoDocumento.id === this.state.tipoDocumento.valueOf().value){
                    if(doc.data().IdTipoPersona.id === 'Propietario'){
                        this.state.invitadoTemp.push(doc.data(), doc.id)
                        this.setState({
                            mensaje2: 'No se encuentra ingreso de ' + doc.data().Apellido + '. Indique observaciones.'
                        })
                        this.setState({observacion: false})
                    } else{
                        if (doc.data().Nombre !=''){
                            this.state.invitadoTemp.push(doc.data(), doc.id)
                            this.setState({
                                mensaje2: 'No se encuentra ingreso de ' + doc.data().Apellido + '. Indique observaciones.'
                            })
                            this.setState({observacion: false})
                        }else{
                            this.state.invitadoTemp.push(doc.data(), doc.id)
                            this.setState({virgen: true, mensaje: 'Falta autentificar el invitado'})
                        }
                    }
                } 
            })})
        if (this.state.invitadoTemp.length == 0 && !this.state.virgen && this.state.observacion){
            this.setState({noExisteInvitado : true })
        }
    }

    seteoEgreso(){
        Database.collection('Ingresos').doc(this.state.invitadoTemp[1]).set(
           { Nombre: this.state.invitadoTemp[0].Nombre,
            Apellido: this.state.invitadoTemp[0].Apellido,
            TipoDocumento: this.state.invitadoTemp[0].TipoDocumento,
            Documento: this.state.invitadoTemp[0].Documento,
            Hora: this.state.invitadoTemp[0].Hora,
            IdCountry: this.state.invitadoTemp[0].IdCountry,
            IdPropietario: this.state.invitadoTemp[0].IdPropietario?this.state.invitadoTemp[0].IdPropietario:'',
            IdTipoPersona: this.state.invitadoTemp[0].IdPropietario? Database.doc('Personas/Invitado'):Database.doc('Personas/Propietario'),
            Egreso: true,
            Estado: this.state.invitadoTemp[0].Estado,
            IdEncargado: Database.doc('Encargados/' + this.state.idEncargado),
        })
    }

   async registrar(){
       
        await Database.collection('Egresos').add({
           Nombre: this.state.invitadoTemp[0].Nombre,
           Apellido: this.state.invitadoTemp[0].Apellido,
           TipoDocumento: this.state.invitadoTemp[0].TipoDocumento,
           Documento: this.state.invitadoTemp[0].Documento,
           Hora: new Date(),
           IdCountry: this.state.invitadoTemp[0].IdCountry,
           IdPropietario: this.state.invitadoTemp[0].IdPropietario?this.state.invitadoTemp[0].IdPropietario:'',
           IdTipoPersona: this.state.invitadoTemp[0].IdPropietario? Database.doc('Personas/Invitado'):Database.doc('Personas/Propietario'),
           Descripcion: this.state.descripcion,
           IdEncargado: Database.doc('Encargados/' + this.state.idEncargado),
       });  
       if(this.state.observacion){
           this.seteoEgreso();
       }
       this.setState({show:false, tipoDocumento:'', documento: '',
        observacion:true, busqueda:true,
        invitadoTemp: [], mensaje :'', mensaje2:'',
        noExisteInvitado:false, virgen: false, descripcion:''});
       this.setState({ingresos: []})
       
       this.render();
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
        
        const handleClose = () => this.setState({
            show:false, tipoDocumento:'', documento: '',
        observacion:true, busqueda:true,
        invitadoTemp: [], mensaje :'', mensaje2:'',
        noExisteInvitado:false, virgen: false, descripcion:''
        });
        const handleShow = () => {this.setState({show: true});
        localStorage.setItem('editarInvitado', 'Egreso');localStorage.setItem('idEncargado', this.state.idEncargado);
    };
        return(
            <div className="col-12">

                <div className="row ">
                    <div className="col-1"></div>
                    <div className="col-5">
                        <label className="h2">Egreso</label>
                    </div>
                    <div className="col-5 izquierda">
                        <input className = "mr-sm-2 borde-button" control de formulario  tipo = "texto" placeholder = "Buscar"/>
                        <button  type="button" className="btn btn-primary"  
                        onClick={handleShow }
                        >Nuevo Egreso</button>
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
                            <label  hidden={this.state.observacion} >{this.state.mensaje2}</label>
                            <textarea  className = "form-control"  placeholder = "Observation"
                                value = {this.state.descripcion}
                                onChange={this.ChangeDescripcion}
                               hidden={this.state.observacion}
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
                                <div  hidden={this.state.noExisteInvitado}>
                                
                                    <label >{this.state.mensaje}</label>
                                
                                <div hidden = {!this.state.virgen}>
                                    <Link to={'/editarInvitado/' + this.state.invitadoTemp[1]} class="btn btn-success">
                                    Autentificar
                                    </Link>
                                </div>
                                <div hidden = {this.state.virgen}>
                                    <button onClick={this.registrar} class="btn btn-success"> 
                                        Registrar
                                    </button>
                                </div>
                                </div>
                                <div hidden={!this.state.noExisteInvitado}>
                                    <label>No existe la persona ingresada. Llame al 911 y tenga cuidado.</label>
                                </div>
                                </>
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
                                <th scope="col">Observaciones</th>
                                <th scope="col">Cancelar</th>
                            </tr>
                            </thead>

                            <tbody>
                            {

                                this.state.egresos.map( egresos => {
                                        return(

                                            <Egresos
                                                idEgreso = {egresos[1]}
                                                nombre = {egresos[0].Nombre}
                                                apellido = {egresos[0].Apellido}
                                                persona = {egresos[0].IdTipoPersona.id}
                                                documento = {egresos[0].Documento}
                                                hora = {egresos[0].Hora}
                                                descripcion= {egresos[0].Descripcion}
                                                act = {this.actualizar}
                                            >
                                            </Egresos>
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

export default PrincialEgreso;
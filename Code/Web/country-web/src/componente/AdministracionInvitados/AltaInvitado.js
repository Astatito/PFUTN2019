import React, { Component } from 'react';
import Select from 'react-select';
import "../Style/Alta.css";
import ReactLightCalendar from '@lls/react-light-calendar'
import '@lls/react-light-calendar/dist/index.css'
import {Link} from 'react-router-dom'
import {Database, Firebase} from "../../config/config";

//https://react-select.com/home
//https://firebase.google.com/docs/auth/web/manage-users#create_a_user
// https://firebase.google.com/docs/admin/setup

class AltaInvitado extends Component{

    constructor(){
        super();
        const date = new Date()
        const startDate = date.getTime()
        this.state = {
            grupo: '',
            nombre: '',
            apellido: '',
            tipoDocumento: '',
            documento: '',
            estado: true,
            descripcion: '',
            fechaNacimiento: '',
            idCountry:'',
            idPropietario: '',
            startDate, // Today
            endDate: new Date(startDate).setDate(date.getDate() + 6), // Today + 6 days,
            tipoD: [],// Para cargar el combo
            resultado: ''
        }
        this.esPropietario = localStorage.getItem('tipoUsuario')==='Propietario'?true:false;
        this.addInvitado = this.addInvitado.bind(this);
        this.ChangeNombre = this.ChangeNombre.bind(this);
        this.ChangeApellido = this.ChangeApellido.bind(this);
        this.ChangeDocumento= this.ChangeDocumento.bind(this);
        this.ChangeFechaNacimiento = this.ChangeFechaNacimiento.bind(this);
        this.ChangeGrupo  = this.ChangeGrupo.bind(this);
        this.ChangeFechas = this.ChangeFechas.bind(this);
        this.registrar = this.registrar.bind(this);
    }

    async componentDidMount(){
        const { tipoD } = this.state;
        await Database.collection('TipoDocumento').get().then(querySnapshot => {
            querySnapshot.forEach(doc => {
                this.state.tipoD.push(
                    {value: doc.id, label: doc.data().Nombre}
                )
            });
        });
        this.setState({tipoD});
        await Database.collection('Personas').get().then(querySnapshot => {
            querySnapshot.forEach(doc => {
                if(doc.data().Usuario === localStorage.getItem('mail')){
                    this.state.idCountry = doc.data().IdCountry
                    this.state.idPropietario = doc.id
                }
            });
        })
    }
 

    addInvitado(){
        var dbRef = Database.collection('Personas')
        dbRef.add({
            Nombre: this.state.nombre,
            Apellido: this.state.apellido,
            estado: this.state.estado,
            TipoDocumento: Database.doc('TipoDocumento/' + this.state.tipoDocumento.valueOf().value),
            Documento: this.state.documento,
            Grupo: this.state.grupo,
            FechaNacimiento: this.state.fechaNacimiento,
            FechaAlta: new Date(),
            FechaDesde: this.state.startDate,
            FechaHasta: this.state.endDate,
            IdCountry: this.state.idCountry,
            IdPropietario: Database.doc('Personas/' + this.state.idPropietario),
            IdTipoPersona: Database.doc('TipoPersona/Invitado'),
        });

    }

    ChangeNombre(event) {
        this.setState({nombre : event.target.value});
    }
    ChangeApellido(event) {
        this.setState({apellido: event.target.value});
    }
    
    ChangeFechas = (startDate, endDate) => this.setState({ startDate, endDate })


    ChangeSelect(value){
        this.setState({tipoDocumento : value});
    }

    ChangeFechaNacimiento(event){
        this.setState({fechaNacimiento : event.target.value});
    }

    ChangeDocumento(event) {
        this.setState({documento : event.target.value});
    }
    ChangeGrupo(event) {
        this.setState({grupo : event.target.value});
    }
 
    registrar(){
        //Agregar validaciones para no registrar cualquier gilada
        if(true){
            this.addInvitado();

        }
    }


    render(){
        return(
            <div className="col-12 jumbotron">
            <div>
                <div className="col-md-1"></div>
                <div className="col-md-8 borde">

                    <legend>  Registrar Invitado </legend>
                        <div className = "form-group">
                            <label for = "Nombre">  Grupo  </label>
                            <input type = "name" className = "form-control"   placeholder = "Name"
                            value = {this.state.grupo}
                            onChange={this.ChangeGrupo}
                           disabled={!this.esPropietario}
                            />
                        </div>
                        <div className = "form-group" hidden={this.esPropietario}>
                            <label for = "Nombre">  Nombre  </label>
                            <input type = "name" className = "form-control"   placeholder = "Name"
                            value = {this.state.nombre}
                            onChange={this.ChangeNombre}
                           
                            />
                        </div>
                        <div className = "form-group"  hidden={this.esPropietario}>
                            <label for = "Apellido">  Apellido  </label>
                            <input type = "family-name" className = "form-control"   placeholder = "Surname"
                                   value = {this.state.apellido}
                                   onChange= {this.ChangeApellido} 
                                   
                                   />
                        </div>
                        <div className = "form-group"  >
                        <label for = "TipoDocumento">  Tipo Documento  </label>
                            <Select
                                className="select-documento"
                                classNamePrefix="select"
                                isDisabled={false}
                                isLoading={false}
                                isClearable={true}
                                isSearchable={true}
                                options={this.state.tipoD}
                                onChange={this.ChangeSelect.bind(this)}
                                disabled={!this.esPropietario}
                            />
                        </div>
                        <div className = "form-group" >
                            <label for = "NumeroDocumento">  Numero de Documento  </label>
                            <input type = "document" className = "form-control"   placeholder = "Document number"
                            value = {this.state.documento}
                            onChange={this.ChangeDocumento}
                            disabled={!this.esPropietario}
                            />
                        </div>
                        <div className = "form-group" >
                            <label >  Fecha Desde - Fecha Hasta  </label>
                            <ReactLightCalendar startDate={this.state.startDate} endDate={this.state.endDate} 
                            onChange={this.ChangeFechas} range displayTime 
                            />
                        </div>

                        <div className = "form-group" hidden={this.esPropietario}>
                            <label for = "FechaNacimiento">  Fecha de Nacimiento  </label>
                            <input type="date"className = "form-control" name="FechaNacimiento"
                                   step="1" min="1920-01-01"
                                   onChange={this.ChangeFechaNacimiento}
                            />
                        </div>
                        <div className="form-group izquierda">
                            <button className="btn btn-primary" onClick={this.registrar} >Registrar</button>
                            <Link to="/" type="button" className="btn btn-primary"
                        >Volver</Link> 
                        </div>

                </div>
            </div>
            </div>
            )
        

    }
}
export default AltaInvitado;
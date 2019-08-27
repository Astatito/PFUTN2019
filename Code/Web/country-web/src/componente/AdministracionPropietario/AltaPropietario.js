import React, { Component } from 'react';
import Select from 'react-select';
import "../Style/Alta.css";
import {Link} from 'react-router-dom'
import {Database, Firebase} from "../../config/config";
import {ValidatorForm, TextValidator, SelectValidator} from 'react-material-ui-form-validator';

class AltaPropietario extends Component{
    constructor(){
        super();
        this.state = {
            nombre: '',
            apellido: '',
            tipoDocumento: '',
            documento: '',
            titular: '',
            telefonoFijo: '',
            celular: '',
            descripcion: '',
            fechaNacimiento: '',
            idCountry:'',
            mail: '',
            pass: '',
            tipoD: [],// Para cargar el combo
            resultado: ''
        }
        this.addPropietario = this.addPropietario.bind(this);
        this.ChangeNombre = this.ChangeNombre.bind(this);
        this.ChangeApellido = this.ChangeApellido.bind(this);
        this.ChangeDocumento= this.ChangeDocumento.bind(this);
        this.ChangeNumero = this.ChangeNumero.bind(this);
        this.ChangeTelefonoFijo = this.ChangeTelefonoFijo.bind(this);
        this.ChangeCelular = this.ChangeCelular.bind(this);
        this.ChangeDescripcion = this.ChangeDescripcion.bind(this);
        this.ChangeFechaNacimiento = this.ChangeFechaNacimiento.bind(this);
        this.ChangeMail = this.ChangeMail.bind(this);
        this.ChangePass = this.ChangePass.bind(this);
        this.crearUsuario = this.crearUsuario.bind(this);
        this.ChangeRadio  = this.ChangeRadio.bind(this);
        this.registrar = this.registrar.bind(this);

    }

    async componentDidMount(){
        const { tipoD } = this.state;
        await Database.collection('TipoDocumento').get().then(querySnapshot => {
            querySnapshot.forEach(doc => {
                this.state.tipoD.push(
                    {value: doc.id, name: doc.data().Nombre}
                )
            });
        });
        this.setState({tipoD})
    }

    addPropietario(){
        Database.collection('Country').doc(localStorage.getItem('idCountry'))
        .collection('Propietarios').add({
            Nombre: this.state.nombre,
            Apellido: this.state.apellido,
            Titular: this.state.titular=== 'Si'?true:false,
            Celular: this.state.celular,
            TelefonoFijo: this.state.telefonoFijo,
            Descripcion: this.state.descripcion,
            TipoDocumento: Database.doc('TipoDocumento/' + this.state.tipoDocumento.valueOf().value),
            Documento: this.state.documento,
            FechaNacimiento: this.state.fechaNacimiento,
            FechaAlta: new Date(),
            Usuario: this.state.mail,
            IdCountry: this.state.idCountry,
            IdTipoPersona: Database.doc('TipoPersona/Propietario'),
        });

    }

    ChangeNombre(event) {
        this.setState({nombre : event.target.value});
    }
    ChangeApellido(event) {
        this.setState({apellido: event.target.value});
    }
    ChangeNumero(event) {
        this.setState({numero: event.target.value});
    }

    ChangeCelular(event) {
        this.setState({celular : event.target.value});
    }

    ChangeDescripcion(event) {
        this.setState({descripcion : event.target.value});
    }

    ChangeTelefonoFijo(event) {
        this.setState({telefonoFijo: event.target.value});
    }

    ChangeSelect(value){
        this.setState({tipoDocumento : value});
    }
    ChangeFechaNacimiento(event){
        this.setState({fechaNacimiento : event.target.value});
    }

    ChangeDocumento(event) {
        this.setState({documento : event.target.value});
    }
    ChangeMail(event) {
        this.setState({mail : event.target.value});
    }
    ChangePass(event) {
        this.setState({pass : event.target.value});
    }

    ChangeRadio(event){
        this.setState({titular: event.currentTarget.value})
    }

    registrar(){
        //Agregar validaciones para no registrar cualquier gilada
        if(true){
            this.crearUsuario();
            this.addPropietario();

        }
    }

    crearUsuario(){
        const {mail} = this.state;
        const {pass} = this.state;
        if (true){
            Firebase.auth().createUserWithEmailAndPassword(mail, pass).then(
                Database.collection('Usuarios').doc(mail).set({
                    NombreUsuario: mail,
                    TipoUsuario: Database.doc('/TiposUsuario/Propietario')
                })
            )
            .catch(function(error) {
              console.log('error :', error);
              //La pass debe tener al menos 6 caracteres wachina
            });
           

        }
    }



    render(){
        return(
            <ValidatorForm
                ref="form"
                onError={errors => console.log("hola",errors)}
                onSubmit={this.registrar}
                >
            <div className="col-12 ">
            <div>
                <div className="row">
                    <legend>  Registrar Propietario </legend>
                        <div className = "col-md-6  flex-container form-group">
                            <TextValidator type = "name" className = "form-control"   label = "Nombre (*)"
                            value = {this.state.nombre}
                            validators={["required"]}
                            errorMessages={["Campo requerido"]}
                            onChange={this.ChangeNombre}
                            />
                        </div>
                        <div className = "col-md-6  flex-container form-group">
                            <TextValidator type = "family-name" className = "form-control"   label = "Apellido (*)"
                                   value = {this.state.apellido}
                                   validators={["required"]}
                                    errorMessages={["Campo requerido"]}
                                   onChange= {this.ChangeApellido} />
                        </div>
                        <div className = "col-md-6  flex-container form-group">
                        <SelectValidator
                            label="Tipo Documento (*)"
                            validators={["required"]}
                            errorMessages={["Campo requerido"]}
                            id = 'documento'
                                className="select-documento"
                                classNamePrefix="select"
                                isDisabled={false}
                                isLoading={false}
                                isClearable={true}
                                isSearchable={true}
                                name="tipoD"
                                //value={this.state.tipoD}
                                
                                // SelectProps={{
                                //     native: true
                                //   }}
                                onChange={this.ChangeSelect.bind(this)}
                            >
                            {this.state.tipoD.map(tipos =>{
                                return(
                                    <option key={tipos.value} value={tipos.value}>
                                        {tipos.name}
                                    </option>
                                );
                            })}
                    </SelectValidator>
                        </div>
                        <div className = "col-md-6  flex-container form-group">
                            <TextValidator type = "document" className = "form-control"   label = "Numero de Documento (*)"
                            value = {this.state.documento}
                            validators={["required"]}
                            errorMessages={["Campo requerido"]}
                            onChange={this.ChangeDocumento}/>
                        </div>
                        <div className = "col-md-6  flex-container form-group">
                            <label for = "FechaNacimiento">  Fecha de Nacimiento (*)  </label>
                            <TextValidator type="date"className = "form-control" name="FechaNacimiento"
                                   step="1" min="1920-01-01"
                                   validators={["required"]}
                                  errorMessages={["Campo requerido"]}
                                   onChange={this.ChangeFechaNacimiento}
                            />
                        </div>
                        <fieldset className = "col-md-6  flex-container form-group">
                            <legend>  Titular (*)  </legend>
                                <div className = "form-check">
                                    <label className = "form-check-label">
                                    <TextValidator type = "radio" className = "form-check-input"  
                                    value = 'Si' checked={this.state.titular === 'Si'}
                                    validators={["required"]}
                                    errorMessages={["Campo requerido"]}
                                    onChange={this.ChangeRadio} />
                                        Si
                                    </label>
                                </div>
                                <div className = "form-check">
                                    <label className = "form-check-label">
                                    <TextValidator type = "radio" className = "form-check-input" value = 'No'
                                    validators={["required"]}
                                    errorMessages={["Campo requerido"]}
                                    onChange={this.ChangeRadio} checked={this.state.titular === 'No'} />
                                            No
                                    </label>
                                </div>
                        </fieldset>
                        <div className = "col-md-6  flex-container form-group">
                            <TextValidator type = "tel" className = "form-control"   label = "Celular (*)"
                            value = {this.state.celular}
                            validators={["required"]}
                            errorMessages={["Campo requerido"]}
                            onChange={this.ChangeCelular}/>
                        </div>
                        <div className = "col-md-6  flex-container form-group">
                            <TextValidator type = "tel" className = "form-control"  
                             label = "Telefono Fijo "
                             value = {this.state.telefonoFijo}
                             onChange={this.ChangeTelefonoFijo}/>
                        </div>
                        <div className = "col-md-6  flex-container form-group">
                            <TextValidator type = "email" className = "form-control" id = "exampleInputEmail1"
                                   aria-describe by = "emailHelp" label = "Dirección de correo electrónico (*)"
                                   validators={["required"]}
                            errorMessages={["Campo requerido"]}
                                   value = {this.state.mail}
                                   onChange={this.ChangeMail}/>
                        </div>
                        <div className = "col-md-6  flex-container form-group">
                            <TextValidator type = "password" className = "form-control" id = "exampleInputPassword1"
                                   label = "Contraseña (*)"
                                   value = {this.state.pass}
                                   validators={["required"]}
                            errorMessages={["Campo requerido"]}
                                   onChange={this.ChangePass}/>
                        </div>        
                        <div className = "col-md-6  flex-container form-group">
                            <TextValidator className = "form-control" id = "exampleTextarea" rows = "3"
                             value = {this.state.descripcion}
                             label= "Descripcion"
                             onChange={this.ChangeDescripcion}> </TextValidator>
                        </div>
                       
                        </div>
                        <div className="form-group izquierda">
                            <button className="btn btn-primary boton" type="submit" >Registrar</button>
                            <Link to="/" type="button" className="btn btn-primary boton"
                        >Volver</Link> 
                        </div>
                </div>
            </div>
            </ValidatorForm>
            )
        

    }
}
export default AltaPropietario;
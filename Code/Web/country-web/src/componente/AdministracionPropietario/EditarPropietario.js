import React, { Component } from 'react';
import Select from 'react-select';
import "../Style/Alta.css";
import {Database} from "../../config/config";
import {Link} from "react-router-dom"

//https://react-select.com/home
// for(let i=0 , i < algo.length, i++  )

class EditarPropietario extends Component{

    constructor(props){
        super(props);
        this.state = {
            propietario: [],
            nombre: '',
            apellido: '',
            tipoDocumento: '',
            documento: '',
            titular: '',
            celular: '',
            descripcion: '',
            fechaNacimiento: '',

            tipoD: [],// Para cargar el combo
            resultado: ''
        }
        this.addPropietario = this.addPropietario.bind(this);
        this.ChangeNombre = this.ChangeNombre.bind(this);
        this.ChangeApellido = this.ChangeApellido.bind(this);
        this.ChangeNumero = this.ChangeNumero.bind(this);
        this.ChangeTitular = this.ChangeTitular.bind(this);
        this.ChangeCelular = this.ChangeCelular.bind(this);
        this.ChangeDescripcion = this.ChangeDescripcion.bind(this);
        this.ChangeFechaNacimiento = this.ChangeFechaNacimiento.bind(this);
        this.registrar = this.registrar.bind(this);

        this.idTD = '';
        const url = this.props.location.pathname.split('/');
        this.idPropietario  = url[url.length - 1];
    }

    async componentDidMount(){
        const { tipoD } = this.state;
        const {propietario} = this.state
        await Database.collection('TipoDocumento').get().then(querySnapshot => {
            querySnapshot.forEach(doc => {

                this.state.tipoD.push(
                    {value: doc.id, label: doc.data().Nombre}
                )

            });
        });
        await Database.collection('Propietarios').doc(this.idPropietario).get()
            .then(doc => {
                if (doc.exists) {
                    this.state.propietario.push(doc.data());
                } else {
                    //Si no existe, hacer esto...
                }
            })
            .catch(err => {
                //En caso de error, hacer esto...
            })
        this.setState({tipoD});
        this.setState({propietario});
        const estrella = this.state.propietario[0];
        this.setState({
            nombre: estrella.Nombre,
            apellido: estrella.Apellido,
            tipoDocumento: estrella.TipoDocumento
        })
        // const temp =this.state.tipoDocumento.split('/');
        // this.idTD = temp[temp.length - 1];

    }


    addPropietario(){
        var dbRef = Database.collection('Propietarios')
        dbRef.doc(this.state.nombre).set({
            Nombre: this.state.nombre,
            Apellido: this.state.apellido,
            Titular: this.state.titular,
            Celular: this.state.celular,
            Descripcion: this.state.descripcion,
            TipoDocumento: 'TipoDocumento/' + this.state.tipoDocumento.valueOf().value,
            FechaNacimiento: this.state.fechaNacimiento,
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
    ChangeTitular(event) {
        this.setState({titular : event.target.value});
    }
    ChangeDescripcion(event) {
        this.setState({descripcion : event.target.value});
    }

    ChangeSelect(value){
        this.setState({tipoDocumento : value});
    }
    ChangeFechaNacimiento(event){
        this.setState({fechaNacimiento : event.target.value});
    }

    registrar(){
        //Agregar validaciones para no registrar cualquier gilada
        if(true){
            this.addPropietario();

        }
    }

    render(){
        return(
            <div className="col-12 jumbotron">
                <div>
                    <div className="col-md-1"></div>
                    <div className="col-md-8 borde">

                        <legend>  Registrar Alta </legend>
                        <div className = "form-group">
                            <label for = "Nombre">  Nombre  </label>
                            <input type = "name" className = "form-control"   placeholder = "Name"
                                   value={this.state.nombre}
                                   onChange={this.ChangeNombre}
                            />
                        </div>
                        <div className = "form-group">
                            <label for = "Apellido">  Apellido  </label>
                            <input type = "family-name" className = "form-control"   placeholder = "Surname"
                                   value={this.state.apellido}
                                   onChange= {this.ChangeApellido} />
                        </div>
                        <div className = "form-group">
                            <Select
                                className="select-documento"
                                classNamePrefix="Select"
                                isDisabled={false}
                                isLoading={false}
                                isClearable={true}
                                isSearchable={true}
                                options={this.state.tipoD}
                                onChange={this.ChangeSelect.bind(this)}
                            />
                        </div>
                        <div className = "form-group">
                            <label for = "NumeroDocumento">  Numero de Documento  </label>
                            <input type = "document" className = "form-control"   placeholder = "Document number"/>
                        </div>
                        <div className = "form-group">
                            <label for = "FechaNacimiento">  Fecha de Nacimiento  </label>
                            <input type="date"className = "form-control" name="FechaNacimiento"
                                   step="1" min="1920-01-01"
                                   onChange={this.ChangeFechaNacimiento}
                            />
                        </div>
                        <fieldset className = "form-group">
                            <legend>  Titular  </legend>
                            <div className = "form-check">
                                <label className = "form-check-label">
                                    <input type = "radio" className = "form-check-input" name = "optionsRadios" id = "optionsRadios1" value = "option1" />
                                    Si
                                </label>
                            </div>
                            <div className = "form-check">
                                <label className = "form-check-label">
                                    <input type = "radio" className = "form-check-input" name = "optionsRadios" id = "optionsRadios2" value = "option2"/>
                                    No
                                </label>
                            </div>
                        </fieldset>
                        <div className = "form-group">
                            <label for = "NumeroCelular">  Celular  </label>
                            <input type = "tel" className = "form-control"   placeholder = "Mobile number"
                                   onChange={this.ChangeCelular}/>
                        </div>
                        <div className = "form-group">
                            <label for = "NumeroTelefono">  Telefono Fijo  </label>
                            <input type = "tel" className = "form-control"   placeholder = "Landline number"/>
                        </div>
                        <div className = "form-group">
                            <label for = "exampleInputEmail1">  Dirección de correo electrónico  </label>
                            <input type = "email" className = "form-control" id = "exampleInputEmail1" aria-describe by = "emailHelp" placeholder = "Enter email"/>
                        </div>
                        <div className = "form-group">
                            <label for = "exampleInputPassword1">  Contraseña  </label>
                            <input type = "password" className = "form-control" id = "exampleInputPassword1" placeholder = "Password"/>
                        </div>
                        <div className = "form-group">
                            <label for = "exampleTextarea"> Descripcion  </ label >
                            <textarea className = "form-control" id = "exampleTextarea" rows = "3"> </textarea>
                        </div>

                        <div className="form-group izquierda">
                        <Link to="/" type="button" className="btn btn-primary"
                        >Volver</Link> 
                            <button className="btn btn-primary" onClick={this.registrar} >Registrar</button>
                        </div>

                    </div>
                </div>
            </div>
        )


    }
}
export default EditarPropietario;
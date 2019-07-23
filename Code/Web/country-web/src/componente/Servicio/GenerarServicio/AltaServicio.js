import React, { Component } from 'react';
import "../../Style/Alta.css";
import {Database} from "../../../config/config"
import {Link} from 'react-router-dom'


class AltaServicio extends Component{

    constructor(){
        super();
        this.state = {
            nombre: '',
            estado: true,
            disponibilidad: '',
            idCountry: 'REFERENCIA',
            resultado: ''
        }
        this.addServicio= this.addServicio.bind(this);
        this.ChangeNombre = this.ChangeNombre.bind(this);
        this.ChangeDescripcion = this.ChangeDescripcion.bind(this);
        this.registrar = this.registrar.bind(this);

    }



    addServicio(){
        var dbRef = Database.collection('Servicios')
        dbRef.add({
            Nombre: this.state.nombre,
            Estado: this.state.estado,
            Disponibilidad: this.state.disponibilidad,
            idCountry: Database.doc('Barrios/' + this.state.idCountry),
        });

    }

    ChangeNombre(event) {
        this.setState({nombre : event.target.value});
    }
    
    ChangeDescripcion(event) {
        this.setState({descripcion : event.target.value});
    }

    registrar(){
        //Agregar validaciones para no registrar cualquier gilada
        if(true){
            this.addServicio();
        }
    }


    render(){
        return(
            <div className="col-12">
                
            <div>
            <div className="col-md-12 ">
            
            <div className="row">
                <legend><h1>  Registrar Alta</h1> </legend>
                    <div className = "col-md-12 flex-container form-group">
                        <label for = "NombreServicio"> Nombre del Servicio  </label>
                        <input  type = "name" className = "col-md-6 form-control"  
                         placeholder = "Name Service"
                         value={this.state.nombre}
                         onChange={this.ChangeNombre}/>
                    </div>
                    <div className = "col-md-12 flex-container form-group">
                        <label for = "FechaNacimiento">  Dias disponibles  </label>
                        <div>
                            {/* <input className="checkbox">Lun</input>
                            <input className="checkbox">Mar</input>
                            <input className="checkbox">Mie</input>
                            <input className="checkbox">Juv</input>
                            <input className="checkbox">Vie</input>
                            <input className="checkbox">Sab</input>
                            <input className="checkbox">Dom</input> */}
                        </div>
                    </div>
                    <fieldset className = "col-md-12 flex-container form-group">
                        <legend>  Estado  </legend>
                            <div className = "form-check">
                                <label className = "form-check-label">
                                <input type = "radio" className = "form-check-input" name = "optionsRadios" id = "optionsRadios1" value = "option1" /> 
                                    Disponible
                                </label>
                            </div>
                            <div className = "form-check">
                                <label className = "form-check-label">
                                    <input type = "radio" className = "form-check-input" name = "optionsRadios" id = "optionsRadios2" value = "option2"/> 
                                        No disponible
                                </label>
                            </div>
                    </fieldset>
                    <div className = "col-md-12 flex-container form-group">
                        <label for = "exampleTextarea"> Descripcion  </ label >
                        <textarea className = "col-md-6 form-control" id = "exampleTextarea" rows = "3"
                         value={this.state.descripcion}
                         onChange={this.ChangeDescripcion}> </textarea>
                    </div>
                </div>
            
            <div className="form-group izquierda">
                <button className="btn btn-primary" onClick={this.registrar}>Registrar</button>                  
            </div>
            </div>
            </div>
        </div>
        
        );
    }
}
export default AltaServicio;
import React, { Component } from 'react';
import "../Style/Alta.css";
import Encabezado from "../Encabezado/Encabezado";


//      <small id = "emailHelp" class = "form-text text-muted"> Nunca compartiremos su correo electrónico con nadie más.  </small>


class AltaServicio extends Component{
    render(){
        return(

            <div className="col-12">
                <Encabezado></Encabezado>
            <div>
            <div className="col-md-12 ">
            <form>
            <div className="row">
                <legend><h1>  Registrar Alta</h1> </legend>
                    <div className = "col-md-12 flex-container form-group">
                        <label for = "NombreServicio"> Nombre del Servicio  </label>
                        <input  type = "name" className = "col-md-6 form-control"   placeholder = "Name Service"/>
                    </div>
                    <div className = "col-md-12 flex-container form-group">
                        <label for = "FechaNacimiento">  Dias disponibles  </label>
                        <div>
                        <button type = "button" className = " btn btn-outline-primary boton">  Lun </button>
                        <button type = "button" className = "btn btn-outline-primary boton">  Mar </button>
                        <button type = "button" className = "btn btn-outline-primary boton">  Mie </button>
                        <button type = "button" className = "btn btn-outline-primary boton">  Jue </button>
                        <button type = "button" className = "btn btn-outline-primary boton">  Vir </button>
                        <button type = "button" className = "btn btn-outline-primary boton">  Sab </button>
                        <button type = "button" className = "btn btn-outline-primary boton">  Dom </button>
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
                        <textarea className = "col-md-6 form-control" id = "exampleTextarea" rows = "3"> </textarea>
                    </div>
                </div>
            </form>
            <div className="form-group izquierda">
                <button className="btn btn-primary">Registrar</button>                  
            </div>
            </div>
            </div>
        </div>
        
        );
    }
}
export default AltaServicio;
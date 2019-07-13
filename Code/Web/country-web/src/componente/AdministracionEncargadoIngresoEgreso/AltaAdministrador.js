import React, { Component } from 'react';
import "../Style/Alta.css";

//      <small id = "emailHelp" class = "form-text text-muted"> Nunca compartiremos su correo electrónico con nadie más.  </small>


class AltaAdministrador extends Component{
    render(){
        return(
            <div className="col-12 jumbotron">
            <div>
                <div className="col-md-1"></div>
                <div className="col-md-8 borde">
            <form>
                    <legend>  Registrar Alta </legend>
                        <div className = "form-group">
                            <label for = "Nombre">  Nombre  </label>
                            <input type = "name" className = "form-control"   placeholder = "Name"/>
                        </div>
                        <div className = "form-group">
                            <label for = "Apellido">  Apellido  </label>
                            <input type = "family-name" className = "form-control"   placeholder = "Surname"/>
                        </div>
                        <div className = "form-group">
                            <label for = "exampleSelect1"> Tipo Documento </label>
                            <select className = "form-control" id = "exampleSelect1">
                                <option>  DNI  </option>
                                <option>  Libreta  </option>
                            </select>
                        </div>
                        <div className = "form-group">
                            <label for = "NumeroDocumento">  Numero de Documento  </label>
                            <input type = "document" className = "form-control"   placeholder = "Document number"/>
                        </div>
                        <div className = "form-group">
                            <label for = "FechaNacimiento">  Fecha de Nacimiento  </label>
                            <input type="date"className = "form-control" name="FechaNacimiento" step="1" min="1920-01-01" />
                        </div>
                        <fieldset className = "form-group">
                            <legend>  Disponibilidad  </legend>
                                <div className = "form-check">
                                    <label className = "form-check-label">
                                    <input type = "radio" className = "form-check-input" name = "optionsRadios" id = "optionsRadios1" value = "option1" /> 
                                        Full Time
                                    </label>
                                </div>
                                <div className = "form-check">
                                    <label className = "form-check-label">
                                        <input type = "radio" className = "form-check-input" name = "optionsRadios" id = "optionsRadios2" value = "option2"/> 
                                            Parte Time
                                    </label>
                                </div>
                        </fieldset>
                        <div className = "form-group">
                            <label for = "NumeroCelular">  Celular  </label>
                            <input type = "tel" className = "form-control"   placeholder = "Mobile number"/>
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
                            <button className="btn btn-primary">Registrar</button>                  
                        </div>
                   
            </form>
            </div>
            <div className="col-md-3"></div>
            </div>
        </div>
        
        );
    }
}
export default AltaAdministrador;
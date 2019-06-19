import React, { Component } from 'react';
import "./Alta.css";

//      <small id = "emailHelp" class = "form-text text-muted"> Nunca compartiremos su correo electrónico con nadie más.  </small>


class Alta extends Component{
    render(){
        return(
            <div className="col-12">
            
            <div className="row">
                <div className="col-md-3"></div>
                <div className="col-md-6 borde">
            <form>
                    <legend>  Registrar Alta </legend>
                        <div class = "form-group">
                            <label for = "Nombre">  Nombre  </label>
                            <input type = "name" class = "form-control"   placeholder = "Name"/>
                        </div>
                        <div class = "form-group">
                            <label for = "Apellido">  Apellido  </label>
                            <input type = "family-name" class = "form-control"   placeholder = "Surname"/>
                        </div>
                        <div class = "form-group">
                            <label for = "exampleSelect1"> Tipo Documento </label>
                            <select class = "form-control" id = "exampleSelect1">
                                <option>  DNI  </option>
                                <option>  Libreta  </option>
                            </select>
                        </div>
                        <div class = "form-group">
                            <label for = "NumeroDocumento">  Numero de Documento  </label>
                            <input type = "document" class = "form-control"   placeholder = "Document number"/>
                        </div>
                        <div class = "form-group">
                            <label for = "FechaNacimiento">  Fecha de Nacimiento  </label>
                            <input type="date"class = "form-control" name="FechaNacimiento" step="1" min="1920-01-01" />
                        </div>
                        <fieldset class = "form-group">
                            <legend>  Titular  </legend>
                                <div class = "form-check">
                                    <label class = "form-check-label">
                                    <input type = "radio" class = "form-check-input" name = "optionsRadios" id = "optionsRadios1" value = "option1" /> 
                                        Si
                                    </label>
                                </div>
                                <div class = "form-check">
                                    <label class = "form-check-label">
                                        <input type = "radio" class = "form-check-input" name = "optionsRadios" id = "optionsRadios2" value = "option2"/> 
                                            No
                                    </label>
                                </div>
                        </fieldset>
                        <div class = "form-group">
                            <label for = "NumeroCelular">  Celular  </label>
                            <input type = "tel" class = "form-control"   placeholder = "Mobile number"/>
                        </div>
                        <div class = "form-group">
                            <label for = "NumeroTelefono">  Telefono Fijo  </label>
                            <input type = "tel" class = "form-control"   placeholder = "Landline number"/>
                        </div>
                        <div class = "form-group">
                            <label for = "exampleInputEmail1">  Dirección de correo electrónico  </label>
                            <input type = "email" class = "form-control" id = "exampleInputEmail1" aria-describe by = "emailHelp" placeholder = "Enter email"/>
                        </div>
                        <div class = "form-group">
                            <label for = "exampleInputPassword1">  Contraseña  </label>
                            <input type = "password" class = "form-control" id = "exampleInputPassword1" placeholder = "Password"/>
                        </div>        
                        <div class = "form-group">
                            <label for = "exampleTextarea"> Descripcion  </ label >
                            <textarea class = "form-control" id = "exampleTextarea" rows = "3"> </textarea>
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
export default Alta;
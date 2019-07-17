import React, { Component } from 'react';
import "../Style/Alta.css";
import Encabezado from "../Encabezado/Encabezado";

class AltaCountry extends Component{
    render(){
        return(

            <div className="col-12">
                <Encabezado></Encabezado>
            <div>
            <div className="col-md-12 ">
            <form>
            <div className="row">
                <legend><h1>  Registrar Alta</h1> </legend>
                    <div className = " flex-container form-group">
                        <label for = "NombreCountry"> Nombre del Country  </label>
                        <input  type = "name" className = "col-md-6 form-control"   placeholder = "Name Country"/>
                    </div>
                    <div className = "col-md-6  flex-container form-group">
                        <label for = "Domicilio">  Domicilio  </label>
                        <input type = "domicilio" className = "col-md-6 form-control"   placeholder = "Domicile"/>
                    </div>
                    <div className = " flex-container form-group">
                        <label for = "NombreTitular">  Nombre del Titular  </label>
                        <input type = "name" className = "col-md-6 form-control"   placeholder = "Name of owner "/>
                    </div>
                    <div className = " flex-container form-group">
                        <label for = "NumeroCelular">  Celular  </label>
                        <input type = "tel" className = "col-md-6 form-control"   placeholder = "Mobile number"/>
                    </div>
                    
                    <div className = " flex-container form-group">
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

export default AltaCountry;
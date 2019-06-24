import React, { Component } from 'react';
import AltaPropietario from "./AltaPropietario";
import "./Alta.css";

class Inicio extends Component{

       
    render(){
        return(

            

            <div className="col-12">

             <div className="row">
                 <div className="col-1"></div>
                    <div className="col-5">
                    <label className="h2">Propietario</label>
                    </div>                
                    <div className="col-5 izquierda">
                          <button className="btn btn-primary" onClick>Nuevo Prpietario </button> 
                    </div>
                    
             </div>
                   
            <div className="row">
                
            <div className="col-md-1"></div>
            <div className="col-md-10 ">
            
            <br></br>

            <table className="table table-hover  ">
                <thead >
                    <tr>
                    <th scope="col">Nombre</th>
                    <th scope="col">Nro de Documento</th>
                    <th scope="col">Titular</th>
                    <th scope="col">Estado</th>
                    <th scope="col">Celular</th>
                    <th scope="col">Editar</th>
                    <th scope="col">Eliminar</th>
                    </tr>
                </thead>
                
                <tbody>
                    <tr class="table-light">
                    <th scope="row">Estrella</th>
                    <td>989898989</td>
                    <td>Si</td>
                    <td> Activo </td>
                    <td> 351355866 </td>
                    <td> Editar </td>
                    <td> Eliminar </td>
                    </tr>

                </tbody>
            </table>
            </div>
            <div className="col-md-1"></div>
            </div>
        </div>
        );
    }
}

export default Inicio;
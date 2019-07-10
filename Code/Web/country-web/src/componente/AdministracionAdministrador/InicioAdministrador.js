import React, { Component } from 'react';
import AltaPropietario from "../AdministracionPropietario/AltaPropietario";
import "../Style/Alta.css";
import Editar from "../Img/Editar.png"
import Eliminar from "../Img/Eliminar.png"
import Encabezado from "../Encabezado/Encabezado";


class InicioAdministrador extends Component{

       
    render(){
        return(

            

            <div className="col-12">
            <Encabezado></Encabezado>
             <div className="row ">
                 <div className="col-1"></div>
                    <div className="col-5">
                    <label className="h2">Propietario</label>
                    </div>                
                    <div className="col-5 izquierda">
                        <input className = "mr-sm-2 borde-button" control de formulario  tipo = "texto" placeholder = "Buscar"/>     
                        <button className="btn btn-primary " onClick>Nuevo Prpietario </button> 
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
                    <td> <img className="text-center" src={Editar} width="30" height="30"></img> </td>
                    <td> <img className="text-center" src={Eliminar} width="30" height="30"></img> </td>
                    </tr>

                </tbody>
            </table>
            </div>
            <div className="col-md-1"></div>            
            </div>
            <div>  
            < hr className="my-4"></hr>
            </div>
            <div className="espacio"></div>


            <div className="row">
                 <div className="col-1"></div>
                    <div className="col-5">
                        <label className="h2">Servicios</label>
                    </div>                
                    <div className="col-5 izquierda">
                          <input className = "mr-sm-2 borde-button" control de formulario  tipo = "texto" placeholder = "Buscar"/>
                          <button className="btn btn-primary" onClick>Agregar Servicio </button> 

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
                        <th scope="col">direccion</th>
                        <th scope="col">Numero</th>
                        <th scope="col">Telefono</th>
                        <th scope="col">Editar</th>
                        <th scope="col">Eliminar</th>
                        </tr>
                    </thead>
                    
                    <tbody>
                        <tr class="table-light">
                        <th scope="row">Country</th>
                        <td>Bahia blanca</td>
                        <td>888</td>
                        <td> 4525568 </td>
                        <td> <img className="text-center" src={Editar} width="30" height="30"></img> </td>
                        <td> <img className="text-center" src={Eliminar} width="30" height="30"></img> </td>
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

export default InicioAdministrador;
import React, { Component } from 'react';
import AltaPropietario from "../AdministracionPropietario/AltaPropietario";
import "../Style/Alta.css";
import Editar from "../Img/Editar.png"
import Eliminar from "../Img/Eliminar.png"
import Eliminar from "../Img/Lupa.png"
import Encabezado from "../Encabezado/Encabezado";
import { Link } from 'react-router-dom'



class InicioAdmSistema extends Component{

    render(){
        return(          
            <div className="col-12">
            <Encabezado></Encabezado>
             <div className="row ">
                 <div className="col-1"></div>
                    <div className="col-5">
                    <label className="h2">Country</label>
                    </div>                
                    <div className="col-5 izquierda">
                        <input className = "mr-sm-2 borde-button" control de formulario  tipo = "texto" placeholder = "Buscar"/>     
                        <Link to='/altaCountry' type="button" className="btn btn-primary" type="submit" >Nuevo Country</Link>
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
                    <th scope="col">Estado</th>
                    <th scope="col">Domicilio</th>
                    <th scope="col">Titular</th>
                    <th scope="col">Celular</th>
                    <th scope="col">Editar</th>
                    <th scope="col">Eliminar</th>
                    <th scope="col">Ampliar</th>
                    </tr>
                </thead>
                
                <tbody>
                    <tr class="table-light">
                    <th scope="row">Los rosales</th>
                    <td>Activo</td>
                    <td>San Isidro 1234</td>
                    <td> Matersky, Lilian </td>
                    <td> 351355866 </td>
                    <td> <img className="text-center" src={Editar} width="30" height="30"></img> </td>
                    <td> <img className="text-center" src={Eliminar} width="30" height="30"></img> </td>
                    <td> <img className="text-center" src={Lupa} width="30" height="30"></img> </td>
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
    </div>
    );
    }
}

export default InicioAdmSistema;
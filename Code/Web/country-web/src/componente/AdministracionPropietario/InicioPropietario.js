import React, { Component } from 'react';
import "../Style/Alta.css";
import Editar from "../Img/Editar.png"
import Eliminar from "../Img/Eliminar.png"
import Encabezado from "../Encabezado/Encabezado";
import { Link } from 'react-router-dom'



class InicioPropietario extends Component{

       
    render(){
        return(
            <div className="col-12">
            <Encabezado></Encabezado>
             <div className="row ">
                <div className="col-1"></div>
                <div className="col-5">
                <label className="h2">Historial Visitantes</label>
                </div>                
                <div className="col-5 izquierda">
                    <input className = "mr-sm-2 borde-button" control de formulario  tipo = "texto" placeholder = "Buscar"/>     
                    <Link to='/' type="button" className="btn btn-primary" type="submit" >Nuevo Visitante</Link>
                </div>
             </div>
            <div className="row">
            <div className="col-md-10 ">
            <br></br>
            <table className="table table-hover  ">
                <thead >
                    <tr>
                    <th scope="col">Nombre</th>
                    <th scope="col">Estado</th>
                    <th scope="col">Celular</th>
                    <th scope="col">Editar</th>
                    <th scope="col">Eliminar</th>
                    </tr>
                </thead>
                <tbody>
                    <tr class="table-light">
                    <th scope="row">Estrella</th>
                    <td> Habilitado </td>
                    <td> 351355866 </td>
                    <td> <img className="text-center" src={Editar} width="30" height="30"></img> </td>
                    <td> <img className="text-center" src={Eliminar} width="30" height="30"></img> </td>
                    </tr>
                </tbody>
            </table>
            </div>
            </div>
            <div>  
            < hr className="my-4"></hr>
            </div>
            <div className="espacio"></div>
            <div className="row ">
                <div className="col-1"></div>
                <div className="col-5">
                <label className="h2">Proximos Eventos</label>
                </div>                
                <div className="col-5 izquierda">
                    <input className = "mr-sm-2 borde-button" control de formulario  tipo = "texto" placeholder = "Buscar"/>     
                    <Link to='/' type="button" className="btn btn-primary" type="submit" >Nuevo Evento</Link>
                </div>
             </div>
            <div className="row">
            <div className="col-md-10 ">
            <br></br>
            <table className="table table-hover  ">
                <thead >
                    <tr>
                    <th scope="col">Nombre</th>
                    <th scope="col">Fecha</th>
                    <th scope="col">Hora</th>
                    <th scope="col">Editar</th>
                    <th scope="col">Eliminar</th>
                    </tr>
                </thead>
                <tbody>
                    <tr class="table-light">
                    <th scope="row">Cancha de Futbol</th>
                    <td> 22/08/2019 </td>
                    <td> 18:00 </td>
                    <td> <img className="text-center" src={Editar} width="30" height="30"></img> </td>
                    <td> <img className="text-center" src={Eliminar} width="30" height="30"></img> </td>
                    </tr>
                </tbody>
            </table>
            </div>
            </div>
            
    </div>
    );
    }
}

export default InicioPropietario;
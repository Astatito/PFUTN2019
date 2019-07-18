import React, {Component} from 'react';
import "../Style/encabezado.css"
import { Link } from 'react-router-dom'
import {Firebase} from '../../config/config';


//<form className = "form-inline my-2 my-lg-0">
//<input className = "mr-sm-2" control de formulario  tipo = "texto" placeholder = "Buscar"/>
//<button type="button" className="btn btn-secondary" type="submit" >Buscar</button>

//</form>
//<Link to='/perfil' className='navbar-brand'>Perfil</Link>

class Encabezado extends Component{

    constructor(props){
        super(props);
        this.state = { 
            tipoUsuario : this.props.tipoU
        }
        this.funcion = this.funcion.bind(this);
    }

    logout() {
        Firebase.auth().signOut();
    }

    funcion(){
       console.log('asd', this.state.tipoUsuario);
        if (this.state.tipoUsuario === 'Root'){
            return (
                <div><label>hola ¡sfhsfhmundo</label></div>
            )
        } else {
            return (
                <div><label>hola mundo</label></div>
            )
        }
       
    }

   render(){

       return(
        <div className=" "> 
           <div className="fijado">
           <nav className = " navbar navbar-expand-lg fixed-top navbar-dark bg-primary">
               
               <Link to='/'  className="navbar-brand">Country</Link>
               <button className = "navbar-toggler" type = "button" data-toggle = "collapse" data-target = "# navbarColor01" aria-controls = "navbarColor01" aria-expand = "false" aria-label = "Navegación de palanca ">
                   <span className = "navbar-toggler-icon"> </span>
               </button>
                {this.funcion()}
               <div className = "collapse navbar-collapse" id = "navbarColor01">
               <ul className = "navbar-nav mr-auto">
                   <li className = "nav-item ">
                       
                   </li>
                                   
               </ul>
               <form className = "form-inline my-2 my-lg-0">
                  <Link to='/country'  className="navbar-brand">Country</Link>
                   <label  className = " color mr-sm-2"> </label>
                   <button onClick={this.logout} className='btn btn-primary'>Cerrar Sesion</button>
               </form>
               </div>
            </nav>
            <div className="espacio"></div>
            </div>
        </div>



       );
  
   }
}
export default Encabezado;


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
            ocultar: true
        }
        //this.botones = this.botones.bind(this);
        this.authListener();
    }

    logout() {
        Firebase.auth().signOut();
    }

    async authListener() {
        await Firebase.auth().onAuthStateChanged((user) => {

            if (user) {
                this.state.ocultar= false; 
            } 
        });

    }

    // botones(){
    //     if (this.state.tipoUsuario === 'root@countryapp.com'){
    //         return (
    //             <div className='form-inline'>
    //                 <Link to='/country'  className="navbar-brand">Country</Link>
    //                 <Link to='/propietario'  className="navbar-brand">Propietario</Link>
    //             </div>
    //         )
    //     }
    //     if (this.state.tipoUsuario == null) {
    //         return (
    //             <div className='form-inline'> </div>
    //         )
    //     }
       
    // }

   render(){
       
       return(
        <div className=" "> 
           <div className="fijado">
           <nav className = " navbar navbar-expand-lg fixed-top navbar-dark bg-primary">
               
               <Link to='/'  className="navbar-brand">Live Safe</Link>
               <button className = "navbar-toggler" type = "button" data-toggle = "collapse" data-target = "# navbarColor01" aria-controls = "navbarColor01" aria-expand = "false" aria-label = "Navegación de palanca ">
                   <span className = "navbar-toggler-icon"> </span>
               </button>

               <div className = "collapse navbar-collapse izquierda" id = "navbarColor01">
                   <div className = " col-12 izquierda">

                       <button onClick={this.logout} className='btn btn-primary izquierda'
                       hidden={false}
                       >Close</button>
                   </div>
               </div>
            </nav>
            <div className="espacio"></div>
            </div>
        </div>



       );
  
   }
}
export default Encabezado;

